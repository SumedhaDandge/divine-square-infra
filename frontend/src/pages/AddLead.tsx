import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  Building2,
  Wallet,
  FileText,
  ChevronDown,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { z } from "zod";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { useDataContext } from "@/contex/DataContext";
import { useProjects } from "@/hooks/useProjects";
import { divineSquareService } from "@/services/DivineInfraService";


const leadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  phone: z.string().min(10, "Please enter a valid phone number").max(15),
  email: z
    .string()
    .email("Please enter a valid email")
    .optional()
    .or(z.literal("")),
  source: z.string(),
  project_interest: z.string().optional(),
  budget_min: z.number().optional(),
  budget_max: z.number().optional(),
  notes: z.string().max(500).optional(),
});


import { useMaster } from "@/hooks/useMaster";

export default function AddLead() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const {projects, leadSources } = useDataContext();  
  const {fetchProjects} = useProjects();
  const { fetchLeadSources } = useMaster();

  useEffect(() => {
    fetchProjects();
    fetchLeadSources();
  }, []);
 

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    source: "",
    project_interest: "",
    budget_min: "",
    budget_max: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSourceDropdown, setShowSourceDropdown] = useState(false);
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<
    "idle" | "saving" | "saved"
  >("idle");

  // Fetch lead details if in edit mode
  useEffect(() => {
      if (isEditMode) {
          const fetchLead = async () => {
              try {
                  const response = await divineSquareService.getLead(id);
                  if (response.statusCode === 200) {
                      const l = response.data;
                      setFormData({
                          name: l.customerName,
                          phone: l.mobile,
                          email: l.email || "",
                          source: l.leadSource?._id || l.leadSource,
                          project_interest: l.interestedProject?._id || l.interestedProject,
                          budget_min: l.budget?.min || "",
                          budget_max: l.budget?.max || "",
                          notes: l.notes || "",
                      });
                  }
              } catch (error) {
                  console.error("Failed to fetch lead", error);
                  toast.error("Failed to fetch lead details");
              }
          };
          fetchLead();
      }
  }, [id, isEditMode]);

  // Auto-save draft to localStorage (only for new leads)
  useEffect(() => {
    if (isEditMode) return;
    const savedDraft = localStorage.getItem("lead_draft");
    if (savedDraft) {
      try {
        setFormData(JSON.parse(savedDraft));
      } catch (e) {
        // Invalid draft data
      }
    }
  }, [isEditMode]);

  useEffect(() => {
    if (isEditMode) return;
    const timeout = setTimeout(() => {
      if (formData.name || formData.phone) {
        setAutoSaveStatus("saving");
        localStorage.setItem("lead_draft", JSON.stringify(formData));
        setTimeout(() => setAutoSaveStatus("saved"), 500);
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [formData, isEditMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = leadSchema.safeParse({
      ...formData,
      budget_min: formData.budget_min
        ? parseFloat(formData.budget_min)
        : undefined,
      budget_max: formData.budget_max
        ? parseFloat(formData.budget_max)
        : undefined,
      email: formData.email || undefined,
      project_interest: formData.project_interest || undefined,
      notes: formData.notes || undefined,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      
      const payload = {
            customerName: formData.name,
            mobile: formData.phone,
            email: formData.email,
            leadSource: formData.source, // ID of source
            interestedProject: formData.project_interest,
            budget: {
                min: formData.budget_min,
                max: formData.budget_max
            },
            notes: formData.notes,
            leadStatus: "new",
            lookingFor: "Residential", // Default
            propertyType: "Plot", // Default
            purpose: "Investment", // Default
      };
      
      let response;
      if (isEditMode) {
          response = await divineSquareService.updateLead(id!, payload);
      } else {
          response = await divineSquareService.createLead(payload);
      }

      if (response.status === 201 || response.statusCode === 200) {
          toast.success(isEditMode ? "Lead updated successfully" : "Lead created successfully");
          if (!isEditMode) localStorage.removeItem("lead_draft");
          navigate(-1);
      } else {
            toast.error(isEditMode ? "Failed to update lead" : "Failed to create lead");
      }

    
    } catch (error) {
       console.error(error);
       toast.error("An error occurred");
    } finally {
        setLoading(false);
    }
  };

  const selectedProject = projects?.find(
    (p: any) => p._id === formData.project_interest
  );

  return (
    <AppShell showFab={false} showBottomNav={false}>
      {/* Header */}
      <header className="bg-primary text-primary-foreground px-4 pt-12 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="touch-btn w-10 h-10 rounded-full bg-primary-foreground/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">{isEditMode ? "Edit Lead" : "Add New Lead"}</h1>
            {!isEditMode && autoSaveStatus === "saved" && (
              <p className="text-xs text-primary-foreground/60">
                Draft auto-saved
              </p>
            )}
          </div>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="flex-1 px-4 py-6 space-y-4">
        {/* Name */}
        <div className="crm-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <User className="w-5 h-5 text-muted-foreground" />
            </div>
            <label className="text-sm font-semibold text-foreground">
              Full Name *
            </label>
          </div>
          <input
            type="text"
            placeholder="Enter lead's full name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full h-12 px-4 rounded-xl bg-muted border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          {errors.name && (
            <p className="text-destructive text-xs mt-1">{errors.name}</p>
          )}
        </div>

        {/* Phone */}
        <div className="crm-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <Phone className="w-5 h-5 text-muted-foreground" />
            </div>
            <label className="text-sm font-semibold text-foreground">
              Phone Number *
            </label>
          </div>
          <input
            type="tel"
            placeholder="+91 98765 43210"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            className="w-full h-12 px-4 rounded-xl bg-muted border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          {errors.phone && (
            <p className="text-destructive text-xs mt-1">{errors.phone}</p>
          )}
        </div>

        {/* Email */}
        <div className="crm-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <Mail className="w-5 h-5 text-muted-foreground" />
            </div>
            <label className="text-sm font-semibold text-foreground">
              Email (Optional)
            </label>
          </div>
          <input
            type="email"
            placeholder="email@example.com"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full h-12 px-4 rounded-xl bg-muted border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          {errors.email && (
            <p className="text-destructive text-xs mt-1">{errors.email}</p>
          )}
        </div>

        {/* Source */}
        <div className="crm-card">
          <label className="text-sm font-semibold text-foreground mb-3 block">
            Lead Source *
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowSourceDropdown(!showSourceDropdown)}
              className="w-full h-12 px-4 rounded-xl bg-muted text-left text-foreground flex items-center justify-between"
            >
              {leadSources?.find((s: any) => s._id === formData.source)?.name ||
                "Select source"}
              <ChevronDown
                className={cn(
                  "w-5 h-5 text-muted-foreground transition-transform",
                  showSourceDropdown && "rotate-180"
                )}
              />
            </button>
            {showSourceDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-lg z-10 overflow-hidden">
                {leadSources?.map((option: any) => (
                  <button
                    key={option._id}
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, source: option._id });
                      setShowSourceDropdown(false);
                    }}
                    className={cn(
                      "w-full px-4 py-3 text-left text-sm hover:bg-muted transition-colors",
                      formData.source === option._id &&
                        "bg-primary/10 text-primary"
                    )}
                  >
                    {option.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Project Interest */}
        <div className="crm-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <Building2 className="w-5 h-5 text-muted-foreground" />
            </div>
            <label className="text-sm font-semibold text-foreground">
              Project Interest
            </label>
          </div>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowProjectDropdown(!showProjectDropdown)}
              className="w-full h-12 px-4 rounded-xl bg-muted text-left text-foreground flex items-center justify-between"
            >
              {selectedProject?.projectName || "Select project"}
              <ChevronDown
                className={cn(
                  "w-5 h-5 text-muted-foreground transition-transform",
                  showProjectDropdown && "rotate-180"
                )}
              />
            </button>
            {showProjectDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-lg z-10 overflow-hidden max-h-48 overflow-y-auto">
                <button
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, project_interest: "" });
                    setShowProjectDropdown(false);
                  }}
                  className="w-full px-4 py-3 text-left text-sm hover:bg-muted transition-colors text-muted-foreground"
                >
                  No specific project
                </button>
                {projects?.map((project: any) => (
                  <button
                    key={project._id}
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        project_interest: project._id,
                      });
                      setShowProjectDropdown(false);
                    }}
                    className={cn(
                      "w-full px-4 py-3 text-left text-sm hover:bg-muted transition-colors",
                      formData.project_interest === project._id &&
                        "bg-primary/10 text-primary"
                    )}
                  >
                    {project.projectName}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Budget Range */}
        <div className="crm-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <Wallet className="w-5 h-5 text-muted-foreground" />
            </div>
            <label className="text-sm font-semibold text-foreground">
              Budget Range (₹ Lakhs)
            </label>
          </div>
          <div className="flex gap-3">
            <input
              type="number"
              placeholder="Min"
              value={formData.budget_min}
              onChange={(e) =>
                setFormData({ ...formData, budget_min: e.target.value })
              }
              className="flex-1 h-12 px-4 rounded-xl bg-muted border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <span className="flex items-center text-muted-foreground">to</span>
            <input
              type="number"
              placeholder="Max"
              value={formData.budget_max}
              onChange={(e) =>
                setFormData({ ...formData, budget_max: e.target.value })
              }
              className="flex-1 h-12 px-4 rounded-xl bg-muted border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>

        {/* Notes */}
        <div className="crm-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <FileText className="w-5 h-5 text-muted-foreground" />
            </div>
            <label className="text-sm font-semibold text-foreground">
              Notes
            </label>
          </div>
          <textarea
            placeholder="Add any additional notes about this lead..."
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-muted border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4 pb-8">
          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 rounded-xl bg-primary text-primary-foreground font-semibold text-base hover:opacity-90 transition-opacity disabled:opacity-70"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Creating Lead...
              </span>
            ) : (
              "Create Lead"
            )}
          </button>
        </div>
      </form>
    </AppShell>
  );
}

