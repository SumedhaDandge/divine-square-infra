import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { useLeads } from "@/hooks/useLeads";
import { useTasks } from "@/hooks/useLeadTasks";
import { useSiteVisits } from "@/hooks/useSiteVisits";
import { useQuotations } from "@/hooks/useQuotations";
import { useProjects } from "@/hooks/useProjects";
import { BarChart3, TrendingUp, Users, MapPin, FileText, Calendar, PieChart, ArrowUp, ArrowDown } from "lucide-react";
import { format, subDays, isAfter, startOfMonth, endOfMonth } from "date-fns";
import { cn } from "@/lib/utils";

type TimeRange = "7days" | "30days" | "thisMonth" | "allTime";

export default function Reports() {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState<TimeRange>("30days");
  
  const { data: leads } = useLeads();
  const { data: tasks } = useTasks();
  const { data: siteVisits } = useSiteVisits();
  const { data: quotations } = useQuotations();
  const { data: projects } = useProjects();

  const getDateFilter = () => {
    const now = new Date();
    switch (timeRange) {
      case "7days":
        return subDays(now, 7);
      case "30days":
        return subDays(now, 30);
      case "thisMonth":
        return startOfMonth(now);
      default:
        return new Date(0);
    }
  };

  const filterDate = getDateFilter();

  // Calculate statistics
  const filteredLeads = leads?.filter(l => isAfter(new Date(l.created_at), filterDate)) || [];
  const filteredSiteVisits = siteVisits?.filter(sv => isAfter(new Date(sv.created_at), filterDate)) || [];
  const filteredQuotations = quotations?.filter(q => isAfter(new Date(q.created_at), filterDate)) || [];
  const completedTasks = tasks?.filter(t => t.completed && isAfter(new Date(t.completed_at || t.created_at), filterDate)) || [];

  // Lead status breakdown
  const leadsByStatus = {
    new: leads?.filter(l => l.status === "new").length || 0,
    contacted: leads?.filter(l => l.status === "contacted").length || 0,
    qualified: leads?.filter(l => l.status === "qualified").length || 0,
    negotiation: leads?.filter(l => l.status === "negotiation").length || 0,
    won: leads?.filter(l => l.status === "won").length || 0,
    lost: leads?.filter(l => l.status === "lost").length || 0,
  };

  // Lead source breakdown
  const leadsBySource = {
    facebook: leads?.filter(l => l.source === "facebook").length || 0,
    instagram: leads?.filter(l => l.source === "instagram").length || 0,
    google: leads?.filter(l => l.source === "google").length || 0,
    referral: leads?.filter(l => l.source === "referral").length || 0,
    walk_in: leads?.filter(l => l.source === "walk_in").length || 0,
    website: leads?.filter(l => l.source === "website").length || 0,
    other: leads?.filter(l => l.source === "other").length || 0,
  };

  // Site visit conversion rate
  const completedVisits = siteVisits?.filter(sv => sv.status === "completed").length || 0;
  const interestedAfterVisit = siteVisits?.filter(sv => 
    sv.feedback_interest_level === "very_interested" || sv.feedback_interest_level === "interested"
  ).length || 0;
  const visitConversionRate = completedVisits > 0 ? Math.round((interestedAfterVisit / completedVisits) * 100) : 0;

  // Total quotation value
  const totalQuotationValue = quotations?.reduce((sum, q) => sum + Number(q.final_price), 0) || 0;

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`;
    }
    return `₹${amount.toLocaleString()}`;
  };

  const StatCard = ({ 
    icon: Icon, 
    label, 
    value, 
    subValue, 
    trend,
    color = "bg-primary"
  }: {
    icon: React.ElementType;
    label: string;
    value: string | number;
    subValue?: string;
    trend?: { value: number; positive: boolean };
    color?: string;
  }) => (
    <div className="crm-card">
      <div className="flex items-start justify-between">
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", color)}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        {trend && (
          <div className={cn(
            "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
            trend.positive ? "bg-status-hot-bg text-status-hot" : "bg-status-lost-bg text-status-lost"
          )}>
            {trend.positive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
            {trend.value}%
          </div>
        )}
      </div>
      <div className="mt-3">
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
        {subValue && <p className="text-xs text-muted-foreground mt-1">{subValue}</p>}
      </div>
    </div>
  );

  return (
    <AppShell>
      {/* Header */}
      <header className="bg-primary text-primary-foreground px-4 pt-12 pb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Reports</h1>
            <p className="text-sm opacity-70">Analytics & Performance</p>
          </div>
          <BarChart3 className="w-8 h-8 opacity-50" />
        </div>
      </header>

      {/* Time Range Filter */}
      <div className="px-4 py-3 flex gap-2 overflow-x-auto scrollbar-hide border-b border-border -mt-2">
        {[
          { value: "7days", label: "7 Days" },
          { value: "30days", label: "30 Days" },
          { value: "thisMonth", label: "This Month" },
          { value: "allTime", label: "All Time" },
        ].map((option) => (
          <button
            key={option.value}
            onClick={() => setTimeRange(option.value as TimeRange)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
              timeRange === option.value
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      <main className="flex-1 px-4 py-6 space-y-6">
        {/* Key Metrics */}
        <section>
          <h2 className="text-sm font-semibold text-foreground mb-3">Key Metrics</h2>
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              icon={Users}
              label="New Leads"
              value={filteredLeads.length}
              subValue={`Total: ${leads?.length || 0}`}
              color="bg-status-new"
            />
            <StatCard
              icon={MapPin}
              label="Site Visits"
              value={filteredSiteVisits.length}
              subValue={`${visitConversionRate}% interested`}
              color="bg-accent"
            />
            <StatCard
              icon={FileText}
              label="Quotations"
              value={filteredQuotations.length}
              subValue={formatCurrency(totalQuotationValue)}
              color="bg-status-cold"
            />
            <StatCard
              icon={TrendingUp}
              label="Conversions"
              value={leadsByStatus.won}
              subValue={`${leads?.length ? Math.round((leadsByStatus.won / leads.length) * 100) : 0}% rate`}
              color="bg-status-hot"
            />
          </div>
        </section>

        {/* Lead Pipeline */}
        <section className="crm-card">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="w-5 h-5 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Lead Pipeline</h2>
          </div>
          <div className="space-y-3">
            {Object.entries(leadsByStatus).map(([status, count]) => {
              const percentage = leads?.length ? Math.round((count / leads.length) * 100) : 0;
              const statusColors: Record<string, string> = {
                new: "bg-status-new",
                contacted: "bg-status-cold",
                qualified: "bg-status-warm",
                negotiation: "bg-accent",
                won: "bg-status-hot",
                lost: "bg-status-lost",
              };
              return (
                <div key={status}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize text-muted-foreground">{status}</span>
                    <span className="font-medium">{count} ({percentage}%)</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full rounded-full transition-all", statusColors[status])}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Lead Sources */}
        <section className="crm-card">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-accent" />
            <h2 className="text-sm font-semibold text-foreground">Lead Sources</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(leadsBySource)
              .filter(([_, count]) => count > 0)
              .sort((a, b) => b[1] - a[1])
              .map(([source, count]) => (
                <div key={source} className="flex items-center justify-between p-3 bg-muted rounded-xl">
                  <span className="text-sm capitalize text-muted-foreground">
                    {source.replace("_", " ")}
                  </span>
                  <span className="font-semibold">{count}</span>
                </div>
              ))}
          </div>
        </section>

        {/* Projects Summary */}
        <section className="crm-card">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-status-cold" />
            <h2 className="text-sm font-semibold text-foreground">Projects Overview</h2>
          </div>
          <div className="space-y-3">
            {projects?.slice(0, 5).map((project) => (
              <div 
                key={project.id} 
                className="flex items-center justify-between p-3 bg-muted rounded-xl cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => navigate(`/projects/${project.id}/plots`)}
              >
                <div>
                  <p className="font-medium text-sm">{project.name}</p>
                  <p className="text-xs text-muted-foreground">{project.location}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">{project.total_plots}</p>
                  <p className="text-xs text-muted-foreground">plots</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tasks Summary */}
        <section className="crm-card">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-status-warm" />
            <h2 className="text-sm font-semibold text-foreground">Task Performance</h2>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-muted rounded-xl">
              <p className="text-xl font-bold text-foreground">{tasks?.length || 0}</p>
              <p className="text-xs text-muted-foreground">Total Tasks</p>
            </div>
            <div className="p-3 bg-status-hot-bg rounded-xl">
              <p className="text-xl font-bold text-status-hot">{completedTasks.length}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
            <div className="p-3 bg-status-warm-bg rounded-xl">
              <p className="text-xl font-bold text-status-warm">{tasks?.filter(t => !t.completed).length || 0}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
          </div>
        </section>
      </main>
    </AppShell>
  );
}
