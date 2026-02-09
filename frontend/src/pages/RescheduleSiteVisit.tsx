import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Calendar as CalendarIcon, Clock, Building2, AlertTriangle, ChevronDown } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { useSiteVisits, useRescheduleSiteVisit } from "@/hooks/useSiteVisits";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { toast } from "sonner";
// import { useRescheduleSiteVisit } from "@/hooks/useSiteVisits"; // Placeholder if exists

export default function RescheduleSiteVisit() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const { data: siteVisits } = useSiteVisits();
  const reschedule = useRescheduleSiteVisit();
  const existingVisit = siteVisits?.find(v => v.id === id || v._id === id);

  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [reason, setReason] = useState("");
  
  useEffect(() => {
    if (existingVisit) {
       const d = new Date(existingVisit.scheduledAt || existingVisit.taskDate);
       if (!isNaN(d.getTime())) {
           setDate(d);
           setTime(existingVisit.taskTime || format(d, "HH:mm"));
       }
       setLocation(existingVisit.pickupLocation || "");
    }
  }, [existingVisit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time || !reason || !id) {
        toast.error("Please fill all required fields");
        return;
    }
    
    try {
        await reschedule.mutateAsync({ id, date, time, reason, location });
        navigate(-1);
    } catch(e) {
        // handled
    }
  };

  if (!existingVisit) return (
      <AppShell showFab={false} showBottomNav={false}>
          <div className="p-4 text-center mt-10">
              <p>Loading visit details...</p>
              <button onClick={() => navigate(-1)} className="mt-4 text-primary">Go Back</button>
          </div>
      </AppShell>
  );

  return (
    <AppShell showFab={false} showBottomNav={false}>
      {/* Header */}
      <header className="bg-amber-100/80 text-amber-900 px-4 pt-12 pb-6 backdrop-blur-sm border-b border-amber-200/50">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="touch-btn w-10 h-10 rounded-full bg-amber-900/10 flex items-center justify-center">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold">Reschedule Visit</h1>
            <p className="text-xs font-medium opacity-80 uppercase tracking-wide">
                {existingVisit.leads?.customerName || existingVisit.leads?.name}
            </p>
          </div>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="flex-1 px-4 py-6 space-y-5">
        
        {/* Read Only Info */}
        <div className="grid grid-cols-2 gap-3">
            <div className="crm-card !p-3 bg-muted/30 border-none">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Building2 className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium uppercase">Project</span>
                    </div>
                    <span className="text-sm font-semibold truncate">
                        {existingVisit.project?.projectName || existingVisit.project?.name || "Project Unnamed"}
                    </span>
                </div>
            </div>
             <div className="crm-card !p-3 bg-muted/30 border-none">
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="text-xs font-medium uppercase">Lead</span>
                    </div>
                    <span className="text-sm font-semibold truncate">
                        {existingVisit.leads?.customerName || existingVisit.leads?.name}
                    </span>
                </div>
            </div>
        </div>

        {/* Reason */}
        <div className="crm-card border-l-4 border-l-amber-500 shadow-sm">
          <label className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" /> 
            Reason for Rescheduling <span className="text-destructive">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Why is the visit being rescheduled?"
            className="w-full p-3 rounded-xl bg-muted/50 border-transparent focus:bg-background focus:ring-2 focus:ring-amber-500/20 outline-none text-sm min-h-[80px] resize-none transition-all"
          />
        </div>

        {/* Date & Time */}
        <div className="crm-card shadow-sm">
           <label className="text-sm font-semibold text-foreground mb-4 block">New Schedule <span className="text-destructive">*</span></label>
           <div className="flex flex-col gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <button type="button" className="w-full h-12 px-4 rounded-xl bg-muted/50 border border-transparent hover:bg-muted text-left flex items-center justify-between transition-colors">
                  <div className="flex items-center gap-3">
                      <CalendarIcon className="w-5 h-5 text-muted-foreground" />
                      {date ? <span className="font-medium">{format(date, "EEEE, MMMM d, yyyy")}</span> : <span className="text-muted-foreground">Select new date</span>}
                  </div>
                  <ChevronDown className="w-4 h-4 text-muted-foreground opacity-50" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>

            <div className="relative w-full">
              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full h-12 pl-12 pr-4 rounded-xl bg-muted/50 border border-transparent hover:bg-muted text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors [color-scheme:light] dark:[color-scheme:dark]"
              />
            </div>
          </div>
        </div>

        {/* Pickup Location */}
        <div className="crm-card shadow-sm">
          <label className="text-sm font-semibold text-foreground mb-3 block">Pickup Location</label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            <input
                type="text"
                placeholder="Enter pickup location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full h-12 pl-12 pr-4 rounded-xl bg-muted/50 border border-transparent hover:bg-muted text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 pb-8 sticky bottom-0 bg-background/80 backdrop-blur-md p-4 -mx-4 border-t border-border mt-auto">
          <button
            type="submit"
            disabled={reschedule.isPending}
            className="w-full h-14 rounded-xl bg-amber-500 text-white font-bold text-base hover:bg-amber-600 active:scale-[0.98] transition-all shadow-lg shadow-amber-500/20 disabled:opacity-70 disabled:scale-100 flex items-center justify-center gap-2"
          >
            {reschedule.isPending ? (
                 <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Updating...
                 </>
            ) : "Confirm Reschedule"}
          </button>
        </div>
      </form>
    </AppShell>
  );
}
