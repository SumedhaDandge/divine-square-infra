import { AppShell } from "@/components/layout/AppShell";
import { 
  ArrowLeft, MapPin, Building2, Grid3X3, IndianRupee, 
  Loader2, Image, Calendar, ChevronRight, CheckCircle2,
  TreeDeciduous, Car, Shield, Droplets, Zap
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useProjects, useProjectPlots } from "@/hooks/useProjects";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useDataContext } from "@/contex/DataContext";
import { useEffect } from "react";

const amenityIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "park": TreeDeciduous,
  "parking": Car,
  "security": Shield,
  "water": Droplets,
  "electricity": Zap,
};

export default function ProjectDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const { projects } = useDataContext();
  const { fetchProjects, isLoading: projectsLoading } = useProjects();
  const { data: plots } = useProjectPlots(id || "");
  
  const project = projects?.find((p: any) => p._id === id || p.id === id);

  useEffect(() => {
      if(!projects || projects.length === 0) {
          fetchProjects();
      }
  }, [id]);

  if (projectsLoading && !project) {
    return (
      <AppShell showFab={false}>
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AppShell>
    );
  }

  if (!project) {
    return (
      <AppShell showFab={false}>
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <h2 className="text-lg font-semibold mb-2">Project Not Found</h2>
          <button
            onClick={() => navigate("/projects")}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-xl"
          >
            Back to Projects
          </button>
        </div>
      </AppShell>
    );
  }

  const formatPrice = (min: number | null, max: number | null) => {
    if (!min && !max) return "Contact for Price";
    const formatVal = (val: number) => {
      if (val >= 10000000) return `${(val / 10000000).toFixed(2)} Cr`;
      if (val >= 100000) return `${(val / 100000).toFixed(0)} L`;
      return `${val.toLocaleString()}`;
    };
    if (min && max) return `₹${formatVal(min)} - ₹${formatVal(max)}`;
    if (min) return `From ₹${formatVal(min)}`;
    if (max) return `Up to ₹${formatVal(max)}`;
    return "Contact for Price";
  };

  const plotCounts = {
    total: plots?.length || 0,
    available: plots?.filter((p: any) => p.status === "available").length || 0,
    booked: plots?.filter((p: any) => p.status === "booked").length || 0,
    sold: plots?.filter((p: any) => p.status === "sold").length || 0,
  };

  const quickStats = [
    { label: "Total Plots", value: plotCounts.total || project.totalUnits, icon: Grid3X3 },
    { label: "Available", value: plotCounts.available, icon: CheckCircle2, color: "text-status-hot" },
    { label: "Booked", value: plotCounts.booked, icon: Building2, color: "text-status-warm" },
    { label: "Sold", value: plotCounts.sold, icon: IndianRupee, color: "text-status-lost" },
  ];

  return (
    <AppShell showFab={false}>
      {/* Header */}
      <header className="bg-primary text-primary-foreground px-4 pt-12 pb-6">
        <button
          onClick={() => navigate(-1)}
          className="touch-btn w-10 h-10 rounded-full bg-primary-foreground/20 mb-4 -ml-1 flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold">{project.projectName}</h1>
              <span className={cn(
                "text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase",
                project.status === "active" 
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-primary-foreground/10 text-primary-foreground/70"
              )}>
                {project.status}
              </span>
            </div>
            <p className="text-primary-foreground/80 flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {project.location}
            </p>
          </div>
        </div>
      </header>

      {/* Quick Stats */}
      <div className="px-4 -mt-4 mb-4">
        <div className="crm-card !p-3 grid grid-cols-4 gap-2">
          {quickStats.map((stat) => (
            <div key={stat.label} className="text-center">
              <stat.icon className={cn("w-5 h-5 mx-auto mb-1", stat.color || "text-muted-foreground")} />
              <p className={cn("text-lg font-bold", stat.color || "text-foreground")}>{stat.value}</p>
              <p className="text-[10px] text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <main className="flex-1 px-4 space-y-4 pb-6">
        {/* View Plots Button */}
        <button
          onClick={() => navigate(`/projects/${id}/plots`)}
          className="w-full crm-card !p-4 flex items-center justify-between group hover:border-primary transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Grid3X3 className="w-6 h-6 text-primary" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-foreground">View Plot Map</p>
              <p className="text-sm text-muted-foreground">Interactive layout with availability</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
        </button>

        {/* Project Info */}
        <div className="crm-card">
          <h3 className="text-sm font-semibold text-foreground mb-3">Project Details</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                <IndianRupee className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Price Range</p>
                <p className="text-sm font-medium text-foreground">
                  {formatPrice(project.priceRange?.min, project.priceRange?.max)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                <Calendar className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Added On</p>
                <p className="text-sm font-medium text-foreground">
                  {format(new Date(project.created_at || project.createdAt || Date.now()), "MMM d, yyyy")}
                </p>
              </div>
            </div>
          </div>
          {project.description && (
            <div className="mt-4 pt-3 border-t border-border">
              <p className="text-xs text-muted-foreground mb-1">Description</p>
              <p className="text-sm text-foreground">{project.description}</p>
            </div>
          )}
           {project.aboutProject && (
            <div className="mt-4 pt-3 border-t border-border">
              <p className="text-xs text-muted-foreground mb-1">About Project</p>
              <p className="text-sm text-foreground">{project.aboutProject}</p>
            </div>
          )}
        </div>

        {/* Amenities */}
        {project.amenities && project.amenities.length > 0 && (
          <div className="crm-card">
            <h3 className="text-sm font-semibold text-foreground mb-3">Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {project.amenities.map((amenity: any) => {
                const name = typeof amenity === 'string' ? amenity : amenity.name;
                const IconComponent = amenityIcons[name?.toLowerCase()] || CheckCircle2;
                return (
                  <div
                    key={name}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-muted rounded-full"
                  >
                    <IconComponent className="w-3.5 h-3.5 text-primary" />
                    <span className="text-xs font-medium text-foreground capitalize">{name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </AppShell>
  );
}
