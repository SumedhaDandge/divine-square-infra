import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, MapPin, Calendar as CalendarIcon, Clock, ChevronDown, Building2 } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { useCreateSiteVisit } from "@/hooks/useSiteVisits";
import { useLeads } from "@/hooks/useLeads";
import { useProjects } from "@/hooks/useProjects";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { z } from "zod";

const siteVisitSchema = z.object({
  lead_id: z.string().min(1, "Please select a lead"),
  project_id: z.string().min(1, "Please select a project"),
  scheduled_date: z.date({ required_error: "Please select a date" }),
  scheduled_time: z.string().min(1, "Please select a time"),
  pickup_location: z.string().max(200).optional(),
  notes: z.string().max(500).optional(),
});

const timeSlots = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
  "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM",
];

export default function ScheduleSiteVisit() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const leadIdParam = searchParams.get("leadId");
  
  const createSiteVisit = useCreateSiteVisit();
  const { data: leads } = useLeads();
  const { data: projects } = useProjects();
  
  const [formData, setFormData] = useState({
    lead_id: leadIdParam || "",
    project_id: "",
    scheduled_date: undefined as Date | undefined,
    scheduled_time: "",
    pickup_location: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showLeadDropdown, setShowLeadDropdown] = useState(false);
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = siteVisitSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    if (!formData.scheduled_date) return;

    try {
      await createSiteVisit.mutateAsync({
        lead_id: formData.lead_id,
        project_id: formData.project_id,
        scheduled_date: formData.scheduled_date.toISOString(),
        scheduled_time: formData.scheduled_time,
        pickup_location: formData.pickup_location || undefined,
        notes: formData.notes || undefined,
      });
      
      navigate(-1);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const selectedLead = leads?.find((l) => l.id === formData.lead_id);
  const selectedProject = projects?.find((p) => p.id === formData.project_id);

  return (
    <AppShell showFab={false} showBottomNav={false}>
      {/* Header */}
      <header className="bg-accent text-accent-foreground px-4 pt-12 pb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="touch-btn w-10 h-10 rounded-full bg-accent-foreground/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold">Schedule Site Visit</h1>
            <p className="text-sm opacity-70">Take your lead to see the property</p>
          </div>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="flex-1 px-4 py-6 space-y-4">
        {/* Lead Selection */}
        <div className="crm-card">
          <label className="text-sm font-semibold text-foreground mb-3 block">Select Lead *</label>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowLeadDropdown(!showLeadDropdown)}
              className="w-full h-12 px-4 rounded-xl bg-muted text-left text-foreground flex items-center justify-between"
            >
              {selectedLead ? (
                <span>{selectedLead.name} - {selectedLead.phone}</span>
              ) : (
                <span className="text-muted-foreground">Select a lead</span>
              )}
              <ChevronDown className={cn("w-5 h-5 text-muted-foreground transition-transform", showLeadDropdown && "rotate-180")} />
            </button>
            {showLeadDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-lg z-10 overflow-hidden max-h-48 overflow-y-auto">
                {leads?.map((lead) => (
                  <button
                    key={lead.id}
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, lead_id: lead.id });
                      setShowLeadDropdown(false);
                    }}
                    className={cn(
                      "w-full px-4 py-3 text-left text-sm hover:bg-muted transition-colors",
                      formData.lead_id === lead.id && "bg-primary/10 text-primary"
                    )}
                  >
                    <p className="font-medium">{lead.name}</p>
                    <p className="text-xs text-muted-foreground">{lead.phone}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
          {errors.lead_id && <p className="text-destructive text-xs mt-1">{errors.lead_id}</p>}
        </div>

        {/* Project Selection */}
        <div className="crm-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <Building2 className="w-5 h-5 text-muted-foreground" />
            </div>
            <label className="text-sm font-semibold text-foreground">Select Project *</label>
          </div>
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowProjectDropdown(!showProjectDropdown)}
              className="w-full h-12 px-4 rounded-xl bg-muted text-left text-foreground flex items-center justify-between"
            >
              {selectedProject ? (
                <span>{selectedProject.name} - {selectedProject.location}</span>
              ) : (
                <span className="text-muted-foreground">Select a project</span>
              )}
              <ChevronDown className={cn("w-5 h-5 text-muted-foreground transition-transform", showProjectDropdown && "rotate-180")} />
            </button>
            {showProjectDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-lg z-10 overflow-hidden max-h-48 overflow-y-auto">
                {projects?.map((project) => (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, project_id: project.id });
                      setShowProjectDropdown(false);
                    }}
                    className={cn(
                      "w-full px-4 py-3 text-left text-sm hover:bg-muted transition-colors",
                      formData.project_id === project.id && "bg-primary/10 text-primary"
                    )}
                  >
                    <p className="font-medium">{project.name}</p>
                    <p className="text-xs text-muted-foreground">{project.location}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
          {errors.project_id && <p className="text-destructive text-xs mt-1">{errors.project_id}</p>}
        </div>

        {/* Date & Time */}
        <div className="crm-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <CalendarIcon className="w-5 h-5 text-muted-foreground" />
            </div>
            <label className="text-sm font-semibold text-foreground">Schedule *</label>
          </div>
          <div className="flex gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="flex-1 h-12 px-4 rounded-xl bg-muted text-left flex items-center gap-2"
                >
                  <CalendarIcon className="w-5 h-5 text-muted-foreground" />
                  {formData.scheduled_date ? (
                    format(formData.scheduled_date, "PPP")
                  ) : (
                    <span className="text-muted-foreground">Pick date</span>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.scheduled_date}
                  onSelect={(date) => setFormData({ ...formData, scheduled_date: date })}
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="w-32 h-12 px-4 rounded-xl bg-muted text-left flex items-center gap-2"
                >
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  {formData.scheduled_time || <span className="text-muted-foreground">Time</span>}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-40 p-2 max-h-48 overflow-y-auto" align="end">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setFormData({ ...formData, scheduled_time: time })}
                    className={cn(
                      "w-full px-3 py-2 text-left text-sm rounded-lg hover:bg-muted transition-colors",
                      formData.scheduled_time === time && "bg-primary/10 text-primary"
                    )}
                  >
                    {time}
                  </button>
                ))}
              </PopoverContent>
            </Popover>
          </div>
          {(errors.scheduled_date || errors.scheduled_time) && (
            <p className="text-destructive text-xs mt-1">{errors.scheduled_date || errors.scheduled_time}</p>
          )}
        </div>

        {/* Pickup Location */}
        <div className="crm-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <MapPin className="w-5 h-5 text-muted-foreground" />
            </div>
            <label className="text-sm font-semibold text-foreground">Pickup Location</label>
          </div>
          <input
            type="text"
            placeholder="Where will you pick up the client?"
            value={formData.pickup_location}
            onChange={(e) => setFormData({ ...formData, pickup_location: e.target.value })}
            className="w-full h-12 px-4 rounded-xl bg-muted border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {/* Notes */}
        <div className="crm-card">
          <label className="text-sm font-semibold text-foreground mb-3 block">Notes (Optional)</label>
          <textarea
            placeholder="Add any notes for this site visit..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-muted border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4 pb-8">
          <button
            type="submit"
            disabled={createSiteVisit.isPending}
            className="w-full h-14 rounded-xl bg-accent text-accent-foreground font-semibold text-base hover:opacity-90 transition-opacity disabled:opacity-70"
          >
            {createSiteVisit.isPending ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                Scheduling...
              </span>
            ) : (
              "Schedule Site Visit"
            )}
          </button>
        </div>
      </form>
    </AppShell>
  );
}
