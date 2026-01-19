import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ChevronDown, Info } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { useProject, useProjectPlots, Plot } from "@/hooks/useProjects";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const statusColors = {
  available: "bg-status-hot",
  booked: "bg-status-warm",
  sold: "bg-status-lost",
};

const statusLabels = {
  available: "Available",
  booked: "Booked",
  sold: "Sold",
};

export default function PlotMap() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: project } = useProject(id || "");
  const { data: plots } = useProjectPlots(id || "");
  
  const [selectedPlot, setSelectedPlot] = useState<Plot | null>(null);
  const [filter, setFilter] = useState<"all" | "available" | "booked" | "sold">("all");

  const filteredPlots = plots?.filter((plot) => 
    filter === "all" || plot.status === filter
  );

  const plotCounts = {
    all: plots?.length || 0,
    available: plots?.filter(p => p.status === "available").length || 0,
    booked: plots?.filter(p => p.status === "booked").length || 0,
    sold: plots?.filter(p => p.status === "sold").length || 0,
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`;
    }
    return `₹${amount.toLocaleString()}`;
  };

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
          <div>
            <h1 className="text-xl font-bold">{project?.name || "Plot Map"}</h1>
            <p className="text-sm opacity-70">{project?.location}</p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-4 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-status-hot" />
            <span className="text-xs">Available ({plotCounts.available})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-status-warm" />
            <span className="text-xs">Booked ({plotCounts.booked})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-status-lost" />
            <span className="text-xs">Sold ({plotCounts.sold})</span>
          </div>
        </div>
      </header>

      {/* Filter Pills */}
      <div className="px-4 py-3 flex gap-2 overflow-x-auto scrollbar-hide border-b border-border">
        {(["all", "available", "booked", "sold"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
              filter === status
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {status === "all" ? "All" : statusLabels[status]} ({plotCounts[status]})
          </button>
        ))}
      </div>

      {/* Plot Grid */}
      <main className="flex-1 p-4">
        {!plots || plots.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <Info className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-1">No Plots Available</h3>
            <p className="text-sm text-muted-foreground">
              This project doesn't have any plots configured yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2">
            {filteredPlots?.map((plot) => (
              <button
                key={plot.id}
                onClick={() => setSelectedPlot(plot)}
                className={cn(
                  "aspect-square rounded-lg flex flex-col items-center justify-center p-2 transition-all active:scale-95",
                  statusColors[plot.status],
                  plot.status === "available" ? "hover:opacity-80" : "opacity-70"
                )}
              >
                <span className="text-white text-xs font-bold">{plot.plot_number}</span>
                <span className="text-white/70 text-[10px]">{plot.area_sqft} sq.ft</span>
              </button>
            ))}
          </div>
        )}
      </main>

      {/* Plot Detail Dialog */}
      <Dialog open={!!selectedPlot} onOpenChange={() => setSelectedPlot(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Plot {selectedPlot?.plot_number}</span>
              <span className={cn(
                "text-xs font-semibold px-2 py-1 rounded-full",
                selectedPlot?.status === "available" && "bg-status-hot-bg text-status-hot",
                selectedPlot?.status === "booked" && "bg-status-warm-bg text-status-warm",
                selectedPlot?.status === "sold" && "bg-status-lost-bg text-status-lost"
              )}>
                {selectedPlot?.status && statusLabels[selectedPlot.status]}
              </span>
            </DialogTitle>
          </DialogHeader>

          {selectedPlot && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted rounded-xl p-3">
                  <p className="text-xs text-muted-foreground">Area</p>
                  <p className="font-semibold">{selectedPlot.area_sqft} sq.ft</p>
                </div>
                <div className="bg-muted rounded-xl p-3">
                  <p className="text-xs text-muted-foreground">Facing</p>
                  <p className="font-semibold">{selectedPlot.facing || "N/A"}</p>
                </div>
                <div className="bg-muted rounded-xl p-3">
                  <p className="text-xs text-muted-foreground">Dimensions</p>
                  <p className="font-semibold">{selectedPlot.dimensions || "N/A"}</p>
                </div>
                <div className="bg-muted rounded-xl p-3">
                  <p className="text-xs text-muted-foreground">Corner Plot</p>
                  <p className="font-semibold">{selectedPlot.corner_plot ? "Yes" : "No"}</p>
                </div>
              </div>

              <div className="bg-primary/5 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Price per sq.ft</span>
                  <span className="font-medium">₹{Number(selectedPlot.price_per_sqft).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-border">
                  <span className="font-semibold">Total Price</span>
                  <span className="font-bold text-lg text-primary">
                    {formatCurrency(Number(selectedPlot.total_price))}
                  </span>
                </div>
              </div>

              {selectedPlot.status === "available" && (
                <button
                  onClick={() => {
                    setSelectedPlot(null);
                    navigate(`/quotations/new?plotId=${selectedPlot.id}`);
                  }}
                  className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
                >
                  Create Quotation
                </button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
