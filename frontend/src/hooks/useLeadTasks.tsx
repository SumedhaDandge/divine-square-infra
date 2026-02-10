import { useDataContext } from "@/contex/DataContext";
import { divineSquareService } from "@/services/DivineInfraService";
import { useState, useCallback } from "react";

export const useLeadTasks = () => {
    const { setTaskByID } = useDataContext();
    const [tasksLoading, setTaskLoading] = useState(false);
    const [tasks, setTasks] = useState<any[]>([]);

    const getTaskByID = async (id: any) => {
        setTaskLoading(true);
        try {
            const response = await divineSquareService.listLeadTasksById(id);
            if (response.status === 200) {
                setTaskByID(response.data);
            }
        } catch (error) {
            console.log("", error);
        } finally {
            setTaskLoading(false);
        }
    };

    const fetchAllTasks = useCallback(async () => {
         setTaskLoading(true);
         try {
             const response = await divineSquareService.listAllTasks();
             // console.log("Tasks response:", response); 
             if(response.status === 200) {
                 const data = Array.isArray(response.data) ? response.data : (response.data?.data || response.data?.tasks || []);
                 setTasks(Array.isArray(data) ? data : []);
             }
         } catch(error) {
             console.error(error);
         } finally {
             setTaskLoading(false);
         }
    }, []);

    // Initial fetch handled by component or useEffect here?
    // Dashboard calls hook, but doesn't call fetch method.
    // Better to return method and let component call it, or use React Query.
    // Dashboard logic: const { tasks, isLoading } = useLeadTasks();
    // Assuming useLeadTasks fetches on mount if used this way?
    // Let's add useEffect for auto-fetch if this hook is meant to provide global tasks.
    // But it's also used for byId.
    // Let's just return fetchAllTasks and let Dashboard call it.
    
    // Actually Dashboard expects { tasks } immediately.
    // I entered code: const { tasks, isLoading } = useLeadTasks();
    // So I should start fetch in useEffect inside hook? 
    // Or simpler: Dashboard calls useEffect(() => { fetchAllTasks() }, [])
    
    // I'll add useEffect to fetch all tasks if no arguments provided? No, keep it simple.
    // I'll update Dashboard to call fetchAllTasks.

    const cancelTask = async (taskId: string, leadId?: string) => {
        try {
            const response = await divineSquareService.cancelTask(taskId);
            if (response.status === 200) {
                // Refresh tasks
                if (leadId) getTaskByID(leadId);
                fetchAllTasks();
                return true;
            }
            return false;
        } catch (error) {
            console.error("Cancel task error:", error);
            return false;
        }
    };

    return {
        getTaskByID,
        fetchAllTasks,
        cancelTask,
        tasks,
        isLoading: tasksLoading, // mapped to isLoading
        tasksLoading
    };
};

export default useLeadTasks;



