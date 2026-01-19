import { cn } from "@/lib/utils";

interface PipelineStage {
  label: string;
  count: number;
  color: string;
}

interface PipelineBarProps {
  stages: PipelineStage[];
  className?: string;
}

export function PipelineBar({ stages, className }: PipelineBarProps) {
  const total = stages.reduce((sum, stage) => sum + stage.count, 0);

  return (
    <div className={cn("crm-card", className)}>
      <h3 className="text-sm font-semibold text-foreground mb-3">Lead Pipeline</h3>
      
      {/* Visual Bar */}
      <div className="h-3 rounded-full overflow-hidden flex bg-muted mb-4">
        {stages.map((stage, index) => (
          <div
            key={stage.label}
            className={cn(
              "h-full transition-all duration-500",
              stage.color
            )}
            style={{ width: `${(stage.count / total) * 100}%` }}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-3 gap-2">
        {stages.map((stage) => (
          <div key={stage.label} className="flex items-center gap-1.5">
            <span className={cn("w-2.5 h-2.5 rounded-full shrink-0", stage.color)} />
            <span className="text-xs text-muted-foreground truncate">{stage.label}</span>
            <span className="text-xs font-semibold text-foreground ml-auto">{stage.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
