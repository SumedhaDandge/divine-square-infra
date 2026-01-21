import { AppShell } from "@/components/layout/AppShell";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  ArrowLeft,
  Phone,
  MessageCircle,
  MapPin,
  Calendar,
  Clock,
  FileText,
  Plus,
  ChevronRight,
  Building2,
  Wallet,
  Loader2,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { cn } from "@/lib/utils";
// import { useLead, LeadStatus } from "@/hooks/useLeads";
// import { useLeadTasks } from "@/hooks/useTasks";
import { useLeadSiteVisits } from "@/hooks/useSiteVisits";
import { useLeadQuotations } from "@/hooks/useQuotations";
import { format } from "date-fns";
import useLeads from "@/hooks/useLeads";
import { useDataContext } from "@/contex/DataContext";
import { useEffect } from "react";
import useLeadTasks from "@/hooks/useLeadTasks";

const getDisplayStatus = (
  status: any,
): "hot" | "warm" | "cold" | "new" | "converted" => {
  const mapping: Record<any, "hot" | "warm" | "cold" | "new" | "converted"> = {
    new: "new",
    contacted: "warm",
    qualified: "warm",
    negotiation: "hot",
    won: "converted",
    lost: "cold",
  };
  return mapping[status];
};

export default function LeadDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { leads } = useDataContext();
  const lead = leads.find((l: any) => l.id === id);
  const { fetchLeads, isLoading } = useLeads();
  // const { data: tasks } = useLeadTasks(id || "");
  // const { data: siteVisits } = useLeadSiteVisits(id || "");
  // const { data: quotations } = useLeadQuotations(id || "");
  const { getTaskByID, tasksLoading } = useLeadTasks();
  const { taskByID } = useDataContext();

  console.log("Lead Detail Rendered for ID:", id, "Lead Data:", lead._id);

  useEffect(() => {
    getTaskByID(lead._id);
  }, []);
  useEffect(() => {
    fetchLeads();
  }, [id]);

  // Combine all activities into timeline
  const timeline =
    taskByID
      ?.map((t: any) => ({
        id: t._id,
        type: t.taskType,
        title: t.title,
        description: t.description || "",
        time: format(new Date(t.dueDate), "MMM d, h:mm a"),
        completed: t.status === "completed",
        sortDate: new Date(t.dueDate),
      }))
      .sort((a: any, b: any) => b.sortDate.getTime() - a.sortDate.getTime()) ||
    [];

  const quickActions = [
    {
      icon: Phone,
      label: "Call",
      color: "bg-primary text-primary-foreground",
      action: () => lead && window.open(`tel:${lead.mobile}`),
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      color: "bg-status-hot text-white",
      action: () =>
        lead && window.open(`https://wa.me/${lead.mobile.replace(/\s/g, "")}`),
    },
    {
      icon: MapPin,
      label: "Site Visit",
      color: "bg-accent text-accent-foreground",
      action: () => navigate(`/site-visits/new?leadId=${id}`),
    },
    {
      icon: FileText,
      label: "Quote",
      color: "bg-status-cold text-white",
      action: () => navigate(`/quotations/new?leadId=${id}`),
    },
  ];

  if (isLoading) {
    return (
      <AppShell showFab={false}>
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AppShell>
    );
  }

  if (!lead) {
    return (
      <AppShell showFab={false}>
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <h2 className="text-lg font-semibold mb-2">Lead Not Found</h2>
          <button
            onClick={() => navigate("/leads")}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-xl"
          >
            Back to Leads
          </button>
        </div>
      </AppShell>
    );
  }

  const formatBudget = (min: number | null, max: number | null) => {
    if (!min && !max) return "Not specified";
    const formatVal = (val: number) => {
      if (val >= 100) return `${(val / 100).toFixed(1)}Cr`;
      return `${val}L`;
    };
    if (min && max) return `₹${formatVal(min)} - ${formatVal(max)}`;
    if (min) return `From ₹${formatVal(min)}`;
    if (max) return `Up to ₹${formatVal(max)}`;
    return "Not specified";
  };

  return (
    <AppShell showFab={false}>
      {/* Header */}
      <header className="bg-primary text-primary-foreground px-4 pt-12 pb-6">
        <button
          onClick={() => navigate(-1)}
          className="touch-btn w-10 h-10 rounded-full bg-primary-foreground/20 mb-4 -ml-1"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold">{lead.customerName}</h1>
              {/* <StatusBadge status={getDisplayStatus(lead.status)} className="!bg-primary-foreground/20 !text-primary-foreground" /> */}
            </div>
            <p className="text-primary-foreground/80">{lead.mobile}</p>
            {lead.email && (
              <p className="text-primary-foreground/60 text-sm mt-1">
                {lead.email}
              </p>
            )}
          </div>
        </div>
      </header>

      {/* Quick Actions */}
      <div className="px-4 -mt-4 mb-4">
        <div className="crm-card !p-2 flex justify-around">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={action.action}
              className={cn(
                "flex flex-col items-center gap-1.5 py-2 px-3 rounded-xl transition-transform active:scale-95",
                action.color,
              )}
            >
              <action.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 px-4 space-y-4 pb-6">
        {/* Lead Info */}
        <div className="crm-card">
          <h3 className="text-sm font-semibold text-foreground mb-3">
            Lead Information
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                <Building2 className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">
                  Interested Project
                </p>
                <p className="text-sm font-medium text-foreground">
                  {lead.interestedProject?.projectName || "Not specified"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                <Wallet className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Budget</p>
                <p className="text-sm font-medium text-foreground">
                  {formatBudget(lead.budget.min, lead.budget.max)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                <Calendar className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Lead Source</p>
                <p className="text-sm font-medium text-foreground capitalize">
                  {lead.leadSource.name} •{" "}
                  {format(new Date(lead.createdAt), "MMM d, yyyy")}
                </p>
              </div>
            </div>
          </div>
          {lead.notes && (
            <div className="mt-4 pt-3 border-t border-border">
              <p className="text-xs text-muted-foreground mb-1">Notes</p>
              <p className="text-sm text-foreground">{lead.notes}</p>
            </div>
          )}
        </div>

        {/* Quotations */}
        {/* {quotations && quotations.length > 0 && (
          <div className="crm-card">
            <h3 className="text-sm font-semibold text-foreground mb-3">Quotations</h3>
            <div className="space-y-2">
              {quotations.map((q) => (
                <div key={q.id} className="flex items-center justify-between p-3 bg-muted rounded-xl">
                  <div>
                    <p className="text-sm font-medium">Plot {q.plots?.plot_number}</p>
                    <p className="text-xs text-muted-foreground">{q.plots?.area_sqft} sq.ft</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-primary">
                      ₹{(Number(q.final_price) / 100000).toFixed(2)}L
                    </p>
                    <p className="text-[10px] text-muted-foreground uppercase">{q.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )} */}

        {/* Activity Timeline */}
        {/* Activity Timeline */}
        <div className="crm-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground">
              Activity Timeline
            </h3>
            <button
              onClick={() => navigate(`/tasks/new/${lead._id}`)}
              className="touch-btn w-8 h-8 rounded-full bg-primary text-primary-foreground"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {tasksLoading ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Loading activities...
            </p>
          ) : timeline.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No activities yet. Add a task to get started.
            </p>
          ) : (
            <div className="space-y-4">
              {timeline.map((item: any, index: number) => (
                <div key={item.id} className="flex gap-3">b       
                  {/* Timeline line */}
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "w-3 h-3 rounded-full border-2",
                        item.completed
                          ? "bg-primary border-primary"
                          : "bg-card border-muted-foreground",
                      )}
                    />
                    {index < timeline.length - 1 && (
                      <div className="w-0.5 flex-1 bg-border mt-1" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {item.title}
                        </p>
                        {item.description && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {item.description}
                          </p>
                        )}
                      </div>

                      {!item.completed && (
                        <button
                          onClick={() => navigate(`/tasks/complete/${item.id}`)}
                          className="text-xs text-primary font-medium"
                        >
                          Mark Done
                        </button>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </AppShell>
  );
}
