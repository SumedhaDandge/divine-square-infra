import { AppShell } from "@/components/layout/AppShell";
import { 
  User, Phone, Mail, ChevronRight, 
  Bell, Shield, HelpCircle, LogOut, Moon, Sun, Users,
  BarChart3, MessageSquare, FileJson, UserCog
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

const menuItems = [
  { icon: Bell, label: "Notifications", path: "/settings/notifications" },
  { icon: Shield, label: "Privacy & Security", path: "/settings/privacy" },
  { icon: HelpCircle, label: "Help & Support", path: "/settings/help" },
];

export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (isDark) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
    } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const quickActions = [
    { icon: UserCog, label: "Update Profile", path: "/profile/edit", color: "text-blue-500", bg: "bg-blue-500/10" },
    { icon: BarChart3, label: "Reports", path: "/reports", color: "text-purple-500", bg: "bg-purple-500/10" },
    { icon: MessageSquare, label: "Inquiries", path: "/inquiries", color: "text-orange-500", bg: "bg-orange-500/10" },
    { icon: FileJson, label: "Create Quote", path: "/quotations/new", color: "text-green-500", bg: "bg-green-500/10" },
  ];

  return (
    <AppShell showFab={false}>
      <div className="min-h-screen bg-muted/20 pb-20">
        {/* Header Section */}
        <div className="relative bg-primary text-primary-foreground pb-10 pt-12 px-6 rounded-b-[2.5rem] shadow-lg overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
             <div className="absolute top-[-50%] left-[-20%] w-[500px] h-[500px] rounded-full bg-white blur-[100px]" />
          </div>
          
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full border-4 border-white/20 shadow-xl bg-primary-foreground/20 flex items-center justify-center mb-4 backdrop-blur-sm">
              <User className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">{user?.name || "User"}</h2>
            <p className="text-primary-foreground/80 font-medium capitalize mt-1">{user?.role || "Role"}</p>
            <div className="mt-2 px-3 py-1 rounded-full bg-white/10 text-xs backdrop-blur-md border border-white/10">
              Divine Square Infra
            </div>
          </div>
        </div>

        <div className="px-4 -mt-6 relative z-20 space-y-6">
          {/* Quick Actions Grid */}
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => navigate(action.path)}
                className="flex flex-col items-center justify-center p-4 bg-background rounded-2xl shadow-sm border border-border/50 hover:shadow-md transition-all active:scale-95"
              >
                <div className={cn("w-12 h-12 rounded-full flex items-center justify-center mb-3", action.bg)}>
                  <action.icon className={cn("w-6 h-6", action.color)} />
                </div>
                <span className="text-sm font-semibold text-foreground">{action.label}</span>
              </button>
            ))}
          </div>

          {/* Contact Information */}
          <div className="bg-background rounded-2xl p-5 shadow-sm border border-border/50">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">Contact Details</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-sm font-medium text-foreground">{user?.mobile || "-"}</p>
                </div>
              </div>
              <div className="h-px bg-border/50" />
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium text-foreground">{user?.email || "-"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Settings Menu */}
          <div className="bg-background rounded-2xl shadow-sm border border-border/50 overflow-hidden">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider px-5 pt-5 pb-2">Preferences</h3>
            
            {user?.role === "admin" && (
              <button
                onClick={() => navigate("/users")}
                className="w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-500" />
                </div>
                <p className="text-sm font-medium text-foreground flex-1 text-left">Manage Team</p>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            )}

            {user?.role === "admin" && (
              <button
                onClick={() => navigate("/masters")}
                className="w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-emerald-500" />
                </div>
                <p className="text-sm font-medium text-foreground flex-1 text-left">Manage Masters</p>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            )}


            <button
              onClick={() => setIsDark(!isDark)}
              className="w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                {isDark ? <Moon className="w-5 h-5 text-purple-500" /> : <Sun className="w-5 h-5 text-purple-500" />}
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-foreground">Dark Mode</p>
              </div>
              <div className={cn(
                "w-11 h-6 rounded-full transition-colors relative",
                isDark ? "bg-primary" : "bg-muted"
              )}>
                <div className={cn(
                  "w-5 h-5 rounded-full bg-white shadow-sm absolute top-0.5 transition-transform",
                  isDark ? "translate-x-5" : "translate-x-0.5"
                )} />
              </div>
            </button>

            {menuItems.map((item, index) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="w-full flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground flex-1 text-left">{item.label}</p>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            ))}

            <div className="h-px bg-border" />

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 p-4 hover:bg-destructive/5 transition-colors text-destructive"
            >
              <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                <LogOut className="w-5 h-5" />
              </div>
              <p className="text-sm font-medium">Sign Out</p>
            </button>
          </div>

          <p className="text-center text-xs text-muted-foreground pb-4">
            Version 1.0.0 • Divine Square Infra
          </p>
        </div>
      </div>
    </AppShell>
  );
}
