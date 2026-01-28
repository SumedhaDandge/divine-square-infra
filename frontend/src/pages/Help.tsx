import { AppShell } from "@/components/layout/AppShell";
import { ArrowLeft, HelpCircle, Mail, Phone, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Help() {
  const navigate = useNavigate();

  return (
    <AppShell showFab={false} showBottomNav={false}>
      <header className="bg-card border-b border-border px-4 pt-12 pb-4 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="touch-btn w-10 h-10 rounded-full bg-muted"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">Help & Support</h1>
        </div>
      </header>

      <main className="p-4 space-y-4">
        <div className="bg-primary/5 p-6 rounded-2xl text-center mb-6">
             <HelpCircle className="w-12 h-12 text-primary mx-auto mb-3" />
             <h2 className="text-lg font-bold">How can we help you?</h2>
             <p className="text-sm text-muted-foreground mt-1">
                 Find answers to common questions or contact our support team.
             </p>
        </div>

        <h3 className="font-semibold text-lg px-2">Contact Support</h3>
        <div className="crm-card space-y-0 divide-y divide-border">
            <button className="w-full py-4 flex items-center gap-4 text-left">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <Mail className="w-5 h-5 text-foreground" />
                </div>
                <div>
                     <p className="font-medium">Email Support</p>
                     <p className="text-xs text-muted-foreground">support@divinesquare.com</p>
                </div>
            </button>
            <button className="w-full py-4 flex items-center gap-4 text-left">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <Phone className="w-5 h-5 text-foreground" />
                </div>
                <div>
                     <p className="font-medium">Call Support</p>
                     <p className="text-xs text-muted-foreground">+91 000 000 0000</p>
                </div>
            </button>
        </div>

        <h3 className="font-semibold text-lg px-2 mt-6">Resources</h3>
        <div className="crm-card space-y-0 divide-y divide-border">
            <button className="w-full py-4 flex items-center justify-between text-left">
                <span className="font-medium">User Guide</span>
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
            </button>
             <button className="w-full py-4 flex items-center justify-between text-left">
                <span className="font-medium">FAQs</span>
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
            </button>
        </div>
      </main>
    </AppShell>
  );
}
