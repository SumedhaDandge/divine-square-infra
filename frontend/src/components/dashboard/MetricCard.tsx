import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: {
    value: number;
    positive: boolean;
  };
  variant?: "default" | "primary" | "accent";
  className?: string;
}

export function MetricCard({
  icon: Icon,
  label,
  value,
  trend,
  variant = "default",
  className,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        "crm-card flex items-center gap-3",
        variant === "primary" && "bg-primary text-primary-foreground border-primary",
        variant === "accent" && "bg-accent text-accent-foreground border-accent",
        className
      )}
    >
      <div
        className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
          variant === "default" && "bg-primary/10 text-primary",
          variant === "primary" && "bg-primary-foreground/20 text-primary-foreground",
          variant === "accent" && "bg-accent-foreground/10 text-accent-foreground"
        )}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-xs font-medium truncate",
            variant === "default" && "text-muted-foreground",
            variant !== "default" && "opacity-80"
          )}
        >
          {label}
        </p>
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold">{value}</span>
          {trend && (
            <span
              className={cn(
                "text-xs font-medium",
                trend.positive ? "text-status-hot" : "text-status-lost"
              )}
            >
              {trend.positive ? "+" : ""}{trend.value}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
