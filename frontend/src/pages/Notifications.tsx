import { AppShell } from "@/components/layout/AppShell";
import { Bell, Phone, MapPin, FileText, Clock, Check, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const notifications = [
  {
    id: "1",
    type: "reminder",
    title: "Follow-up Reminder",
    message: "Call Rajesh Sharma about Green Valley Phase 2",
    time: "5 min ago",
    read: false,
  },
  {
    id: "2",
    type: "site_visit",
    title: "Site Visit Today",
    message: "Priya Patel - Mauli Heights at 2:00 PM",
    time: "1 hour ago",
    read: false,
  },
  {
    id: "3",
    type: "quote",
    title: "Quotation Viewed",
    message: "Amit Deshmukh viewed the quotation for Royal Gardens",
    time: "3 hours ago",
    read: true,
  },
  {
    id: "4",
    type: "lead",
    title: "New Lead Assigned",
    message: "New lead from Facebook - Vikram Singh",
    time: "Yesterday",
    read: true,
  },
  {
    id: "5",
    type: "reminder",
    title: "Overdue Follow-up",
    message: "Sunita Rao - Follow-up was due yesterday",
    time: "Yesterday",
    read: true,
  },
];

const iconMap = {
  reminder: Bell,
  site_visit: MapPin,
  quote: FileText,
  lead: Phone,
};

const colorMap = {
  reminder: "bg-status-warm-bg text-status-warm",
  site_visit: "bg-accent/10 text-accent",
  quote: "bg-status-cold-bg text-status-cold",
  lead: "bg-status-hot-bg text-status-hot",
};

export default function Notifications() {
  return (
    <AppShell showFab={false}>
      {/* Header */}
      <header className="bg-card border-b border-border px-4 pt-12 pb-4 sticky top-0 z-30">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">Notifications</h1>
          <button className="text-sm text-primary font-medium">Mark all read</button>
        </div>
      </header>

      <main className="flex-1">
        {notifications.map((notification) => {
          const Icon = iconMap[notification.type as keyof typeof iconMap];
          const colorClass = colorMap[notification.type as keyof typeof colorMap];

          return (
            <div
              key={notification.id}
              className={cn(
                "flex items-start gap-3 px-4 py-4 border-b border-border transition-colors",
                !notification.read && "bg-primary/5"
              )}
            >
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", colorClass)}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className={cn(
                    "text-sm truncate",
                    !notification.read ? "font-semibold text-foreground" : "font-medium text-foreground"
                  )}>
                    {notification.title}
                  </h3>
                  {!notification.read && (
                    <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                  {notification.message}
                </p>
                <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {notification.time}
                </p>
              </div>
            </div>
          );
        })}
      </main>
    </AppShell>
  );
}
