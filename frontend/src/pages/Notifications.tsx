import { AppShell } from "@/components/layout/AppShell";
import { Bell, Phone, MapPin, FileText, Clock, Check, Trash2, Calendar, MessageSquare, AlertTriangle, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLeadTasks } from "@/hooks/useLeadTasks";
import { useEffect, useState, useRef } from "react";
import { format, isToday, isFuture, differenceInMinutes, parseISO, isYesterday } from "date-fns";
import { useNavigate } from "react-router-dom";

// Mock system notifications for now
const systemNotifications : any[] = [];

const iconMap: Record<string, any> = {
  reminder: Bell,
  site_visit: MapPin,
  quote: FileText,
  lead: Phone,
  call: Phone,
  whatsapp: MessageSquare,
  follow_up: Bell,
  booking: Check,
  revisit: Calendar,
};

const colorMap: Record<string, string> = {
  reminder: "bg-orange-500/10 text-orange-600",
  site_visit: "bg-blue-500/10 text-blue-600",
  quote: "bg-purple-500/10 text-purple-600",
  lead: "bg-emerald-500/10 text-emerald-600",
  call: "bg-indigo-500/10 text-indigo-600",
  whatsapp: "bg-green-500/10 text-green-600",
  follow_up: "bg-amber-500/10 text-amber-600",
  booking: "bg-teal-500/10 text-teal-600",
  revisit: "bg-cyan-500/10 text-cyan-600",
};

