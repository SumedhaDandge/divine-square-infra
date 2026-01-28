import { AppShell } from "@/components/layout/AppShell";
import { ArrowLeft, Shield, Lock, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Privacy() {
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
          <h1 className="text-xl font-bold">Privacy & Security</h1>
        </div>
      </header>

      <main className="p-4 space-y-4">
        <div className="crm-card space-y-4">
            <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                     <h3 className="font-semibold text-lg">Data Protection</h3>
                     <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                         Your data is encrypted and stored securely. We adhere to strict data protection policies to ensure your information remains confidential.
                     </p>
                </div>
            </div>

             <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Lock className="w-5 h-5 text-primary" />
                </div>
                <div>
                     <h3 className="font-semibold text-lg">Access Control</h3>
                     <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                         Only authorized personnel have access to sensitive client data. Role-based access controls are enforced throughout the application.
                     </p>
                </div>
            </div>
            
             <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                     <h3 className="font-semibold text-lg">Terms of Service</h3>
                     <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                         By using this application, you agree to our terms of service regarding data usage and privacy standards.
                     </p>
                </div>
            </div>
        </div>
      </main>
    </AppShell>
  );
}
