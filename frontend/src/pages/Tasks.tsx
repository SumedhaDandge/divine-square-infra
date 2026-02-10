
import { AppShell } from "@/components/layout/AppShell";
import { TaskCard } from "@/components/dashboard/TaskCard";
import { useLeadTasks } from "@/hooks/useLeadTasks";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Calendar, AlertCircle, CheckCircle, Clock, CheckSquare, Bell } from "lucide-react";
import { format, isToday, isPast, isFuture } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { divineSquareService } from "@/services/DivineInfraService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { parse, isValid } from "date-fns";

export default function Tasks() {
  const navigate = useNavigate();
  const { tasks, fetchAllTasks, isLoading } = useLeadTasks();
  const [activeTab, setActiveTab] = useState<"today" | "overdue" | "upcoming" | "completed">("today");
  const [searchQuery, setSearchQuery] = useState("");

  const [cancelTaskId, setCancelTaskId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState("");
  
  const [rescheduleTaskId, setRescheduleTaskId] = useState<string | null>(null);
  const [rescheduleData, setRescheduleData] = useState({ date: "", time: "" });

  useEffect(() => {
    fetchAllTasks();
  }, []);

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

  const taskList = Array.isArray(tasks) ? tasks : [];

  const filteredTasks = taskList.filter((task: any) => {
    // Filter by Tab
    if (activeTab === "completed") {
      if (!task.completed) return false;
    } else {
      if (task.completed) return false;
      const dueDate = new Date(task.scheduledAt);
      
      if (activeTab === "today") {
        if (!isToday(dueDate)) return false;
      } else if (activeTab === "overdue") {
        // Overdue is strictly past AND not today
        if (!(isPast(dueDate) && !isToday(dueDate))) return false;
      } else if (activeTab === "upcoming") {
        // Upcoming is strictly future AND not today
        if (!(isFuture(dueDate) && !isToday(dueDate))) return false;
      }
    }

    // Filter by Search
    const search = searchQuery.toLowerCase();
    const title = task.title?.toLowerCase() || "";
    const leadName = task.lead?.customerName?.toLowerCase() || "";
    const type = task.activityType?.toLowerCase() || "";
    
    return title.includes(search) || leadName.includes(search) || type.includes(search);
  });

  const handleCancelTask = (taskId: string) => {
      setCancelTaskId(taskId);
      setCancelReason("");
  };

  const handleConfirmCancel = async () => {
      if (!cancelTaskId) return;
      if (!cancelReason.trim()) {
          toast.error("Please provide a reason");
          return;
      }

      try {
          const res = await divineSquareService.cancelTask(cancelTaskId, { reason: cancelReason });
          if (res.status === 200) {
            toast.success("Task cancelled");
            setCancelTaskId(null);
            fetchAllTasks();
          }
      } catch (error) {
          toast.error("Failed to cancel task");
      }
  };

  const handleRescheduleTask = (task: any) => {
      setRescheduleTaskId(task._id);
      try {
          const d = new Date(task.scheduledAt);
          setRescheduleData({
              date: format(d, "yyyy-MM-dd"),
              time: format(d, "HH:mm")
          });
      } catch (e) {
          setRescheduleData({ date: "", time: "" });
      }
  };

  const handleConfirmReschedule = async () => {
      if (!rescheduleTaskId || !rescheduleData.date || !rescheduleData.time) {
          toast.error("Please select date and time");
          return;
      }

      let newDate = new Date(rescheduleData.date);
      const [h, m] = rescheduleData.time.split(':');
      newDate.setHours(Number(h));
      newDate.setMinutes(Number(m));
      
      // Format time as hh:mm a for backend consistency if needed, but standard Date object is better for `taskDate`
      const timeStr = format(newDate, "hh:mm a");

      try {
          // Payload matching create/update structure
          const payload = {
            taskDate: newDate,
            taskTime: timeStr,
            remark: "Rescheduled via App" 
          };
          
          await divineSquareService.updateLeadTask(rescheduleTaskId, payload);
          toast.success("Task rescheduled");
          setRescheduleTaskId(null);
          fetchAllTasks();
      } catch (e) {
          toast.error("Failed to reschedule task");
      }
  };

  // Sort by due date
  const sortedTasks = [...filteredTasks].sort((a: any, b: any) => {
    return new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime();
  });

  const TabButton = ({ id, label, icon: Icon, count }: { id: string, label: string, icon: any, count: number }) => (
    <button
      onClick={() => setActiveTab(id as any)}
      className={cn(
        "flex-1 relative py-2 rounded-xl transition-all duration-300 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2",
        activeTab === id
          ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
          : "bg-muted/50 text-muted-foreground hover:bg-muted"
      )}
    >
      <Icon className="w-4 h-4 sm:w-4 sm:h-4 mb-0.5 sm:mb-0" />
      <span className={cn("text-[10px] sm:text-sm font-medium leading-none")}>{label}</span>
      {count > 0 && (
         <span className={cn(
            "absolute top-1 right-1 sm:static sm:top-auto sm:right-auto text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full flex items-center justify-center min-w-[16px]",
            activeTab === id ? "bg-white/20 text-white" : "bg-black/5 text-muted-foreground"
         )}>
           {count}
         </span>
      )}
    </button>
  );

  // Calculate counts for tabs
  const todayCount = taskList.filter((t: any) => !t.completed && t.scheduledAt && isToday(new Date(t.scheduledAt))).length;
  const overdueCount = taskList.filter((t: any) => !t.completed && t.scheduledAt && isPast(new Date(t.scheduledAt)) && !isToday(new Date(t.scheduledAt))).length;
  const upcomingCount = taskList.filter((t: any) => !t.completed && t.scheduledAt && isFuture(new Date(t.scheduledAt)) && !isToday(new Date(t.scheduledAt))).length;
  const completedCount = taskList.filter((t: any) => t.completed).length;

  return (
    <AppShell fabAction={() => navigate("/tasks/new")}>
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border/50 px-4 pt-3 pb-2 transition-all">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
             <h1 className="text-lg font-bold text-foreground">Tasks</h1>
             <div className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-[10px] font-bold">
                {todayCount + overdueCount}
             </div>
          </div>
          <div className="flex gap-2">
             <button 
               onClick={() => navigate("/settings/notifications")}
               className="w-8 h-8 rounded-full bg-muted/50 hover:bg-muted border border-border/50 flex items-center justify-center transition-all active:scale-95 relative"
             >
               <Bell className="w-4 h-4 text-muted-foreground" />
               <span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full border border-background" />
             </button>
             <button 
               onClick={() => navigate("/tasks/new")}
               className="w-8 h-8 rounded-full bg-primary text-primary-foreground shadow-sm flex items-center justify-center transition-all hover:opacity-90 active:scale-95"
             >
               <Plus className="w-4 h-4" />
             </button>
          </div>
        </div>

        <div className="relative mb-3 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/70" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded-lg bg-muted/40 border border-border/30 text-sm focus:bg-background focus:border-primary/50 transition-all outline-none placeholder:text-muted-foreground/60"
          />
        </div>

        <div className="flex w-full bg-muted/20 p-0.5 rounded-lg gap-0.5 overflow-x-auto no-scrollbar">
          <TabButton id="today" label="Today" icon={Calendar} count={todayCount} />
          <TabButton id="overdue" label="Overdue" icon={AlertCircle} count={overdueCount} />
          <TabButton id="upcoming" label="Upcoming" icon={Clock} count={upcomingCount} />
          <TabButton id="completed" label="Done" icon={CheckCircle} count={completedCount} />
        </div>
      </header>

      {/* Spacer for fixed header - Increased for safe buffer */}
      <div className="h-[160px]" />

      <main className="flex-1 px-4 py-4 space-y-3 pb-24">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : sortedTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <CheckSquare className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground">No tasks found</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-[250px]">
              {searchQuery ? "Try adjusting your search filters" : 
               activeTab === "completed" ? "No completed tasks yet" : 
               "You're all caught up! No tasks in this view."}
            </p>
            {!searchQuery && activeTab !== "completed" && (
              <button
                onClick={() => navigate("/tasks/new")}
                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
              >
                Create Task
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {sortedTasks.map((task: any) => (
                <TaskCard
                key={task._id}
                id={task._id}
                type={task.activityType}
                leadName={task.lead?.customerName || "Lead Not Found"}
                leadStatus={getTaskStatus(task)}
                time={format(new Date(task.scheduledAt), isToday(new Date(task.scheduledAt)) ? "h:mm a" : "MMM d, h:mm a")}
                project={task.title}
                remark={task.remark}
                isOverdue={activeTab === "overdue" || (activeTab === "today" && isPast(new Date(task.scheduledAt)) && !isToday(new Date(task.scheduledAt)))}
                onCall={() => task.lead && window.open(`tel:${task.lead.mobile}`)}
                onWhatsApp={() => task.lead && window.open(`https://wa.me/${task.lead.mobile.replace(/\s/g, "")}`)}
                onCancel={() => setCancelTaskId(task._id)}
                onReschedule={() => {
                    setRescheduleTaskId(task._id);
                    // Initialize with current task date/time?
                    // handleRescheduleTask logic was doing this. I'll rely on setRescheduleTaskId if that's what triggers modal. 
                    // Wait, previous code was handleRescheduleTask(task). I should keep that if it exists.
                    // Checking read_file output line 272: handleRescheduleTask(task). 
                    // So I should use handleRescheduleTask(task).
                    handleRescheduleTask(task);
                }}
                onViewLead={() => task.lead && navigate(`/leads/${task.lead._id}`)}
              />
            ))}
          </div>
        )}
      </main>


      {/* Cancel Dialog */}
      <Dialog open={!!cancelTaskId} onOpenChange={(open) => !open && setCancelTaskId(null)}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Cancel Task</DialogTitle>
                <DialogDescription>Please provide a reason for cancelling this task.</DialogDescription>
            </DialogHeader>
            <div className="py-4">
                <textarea
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Reason for cancellation..."
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                />
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setCancelTaskId(null)}>Close</Button>
                <Button variant="destructive" onClick={handleConfirmCancel}>Confirm Cancel</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reschedule Dialog */}
      <Dialog open={!!rescheduleTaskId} onOpenChange={(open) => !open && setRescheduleTaskId(null)}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Reschedule Task</DialogTitle>
                <DialogDescription>Select a new date and time.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Date</label>
                        <input 
                            type="date"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={rescheduleData.date}
                            onChange={(e) => setRescheduleData({...rescheduleData, date: e.target.value})}
                            min={format(new Date(), "yyyy-MM-dd")}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Time</label>
                         <input 
                            type="time"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={rescheduleData.time}
                            onChange={(e) => setRescheduleData({...rescheduleData, time: e.target.value})}
                        />
                    </div>
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setRescheduleTaskId(null)}>Close</Button>
                <Button onClick={handleConfirmReschedule}>Reschedule</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
