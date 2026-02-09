
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { divineSquareService } from "@/services/DivineInfraService";
import { toast } from "sonner";

export interface CreateSiteVisitData {
  lead_id: string;
  project_id: string; 
  projectName?: string;
  scheduled_date: string;
  scheduled_time: string;
  pickup_location?: string;
  notes?: string;
}

export interface SiteVisitFeedbackData {
    id: string; // Task ID
    feedback: {
        rating?: number;
        interestLevel: string;
        notes?: string;
        images?: string[];
        layoutsVisited?: string[];
        attendeeCount?: number;
        revisitDate?: string;
        objections?: string[];
    }
}

export function useCreateSiteVisit() {
  const queryClient = useQueryClient();
  const userData = sessionStorage.getItem("auth_user");
  const userId = userData ? JSON.parse(userData) : {};

  return useMutation({
    mutationFn: async (data: CreateSiteVisitData) => {
        const assignedTo = userId.id || userId._id;
        if (!assignedTo) {
            throw new Error("User session invalid. Please login again.");
        }

        // Construct remark
        let remark = `Site Visit`;
        if (data.projectName) remark += ` - ${data.projectName}`;
        if (data.notes) remark += ` - Notes: ${data.notes}`;

        const payload = {
            lead: data.lead_id,
            project: data.project_id, // Added project link
            taskType: "site_visit",
            remark: remark,
            taskDate: new Date(data.scheduled_date),
            taskTime: data.scheduled_time,
            pickupLocation: data.pickup_location, // Added separate field
            assignedTo: assignedTo
        };

        const response = await divineSquareService.createLeadTask(payload);
        if (response.status === 201) return response.data;
        throw new Error(response.message || "Failed to schedule site visit");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-visits"] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] }); 
      toast.success("Site visit scheduled successfully!");
    },
    onError: (error) => {
      toast.error("Failed to schedule site visit: " + error.message);
    },
  });
}

export function useRescheduleSiteVisit() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: { id: string; date: Date; time: string; location?: string; reason: string }) => {
             const payload = {
                 rescheduleReason: data.reason,
                 taskDate: data.date,
                 taskTime: data.time,
                 pickupLocation: data.location
             };
             const response = await divineSquareService.updateLeadTask(data.id, payload);
             if (response.status === 200) return response.data;
             throw new Error(response.message || "Failed to reschedule");
        },
        onSuccess: () => {
             queryClient.invalidateQueries({ queryKey: ["site-visits"] });
             queryClient.invalidateQueries({ queryKey: ["tasks"] });
             toast.success("Site visit rescheduled successfully!");
        },
        onError: (err) => toast.error("Failed to reschedule: " + err.message)
    });
}

export function useSubmitFeedback() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: SiteVisitFeedbackData) => {
            const payload = {
                feedback: data.feedback,
                status: "completed", // Mark as completed when feedback is submitted
                completedAt: new Date(),
            };
            const response = await divineSquareService.updateLeadTask(data.id, payload);
            if (response.status === 200) return response.data;
            throw new Error(response.message || "Failed to submit feedback"); 
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["site-visits"] });
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
            toast.success("Feedback submitted successfully!");
        },
        onError: (error) => {
             toast.error("Failed to submit feedback: " + error.message);
        }
    })
}

export function useUploadImages() {
    return useMutation({
        mutationFn: async (files: File[]) => {
            const formData = new FormData();
            files.forEach(file => formData.append("files", file));
            
            const response = await divineSquareService.uploadMedia(formData);
            if (response.success || response.status === 200) {
                 return response.data; // Array of URLs
            }
            throw new Error(response.message || "Upload failed");
        },
        onError: (err) => toast.error("Upload failed: " + err.message)
    });
}

export function useSiteVisits() {
    const userId = JSON.parse(sessionStorage.getItem("auth_user") || "{}");
    
    return useQuery({
        queryKey: ["site-visits"],
        queryFn: async () => {
             // Fetch all tasks of type site_visit
             // We pass 'mine=true' if we only want to see user's visits, or remove it for admin to see all.
             // Assuming user wants to see their scheduled visits.
             const response = await divineSquareService.listAllTasks({ 
                 taskType: "site_visit",
                 // mine: "true" // Optional: filter by user
             });
             // response is the data array directly from listAllTasksService in controller (line 61 in controller returns result directly if using service, wait.
             // Controller line 61: return successResponse(res, 200, "Tasks fetched", result);
             // Services usually return { statusCode, data } or just data.
             // listAllTasksService returns `tasks` array.
             // Controller wraps it in `successResponse` -> { status, message, data }.
             // Api._get returns response.data (axios).
             // So we likely get { status: 200, message: "...", data: [...] }
             
             if(response.statusCode === 200 || response.status === 200) {
                 return response.data;
             }
             return [];
        }
    });
}
