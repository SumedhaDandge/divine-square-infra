import { Phone, MessageCircle, MapPin, Calendar, ChevronRight } from "lucide-react";
// import { StatusBadge, LeadStatus } from "@/components/ui/StatusBadge";
import { cn } from "@/lib/utils";

interface LeadCardProps {
  id: string;
  name: string;
  phone: string;
  status: any;
  source: string;
  project?: string;
  budget?: string;
  lastContact?: string;
  nextFollowUp?: string;
  onClick?: () => void;
  onCall?: () => void;
  onWhatsApp?: () => void;
}

export function LeadCard({
  name,
  phone,
  status,
  source,
  project,
  budget,
  lastContact,
  nextFollowUp,
  onClick,
  onCall,
  onWhatsApp,
}: LeadCardProps) {


  console.log("Rendering LeadCard for:", name);
  return (
    <div className="crm-card animate-slide-up">
      {/* Header */}
      <div className="flex items-start justify-between mb-3" onClick={onClick}>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-foreground truncate">{name}</h3>
            {/* <StatusBadge status={status} /> */}
          </div>
          <p className="text-sm text-muted-foreground">{phone}</p>
        </div>
        <button className="touch-btn w-8 h-8 rounded-full hover:bg-muted transition-colors -mr-2">
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          Source: <span className="text-foreground font-medium">{source}</span>
        </div>
        {project && (
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="w-3 h-3" />
            <span className="text-foreground font-medium truncate">{project}</span>
          </div>
        )}
        {budget && (
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <span className="text-foreground font-medium">₹{budget}</span>
          </div>
        )}
        {nextFollowUp && (
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span className={cn(
              "font-medium",
              nextFollowUp.includes("Today") ? "text-status-hot" : "text-foreground"
            )}>
              {nextFollowUp}
            </span>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2 pt-3 border-t border-border">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCall?.();
          }}
          className="flex-1 touch-btn bg-primary text-primary-foreground rounded-xl text-sm font-semibold gap-2 hover:bg-primary-hover transition-colors"
        >
          <Phone className="w-4 h-4" />
          Call
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onWhatsApp?.();
          }}
          className="flex-1 touch-btn bg-status-hot text-white rounded-xl text-sm font-semibold gap-2 hover:opacity-90 transition-opacity"
        >
          <MessageCircle className="w-4 h-4" />
          WhatsApp
        </button>
      </div>
    </div>
  );
}
