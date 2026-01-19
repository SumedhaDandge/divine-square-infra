import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { MapPin, ChevronRight, Search, Building2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { getUserRole } from "@/utils/auth";

import { useProjects } from "@/hooks/useProjects";
import { useDataContext } from "@/contex/DataContext";

export default function Projects() {
  const navigate = useNavigate();
  const userRole = getUserRole();

  // Replace with actual user role from auth context
  const [searchQuery, setSearchQuery] = useState("");

  const { projects } = useDataContext();
  const { fetchProjects, isLoading } = useProjects();
  useEffect(() => {
    fetchProjects();
  }, []);

  const filteredProjects = projects?.filter((project: any) => {
    const projectName = project.projectName?.toLowerCase() || "";
    const location = project.location?.toLowerCase() || "";
    const query = searchQuery.toLowerCase();

    return projectName.includes(query) || location.includes(query);
  });

  const formatPrice = (min: number | null, max: number | null) => {
    if (!min && !max) return "Price on request";
    const formatVal = (val: number) => {
      if (val >= 10000000) return `${(val / 10000000).toFixed(1)}Cr`;
      if (val >= 100000) return `${(val / 100000).toFixed(0)}L`;
      return `${val}`;
    };
    if (min && max) return `₹${formatVal(min)} - ${formatVal(max)}`;
    if (min) return `From ₹${formatVal(min)}`;
    if (max) return `Up to ₹${formatVal(max)}`;
    return "Price on request";
  };

  const canAddProject = userRole === "admin" || userRole === "manager";

  return (
    <AppShell>
      {/* Header */}
      <header className="bg-card border-b border-border px-4 pt-12 pb-4 sticky top-0 z-30">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-foreground">Projects</h1>
          {canAddProject && (
            <button
              onClick={() => navigate("/projects/new")}
              className="touch-btn w-10 h-10 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              <Plus className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-10 pr-4 rounded-xl bg-muted border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </header>

      <main className="flex-1 px-4 py-4 space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredProjects?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Building2 className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-1">
              No Projects Found
            </h3>
            <p className="text-sm text-muted-foreground">
              {searchQuery
                ? "Try a different search term"
                : "Add your first project to get started"}
            </p>
            {canAddProject && !searchQuery && (
              <button
                onClick={() => navigate("/projects/new")}
                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-xl font-medium"
              >
                Add Project
              </button>
            )}
          </div>
        ) : (
          filteredProjects?.map((project: any) => (
            <div
              key={project._id}
              className="crm-card animate-slide-up cursor-pointer"
              onClick={() => navigate(`/projects/${project._id}/plots`)}
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground truncate">
                      {project.projectName}
                    </h3>

                    <span
                      className={cn(
                        "text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase",
                        project.status === "active"
                          ? "bg-status-hot-bg text-status-hot"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {project.status}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {project.location}
                  </p>
                </div>

                <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
              </div>

              <div className="grid grid-cols-3 gap-3 mt-4 pt-3 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground">Total Units</p>
                  <p className="text-sm font-semibold text-foreground">
                    {project.totalUnits}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <p className="text-sm font-semibold text-status-hot capitalize">
                    {project.status}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Price Range</p>
                  <p className="text-sm font-semibold text-foreground">
                    {formatPrice(
                      project.priceRange?.min,
                      project.priceRange?.max
                    )}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </main>
    </AppShell>
  );
}
