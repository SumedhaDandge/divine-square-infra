import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { format, parse, isValid } from "date-fns";
import {
  Phone,
  MessageSquare,
  CalendarCheck,
  Repeat,
  PhoneForwarded,
  CheckCircle,
  ArrowLeft,
  Calendar as CalendarIcon,
  Clock,
} from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import { toast } from "sonner";
import useLeads from "@/hooks/useLeads";
import { useDataContext } from "@/contex/DataContext";
import { divineSquareService } from "@/services/DivineInfraService";

/* ------------------ VALIDATION ------------------ */

const taskSchema = z.object({
  lead_id: z.string().min(1),
  type: z.enum([
    "call",
    "whatsapp",
    "site_visit",
    "revisit",
    "follow_up",
    "booking",
  ]),
  remark: z.string().min(2, "Please enter remark"),
  due_date: z.date(),
  due_time: z.string().min(1),
});

/* ------------------ TASK TYPES ------------------ */

const taskTypes = [
  { value: "call", label: "Call", icon: Phone },
  { value: "whatsapp", label: "WhatsApp", icon: MessageSquare },
  { value: "site_visit", label: "Site Visit", icon: CalendarCheck },
  { value: "revisit", label: "Re-Visit", icon: Repeat },
  { value: "follow_up", label: "Follow-up", icon: PhoneForwarded },
  { value: "booking", label: "Booking", icon: CheckCircle },
];

/* ------------------ TIME SLOTS ------------------ */

/* ------------------ COMPONENT ------------------ */

