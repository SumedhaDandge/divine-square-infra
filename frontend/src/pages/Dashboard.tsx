import { useNavigate } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { TaskCard } from "@/components/dashboard/TaskCard";
import { PipelineBar } from "@/components/dashboard/PipelineBar";
import { Users, PhoneCall, MapPin, TrendingUp, Calendar, AlertCircle, Loader2, Bell } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import useLeads from "@/hooks/useLeads";
import { useLeadTasks } from "@/hooks/useLeadTasks";
import { useSiteVisits } from "@/hooks/useSiteVisits";
import { format, isToday, isPast, isFuture } from "date-fns";
import { useEffect } from "react";
import { useDataContext } from "@/contex/DataContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { leads } = useDataContext();
  const { fetchLeads, isLoading: leadsLoading } = useLeads();
  const { tasks, fetchAllTasks, isLoading: tasksLoading } = useLeadTasks();
  const { data: siteVisits } = useSiteVisits();

  useEffect(() => {
      fetchLeads();
      fetchAllTasks();
  }, []);

  const isLoading = leadsLoading || tasksLoading;

  // Calculate metrics
  const totalLeads = leads?.length || 0;
  
  // Need to handle tasks which might be array or object. Assuming array based on usage.
  const taskList = Array.isArray(tasks) ? tasks : [];
  
  const todayTasks = taskList.filter((t: any) => !t.completed && t.scheduledAt && isToday(new Date(t.scheduledAt)));
  const overdueTasks = taskList.filter((t: any) => !t.completed && t.scheduledAt && isPast(new Date(t.scheduledAt)) && !isToday(new Date(t.scheduledAt)));
  const upcomingSiteVisits = siteVisits?.filter((sv: any) => sv.status === "scheduled" && isFuture(new Date(sv.scheduled_date))).length || 0;
  const conversions = leads?.filter((l: any) => l.leadStatus === "closed").length || 0; // Assuming 'closed' is 'won'

  // Pipeline stages
  const pipelineStages = [
    { label: "New", count: leads?.filter((l: any) => l.leadStatus === "new").length || 0, color: "bg-status-new" },
    { label: "Contacted", count: leads?.filter((l: any) => l.leadStatus === "contacted").length || 0, color: "bg-status-cold" },
    { label: "Qualified", count: leads?.filter((l: any) => l.leadStatus === "qualified").length || 0, color: "bg-status-warm" },
    { label: "Unresponsive", count: leads?.filter((l: any) => l.leadStatus === "unresponsive").length || 0, color: "bg-status-lost" },
    { label: "Closed", count: leads?.filter((l: any) => l.leadStatus === "closed").length || 0, color: "bg-primary" },
    // { label: "Lost", count: leads?.filter((l: any) => l.leadStatus === "lost").length || 0, color: "bg-status-lost" },
  ];

  const getTaskStatus = (task: any): "hot" | "warm" | "new" | "cold" => {
    const typeMap: Record<string, "hot" | "warm" | "new" | "cold"> = {
      call: "hot",
      site_visit: "warm",
      whatsapp: "new",
      meeting: "hot",
      email: "cold",
      reminder: "warm",
    };
    return typeMap[task.activityType] || "new";
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  if (isLoading) {
    return (
      <AppShell>
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell fabAction={() => navigate("/leads/new")}>
      {/* Header */}
      {/* Header */}
      <header className="bg-primary text-primary-foreground px-4 pt-12 pb-6 flex items-center justify-between">
        <div>
           <div className="flex items-center gap-2 mb-1">
             <p className="text-primary-foreground/80 text-sm">{getGreeting()}</p>
             <span className="text-xs bg-primary-foreground/20 px-2 py-1 rounded-full">
               Divine Square
             </span>
           </div>
           {/* <h1 className="text-2xl font-bold">{user?.name || "Welcome"}</h1> */}
           <p className="text-primary-foreground/70 text-sm mt-1 flex items-center gap-1">
             <Calendar className="w-4 h-4" />
             {format(new Date(), "EEEE, d MMMM yyyy")}
           </p>
        </div>
        <button 
           onClick={() => navigate("/settings/notifications")}
           className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center transition-opacity hover:opacity-90 relative"
        >
             <Bell className="w-6 h-6 text-primary-foreground" />
             <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-primary animate-pulse" />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 -mt-4 space-y-4 pb-6">
        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <MetricCard
            icon={Users}
            label="Total Leads"
            value={totalLeads}
            trend={totalLeads > 0 ? { value: 12, positive: true } : undefined}
          />
          <MetricCard
            icon={PhoneCall}
            label="Today's Follow-ups"
            value={todayTasks.length}
            variant="primary"
          />
          <MetricCard
            icon={MapPin}
            label="Site Visits"
            value={upcomingSiteVisits}
          />
          <MetricCard
            icon={TrendingUp}
            label="Conversions"
            value={conversions}
            trend={conversions > 0 ? { value: 5, positive: true } : undefined}
          />
        </div>

        {/* Pipeline */}
        {totalLeads > 0 && <PipelineBar stages={pipelineStages} />}

        {/* Overdue Section */}
        {overdueTasks.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-4 h-4 text-status-lost" />
              <h2 className="text-sm font-semibold text-status-lost">Overdue ({overdueTasks.length})</h2>
            </div>
            <div className="space-y-3">
              {overdueTasks.slice(0, 3).map((task: any) => (
                <TaskCard
                  key={task._id}
                  id={task._id}
                  type={task.activityType}
                  leadName={task.lead?.customerName || "Lead Not Found"}
                  leadStatus={getTaskStatus(task)}
                  time={format(new Date(task.scheduledAt), "MMM d, h:mm a")}
                  project={task.title}
                  isOverdue={true}
                  onCall={() => task.lead && window.open(`tel:${task.lead.mobile}`)}
                  onWhatsApp={() => task.lead && window.open(`https://wa.me/${task.lead.mobile.replace(/\s/g, "")}`)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Today's Tasks */}
        <section>
          <h2 className="text-sm font-semibold text-foreground mb-3">
            {todayTasks.length > 0 ? "Today's Tasks" : "No tasks for today"}
          </h2>
          {todayTasks.length > 0 ? (
            <div className="space-y-3">
              {todayTasks.map((task: any) => (
                <TaskCard
                  key={task._id}
                  id={task._id}
                  type={task.activityType}
                  leadName={task.lead?.customerName || "Lead Not Found"}
                  leadStatus={getTaskStatus(task)}
                  time={format(new Date(task.scheduledAt), "h:mm a")}
                  project={task.title}
                  onCall={() => task.lead && window.open(`tel:${task.lead.mobile}`)}
                  onWhatsApp={() => task.lead && window.open(`https://wa.me/${task.lead.mobile.replace(/\s/g, "")}`)}
                />
              ))}
            </div>
          ) : (
            <div className="crm-card text-center py-8">
              <Calendar className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-3">
                {totalLeads === 0 
                  ? "Add your first lead to get started" 
                  : "All caught up! No pending tasks."}
              </p>
              <button
                onClick={() => navigate(totalLeads === 0 ? "/leads/new" : "/tasks/new")}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-medium"
              >
                {totalLeads === 0 ? "Add Lead" : "Add Task"}
              </button>
            </div>
          )}
        </section>
      </main>
    </AppShell>
  );
}


