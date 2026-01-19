import { AppShell } from "@/components/layout/AppShell";
import { 
  User, Phone, Mail, Building2, ChevronRight, 
  Bell, Shield, HelpCircle, LogOut, Moon, Sun
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: Bell, label: "Notifications", path: "/settings/notifications" },
  { icon: Shield, label: "Privacy & Security", path: "/settings/privacy" },
  { icon: HelpCircle, label: "Help & Support", path: "/settings/help" },
];

export default function Profile() {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <AppShell showFab={false}>
      {/* Header */}
      <header className="bg-primary text-primary-foreground px-4 pt-12 pb-8">
        <h1 className="text-xl font-bold mb-6">Profile</h1>
        
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary-foreground/20 flex items-center justify-center">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Rahul Verma</h2>
            <p className="text-primary-foreground/70 text-sm">Sales Executive</p>
            <p className="text-primary-foreground/60 text-xs mt-1">Divine Square Infra</p>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 -mt-4 space-y-4 pb-6">
        {/* Contact Info */}
        <div className="crm-card">
          <h3 className="text-sm font-semibold text-foreground mb-3">Contact Information</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                <Phone className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="text-sm font-medium text-foreground">+91 98765 43210</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                <Mail className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium text-foreground">rahul.verma@divinesquare.in</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                <Building2 className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Branch</p>
                <p className="text-sm font-medium text-foreground">Nagpur Main Office</p>
              </div>
            </div>
          </div>
        </div>

        {/* Performance */}
        <div className="crm-card">
          <h3 className="text-sm font-semibold text-foreground mb-3">This Month</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">24</p>
              <p className="text-xs text-muted-foreground">Leads</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-status-hot">8</p>
              <p className="text-xs text-muted-foreground">Site Visits</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-accent">3</p>
              <p className="text-xs text-muted-foreground">Conversions</p>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="crm-card !p-0 overflow-hidden">
          {/* Theme Toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              {isDark ? <Moon className="w-5 h-5 text-muted-foreground" /> : <Sun className="w-5 h-5 text-muted-foreground" />}
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

          <div className="h-px bg-border" />

          {menuItems.map((item, index) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                <item.icon className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground flex-1 text-left">{item.label}</p>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          ))}

          <div className="h-px bg-border" />

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-4 hover:bg-destructive/5 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
              <LogOut className="w-5 h-5 text-destructive" />
            </div>
            <p className="text-sm font-medium text-destructive">Sign Out</p>
          </button>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Divine Square Infra CRM v1.0.0
        </p>
      </main>
    </AppShell>
  );
}