export default function AddTask() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const leadIdParam = searchParams.get("leadId");
const userId = JSON.parse(sessionStorage.getItem("auth_user"));
console.log("userID", userId?.id); // or user.id depending on your structure


  const { fetchLeads } = useLeads();
  const { leads } = useDataContext();

  const [showLeadDropdown, setShowLeadDropdown] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    lead_id: leadIdParam || "",
    type: "call",
    remark: "",
    due_date: undefined as Date | undefined,
    due_time: "",
  });

  useEffect(() => {
    fetchLeads();
  }, []);

  /* ------------------ SUBMIT ------------------ */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = taskSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        fieldErrors[String(err.path[0])] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    console.log("paylod",formData)

    // Combine date and time to avoid "Past date" error when scheduling for today
    let scheduledDate = formData.due_date;
    if (scheduledDate && formData.due_time) {
       // Parse "04:30 PM" format
       const parsedTime = parse(formData.due_time, "hh:mm a", new Date());
       if (isValid(parsedTime)) {
          const newDate = new Date(scheduledDate);
          newDate.setHours(parsedTime.getHours());
          newDate.setMinutes(parsedTime.getMinutes());
          newDate.setSeconds(0);
          scheduledDate = newDate;
       }
    }

    const paylod = {
      lead : formData.lead_id,
      taskType :  formData.type,
      remark : formData.remark,
      taskDate : scheduledDate,
      taskTime : formData.due_time,
      assignedTo : userId.id
    }

    try {
      setLoading(true);

      const response = await divineSquareService.createLeadTask(paylod);

      console.log("helooo", response);
      if (response.status === 201) {
        toast.success("Task created successfully");
        navigate(-1);
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  const selectedLead = leads?.find((l: any) => l._id === formData.lead_id);

  /* ------------------ UI ------------------ */

  return (
    <AppShell showFab={false} showBottomNav={false}>

      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50 pb-2 shadow-sm">
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-muted/80 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-foreground">Add Task</h1>
          </div>

        </div>
      </header>

      {/* Spacer */}
      <div className="h-20" />

      <form id="task-form" onSubmit={handleSubmit} className="px-4 py-4 space-y-6 pb-32">
        
        {/* SECTION 1: TASK TYPE */}
        <section className="space-y-4">
           {/* ... existing content ... */}
           <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Task Type</h3>
           <div className="grid grid-cols-3 gap-3">
            {taskTypes.map((t) => {
              const isSelected = formData.type === t.value;
              return (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, type: t.value as any })}
                  className={cn(
                    "flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border transition-all active:scale-95",
                    isSelected 
                        ? "bg-primary/10 border-primary text-primary shadow-sm" 
                        : "bg-card border-border/50 text-muted-foreground hover:bg-muted/50"
                  )}
                >
                  <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                      isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  )}>
                      <t.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wide">{t.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* SECTION 2: DETAILS */}
        <section className="space-y-4">
             <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Task Details</h3>
             
             <div className="bg-card rounded-2xl border border-border/50 shadow-sm p-4 space-y-5">
                
                {/* Lead Selection */}
                <div>
                    <label className="text-xs font-semibold text-foreground mb-1.5 block">Lead *</label>
                    {leadIdParam && selectedLead ? (
                         <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl border border-border/50">
                             <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                 {selectedLead.customerName.charAt(0)}
                             </div>
                             <div>
                                 <p className="text-sm font-bold text-foreground">{selectedLead.customerName}</p>
                                 <p className="text-xs text-muted-foreground">{selectedLead.mobile}</p>
                             </div>
                         </div>
                    ) : (
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setShowLeadDropdown(!showLeadDropdown)}
                                className="w-full h-11 px-4 rounded-xl bg-muted/30 border border-border/50 text-left flex items-center justify-between text-sm"
                            >
                                <span className={!selectedLead ? "text-muted-foreground" : ""}>
                                {selectedLead ? `${selectedLead.customerName} - ${selectedLead.mobile}` : "Select Lead"}
                                </span>
                                <ArrowLeft className={cn("w-4 h-4 text-muted-foreground transition-transform -rotate-90", showLeadDropdown && "rotate-90")} />
                            </button>

                            {showLeadDropdown && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border/50 rounded-xl shadow-xl z-20 max-h-60 overflow-y-auto p-1">
                                {leads?.map((l: any) => (
                                    <button
                                    key={l._id}
                                    type="button"
                                    onClick={() => {
                                        setFormData({ ...formData, lead_id: l._id });
                                        setShowLeadDropdown(false);
                                    }}
                                    className="w-full text-left px-3 py-2 rounded-lg text-sm mb-1 hover:bg-muted truncate"
                                    >
                                    <span className="font-medium">{l.customerName}</span> <span className="text-muted-foreground">- {l.mobile}</span>
                                    </button>
                                ))}
                                </div>
                            )}
                        </div>
                    )}
                    {errors.lead_id && <p className="text-destructive text-[10px] mt-1">{errors.lead_id}</p>}
                </div>

                {/* Schedule */}
                <div>
                    <label className="text-xs font-semibold text-foreground mb-1.5 block">Schedule *</label>
                    <div className="grid grid-cols-2 gap-3">
                        {/* Date Picker */}
                        <Popover>
                            <PopoverTrigger asChild>
                                <button
                                    type="button"
                                    className={cn(
                                        "h-11 px-3 rounded-xl bg-muted/30 border border-border/50 flex items-center justify-start gap-2 text-sm transition-colors hover:bg-muted/50",
                                        !formData.due_date && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="w-4 h-4 opacity-50" />
                                    {formData.due_date ? format(formData.due_date, "PPP") : "Select Date"}
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={formData.due_date}
                                    onSelect={(date) => setFormData({ ...formData, due_date: date })}
                                    disabled={(date) => {
                                        const today = new Date();
                                        today.setHours(0, 0, 0, 0);
                                        return date < today;
                                    }}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>

                        {/* Time Picker */}
                        <div className="relative">
                            <Clock className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground/50 pointer-events-none" />
                            <input 
                                type="time"
                                className={cn(
                                    "w-full h-11 pl-9 pr-3 rounded-xl bg-muted/30 border border-border/50 text-sm focus:bg-background focus:border-primary/50 transition-all outline-none",
                                    !formData.due_time && "text-transparent"
                                )}
                                style={{ colorScheme: "light" }} 
                                value={(() => {
                                    if (!formData.due_time) return "";
                                    try {
                                            const parsed = parse(formData.due_time, "hh:mm a", new Date());
                                            return isValid(parsed) ? format(parsed, "HH:mm") : "";
                                    } catch (e) { return ""; }
                                })()}
                                onChange={(e) => {
                                    const val = e.target.value; 
                                    if(!val) {
                                        setFormData({...formData, due_time: ""});
                                        return;
                                    }
                                    const [h, m] = val.split(':');
                                    const date = new Date();
                                    date.setHours(Number(h));
                                    date.setMinutes(Number(m));
                                    const timeStr = format(date, "hh:mm a");
                                    setFormData({ ...formData, due_time: timeStr });
                                }}
                            />
                            {!formData.due_time && (
                                <span className="absolute left-9 top-3.5 text-sm text-muted-foreground pointer-events-none">Select Time</span>
                            )}
                        </div>
                    </div>
                    {(errors.due_date || errors.due_time) && (
                        <p className="text-destructive text-[10px] mt-1">Please select both date and time.</p>
                    )}
                </div>

                {/* Remark */}
                <div>
                   <label className="text-xs font-semibold text-foreground mb-1.5 block">Remark *</label>
                   <textarea
                        value={formData.remark}
                        onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                        className="w-full p-3 rounded-xl bg-muted/30 border border-border/50 focus:bg-background focus:border-primary/50 transition-all outline-none resize-none min-h-[100px] text-sm placeholder:text-muted-foreground/50"
                        placeholder="Enter task details..."
                    />
                     {errors.remark && <p className="text-destructive text-[10px] mt-1">{errors.remark}</p>}
                </div>

             </div>
        </section>

      </form>

      {/* Submit Button - Fixed Bottom - MOVED OUTSIDE FORM */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t border-border/50 z-[60] pb-[calc(1rem+env(safe-area-inset-bottom))]">
            <button
            form="task-form"
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-primary text-primary-foreground text-sm font-bold rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
            {loading ? (
                <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Scheduling...
                </>
            ) : "Create Task"}
            </button>
        </div>
    </AppShell>
  );
}
