import { useState } from "react";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Building2, Smartphone, Lock, ArrowRight, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { divineSquareService } from "@/services/DivineInfraService";
import { registerFcmToken } from "@/utils/registerFcmToken";
import { cn } from "@/lib/utils";

const loginSchema = z.object({
  mobile: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    mobile: "",
    password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validation = loginSchema.safeParse(formData);

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        fieldErrors[String(err.path[0])] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      setIsLoading(true);

      const response = await divineSquareService.Login(formData);
      if (response.status === 200) {
        const token = response.data.token;
        sessionStorage.setItem("auth_token", token);
        sessionStorage.setItem("auth_user", JSON.stringify(response.data.user));
        registerFcmToken(token); 
        toast.success("Identity Verified");
        navigate("/dashboard", { replace: true });
      }
    } catch (error) {
      console.error(error);
      toast.error("Invalid credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F4F1] flex flex-col font-sans selection:bg-[#235D4D]/10 overflow-x-hidden">
      {/* 
        CLEAN ARCHITECTURAL HEADER 
        Professional Deep Green with subtle geometry 
      */}
      <div className="h-[35vh] bg-[#235D4D] relative flex items-center justify-center overflow-hidden">
        {/* Subdued Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
             <path d="M0 20 L100 20 M0 40 L100 40 M0 60 L100 60 M0 80 L100 80" stroke="white" strokeWidth="0.1" />
             <path d="M20 0 L20 100 M40 0 L40 100 M60 0 L60 100 M80 0 L80 100" stroke="white" strokeWidth="0.1" />
          </svg>
        </div>

        {/* Brand Container */}
        <div className="relative z-10 flex flex-col items-center animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-xl mb-4">
             <Building2 className="w-7 h-7 text-white/90" />
          </div>
          <h1 className="text-xl font-semibold text-white tracking-[0.15em] uppercase">
            Divine Square <span className="text-[#C5A059] font-light">Infra</span>
          </h1>
          <p className="text-[#C5A059] text-[9px] font-medium uppercase tracking-[0.5em] mt-3 opacity-60">Partner Hub</p>
        </div>

        {/* Smooth Transition Wave */}
        <div className="absolute bottom-[-1px] left-0 w-full overflow-hidden leading-[0]">
          <svg viewBox="0 0 1440 320" className="relative block w-full h-[60px] md:h-[80px] fill-[#F2F4F1]">
            <path d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,250.7C960,235,1056,181,1152,149.3C1248,117,1344,107,1392,101.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </div>

      {/* 
        REFINED SIGN-IN SECTION 
        - Balanced spacing and lighter weights for high readability 
      */}
      <div className="flex-1 flex flex-col items-center px-8 -mt-10 md:-mt-14 relative z-30 pb-12">
        {/*
           CARD ARCHITECTURE 
           - Deepened Shaded background (#DFE2DE) for clear differentiation
           - Added Green Border & Stronger Shadow
        */}
        <div className="w-full max-w-[400px] bg-[#DFE2DE] rounded-[2.5rem] p-8 md:p-10 shadow-[0_32px_64px_-16px_rgba(35,93,77,0.18)] border border-[#235D4D]/10 flex flex-col animate-in fade-in slide-in-from-bottom-6 duration-700">
          
          <div className="mb-8 px-1">
            <h2 className="text-2xl font-semibold text-[#235D4D] tracking-tight">Sign in</h2>
            <p className="text-slate-400 text-sm mt-1 font-medium">Access your secure workspace</p>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-7 px-1">
            {/* 
               CLEAN READABLE LABELS & INPUTS 
               - Switched to font-medium (instead of bold/black)
               - High-readability Inter font
            */}
            <div className="space-y-1.5 group">
              <label className="text-[11px] font-medium text-slate-500 uppercase tracking-widest ml-1 transition-colors group-focus-within:text-[#235D4D]">Mobile Identity</label>
              <div className="relative flex items-center h-12 bg-white rounded-xl px-4 shadow-sm border border-slate-100 group-focus-within:border-[#235D4D]/20 transition-all">
                <Smartphone className="w-4 h-4 text-slate-300 group-focus-within:text-[#235D4D] transition-colors mr-3" />
                <input
                  type="tel"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  placeholder="Enter 10-digit mobile"
                  className="flex-1 bg-transparent text-sm font-medium text-[#235D4D] placeholder:text-slate-200 outline-none"
                />
              </div>
              {errors.mobile && <p className="text-red-500 text-[10px] font-medium mt-1 ml-1">{errors.mobile}</p>}
            </div>

            <div className="space-y-1.5 group">
              <div className="flex justify-between items-center px-1">
                <label className="text-[11px] font-medium text-slate-500 uppercase tracking-widest transition-colors group-focus-within:text-[#235D4D]">Security Key</label>
                <button type="button" className="text-[10px] font-medium text-[#C5A059] hover:underline">Forgot?</button>
              </div>
              <div className="relative flex items-center h-12 bg-white rounded-xl px-4 shadow-sm border border-slate-100 group-focus-within:border-[#235D4D]/20 transition-all">
                <Lock className="w-4 h-4 text-slate-300 group-focus-within:text-[#235D4D] transition-colors mr-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter your password"
                  className="flex-1 bg-transparent text-sm font-medium text-[#235D4D] placeholder:text-slate-200 outline-none pr-8"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-slate-300 hover:text-[#235D4D] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-[10px] font-medium mt-1 ml-1">{errors.password}</p>}
            </div>

            {/* Action Section */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className={cn(
                  "w-full h-12 rounded-xl bg-gradient-to-r from-[#235D4D] to-[#1C4A3E] text-white flex items-center justify-center gap-2 shadow-lg shadow-[#235D4D]/10 transition-all active:scale-[0.98] hover:shadow-xl",
                  "disabled:opacity-70 disabled:pointer-events-none"
                )}
              >
                <span className="text-xs font-semibold uppercase tracking-widest">Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Footer Subtext */}
          <div className="mt-10 text-center border-t border-slate-100 pt-6">
            <p className="text-slate-400 text-[10px] font-medium tracking-widest uppercase">
              Partners Portal &copy; {new Date().getFullYear()} Divine Group
            </p>
          </div>
        </div>

        {/* Security Meta */}
        <div className="mt-8 flex items-center gap-3 text-slate-300 opacity-60">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="text-[9px] font-bold uppercase tracking-[0.3em]">End-to-End Secure Login</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
