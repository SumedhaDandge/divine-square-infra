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

    const paylod = {
      lead : formData.lead_id,
      taskType :  formData.type,
      remark : formData.remark,
      taskDate : formData.due_date,
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
      <header className="bg-primary text-primary-foreground px-4 pt-12 pb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="touch-btn w-10 h-10 rounded-full bg-primary-foreground/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">Add Task</h1>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="px-4 py-6 space-y-4">
        {/* TASK TYPE */}
        <div className="crm-card">
          <label className="font-semibold">Task Type</label>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {taskTypes.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setFormData({ ...formData, type: t.value })}
                className={cn(
                  "py-3 rounded-xl border",
                  formData.type === t.value && "bg-primary text-white",
                )}
              >
                <t.icon className="mx-auto mb-1" />
                <span className="text-xs">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* LEAD */}
        <div className="crm-card">
          <label className="font-semibold">Lead *</label>
          <button
            type="button"
            onClick={() => setShowLeadDropdown(!showLeadDropdown)}
            className="w-full h-12 bg-muted rounded-xl px-4 text-left"
          >
            {selectedLead
              ? `${selectedLead.customerName} - ${selectedLead.mobile}`
              : "Select lead"}
          </button>

          {showLeadDropdown && (
            <div className="mt-1 border rounded-xl max-h-40 overflow-y-auto">
              {leads?.map((l: any) => (
                <button
                  key={l._id}
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, lead_id: l._id });
                    setShowLeadDropdown(false);
                  }}
                  className="block w-full px-4 py-2 text-left hover:bg-muted"
                >
                  {l.customerName} – {l.mobile}
                </button>
              ))}
            </div>
          )}
          {errors.lead_id && <p className="text-xs text-red-500 mt-1">Please select a lead</p>}
        </div>

        {/* REMARK */}
        <div className="crm-card">
          <label className="font-semibold">Remark *</label>
          <textarea
            value={formData.remark}
            onChange={(e) =>
              setFormData({ ...formData, remark: e.target.value })
            }
            className="w-full bg-muted rounded-xl p-3"
          />
          {errors.remark && <p className="text-xs text-red-500 mt-1">{errors.remark}</p>}
        </div>

        {/* DATE & TIME */}
        <div className="crm-card">
          <label className="font-semibold">Schedule *</label>
          <div className="flex gap-2 mt-2">
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="flex-1 h-12 bg-muted rounded-xl px-3"
                >
                  <CalendarIcon className="inline mr-2" />
                  {formData.due_date
                    ? format(formData.due_date, "PPP")
                    : "Pick date"}
                </button>
              </PopoverTrigger>
              <PopoverContent>
                <Calendar
                  mode="single"
                  selected={formData.due_date}
                  onSelect={(date) =>
                    setFormData({ ...formData, due_date: date })
                  }
                  disabled={(date) => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return date < today;
                  }}
                />
              </PopoverContent>
            </Popover>

            {/* NATIVE TIME PICKER */}
            <div className="relative">
                 <input 
                    type="time"
                    className={cn(
                        "w-full h-12 bg-muted rounded-xl px-4 text-sm font-medium",
                        errors.due_time ? "border border-red-500 bg-red-50" : ""
                    )}
                    value={(() => {
                        if (!formData.due_time) return "";
                        try {
                             const parsed = parse(formData.due_time, "hh:mm a", new Date());
                             return isValid(parsed) ? format(parsed, "HH:mm") : "";
                        } catch (e) { return ""; }
                    })()}
                    onChange={(e) => {
                        const val = e.target.value; // HH:mm
                        if(!val) return;
                        
                        // Convert to 12h format
                        const [h, m] = val.split(':');
                        const date = new Date();
                        date.setHours(Number(h));
                        date.setMinutes(Number(m));
                        
                        // Use hh:mm a format consistently
                        const timeStr = format(date, "hh:mm a");
                        setFormData({ ...formData, due_time: timeStr });
                    }}
                 />
            </div>
          </div>
          {errors.due_date && <p className="text-xs text-red-500 mt-1">Date is required</p>}
          {errors.due_time && <p className="text-xs text-red-500 mt-1">Time is required</p>}
        </div>

        {/* SUBMIT */}
        <button
          disabled={loading}
          className="w-full h-14 bg-primary text-white rounded-xl font-semibold"
        >
          {loading ? "Creating..." : "Create Task"}
        </button>
      </form>
    </AppShell>
  );
}
