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
  MapPin,
  Briefcase,
  Home,
  Target,
  CheckCircle2,
  CalendarClock
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { z } from "zod";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import { useDataContext } from "@/contex/DataContext";
import { useProjects } from "@/hooks/useProjects";
import { divineSquareService } from "@/services/DivineInfraService";
import { useMaster } from "@/hooks/useMaster";

const leadSchema = z.object({
  name: z.string({ required_error: "Name is required" }).min(2, "Name must be at least 2 characters").max(100),
  phone: z.string({ required_error: "Phone number is required" }).regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number"),
  email: z.string().email("Please enter a valid email").optional().or(z.literal("")),
  source: z.string({ required_error: "Lead Source is required" }).min(1, "Lead Source is required"),
  leadStatus: z.string({ required_error: "Lead Status is required" }),
  project_interests: z.array(z.string()).optional(),
  budget: z.number().optional(),
  
  lookingLocation: z.string().optional(),
  lookingFor: z.enum(["Residential", "Commercial"]),
  propertyType: z.enum(["Plot", "Flat", "Shop", "Office"]),
  purpose: z.enum(["Self Use", "Investment", "Rental"]),
  belongsFrom: z.string().optional(),
  isFutureInterest: z.boolean().optional(),
  
  notes: z.string().max(500).optional(),
});

