import { Phone, MessageCircle, MapPin, Clock, Mail, Users, Bell, PhoneCall, CalendarClock, XCircle, ChevronDown, ChevronUp, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusBadge, LeadStatus } from "@/components/ui/StatusBadge";
import { useState } from "react";

export type TaskType = "call" | "whatsapp" | "site_visit" | "reminder" | "email" | "meeting";

interface TaskCardProps {
  id?: string;
  type: TaskType;
  leadName: string;
  leadStatus: LeadStatus;
  time: string;
  project?: string;
  remark?: string; // Added remark
  isOverdue?: boolean;
  onCall?: () => void;
  onWhatsApp?: () => void;
  onCancel?: () => void;
  onReschedule?: () => void;
  onViewLead?: () => void; // Added view lead action
}

const taskConfig: Record<TaskType, { icon: typeof Phone; label: string; color: string; bg: string }> = {
  call: { icon: Phone, label: "Call", color: "text-blue-600", bg: "bg-blue-50" },
  whatsapp: { icon: MessageCircle, label: "WhatsApp", color: "text-green-600", bg: "bg-green-50" },
  site_visit: { icon: MapPin, label: "Site Visit", color: "text-purple-600", bg: "bg-purple-50" },
  reminder: { icon: Bell, label: "Reminder", color: "text-amber-600", bg: "bg-amber-50" },
  email: { icon: Mail, label: "Email", color: "text-slate-600", bg: "bg-slate-50" },
  meeting: { icon: Users, label: "Meeting", color: "text-indigo-600", bg: "bg-indigo-50" },
};

export function TaskCard({
  type,
  leadName,
  leadStatus,
  time,
  project,
  remark,
  isOverdue,
  onCall,
  onWhatsApp,
  onCancel,
  onReschedule,
  onViewLead,
}: TaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const config = taskConfig[type] || taskConfig.call;
  const Icon = config.icon;

  return (
    <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
            "bg-card border-b border-border/50 first:border-t hover:bg-muted/5 transition-all p-3.5 cursor-pointer select-none",
            isExpanded && "bg-muted/10"
        )}
    >
      <div className="flex gap-3">
          {/* Icon */}
          <div className={cn("w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-1", config.bg, config.color)}>
             <Icon className="w-4 h-4" />
          </div>

          <div className="flex-1 min-w-0">
             {/* Header Row */}
             <div className="flex justify-between items-start">
                 <div>
                    <h4 className="font-semibold text-sm text-foreground truncate leading-tight pr-2">{leadName}</h4>
                    <div className="flex items-center gap-2 mt-1">
                        <span className={cn("text-[10px] uppercase font-bold tracking-wide", config.color)}>
                            {config.label}
                        </span>
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                            {time}
                        </span>
                        {isOverdue && (
                            <span className="text-[10px] font-bold text-red-500 bg-red-50 px-1.5 rounded-full flex items-center gap-1">
                                !
                            </span>
                        )}
                    </div>
                 </div>
                 
                 <div className="flex items-center gap-2">
                     <StatusBadge status={leadStatus} className="scale-75 origin-right" />
                     {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                 </div>
             </div>

             {/* Expanded Content */}
             {isExpanded && (
                 <div className="mt-4 pt-3 border-t border-border/40 animate-in slide-in-from-top-2 duration-200">
                     {/* Details */}
                     <div className="space-y-2 mb-4">
                        {project && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span className="font-medium text-foreground">Project:</span> {project}
                            </div>
                        )}
                        {remark && (
                            <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded-lg border border-border/30">
                                <span className="font-medium text-foreground block mb-0.5">Note:</span>
                                {remark}
                            </div>
                        )}
                     </div>

                     {/* Actions Grid - 2x2 or auto flow */}
                     <div className="grid grid-cols-2 gap-2">
                         {onCall ? (
                             <button 
                                 onClick={(e) => { e.stopPropagation(); onCall(); }}
                                 className="flex items-center justify-center gap-2 h-9 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold hover:bg-blue-100 transition-colors"
                             >
                                 <PhoneCall className="w-3.5 h-3.5" />
                                 Call
                             </button>
                         ) : <div/>}

                         {onWhatsApp ? (
                             <button 
                                 onClick={(e) => { e.stopPropagation(); onWhatsApp(); }}
                                 className="flex items-center justify-center gap-2 h-9 rounded-lg bg-green-50 text-green-700 text-xs font-semibold hover:bg-green-100 transition-colors"
                             >
                                 <MessageCircle className="w-3.5 h-3.5" />
                                 WhatsApp
                             </button>
                         ) : <div/>}
                         
                         {onReschedule && (
                             <button 
                                 onClick={(e) => { e.stopPropagation(); onReschedule(); }}
                                 className="flex items-center justify-center gap-2 h-9 rounded-lg bg-amber-50 text-amber-700 text-xs font-medium hover:bg-amber-100 transition-colors"
                             >
                                 <CalendarClock className="w-3.5 h-3.5" />
                                 Reschedule
                             </button>
                         )}

                         {onCancel && (
                             <button 
                                 onClick={(e) => { e.stopPropagation(); onCancel(); }}
                                 className="flex items-center justify-center gap-2 h-9 rounded-lg bg-red-50 text-red-700 text-xs font-medium hover:bg-red-100 transition-colors"
                             >
                                 <XCircle className="w-3.5 h-3.5" />
                                 Cancel
                             </button>
                         )}
                         
                         {onViewLead && (
                             <button 
                                 onClick={(e) => { e.stopPropagation(); onViewLead(); }}
                                 className="col-span-2 mt-1 flex items-center justify-center gap-2 h-8 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                             >
                                 <User className="w-3.5 h-3.5" />
                                 View Lead Profile
                             </button>
                         )}
                     </div>
                 </div>
             )}
          </div>
      </div>
    </div>
  );
}
