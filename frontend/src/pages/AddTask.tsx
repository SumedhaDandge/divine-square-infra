// import { useEffect, useState } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import {
//   ArrowLeft,
//   Phone,
//   MessageCircle,
//   MapPin,
//   Bell,
//   Mail,
//   Users,
//   Calendar as CalendarIcon,
//   Clock,
//   ChevronDown,
// } from "lucide-react";
// import { AppShell } from "@/components/layout/AppShell";
// // import { useCreateTask, TaskType, useLeadTasks } from "@/hooks/useTasks";

// import { Calendar } from "@/components/ui/calendar";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { format } from "date-fns";
// import { cn } from "@/lib/utils";
// import { z } from "zod";
// import useLeads from "@/hooks/useLeads";
// import { useDataContext } from "@/contex/DataContext";

// const taskSchema = z.object({
//   lead_id: z.string().min(1, "Please select a lead"),
//   type: z.enum([
//     "call",
//     "whatsapp",
//     "site_visit",
//     "reminder",
//     "email",
//     "meeting",
//   ]),
//   title: z.string().min(2, "Title must be at least 2 characters").max(100),
//   description: z.string().max(500).optional(),
//   due_date: z.date({ required_error: "Please select a date" }),
//   due_time: z.string().min(1, "Please select a time"),
// });

// const taskTypes: {
//   value: any;
//   label: string;
//   icon: React.ElementType;
//   color: string;
// }[] = [
//   {
//     value: "call",
//     label: "Call",
//     icon: Phone,
//     color: "bg-primary text-primary-foreground",
//   },
//   {
//     value: "whatsapp",
//     label: "WhatsApp",
//     icon: MessageCircle,
//     color: "bg-status-hot text-white",
//   },
//    {
//     value: "reminder",
//     label: "Reminder",
//     icon: Bell,
//     color: "bg-status-warm text-white",
//   },
//   {
//     value: "site_visit",
//     label: "Site Visit",
//     icon: MapPin,
//     color: "bg-accent text-accent-foreground",
//   },

//   {
//     value : "revisit",
//     label : " Re-Visit",
//     icon : Bell,
//     color : "bg-status-warm text-white"
//   },
//   {
//     value: "booking",
//     label: "Booking",
//     icon: MapPin,
//     color: "bg-accent text-accent-foreground",
//   },

// ];

// const timeSlots = [
//   "09:00 AM",
//   "09:30 AM",
//   "10:00 AM",
//   "10:30 AM",
//   "11:00 AM",
//   "11:30 AM",
//   "12:00 PM",
//   "12:30 PM",
//   "01:00 PM",
//   "01:30 PM",
//   "02:00 PM",
//   "02:30 PM",
//   "03:00 PM",
//   "03:30 PM",
//   "04:00 PM",
//   "04:30 PM",
//   "05:00 PM",
//   "05:30 PM",
//   "06:00 PM",
//   "06:30 PM",
//   "07:00 PM",
// ];

// export default function AddTask() {
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const leadIdParam = searchParams.get("leadId");

//   // const createTask = useCreateTask();
//   // const { data: leads } = useLeads();
//   // const {} = useLeadTasks

//   const { fetchLeads } = useLeads();
//   const { leads } = useDataContext();

//   useEffect(() => {
//     fetchLeads();
//   }, []);

//   const [formData, setFormData] = useState({
//     lead_id: leadIdParam || "",
//     type: "call" as any,
//     title: "",
//     description: "",
//     due_date: undefined as Date | undefined,
//     due_time: "",
//   });
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [showLeadDropdown, setShowLeadDropdown] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setErrors({});

//     const result = taskSchema.safeParse(formData);

//     if (!result.success) {
//       const fieldErrors: Record<string, string> = {};
//       result.error.errors.forEach((err) => {
//         if (err.path[0]) {
//           fieldErrors[err.path[0] as string] = err.message;
//         }
//       });
//       setErrors(fieldErrors);
//       return;
//     }

//     // Convert time to 24h format and combine with date
//     const timeParts = formData.due_time.match(/(\d+):(\d+)\s*(AM|PM)/i);
//     if (!timeParts || !formData.due_date) return;

//     let hours = parseInt(timeParts[1]);
//     const minutes = parseInt(timeParts[2]);
//     const isPM = timeParts[3].toUpperCase() === "PM";

//     if (isPM && hours !== 12) hours += 12;
//     if (!isPM && hours === 12) hours = 0;

//     const dueDateTime = new Date(formData.due_date);
//     dueDateTime.setHours(hours, minutes, 0, 0);