export default function Notifications() {
  const navigate = useNavigate();
  const { tasks, fetchAllTasks, isLoading } = useLeadTasks();
  const [now, setNow] = useState(new Date());
  const [permission, setPermission] = useState(
    "Notification" in window ? Notification.permission : "default"
  );
  
  // Read state persistence
  const [readIds, setReadIds] = useState<string[]>(() => {
      const saved = localStorage.getItem("read_notifications");
      return saved ? JSON.parse(saved) : [];
  });

  const lastNotifiedRef = useRef<Record<string, number>>({});

  useEffect(() => {
    localStorage.setItem("read_notifications", JSON.stringify(readIds));
  }, [readIds]);

  const markAsRead = (id: string) => {
      if (!readIds.includes(id)) {
          setReadIds(prev => [...prev, id]);
      }
  };

  const clearAll = () => {
      // Mark ALL current tasks as read
      const allIds = tasks.map((t: any) => t._id);
      // Merge with existing readIds to avoid duplicates
      const newReadIds = Array.from(new Set([...readIds, ...allIds]));
      setReadIds(newReadIds);
  };

  useEffect(() => {
    fetchAllTasks();
    
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    const checkReminders = () => {
        const currentNow = new Date();
        setNow(currentNow);

        if (!("Notification" in window) || Notification.permission !== "granted") return;

        const urgentTasks = (Array.isArray(tasks) ? tasks : []).filter((t: any) => {
            if (t.completed || !t.scheduledAt) return false;
            const d = new Date(t.scheduledAt);
            const diff = differenceInMinutes(d, currentNow);
            return diff <= 15 && diff >= -5;
        });

        urgentTasks.forEach((task: any) => {
            const lastTime = lastNotifiedRef.current[task._id] || 0;
            const timeSinceLastNotify = currentNow.getTime() - lastTime;
            const notificationInterval = 5 * 60 * 1000; // 5 minutes

            if (timeSinceLastNotify >= notificationInterval) {
                try {
                    const title = `Reminder: ${task.activityType ? task.activityType.toUpperCase() : "TASK"}`;
                    const options = {
                        body: `Upcoming with ${task.lead?.customerName || 'Client'}\n${task.remark || ''}`,
                        icon: '/vite.svg',
                        tag: task._id
                    };
                    
                    new Notification(title, options);
                } catch(e) { console.error("Notification error", e); }
                
                lastNotifiedRef.current[task._id] = currentNow.getTime();
            }
        });
    };

    const interval = setInterval(checkReminders, 30000);
    checkReminders();

    return () => clearInterval(interval);
  }, [tasks]);

  // Filter and Process Tasks
  const taskNotifications = (Array.isArray(tasks) ? tasks : [])
    .filter((task: any) => !task.completed && task.scheduledAt)
    .map((task: any) => {
      const dueDate = new Date(task.scheduledAt);
      const diff = differenceInMinutes(dueDate, now);
      
      let type = "reminder";
      if (task.activityType) type = task.activityType;

      const isUrgent = diff <= 15 && diff > -60;
      const isRead = readIds.includes(task._id);

      return {
        id: task._id,
        type,
        title: isUrgent ? "Upcoming Task Reminder" : `${task.activityType ? task.activityType.replace('_', ' ').toUpperCase() : 'Task'}`,
        message: `${task.lead?.customerName || "Lead"} - ${task.remark || task.title || "No details"}`,
        time: isUrgent && diff > 0 ? `Due in ${diff} mins` : (isToday(dueDate) ? format(dueDate, "h:mm a") : format(dueDate, "MMM d, h:mm a")),
        read: isRead,
        date: dueDate,
        isUrgent: isUrgent && !isRead, // If read, remove urgent styling? Or keep urgency but mark read? Let's keep urgency flag but use read to dim.
        originalUrgency: isUrgent,
        isSystem: false, 
        leadId: task.lead?._id
      };
    });

  // Sort
  const allNotifications = [...taskNotifications, ...systemNotifications].sort((a, b) => {
    // Unread first
    if (!a.read && b.read) return -1;
    if (a.read && !b.read) return 1;

    // Then Urgent
    if (a.isUrgent && !b.isUrgent) return -1;
    if (!a.isUrgent && b.isUrgent) return 1;
    return b.date.getTime() - a.date.getTime();
  });

  // Grouping Logic
  const grouped = allNotifications.reduce((acc: any, note: any) => {
      let key = "Earlier";
      if (note.isUrgent) key = "Urgent";
      else if (isToday(note.date)) key = "Today";
      else if (isYesterday(note.date)) key = "Yesterday";
      
      if (!acc[key]) acc[key] = [];
      acc[key].push(note);
      return acc;
  }, {});

  const groupOrder = ["Urgent", "Today", "Yesterday", "Earlier"];
  const unreadCount = allNotifications.filter(n => !n.read).length;

  return (
    <AppShell showFab={false}>
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border/50 transition-all">
        <div className="flex items-center justify-between px-4 pt-4 pb-3">
          <div className="flex items-center gap-3">
             <div className="relative">
                <Bell className="w-5 h-5 text-foreground" />
                {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-background" />}
             </div>
             <h1 className="text-lg font-bold text-foreground">Notifications</h1>
          </div>
          
          <div className="flex gap-2">
            {unreadCount > 0 && (
                <button 
                    onClick={clearAll}
                    className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground px-2 py-1 rounded-md hover:bg-muted transition-colors"
                >
                    <CheckCheck className="w-3.5 h-3.5" />
                    Mark all read
                </button>
            )}
            {permission !== "granted" && (
                <button 
                    onClick={() => {
                        Notification.requestPermission().then(p => setPermission(p));
                    }}
                    className="text-xs font-bold bg-primary text-primary-foreground px-3 py-1.5 rounded-full shadow-sm"
                >
                    Enable Push
                </button>
            )}
           </div>
        </div>
      </header>
      
      <div className="h-16" /> 

      <main className="flex-1 px-4 pt-4 pb-24 space-y-6">
        {allNotifications.length === 0 ? (
             <div className="flex flex-col items-center justify-center py-24 text-center">
                 <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
                    <Bell className="w-8 h-8 text-muted-foreground/40" />
                 </div>
                 <h3 className="text-sm font-medium text-foreground">No notifications</h3>
             </div>
        ) : (
            groupOrder.map((label) => {
                const items = grouped[label];
                if (!items || items.length === 0) return null;

                return (
                    <section key={label} className="space-y-2">
                        <div className="flex items-center gap-2 pl-1 mb-2">
                            <span className={cn(
                                "w-1.5 h-1.5 rounded-full",
                                label === "Urgent" ? "bg-red-500" :
                                label === "Today" ? "bg-primary" : "bg-muted-foreground/30"
                            )} />
                            <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{label}</h2>
                        </div>
                        
                        <div className="grid gap-2">
                            {items.map((notification: any) => {
                                const Icon = iconMap[notification.type] || Bell;
                                const colorClass = colorMap[notification.type] || "bg-muted text-muted-foreground";
                                
                                return (
                                    <div
                                    key={notification.id}
                                    onClick={() => {
                                        markAsRead(notification.id);
                                        if(notification.leadId) navigate(`/leads/${notification.leadId}`);
                                    }}
                                    className={cn(
                                        "group relative bg-card border-b border-border/50 p-3.5 hover:bg-muted/30 transition-colors cursor-pointer first:rounded-t-xl last:rounded-b-xl last:border-0",
                                        notification.isUrgent && "bg-red-50/40",
                                        notification.read && "opacity-60 bg-muted/5"
                                    )}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5", colorClass)}>
                                                {notification.originalUrgency ? <AlertTriangle className="w-4 h-4 text-red-600" /> : <Icon className="w-4 h-4" />}
                                            </div>
                                            
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-2 mb-0.5">
                                                    <h3 className={cn("text-sm font-semibold truncate leading-tight", notification.originalUrgency ? "text-red-700" : "text-foreground")}>
                                                        {notification.title}
                                                    </h3>
                                                    <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0">
                                                        {notification.time}
                                                    </span>
                                                </div>
                                                
                                                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed pr-2">
                                                    {notification.message}
                                                </p>
                                            </div>
                                            {!notification.read && (
                                                <div className="absolute top-4 right-2 w-2 h-2 rounded-full bg-primary" />
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                );
            })
        )}
      </main>
    </AppShell>
  );
}
