
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { divineSquareService } from "@/services/DivineInfraService";
import { toast } from "sonner";

export interface CreateSiteVisitData {
  lead_id: string;
  project_id: string; // We'll put this in remark
  scheduled_date: string;
  scheduled_time: string;
  pickup_location?: string;
  notes?: string;
}

export function useCreateSiteVisit() {
  const queryClient = useQueryClient();
  const userId = JSON.parse(sessionStorage.getItem("auth_user") || "{}");

  return useMutation({
    mutationFn: async (data: CreateSiteVisitData) => {
        // Construct remark
        let remark = `Site Visit`;
        if (data.notes) remark += ` - Notes: ${data.notes}`;
        if (data.pickup_location) remark += ` - Pickup: ${data.pickup_location}`;
        // Note: Project Name isn't passed here, only ID. We might need to fetch project name or just assume user knows.
        // Ideally we should pass project name but keeping it simple.

        const payload = {
            lead: data.lead_id,
            taskType: "site_visit",
            remark: remark,
            taskDate: new Date(data.scheduled_date),
            taskTime: data.scheduled_time,
            assignedTo: userId.id
        };

        const response = await divineSquareService.createLeadTask(payload);
        if (response.status === 201) return response.data;
        throw new Error(response.message || "Failed to schedule site visit");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-visits"] }); // Also invalidate tasks?
      queryClient.invalidateQueries({ queryKey: ["tasks"] }); 
      toast.success("Site visit scheduled successfully!");
    },
    onError: (error) => {
      toast.error("Failed to schedule site visit: " + error.message);
    },
  });
}

// Other hooks are placeholders for now as we use generic Task list
export function useSiteVisits() {
    return { data: [], isLoading: false };
}
