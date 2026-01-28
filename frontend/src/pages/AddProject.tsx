import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  MapPin,
  FileText,
  Tag,
  Image,
  ChevronDown,
  Building,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { z } from "zod";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

import { useProjects } from "@/hooks/useProjects";
import { useMaster } from "@/hooks/useMaster";
import { useDataContext } from "@/contex/DataContext";
import { divineSquareService } from "@/services/DivineInfraService";

const projectSchema = z.object({
  name: z
    .string()
    .min(2, "Project name must be at least 2 characters")
    .max(100),
  location: z.string().min(2, "Location is required").max(200),
  description: z.string().max(1000).optional(),
  total_plots: z.number().min(1, "At least 1 plot required"),
  price_range_min: z.number().optional(),
  price_range_max: z.number().optional(),
  status: z.string(),
  amenities: z.array(z.string()).optional(),
});

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" }
];

const projectStageOptions = [
  { label: "Upcoming", value: "upcoming" },
  { label: "Ongoing", value: "ongoing" },
  { label: "Completed", value: "completed" },
];


// const amenityOptions = [
//   "Club House",
//   "Swimming Pool",
//   "Garden",
//   "Gym",
//   "Temple",
//   "Children's Play Area",
//   "24/7 Security",
//   "CCTV",
//   "Water Supply",
//   "Underground Drainage",
//   "Wide Roads",
//   "Street Lights",
//   "Compound Wall",
// ];

const projectTypeOptions = [
  { label: "Residential", value: "residential" },
  { label: "Commercial", value: "commercial" },
  { label: "Residential + Commercial", value: "both" },
];

