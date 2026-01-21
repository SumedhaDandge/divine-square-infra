import { useState } from "react";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Building2 } from "lucide-react";
import { toast } from "sonner";
import { divineSquareService } from "@/services/DivineInfraService";
import { registerFcmToken } from "@/utils/registerFcmToken";

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
        // ✅ Save auth data
        sessionStorage.setItem("auth_token", token);
        sessionStorage.setItem("auth_user", JSON.stringify(response.data.user));
        // 🔔 REGISTER FCM TOKEN (IMPORTANT)
        registerFcmToken(token); 
        toast.success("Login successful");
        navigate("/dashboard", { replace: true });
      }
    } catch (error) {
      console.error(error);
      toast.error("Invalid mobile number or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary flex flex-col">
      {/* Header */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-8">
        <div className="w-20 h-20 rounded-2xl bg-primary-foreground/20 flex items-center justify-center mb-6">
          <Building2 className="w-10 h-10 text-primary-foreground" />
        </div>

        <h1 className="text-3xl font-bold text-primary-foreground">
          Divine Square Infra
        </h1>

        <p className="text-primary-foreground/70 mt-2">
          Channel Partner of Mauli Infra Group
        </p>
      </div>

      {/* Login Card */}
      <div className="bg-card rounded-t-[2rem] px-6 pt-8 pb-12">
        <h2 className="text-xl font-bold mb-1">Welcome Back</h2>
        <p className="text-muted-foreground text-sm mb-6">
          Sign in to continue
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Mobile */}
          <div>
            <label className="text-sm font-medium">Mobile Number</label>
            <input
              type="tel"
              value={formData.mobile}
              onChange={(e) =>
                setFormData({ ...formData, mobile: e.target.value })
              }
              placeholder="Enter mobile number"
              className="w-full h-14 px-4 rounded-xl bg-muted focus:ring-2 focus:ring-primary/30"
            />
            {errors.mobile && (
              <p className="text-destructive text-xs mt-1">{errors.mobile}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Enter password"
                className="w-full h-14 px-4 pr-12 rounded-xl bg-muted focus:ring-2 focus:ring-primary/30"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
            {errors.password && (
              <p className="text-destructive text-xs mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 rounded-xl bg-primary text-primary-foreground font-semibold"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
