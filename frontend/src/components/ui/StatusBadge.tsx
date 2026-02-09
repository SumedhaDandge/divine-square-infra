import { cn } from "@/lib/utils";

export type LeadStatus = "new" | "hot" | "warm" | "cold" | "lost" | "converted";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusConfig: Record<string, { label: string; className: string }> = {
  new: { label: "New", className: "status-new" },
  hot: { label: "Hot", className: "status-hot" },
  warm: { label: "Warm", className: "status-warm" },
  cold: { label: "Cold", className: "status-cold" },
  lost: { label: "Lost", className: "status-lost" },
  converted: { label: "Converted", className: "status-converted" },
  
  // Add new statuses if standardizing, but fallback handles dynamic ones
  site_visit_scheduled: { label: "Site Visit Scheduled", className: "bg-purple-100 text-purple-700" },
  site_visit_completed: { label: "Site Visit Completed", className: "bg-purple-200 text-purple-800" },
  site_visit_done: { label: "Site Visit Done", className: "bg-purple-200 text-purple-800" },
  negotiation: { label: "Negotiation", className: "bg-yellow-100 text-yellow-800" },
  booked: { label: "Booked", className: "bg-green-100 text-green-800" },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const safeStatus = status?.toString()?.toLowerCase() || "new";
  const config = statusConfig[safeStatus] || { 
    label: status?.toString()?.replace(/_/g, " ") || "Unknown", 
    className: "bg-gray-100 text-gray-800" 
  };
  
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