export default function AddLead() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const { projects, leadSources } = useDataContext();  
  const { fetchProjects } = useProjects();
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
    leadStatus: "new",
    project_interests: [] as string[],
    budget: "",
    
    lookingLocation: "",
    lookingFor: "Residential" as "Residential" | "Commercial",
    propertyType: "Plot" as "Plot" | "Flat" | "Shop" | "Office",
    purpose: "Investment" as "Self Use" | "Investment" | "Rental",
    belongsFrom: "",
    isFutureInterest: false,
    
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<"idle" | "saving" | "saved">("idle");

  // Dropdown states
  const [showSourceDropdown, setShowSourceDropdown] = useState(false);
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

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
              leadStatus: l.leadStatus || "new",
              project_interests: l.interestedProjects?.map((p: any) => p._id || p) || [],
              budget: l.budget ? new Intl.NumberFormat('en-IN').format(l.budget) : "",
              
              lookingLocation: l.lookingLocation || "",
              lookingFor: l.lookingFor || "Residential",
              propertyType: l.propertyType || "Plot",
              purpose: l.purpose || "Investment",
              belongsFrom: l.belongsFrom || "",
              isFutureInterest: l.isFutureInterest || false,
              
              notes: l.remarks || "", // mapped to remarks in backend, notes in frontend state
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

  // Auto-save draft logic (simplified for brevity)
  useEffect(() => {
    if (isEditMode) return;
    const isDirty = Object.values(formData).some(val => val !== "" && val !== false && (Array.isArray(val) ? val.length > 0 : true));
    if (isDirty) {
      const timeout = setTimeout(() => {
        localStorage.setItem("lead_draft_v2", JSON.stringify(formData));
        setAutoSaveStatus("saved");
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [formData, isEditMode]);

  // Load draft
  useEffect(() => {
    if (!isEditMode) {
      const draft = localStorage.getItem("lead_draft_v2");
      if (draft) {
        try { 
          const parsed = JSON.parse(draft);
          setFormData(prev => ({ ...prev, ...parsed, leadStatus: parsed.leadStatus || "new" }));
        } catch {}
      }
    }
  }, [isEditMode]);

  const formatIndianNumber = (value: string) => {
    const number = value.replace(/[^0-9.]/g, '');
    if (!number) return '';
    // Handle decimal points if needed, but for budget standard int is usually fine.
    // However, if user types decimal, let's allow basic float parsing logic or just simple integer formatting
    // For simplicity and common use case: integer formatting with commas
    const parts = number.split('.');
    const integerPart = parts[0];
    const decimalPart = parts.length > 1 ? '.' + parts[1] : '';
    
    const formattedInt = new Intl.NumberFormat('en-IN').format(parseInt(integerPart || '0'));
    return formattedInt + decimalPart;
  };

  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/,/g, '');
    if (isNaN(Number(rawValue))) return; // Prevent non-numeric input
    
    // Format only if it's a valid number
    const formatted = formatIndianNumber(rawValue);
    setFormData({ ...formData, budget: formatted });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const budgetValue = formData.budget ? parseFloat(formData.budget.toString().replace(/,/g, "")) : undefined;
    const statusValue = formData.leadStatus || "new";

    const result = leadSchema.safeParse({
      ...formData,
      budget: budgetValue,
      leadStatus: statusValue,
      email: formData.email || undefined,
      project_interests: formData.project_interests.length ? formData.project_interests : undefined,
      lookingLocation: formData.lookingLocation || undefined,
      belongsFrom: formData.belongsFrom || undefined,
      notes: formData.notes || undefined,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      
      const firstError = Object.values(fieldErrors)[0];
      toast.error(firstError || "Please check the form for errors");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        customerName: formData.name,
        mobile: formData.phone,
        email: formData.email,
        leadSource: formData.source,
        interestedProjects: formData.project_interests,
        budget: budgetValue,
        lookingLocation: formData.lookingLocation,
        lookingFor: formData.lookingFor,
        propertyType: formData.propertyType,
        purpose: formData.purpose,
        belongsFrom: formData.belongsFrom,
        isFutureInterest: formData.isFutureInterest,
        remarks: formData.notes, // Backend expects remarks
        leadStatus: formData.leadStatus || "new",
      };


      let response;
      if (isEditMode) {
        response = await divineSquareService.updateLead(id!, payload);
      } else {
        response = await divineSquareService.createLead(payload);
      }

      if (response.status === 201 || response.statusCode === 200 || response.statusCode === 201) {
        toast.success(isEditMode ? "Lead updated successfully" : "Lead created successfully");
        if (!isEditMode) localStorage.removeItem("lead_draft_v2");
        navigate(-1);
      } else {
        toast.error("Operation failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const selectedProjects = projects?.filter((p: any) => formData.project_interests?.includes(p._id));

  // Helper for toggle buttons
  const ToggleGroup = ({ label, icon: Icon, options, value, onChange }: any) => (
    <div className="crm-card">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
          <Icon className="w-5 h-5 text-muted-foreground" />
        </div>
        <label className="text-sm font-semibold text-foreground">{label}</label>
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((opt: string) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium border transition-all",
              value === opt
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background border-border hover:bg-muted text-muted-foreground"
            )}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <AppShell showFab={false} showBottomNav={false}>
      <header className="bg-primary text-primary-foreground px-4 pt-12 pb-6 sticky top-0 z-10 shadow-md">
        <div className="flex items-center gap-3 mb-1">
          <button onClick={() => navigate(-1)} className="touch-btn w-10 h-10 rounded-full bg-primary-foreground/20 hover:bg-primary-foreground/30 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold">{isEditMode ? "Edit Lead" : "New Lead"}</h1>
            {autoSaveStatus === "saved" && !isEditMode && <span className="text-[10px] opacity-80 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Draft saved</span>}
          </div>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="px-4 py-6 space-y-6 pb-20">
        
        {/* SECTION 1: PERSONAL DETAILS */}
        <section className="space-y-4">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Personal Details</h3>
          
          {/* Name */}
          <div className="crm-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <User className="w-5 h-5 text-blue-500" />
              </div>
              <label className="text-sm font-semibold text-foreground">Full Name *</label>
            </div>
            <input
              type="text"
              placeholder="e.g. Rahul Sharma"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full h-12 px-4 rounded-xl bg-muted/50 border border-transparent focus:bg-background focus:border-primary/30 transition-all outline-none"
            />
            {errors.name && <p className="text-destructive text-xs mt-1 ml-1">{errors.name}</p>}
          </div>

          {/* Contact */}
          <div className="grid grid-cols-1 gap-4">
            <div className="crm-card">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-green-500" />
                </div>
                <label className="text-sm font-semibold text-foreground">Mobile *</label>
              </div>
              <input
                type="tel"
                placeholder="10-digit number"
                maxLength={10}
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                className="w-full h-12 px-4 rounded-xl bg-muted/50 border border-transparent focus:bg-background focus:border-primary/30 transition-all outline-none"
              />
              {errors.phone && <p className="text-destructive text-xs mt-1 ml-1">{errors.phone}</p>}
            </div>

            <div className="crm-card">
               <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-orange-500" />
                </div>
                <label className="text-sm font-semibold text-foreground">Email</label>
              </div>
              <input
                type="email"
                placeholder="optional@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full h-12 px-4 rounded-xl bg-muted/50 border border-transparent focus:bg-background focus:border-primary/30 transition-all outline-none"
              />
               {errors.email && <p className="text-destructive text-xs mt-1 ml-1">{errors.email}</p>}
            </div>
          </div>
          
          {/* Location / Belongs From */}
           <div className="crm-card">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-indigo-500" />
                </div>
                <label className="text-sm font-semibold text-foreground">City / Belongs From</label>
              </div>
              <input
                type="text"
                placeholder="Where are they from?"
                value={formData.belongsFrom}
                onChange={(e) => setFormData({ ...formData, belongsFrom: e.target.value })}
                className="w-full h-12 px-4 rounded-xl bg-muted/50 border border-transparent focus:bg-background focus:border-primary/30 transition-all outline-none"
              />
            </div>
        </section>

        {/* SECTION 2: REQUIREMENTS */}
        <section className="space-y-4">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Requirements</h3>

          <ToggleGroup 
            label="Looking For" 
            icon={Target} 
            options={["Residential", "Commercial"]} 
            value={formData.lookingFor}
            onChange={(val: any) => setFormData({...formData, lookingFor: val})} 
          />

          <ToggleGroup 
            label="Property Type" 
            icon={Home} 
            options={["Plot", "Flat", "Shop", "Office"]} 
            value={formData.propertyType}
            onChange={(val: any) => setFormData({...formData, propertyType: val})} 
          />

           <ToggleGroup 
            label="Purpose" 
            icon={Briefcase} 
            options={["Investment", "Self Use", "Rental"]} 
            value={formData.purpose}
            onChange={(val: any) => setFormData({...formData, purpose: val})} 
          />

           {/* Projects */}
           <div className="crm-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-purple-500" />
              </div>
              <label className="text-sm font-semibold text-foreground">Interested Projects</label>
            </div>
            
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowProjectDropdown(!showProjectDropdown)}
                className="w-full min-h-[3rem] px-4 py-2 rounded-xl bg-muted/50 border border-transparent text-left flex items-center justify-between"
              >
                <div className="flex flex-wrap gap-1">
                  {selectedProjects?.length > 0 ? (
                    selectedProjects.map((p: any) => (
                      <span key={p._id} className="text-xs bg-background border px-2 py-1 rounded-md">{p.projectName}</span>
                    ))
                  ) : <span className="text-muted-foreground">Select projects...</span>}
                </div>
                <ChevronDown className={cn("w-4 h-4 transition-transform ml-2", showProjectDropdown && "rotate-180")} />
              </button>
              
              {showProjectDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-xl shadow-xl z-20 max-h-60 overflow-y-auto p-1">
                  {projects?.map((p: any) => {
                    const isSelected = formData.project_interests.includes(p._id);
                    return (
                        <button
                          key={p._id}
                          type="button"
                          onClick={() => {
                            const current = formData.project_interests;
                            const updated = isSelected ? current.filter(id => id !== p._id) : [...current, p._id];
                            setFormData({...formData, project_interests: updated});
                          }}
                          className={cn(
                            "w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between mb-1",
                            isSelected ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted"
                          )}
                        >
                          {p.projectName}
                          {isSelected && <CheckCircle2 className="w-4 h-4" />}
                        </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

        {/* Budget */}
          <div className="crm-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-yellow-500" />
              </div>
              <label className="text-sm font-semibold text-foreground">Budget (₹)</label>
            </div>
            <input
              type="text"
              value={formData.budget}
              onChange={handleBudgetChange}
              className="w-full h-12 px-4 rounded-xl bg-muted/50 border-transparent focus:bg-background focus:border-primary/30 border outline-none text-sm"
              placeholder="Enter budget (e.g. 50,000)"
            />
          </div>
          
           {/* Preferred Location */}
           <div className="crm-card">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-pink-500" />
                </div>
                <label className="text-sm font-semibold text-foreground">Preferred Location</label>
              </div>
              <input
                type="text"
                placeholder="e.g. Near Airport, City Center"
                value={formData.lookingLocation}
                onChange={(e) => setFormData({ ...formData, lookingLocation: e.target.value })}
                className="w-full h-12 px-4 rounded-xl bg-muted/50 border border-transparent focus:bg-background focus:border-primary/30 transition-all outline-none"
              />
            </div>
        </section>

        {/* SECTION 3: OTHER INFO */}
        <section className="space-y-4">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Status, Source & Notes</h3>
          
        {/* Status (Only in Edit Mode) */}
        {isEditMode && (
          <div className="crm-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-indigo-500" />
              </div>
              <label className="text-sm font-semibold text-foreground">Lead Status *</label>
            </div>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                className="w-full h-12 px-4 rounded-xl bg-muted/50 border border-transparent text-left flex items-center justify-between"
              >
                <span className="capitalize">
                  {formData.leadStatus?.replace(/_/g, " ") || "New"}
                </span>
                <ChevronDown className={cn("w-4 h-4 transition-transform ml-2", showStatusDropdown && "rotate-180")} />
              </button>
              
              {showStatusDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-xl shadow-xl z-20 max-h-60 overflow-y-auto p-1">
                  {[
                    "new", "hot", "warm", "cold", 
                    "site_visit_scheduled", "site_visit_completed", "site_visit_done", 
                    "negotiation", "booked", "converted", "lost"
                  ].map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => {
                        setFormData({...formData, leadStatus: status});
                        setShowStatusDropdown(false);
                      }}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-lg text-sm mb-1 hover:bg-muted capitalize",
                        formData.leadStatus === status && "bg-primary/10 text-primary font-medium"
                      )}
                    >
                      {status.replace(/_/g, " ")}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}


          {/* Source */}
          <div className="crm-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center">
                <Target className="w-5 h-5 text-teal-500" />
              </div>
              <label className="text-sm font-semibold text-foreground">Source *</label>
            </div>
             <div className="relative">
              <button
                type="button"
                onClick={() => setShowSourceDropdown(!showSourceDropdown)}
                className="w-full h-12 px-4 rounded-xl bg-muted/50 border border-transparent text-left flex items-center justify-between"
              >
                <span className={!formData.source ? "text-muted-foreground" : ""}>
                   {leadSources?.find((s: any) => s._id === formData.source)?.name || "Select Source"}
                </span>
                <ChevronDown className={cn("w-4 h-4 transition-transform ml-2", showSourceDropdown && "rotate-180")} />
              </button>
              
              {showSourceDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-xl shadow-xl z-20 max-h-60 overflow-y-auto p-1">
                  {leadSources?.map((s: any) => (
                     <button
                        key={s._id}
                        type="button"
                        onClick={() => {
                          setFormData({...formData, source: s._id});
                          setShowSourceDropdown(false);
                        }}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-lg text-sm mb-1",
                          formData.source === s._id ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted"
                        )}
                      >
                        {s.name}
                      </button>
                  ))}
                </div>
              )}
            </div>
            {errors.source && <p className="text-destructive text-xs mt-1 ml-1">{errors.source}</p>}
          </div>

          {/* Future Interest */}
          <div className="crm-card flex items-center justify-between py-4">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                  <CalendarClock className="w-5 h-5 text-cyan-500" />
                </div>
                <div>
                   <label className="text-sm font-semibold text-foreground block">Future Interest</label>
                   <p className="text-xs text-muted-foreground">Is the customer interested in future projects?</p>
                </div>
             </div>
             <div 
               onClick={() => setFormData({...formData, isFutureInterest: !formData.isFutureInterest})}
               className={cn(
                 "w-12 h-6 rounded-full relative cursor-pointer transition-colors",
                 formData.isFutureInterest ? "bg-primary" : "bg-muted"
               )}
             >
                <div className={cn(
                   "w-4 h-4 rounded-full bg-white absolute top-1 transition-transform",
                   formData.isFutureInterest ? "left-7" : "left-1"
                )} />
             </div>
          </div>

          {/* Notes */}
          <div className="crm-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gray-500/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-gray-500" />
              </div>
              <label className="text-sm font-semibold text-foreground">Remarks / Notes</label>
            </div>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full p-4 rounded-xl bg-muted/50 border border-transparent focus:bg-background focus:border-primary/30 transition-all outline-none resize-none min-h-[100px]"
              placeholder="Any other details..."
            />
          </div>
        </section>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-14 bg-primary text-primary-foreground text-lg font-bold rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:hover:scale-100"
        >
          {loading ? "Saving..." : isEditMode ? "Update Lead" : "Create Lead"}
        </button>

      </form>
    </AppShell>
  );
}


