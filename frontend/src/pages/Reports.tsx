import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import useLeads from "@/hooks/useLeads";
import { useLeadTasks } from "@/hooks/useLeadTasks";
import { useSiteVisits } from "@/hooks/useSiteVisits";
import { BarChart3, TrendingUp, Users, MapPin, Calendar, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { format, isAfter, startOfWeek, startOfMonth, startOfYear, isSameWeek, isSameMonth, subDays } from "date-fns";
import { cn } from "@/lib/utils";
import { useDataContext } from "@/contex/DataContext";

type TimeRange = "thisWeek" | "thisMonth" | "thisYear" | "allTime";

export default function Reports() {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState<TimeRange>("thisMonth");
  
  const { leads } = useDataContext();
  const { fetchLeads } = useLeads();
  const { tasks, fetchAllTasks } = useLeadTasks();
  const { data: siteVisits, refetch: fetchSiteVisits } = useSiteVisits();

  useEffect(() => {
    fetchLeads();
    fetchAllTasks();
    fetchSiteVisits();
  }, []);

  const now = new Date();

  const getDateFilter = (date: Date) => {
      const d = new Date(date);
      switch(timeRange) {
          case "thisWeek": return isSameWeek(d, now);
          case "thisMonth": return isSameMonth(d, now);
          case "thisYear": return d.getFullYear() === now.getFullYear();
          case "allTime": return true;
          default: return true;
      }
  };
  
  // -- FILTERED DATA --
  const filteredLeads = leads?.filter((l: any) => getDateFilter(new Date(l.createdAt || l.created_at))) || [];
  const filteredTasks = tasks?.filter((t: any) => t.taskDate && getDateFilter(new Date(t.taskDate))) || [];
  const filteredVisits = siteVisits?.filter((sv: any) => sv.visitDate && getDateFilter(new Date(sv.visitDate))) || [];
  const filteredBookings = leads?.filter((l: any) => (l.leadStatus === "closed" || l.leadStatus === "won") && getDateFilter(new Date(l.updatedAt || l.updated_at))) || [];

  // -- PAGINATION HELPERS --
  const PaginatedList = ({ data, renderItem, emptyMessage, title, icon: Icon, color }: any) => {
      const [page, setPage] = useState(1);
      const itemsPerPage = 5;
      const totalPages = Math.ceil(data.length / itemsPerPage);
      
      const currentData = data.slice((page - 1) * itemsPerPage, page * itemsPerPage);

      return (
        <section className="crm-card">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Icon className={cn("w-5 h-5", color)} />
                    <h2 className="text-sm font-semibold text-foreground">{title} ({data.length})</h2>
                </div>
            </div>
            
            {data.length > 0 ? (
                <>
                    <div className="space-y-3 min-h-[300px]">
                        {currentData.map((item: any, i: number) => renderItem(item, i))}
                    </div>
                    
                    {totalPages > 1 && (
                        <div className="flex justify-between items-center mt-4 pt-2 border-t border-border">
                             <button 
                                disabled={page === 1}
                                onClick={() => setPage(p => p - 1)}
                                className="p-2 hover:bg-muted rounded-full disabled:opacity-30"
                             >
                                 <ChevronLeft className="w-4 h-4" />
                             </button>
                             <span className="text-xs text-muted-foreground">Page {page} of {totalPages}</span>
                             <button 
                                disabled={page === totalPages}
                                onClick={() => setPage(p => p + 1)}
                                className="p-2 hover:bg-muted rounded-full disabled:opacity-30"
                             >
                                 <ChevronRight className="w-4 h-4" />
                             </button>
                        </div>
                    )}
                </>
            ) : (
                <p className="text-sm text-muted-foreground">{emptyMessage}</p>
            )}
        </section>
      );
  };

  const StatCard = ({ icon: Icon, label, value, color = "bg-primary" }: any) => (
    <div className="crm-card p-4 flex items-center gap-4">
      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", color)}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );

  return (
    <AppShell>
      <header className="bg-primary text-primary-foreground px-4 pt-12 pb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold">Performance Report</h1>
            <p className="text-sm opacity-70">Analytics Overview</p>
          </div>
          <BarChart3 className="w-8 h-8 opacity-50" />
        </div>

        {/* Time Range Selector */}
        <div className="flex bg-primary-foreground/10 p-1 rounded-xl overflow-x-auto scrollbar-hide">
            {[
                { id: "thisWeek", label: "This Week" },
                { id: "thisMonth", label: "This Month" },
                { id: "thisYear", label: "This Year" },
                { id: "allTime", label: "All Time" }
            ].map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setTimeRange(tab.id as TimeRange)}
                    className={cn(
                        "flex-1 px-3 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap",
                        timeRange === tab.id ? "bg-white text-primary shadow-sm" : "text-primary-foreground/70 hover:bg-white/10"
                    )}
                >
                    {tab.label}
                </button>
            ))}
        </div>
      </header>

      <main className="flex-1 px-4 py-6 space-y-6">
        
        {/* SUMMARY STATS */}
        <section className="grid grid-cols-2 gap-3">
             <StatCard 
                icon={Users} 
                label="New Leads" 
                value={filteredLeads.length} 
                color="bg-status-new"
             />
             <StatCard 
                icon={TrendingUp} 
                label="Bookings" 
                value={filteredBookings.length} 
                color="bg-status-hot"
             />
             <StatCard 
                icon={MapPin} 
                label="Visits" 
                value={filteredVisits.length} 
                color="bg-accent"
             />
             <StatCard 
                icon={CheckCircle} 
                label="Tasks Done" 
                value={filteredTasks.filter((t:any) => t.isCompleted).length} 
                color="bg-status-warm"
             />
        </section>

        {/* NEW LEADS LIST */}
        <PaginatedList 
            title="New Leads"
            icon={Users}
            color="text-status-new"
            data={filteredLeads}
            emptyMessage="No leads found for this period."
            renderItem={(lead: any, i:number) => (
                <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl text-sm">
                    <div>
                        <p className="font-semibold">{lead.customerName}</p>
                        <p className="text-xs text-muted-foreground">{lead.mobile}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-muted-foreground">{format(new Date(lead.createdAt || lead.created_at), "MMM d")}</p>
                        <span className="text-[10px] uppercase font-bold text-primary">{lead.leadStatus}</span>
                    </div>
                </div>
            )}
        />

        {/* SITE VISITS LIST */}
        <PaginatedList 
            title="Site Visits"
            icon={MapPin}
            color="text-accent"
            data={filteredVisits}
            emptyMessage="No site visits for this period."
            renderItem={(sv: any, i:number) => (
                <div key={i} className="flex flex-col p-3 bg-muted/50 rounded-xl text-sm gap-1">
                    <div className="flex justify-between font-semibold">
                        <span>{sv.lead?.customerName || "Unknown Lead"}</span>
                        <span className="text-primary">{format(new Date(sv.visitDate), "MMM d")}</span>
                    </div>
                    <p className="text-muted-foreground text-xs">{sv.project?.projectName || "Project N/A"}</p>
                    <p className="text-xs capitalize">Status: {sv.status}</p>
                </div>
            )}
        />

        {/* BOOKINGS LIST */}
        <PaginatedList 
            title="Bookings"
            icon={TrendingUp}
            color="text-status-hot"
            data={filteredBookings}
            emptyMessage="No bookings for this period."
            renderItem={(b: any, i:number) => (
                <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl text-sm">
                    <div>
                        <p className="font-semibold">{b.customerName}</p>
                        <p className="text-xs text-muted-foreground">{b.interestedProject?.projectName}</p>
                    </div>
                    <div className="text-right">
                        <span className="text-xs bg-status-hot/10 text-status-hot px-2 py-1 rounded-full">Closed</span>
                        <p className="text-[10px] text-muted-foreground mt-1">
                            {format(new Date(b.updatedAt || b.updated_at), "MMM d")}
                        </p>
                    </div>
                </div>
            )}
        />

      </main>
    </AppShell>
  );
}
