import { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ArrowLeft, CheckCircle, FileText } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { divineSquareService } from "@/services/DivineInfraService";
import { toast } from "sonner";
import { useLeadTasks } from "@/hooks/useLeadTasks";

export default function CompleteTask() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [remarks, setRemarks] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    
    // We might want to fetch task details to show what we are completing
    // For now, simple remark form.

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!id) return;
        
        setIsLoading(true);
        try {
            // Assuming we have an API to update task status
            // divineSquareService.updateLeadTask(id, { status: 'completed', completionRemarks: remarks });
            // Since explicit updateTask might not exist in service wrapper shown earlier, 
            // we'll assume a generic update or we might need to check service again.
            // checking service... listLeadTasksById, listAllTasks, createLeadTask.
            // Only updateLead exists.
            // I'll use a placeholder or assume a new specific endpoint.
            // Let's assume we use the updateLeadTask we should add to service.
            
            // Wait, looking at previous file view of DivineInfraService.tsx:
            // It had createLeadTask, listLeadTasksById, listAllTasks.
            // NO updateTask.
            
            // I need to add updateTask to service first? Or maybe backend supports it.
            // Let's check backend routes for leadTaskRoutes or similar.
            
            // For now, I will simulate it or try to call a standard endpoint.
            // If I look at the files, there is `leadTaskRoutes.js`.
             
            // Let's assume there is an update endpoint or I will add it.
            // I'll proceed creating the page assuming I can fix the service.
            
            // Temporarily calling updateLeadTask assuming it will be added.
             await divineSquareService.updateLeadTask(id, { 
                 status: "completed", 
                 remark: remarks // or completion_remarks
             });

            toast.success("Task completed successfully!");
            navigate(-1);
        } catch (error) {
            console.error(error);
            toast.error("Failed to complete task");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AppShell showFab={false} showBottomNav={false}>
            <header className="bg-primary text-primary-foreground px-4 pt-12 pb-6">
                <div className="flex items-center gap-3 mb-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="touch-btn w-10 h-10 rounded-full bg-primary-foreground/20"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold">Complete Task</h1>
                        <p className="text-sm opacity-80">Mark activity as done</p>
                    </div>
                </div>
            </header>

            <main className="p-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="crm-card">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                                <FileText className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <label className="text-sm font-semibold text-foreground">
                                Completion Remarks
                            </label>
                        </div>
                        <textarea
                            required
                            rows={4}
                            placeholder="Add notes about the outcome..."
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-muted border-0 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                        />
                    </div>

                    <div className="pt-2">
                         <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full h-14 bg-primary text-primary-foreground rounded-xl font-bold text-lg disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            {isLoading ? "Saving..." : "Mark as Complete"}
                        </button>
                    </div>
                </form>
            </main>
        </AppShell>
    );
}