//     // try {
//     //   await createTask.mutateAsync({
//     //     lead_id: formData.lead_id,
//     //     type: formData.type,
//     //     title: formData.title,
//     //     description: formData.description || undefined,
//     //     due_date: dueDateTime.toISOString(),
//     //   });

//     //   navigate(-1);
//     // } catch (error) {
//     //   // Error handled by mutation
//     // }
//   };

//   console.log("leadsssss", leads);

//   const selectedLead = leads?.find((l: any) => l._id === formData.lead_id);

//   console.log("selected", selectedLead);

//   return (
//     <AppShell showFab={false} showBottomNav={false}>
//       {/* Header */}
//       <header className="bg-primary text-primary-foreground px-4 pt-12 pb-6">
//         <div className="flex items-center gap-3">
//           <button
//             onClick={() => navigate(-1)}
//             className="touch-btn w-10 h-10 rounded-full bg-primary-foreground/20"
//           >
//             <ArrowLeft className="w-5 h-5" />
//           </button>
//           <h1 className="text-xl font-bold">Add Follow-up</h1>
//         </div>
//       </header>

//       <form onSubmit={handleSubmit} className="flex-1 px-4 py-6 space-y-4">
//         {/* Task Type */}
//         <div className="crm-card">
//           <label className="text-sm font-semibold text-foreground mb-3 block">
//             Task Type
//           </label>
//           <div className="grid grid-cols-3 gap-2">
//             {taskTypes.map((type) => (
//               <button
//                 key={type.value}
//                 type="button"
//                 onClick={() => setFormData({ ...formData, type: type.value })}
//                 className={cn(
//                   "flex flex-col items-center gap-2 py-3 px-2 rounded-xl transition-all border-2",
//                   formData.type === type.value
//                     ? `${type.color} border-transparent`
//                     : "bg-muted border-transparent hover:border-primary/20",
//                 )}
//               >
//                 <type.icon className="w-5 h-5" />
//                 <span className="text-xs font-medium">{type.label}</span>
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Lead Selection */}
//         <div className="crm-card">
//           <label className="text-sm font-semibold text-foreground mb-3 block">
//             Select Lead *
//           </label>
//           <div className="relative">
//             <button
//               type="button"
//               onClick={() => setShowLeadDropdown(!showLeadDropdown)}
//               className="w-full h-12 px-4 rounded-xl bg-muted text-left text-foreground flex items-center justify-between"
//             >
//               {selectedLead ? (
//                 <span>
//                   {selectedLead.customerName} - {selectedLead.mobile}
//                 </span>
//               ) : (
//                 <span className="text-muted-foreground">Select a lead</span>
//               )}
//               <ChevronDown
//                 className={cn(
//                   "w-5 h-5 text-muted-foreground transition-transform",
//                   showLeadDropdown && "rotate-180",
//                 )}
//               />
//             </button>

//             {showLeadDropdown && (
//               <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-lg z-10 overflow-hidden max-h-48 overflow-y-auto">
//                 {leads?.map((lead: any) => (
//                   <button
//                     key={lead._id}
//                     type="button"
//                     onClick={() => {
//                       setFormData({ ...formData, lead_id: lead._id });
//                       setShowLeadDropdown(false);
//                     }}
//                     className={cn(
//                       "w-full px-4 py-3 text-left text-sm hover:bg-muted transition-colors",
//                       formData.lead_id === lead._id &&
//                         "bg-primary/10 text-primary",
//                     )}
//                   >
//                     <p className="font-medium">{lead.customerName}</p>
//                     <p className="text-xs text-muted-foreground">
//                       {lead.mobile}
//                     </p>
//                   </button>
//                 ))}
//               </div>
//             )}
//           </div>
//           {errors.lead_id && (
//             <p className="text-destructive text-xs mt-1">{errors.lead_id}</p>
//           )}
//         </div>

//         {/* Title */}
//         <div className="crm-card">
//           <label className="text-sm font-semibold text-foreground mb-3 block">
//             Task Title *
//           </label>
//           <input
//             type="text"
//             placeholder="e.g., Follow-up call about site visit"
//             value={formData.title}
//             onChange={(e) =>
//               setFormData({ ...formData, title: e.target.value })
//             }
//             className="w-full h-12 px-4 rounded-xl bg-muted border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
//           />
//           {errors.title && (
//             <p className="text-destructive text-xs mt-1">{errors.title}</p>
//           )}
//         </div>

