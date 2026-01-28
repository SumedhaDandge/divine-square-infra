import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useUsers } from "@/hooks/useUsers";
import { Plus, User, Mail, Phone, MapPin, Shield, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

import { useNavigate } from "react-router-dom";

export default function UsersPage() {
    const navigate = useNavigate();
    const { users, isLoading, createUser } = useUsers();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
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
        await createUser.mutateAsync(formData);
        setIsDialogOpen(false);
        setFormData({ name: "", email: "", mobile: "", password: "", role: "sales", address: "" });
    };

    return (
        <AppShell>
             <header className="bg-card border-b border-border px-4 pt-12 pb-4 sticky top-0 z-30 flex justify-between items-center">
                <h1 className="text-xl font-bold">Team Members</h1>
                
                <button 
                    onClick={() => navigate("/users/new")}
                    className="touch-btn w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center"
                >
                    <Plus className="w-5 h-5"/>
                </button>
             </header>

             <main className="p-4 space-y-4">
                 {isLoading ? (
                     <div className="flex justify-center py-12">
                         <Loader2 className="w-8 h-8 animate-spin text-primary"/>
                     </div>
                 ) : (
                     users.map((user: any) => (
                         <div key={user._id} className="crm-card flex items-start gap-4">
                             <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                 <User className="w-6 h-6 text-primary"/>
                             </div>
                             <div className="flex-1 min-w-0">
                                 <div className="flex justify-between items-start">
                                     <h3 className="font-semibold text-lg">{user.name}</h3>
                                     <span className={cn(
                                         "text-[10px] font-bold uppercase px-2 py-1 rounded-full",
                                         user.role === "admin" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                                     )}>
                                         {user.role}
                                     </span>
                                 </div>
                                 <div className="space-y-1 mt-2 text-sm text-muted-foreground">
                                     <div className="flex items-center gap-2">
                                         <Mail className="w-4 h-4"/>
                                         {user.email}
                                     </div>
                                     <div className="flex items-center gap-2">
                                         <Phone className="w-4 h-4"/>
                                         {user.mobile}
                                     </div>
                                      {user.address && (
                                         <div className="flex items-center gap-2">
                                             <MapPin className="w-4 h-4"/>
                                             {user.address}
                                         </div>
                                     )}
                                 </div>
                             </div>
                         </div>
                     ))
                 )}
             </main>
        </AppShell>
    );
}
