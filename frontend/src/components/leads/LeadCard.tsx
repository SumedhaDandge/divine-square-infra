import { Phone, MessageCircle, MapPin, Calendar, ChevronRight, User, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/StatusBadge";

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
  
  return (
    <div className="bg-card rounded-xl p-3 border border-border/60 shadow-sm hover:shadow-md transition-all">
      <div className="flex justify-between items-start gap-3" onClick={onClick}>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="font-semibold text-sm text-foreground truncate">{name}</h3>
            <StatusBadge status={status} className="h-5 text-[10px] px-1.5 py-0" />
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
             <span className="flex items-center gap-1">
                <Phone className="w-3 h-3" /> {phone}
             </span>
             {budget && (
                <span className="flex items-center gap-1">
                   <Wallet className="w-3 h-3" /> ₹{budget}
                </span>
             )}
          </div>
          
          {project && (
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted/50 text-[10px] font-medium text-foreground/80 mb-3">
               <MapPin className="w-3 h-3 text-primary" />
               {project}
            </div>
          )}
        </div>
        
        {/* <button className="text-muted-foreground/50">
           <ChevronRight className="w-4 h-4" />
        </button> */}
      </div>

      <div className="grid grid-cols-2 gap-2 mt-1">
         <button
           onClick={(e) => { e.stopPropagation(); onCall?.(); }}
           className="flex items-center justify-center gap-1.5 h-8 rounded-lg bg-primary/10 text-primary text-xs font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
         >
           <Phone className="w-3.5 h-3.5" /> Call
         </button>
         <button
           onClick={(e) => { e.stopPropagation(); onWhatsApp?.(); }}
           className="flex items-center justify-center gap-1.5 h-8 rounded-lg bg-green-50 text-green-600 text-xs font-medium hover:bg-green-500 hover:text-white transition-colors"
         >
           <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
         </button>
      </div>
    </div>
  );
}
