import { cn } from "@/lib/utils";

export type LeadStatus = "new" | "hot" | "warm" | "cold" | "lost" | "converted";

interface StatusBadgeProps {
  status: LeadStatus;
  className?: string;
}

const statusConfig: Record<LeadStatus, { label: string; className: string }> = {
  new: { label: "New", className: "status-new" },
  hot: { label: "Hot", className: "status-hot" },
  warm: { label: "Warm", className: "status-warm" },
  cold: { label: "Cold", className: "status-cold" },
  lost: { label: "Lost", className: "status-lost" },
  converted: { label: "Converted", className: "status-converted" },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