//         {/* Date & Time */}
//         <div className="crm-card">
//           <label className="text-sm font-semibold text-foreground mb-3 block">
//             Schedule *
//           </label>
//           <div className="flex gap-3">
//             <Popover>
//               <PopoverTrigger asChild>
//                 <button
//                   type="button"
//                   className="flex-1 h-12 px-4 rounded-xl bg-muted text-left flex items-center gap-2"
//                 >
//                   <CalendarIcon className="w-5 h-5 text-muted-foreground" />
//                   {formData.due_date ? (
//                     format(formData.due_date, "PPP")
//                   ) : (
//                     <span className="text-muted-foreground">Pick date</span>
//                   )}
//                 </button>
//               </PopoverTrigger>
//               <PopoverContent className="w-auto p-0" align="start">
//                 <Calendar
//                   mode="single"
//                   selected={formData.due_date}
//                   onSelect={(date) =>
//                     setFormData({ ...formData, due_date: date })
//                   }
//                   disabled={(date) =>
//                     date < new Date(new Date().setHours(0, 0, 0, 0))
//                   }
//                   initialFocus
//                   className="p-3 pointer-events-auto"
//                 />
//               </PopoverContent>
//             </Popover>

//             <Popover>
//               <PopoverTrigger asChild>
//                 <button
//                   type="button"
//                   className="w-32 h-12 px-4 rounded-xl bg-muted text-left flex items-center gap-2"
//                 >
//                   <Clock className="w-5 h-5 text-muted-foreground" />
//                   {formData.due_time || (
//                     <span className="text-muted-foreground">Time</span>
//                   )}
//                 </button>
//               </PopoverTrigger>
//               <PopoverContent
//                 className="w-40 p-2 max-h-48 overflow-y-auto"
//                 align="end"
//               >
//                 {timeSlots.map((time) => (
//                   <button
//                     key={time}
//                     type="button"
//                     onClick={() => setFormData({ ...formData, due_time: time })}
//                     className={cn(
//                       "w-full px-3 py-2 text-left text-sm rounded-lg hover:bg-muted transition-colors",
//                       formData.due_time === time &&
//                         "bg-primary/10 text-primary",
//                     )}
//                   >
//                     {time}
//                   </button>
//                 ))}
//               </PopoverContent>
//             </Popover>
//           </div>
//           {(errors.due_date || errors.due_time) && (
//             <p className="text-destructive text-xs mt-1">
//               {errors.due_date || errors.due_time}
//             </p>
//           )}
//         </div>

//         {/* Description */}
//         <div className="crm-card">
//           <label className="text-sm font-semibold text-foreground mb-3 block">
//             Notes (Optional)
//           </label>
//           <textarea
//             placeholder="Add any notes for this task..."
//             value={formData.description}
//             onChange={(e) =>
//               setFormData({ ...formData, description: e.target.value })
//             }
//             rows={3}
//             className="w-full px-4 py-3 rounded-xl bg-muted border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
//           />
//         </div>

//         {/* Submit Button */}
//         <div className="pt-4 pb-8">
//           {/* <button
//             type="submit"
//             disabled={createTask.isPending}
//             className="w-full h-14 rounded-xl bg-primary text-primary-foreground font-semibold text-base hover:opacity-90 transition-opacity disabled:opacity-70"
//           >
//             {createTask.isPending ? (
//               <span className="flex items-center justify-center gap-2">
//                 <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
//                 Creating Task...
//               </span>
//             ) : (
//               "Create Task"
//             )}
//           </button> */}
//         </div>
//       </form>
//     </AppShell>
//   );
// }

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { format } from "date-fns";
import {
  Phone,
  MessageCircle,
  MapPin,
  Bell,
  ArrowLeft,
  ChevronDown,
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
  { value: "whatsapp", label: "WhatsApp", icon: MessageCircle },
  { value: "site_visit", label: "Site Visit", icon: MapPin },
  { value: "revisit", label: "Re-Visit", icon: Bell },
  { value: "follow_up", label: "Follow-up", icon: Bell },
  { value: "booking", label: "Booking", icon: MapPin },
];

/* ------------------ TIME SLOTS ------------------ */

const timeSlots = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "01:00 PM",
  "01:30 PM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
  "05:00 PM",
  "05:30 PM",
  "06:00 PM",
  "06:30 PM",
  "07:00 PM",
];

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

            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="w-32 h-12 bg-muted rounded-xl px-3"
                >
                  <Clock className="inline mr-1" />
                  {formData.due_time || "Time"}
                </button>
              </PopoverTrigger>
              <PopoverContent>
                {timeSlots.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setFormData({ ...formData, due_time: t })}
                    className="block w-full text-left px-3 py-2 hover:bg-muted"
                  >
                    {t}
                  </button>
                ))}
              </PopoverContent>
            </Popover>
          </div>
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
