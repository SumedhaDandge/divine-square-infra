import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useUsers } from "@/hooks/useUsers";
import { ArrowLeft, User, Mail, Phone, MapPin, Loader2, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function AddUser() {
    const navigate = useNavigate();
    const { createUser } = useUsers();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobile: "",
        password: "",
        role: "sales",
        address: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createUser.mutateAsync(formData);
            navigate("/users");
        } catch (error) {
            // Error handled by hook/toast
        }
    };

    return (
        <AppShell showFab={false} showBottomNav={false}>
            {/* Header */}
            <header className="bg-primary text-primary-foreground px-4 pt-12 pb-6">
                <div className="flex items-center gap-3 mb-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="touch-btn w-10 h-10 rounded-full bg-primary-foreground/20"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold">Add Team Member</h1>
                        <p className="text-sm opacity-80">Create a new user account</p>
                    </div>
                </div>
            </header>

            <main className="p-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div className="crm-card">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                                <User className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <label className="text-sm font-semibold text-foreground">
                                Full Name *
                            </label>
                        </div>
                        <input
                            required
                            type="text"
                            placeholder="e.g. John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full h-12 px-4 rounded-xl bg-muted border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                    </div>

                    {/* Email */}
                    <div className="crm-card">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                                <Mail className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <label className="text-sm font-semibold text-foreground">
                                Email Address *
                            </label>
                        </div>
                        <input
                            required
                            type="email"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full h-12 px-4 rounded-xl bg-muted border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                    </div>

                    {/* Mobile */}
                    <div className="crm-card">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                                <Phone className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <label className="text-sm font-semibold text-foreground">
                                Mobile Number *
                            </label>
                        </div>
                        <input
                            required
                            type="tel"
                            placeholder="+91 9999999999"
                            value={formData.mobile}
                            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                            className="w-full h-12 px-4 rounded-xl bg-muted border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                    </div>

                    {/* Password */}
                    <div className="crm-card">
                        <div className="flex items-center gap-3 mb-3">
                             <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                                <Shield className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <label className="text-sm font-semibold text-foreground">
                                Password *
                            </label>
                        </div>
                        <input
                            required
                            type="password"
                            placeholder="******"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full h-12 px-4 rounded-xl bg-muted border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                    </div>

                     {/* Role */}
                    <div className="crm-card">
                        <label className="text-sm font-semibold text-foreground mb-3 block">
                            Role
                        </label>
                        <select 
                            value={formData.role}
                            onChange={(e) => setFormData({...formData, role: e.target.value})}
                            className="w-full h-12 px-4 rounded-xl bg-muted border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none bg-no-repeat"
                            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.5rem center`, backgroundSize: `1.5em 1.5em` }}
                        >
                            <option value="sales">Sales</option>
                            <option value="manager">Manager</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    {/* Address */}
                    <div className="crm-card">
                         <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                                <MapPin className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <label className="text-sm font-semibold text-foreground">
                                Address
                            </label>
                        </div>
                        <textarea
                            rows={3}
                            placeholder="Enter address..."
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-muted border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2 pb-8">
                        <button 
                            type="submit" 
                            disabled={createUser.isPending}
                            className="w-full h-14 bg-primary text-primary-foreground rounded-xl font-bold text-lg disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            {createUser.isPending ? "Creating..." : "Create Member"}
                        </button>
                    </div>
                </form>
            </main>
        </AppShell>
    );
}