export default function AddProject() {
  const navigate = useNavigate();
  // const { user, userRole } = useAuth();
  const queryClient = useQueryClient();

  const { ammenities, nearbyDevelopments } = useDataContext();

  const { fetchAmmeneities, fetchNearByDevelopments } = useMaster();

  useEffect(() => {
    fetchAmmeneities();
    fetchNearByDevelopments();
  }, []);

  const [isLoading, setIsLoading] = useState(false);
const [formData, setFormData] = useState({
  projectName: "",
  location: "",
  projectType: "residential",
  projectStage: "upcoming", // 👈 ADD THIS
  totalUnits: "",
  price_range_min: "",
  price_range_max: "",
  status: "active",
  amenities: [] as string[],
  nearbyDevelopments: [] as string[],
  projectImages: [] as File[],
  plotSizes: "",
  aboutProject: "",
});


  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showProjectTypeDropdown, setShowProjectTypeDropdown] = useState(false);
  const [showProjectStageDropdown, setShowProjectStageDropdown] =
  useState(false);

  const toggleAmenity = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const toogleNearbyDevelopment = (development: string) => {
    setFormData((prev) => ({
      ...prev,
      nearbyDevelopments: prev.nearbyDevelopments.includes(development)
        ? prev.nearbyDevelopments.filter((a) => a !== development)
        : [...prev.nearbyDevelopments, development],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
    const payload = {
  projectName: formData.projectName,
  location: formData.location,
  projectType: formData.projectType,
  projectStage: formData.projectStage, // 👈 ADD THIS
  totalUnits: Number(formData.totalUnits),

  priceRange: {
    min: Number(formData.price_range_min),
  },

  amenities: formData.amenities,
  nearbyDevelopments: formData.nearbyDevelopments,
  status: formData.status,
  plotSizes: formData.plotSizes,
  aboutProject: formData.aboutProject,
};


      console.log("Payload:", payload);

    

      const response = await divineSquareService.createProject(payload);
      console.log("Create Project Response:", response);
      if (response.status === 201) {
        toast.success("Project created successfully!");
        // Invalidate and refetch projects
        // queryClient.invalidateQueries({ queryKey: ["projects"] });
      }

      navigate(-1);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppShell showFab={false} showBottomNav={false}>
      {/* Header */}
      <header className="bg-accent text-accent-foreground px-4 pt-12 pb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="touch-btn w-10 h-10 rounded-full bg-accent-foreground/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold">Add New Project</h1>
            <p className="text-sm opacity-70">
              Create a new real estate project
            </p>
          </div>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="flex-1 px-4 py-6 space-y-4">
        {/* Project Name */}
        <div className="crm-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <Building2 className="w-5 h-5 text-muted-foreground" />
            </div>
            <label className="text-sm font-semibold text-foreground">
              Project Name *
            </label>
          </div>
          <input
            type="text"
            placeholder="e.g., Green Valley Phase 2"
            value={formData.projectName}
            onChange={(e) =>
              setFormData({ ...formData, projectName: e.target.value })
            }
            className="w-full h-12 px-4 rounded-xl bg-muted border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          {errors.projectName && (
            <p className="text-destructive text-xs mt-1">
              {errors.projectName}
            </p>
          )}
        </div>

        {/* Location */}
        <div className="crm-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <MapPin className="w-5 h-5 text-muted-foreground" />
            </div>
            <label className="text-sm font-semibold text-foreground">
              Location *
            </label>
          </div>
          <input
            type="text"
            placeholder="e.g., Hinjewadi, Pune"
            value={formData.location}
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            className="w-full h-12 px-4 rounded-xl bg-muted border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          {errors.location && (
            <p className="text-destructive text-xs mt-1">{errors.location}</p>
          )}
        </div>

        {/* Total Plots */}
        <div className="crm-card">
          <label className="text-sm font-semibold text-foreground mb-3 block">
            Total Plots *
          </label>
          <input
            type="number"
            placeholder="Enter number of plots"
            value={formData.totalUnits}
            onChange={(e) =>
              setFormData({ ...formData, totalUnits: e.target.value })
            }
            className="w-full h-12 px-4 rounded-xl bg-muted border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          {errors.totalUnits && (
            <p className="text-destructive text-xs mt-1">{errors.totalUnits}</p>
          )}
        </div>

        {/* Plot Sizes */}
        <div className="crm-card">
          <label className="text-sm font-semibold text-foreground mb-3 block">
            Plot Sizes
          </label>
          <input
            type="text"
            placeholder="e.g., 1200, 1500, 2400 sqft"
            value={formData.plotSizes}
            onChange={(e) =>
              setFormData({ ...formData, plotSizes: e.target.value })
            }
            className="w-full h-12 px-4 rounded-xl bg-muted border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {/* About Project */}
        <div className="crm-card">
          <label className="text-sm font-semibold text-foreground mb-3 block">
            About Project
          </label>
          <textarea
            placeholder="Enter project description"
            value={formData.aboutProject}
            onChange={(e) =>
              setFormData({ ...formData, aboutProject: e.target.value })
            }
            className="w-full min-h-[100px] px-4 py-3 rounded-xl bg-muted border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y"
          />
        </div>

        {/* Price Range */}
        <div className="crm-card">
          <label className="text-sm font-semibold text-foreground mb-3 block">
            Price Range (₹ Lakhs)
          </label>
          <div className="flex flex-col">
            <input
              type="number"
              placeholder="Min"
              value={formData.price_range_min}
              onChange={(e) =>
                setFormData({ ...formData, price_range_min: e.target.value })
              }
              className="w-full h-12 px-4 rounded-xl bg-muted border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>
        {/* Project Type  */}
        <div className="crm-card">
          <label className="text-sm font-semibold mb-3 block">
            Project Type *
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setShowProjectTypeDropdown(!showProjectTypeDropdown)
              }
              className="w-full h-12 px-4 rounded-xl bg-muted text-left text-foreground flex items-center justify-between"
            >
              {projectTypeOptions.find((s) => s.value === formData.projectType)
                ?.label || "Select project type"}
              <ChevronDown
                className={cn(
                  "w-5 h-5 text-muted-foreground transition-transform",
                  showProjectTypeDropdown && "rotate-180"
                )}
              />
            </button>

            {showProjectTypeDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-lg z-10 overflow-hidden">
                {projectTypeOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, projectType: option.value });
                      setShowProjectTypeDropdown(false);
                    }}
                    className={cn(
                      "w-full px-4 py-3 text-left text-sm hover:bg-muted transition-colors",
                      formData.projectType === option.value &&
                        "bg-primary/10 text-primary"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Project Stage */}
<div className="crm-card">
  <label className="text-sm font-semibold text-foreground mb-3 block">
    Project Stage *
  </label>

  <div className="relative">
    <button
      type="button"
      onClick={() =>
        setShowProjectStageDropdown(!showProjectStageDropdown)
      }
      className="w-full h-12 px-4 rounded-xl bg-muted text-left text-foreground flex items-center justify-between"
    >
      {
        projectStageOptions.find(
          (s) => s.value === formData.projectStage
        )?.label
      }
      <ChevronDown
        className={cn(
          "w-5 h-5 text-muted-foreground transition-transform",
          showProjectStageDropdown && "rotate-180"
        )}
      />
    </button>

    {showProjectStageDropdown && (
      <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-lg z-10 overflow-hidden">
        {projectStageOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => {
              setFormData({
                ...formData,
                projectStage: option.value,
              });
              setShowProjectStageDropdown(false);
            }}
            className={cn(
              "w-full px-4 py-3 text-left text-sm hover:bg-muted transition-colors",
              formData.projectStage === option.value &&
                "bg-primary/10 text-primary"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    )}
  </div>
</div>


        {/* Status */}
        <div className="crm-card">
          <label className="text-sm font-semibold text-foreground mb-3 block">
            Status
          </label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              className="w-full h-12 px-4 rounded-xl bg-muted text-left text-foreground flex items-center justify-between"
            >
              {statusOptions.find((s) => s.value === formData.status)?.label ||
                "Select status"}
              <ChevronDown
                className={cn(
                  "w-5 h-5 text-muted-foreground transition-transform",
                  showStatusDropdown && "rotate-180"
                )}
              />
            </button>
            {showStatusDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-lg z-10 overflow-hidden">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, status: option.value });
                      setShowStatusDropdown(false);
                    }}
                    className={cn(
                      "w-full px-4 py-3 text-left text-sm hover:bg-muted transition-colors",
                      formData.status === option.value &&
                        "bg-primary/10 text-primary"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Amenities */}
        <div className="crm-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <Tag className="w-5 h-5 text-muted-foreground" />
            </div>
            <label className="text-sm font-semibold text-foreground">
              Amenities
            </label>
          </div>
          <div className="flex flex-wrap gap-2">
            {ammenities.map((amenity: any) => (
              <button
                key={amenity._id}
                type="button"
                onClick={() => toggleAmenity(amenity._id)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                  formData.amenities.includes(amenity._id)
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {amenity.name}
              </button>
            ))}
          </div>
        </div>

        {/* Near by Developments */}
        <div className="crm-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <Building className="w-5 h-5 text-muted-foreground" />
            </div>
            <label className="text-sm font-semibold text-foreground">
              Near by Developments
            </label>
          </div>

          {nearbyDevelopments.map((devlopment: any) => (
            <button
              key={devlopment._id}
              type="button"
              onClick={() => toogleNearbyDevelopment(devlopment._id)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                formData.nearbyDevelopments.includes(devlopment._id)
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {devlopment.name}
            </button>
          ))}
        </div>

        <div className="crm-card">
          <label className="text-sm font-semibold mb-3 block">
            Project Images
          </label>

          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => {
              if (!e.target.files) return;
              setFormData({
                ...formData,
                projectImages: Array.from(e.target.files),
              });
            }}
            className="w-full"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4 pb-8">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 rounded-xl bg-accent text-accent-foreground font-semibold text-base hover:opacity-90 transition-opacity disabled:opacity-70"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                Creating Project...
              </span>
            ) : (
              "Create Project"
            )}
          </button>
        </div>
      </form>
    </AppShell>
  );
}
