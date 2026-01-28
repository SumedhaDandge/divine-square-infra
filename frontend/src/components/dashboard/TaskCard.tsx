import { Phone, MessageCircle, MapPin, Clock, Mail, Users, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusBadge, LeadStatus } from "@/components/ui/StatusBadge";

export type TaskType = "call" | "whatsapp" | "site_visit" | "reminder" | "email" | "meeting";

interface TaskCardProps {
  id?: string;
  type: TaskType;
  leadName: string;
  leadStatus: LeadStatus;
  time: string;
  project?: string;
  isOverdue?: boolean;
  onCall?: () => void;
  onWhatsApp?: () => void;
}

const taskConfig: Record<TaskType, { icon: typeof Phone; label: string; color: string }> = {
  call: { icon: Phone, label: "Follow-up Call", color: "text-status-cold bg-status-cold-bg" },
  whatsapp: { icon: MessageCircle, label: "WhatsApp", color: "text-status-hot bg-status-hot-bg" },
  site_visit: { icon: MapPin, label: "Site Visit", color: "text-accent bg-accent/10" },
  reminder: { icon: Bell, label: "Reminder", color: "text-status-warm bg-status-warm-bg" },
  email: { icon: Mail, label: "Email", color: "text-status-new bg-status-new-bg" },
  meeting: { icon: Users, label: "Meeting", color: "text-primary bg-primary/10" },
};

export function TaskCard({
  type,
  leadName,
  leadStatus,
  time,
  project,
  isOverdue,
  onCall,
  onWhatsApp,
}: TaskCardProps) {
  const config = taskConfig[type] || taskConfig.call;
  const Icon = config.icon;

  return (
    <div className="crm-card animate-slide-up">
      <div className="flex items-start gap-3">
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", config.color)}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-muted-foreground">{config.label}</span>
            {isOverdue && (
              <span className="text-[10px] font-semibold text-status-lost bg-status-lost-bg px-1.5 py-0.5 rounded">
                OVERDUE
              </span>
            )}
          </div>
          <h4 className="font-semibold text-foreground truncate">{leadName}</h4>
          <div className="flex items-center gap-2 mt-1">
            <StatusBadge status={leadStatus} />
            {project && (
              <span className="text-xs text-muted-foreground truncate">• {project}</span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {time}
          </p>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div className="flex gap-2 mt-3 pt-3 border-t border-border">
        <button
          onClick={onCall}
          className="flex-1 touch-btn bg-primary/10 text-primary rounded-xl text-sm font-medium gap-2 hover:bg-primary/20 transition-colors"
        >
          <Phone className="w-4 h-4" />
          Call
        </button>
        <button
          onClick={onWhatsApp}
          className="flex-1 touch-btn bg-status-hot/10 text-status-hot rounded-xl text-sm font-medium gap-2 hover:bg-status-hot/20 transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          WhatsApp
        </button>
      </div>
    </div>
  );
}
