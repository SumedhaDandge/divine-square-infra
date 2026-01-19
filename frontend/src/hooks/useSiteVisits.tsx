import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export type SiteVisitStatus = "scheduled" | "completed" | "cancelled" | "no_show";

export interface SiteVisit {
  id: string;
  lead_id: string;
  project_id: string;
  scheduled_date: string;
  scheduled_time: string;
  status: SiteVisitStatus;
  pickup_location: string | null;
  notes: string | null;
  feedback_rating: number | null;
  feedback_notes: string | null;
  feedback_interest_level: string | null;
  conducted_by: string;
  created_at: string;
  updated_at: string;
  leads?: { id: string; name: string; phone: string } | null;
  projects?: { id: string; name: string; location: string } | null;
}

export interface CreateSiteVisitData {
  lead_id: string;
  project_id: string;
  scheduled_date: string;
  scheduled_time: string;
  pickup_location?: string;
  notes?: string;
}

export interface SiteVisitFeedback {
  feedback_rating: number;
  feedback_notes: string;
  feedback_interest_level: string;
}

export function useSiteVisits() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["site-visits"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_visits")
        .select(`
          *,
          leads:lead_id (id, name, phone),
          projects:project_id (id, name, location)
        `)
        .order("scheduled_date", { ascending: true });

      if (error) throw error;
      return data as SiteVisit[];
    },
    enabled: !!user,
  });
}

export function useLeadSiteVisits(leadId: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["site-visits", "lead", leadId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_visits")
        .select(`
          *,
          projects:project_id (id, name, location)
        `)
        .eq("lead_id", leadId)
        .order("scheduled_date", { ascending: false });

      if (error) throw error;
      return data as SiteVisit[];
    },
    enabled: !!user && !!leadId,
  });
}

export function useCreateSiteVisit() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: CreateSiteVisitData) => {
      if (!user) throw new Error("Not authenticated");

      const { data: visit, error } = await supabase
        .from("site_visits")
        .insert({
          ...data,
          conducted_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return visit;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-visits"] });
      toast.success("Site visit scheduled successfully!");
    },
    onError: (error) => {
      toast.error("Failed to schedule site visit: " + error.message);
    },
  });
}

export function useUpdateSiteVisit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<SiteVisit> & { id: string }) => {
      const { data: visit, error } = await supabase
        .from("site_visits")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return visit;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-visits"] });
      toast.success("Site visit updated successfully!");
    },
    onError: (error) => {
      toast.error("Failed to update site visit: " + error.message);
    },
  });
}

export function useSubmitFeedback() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...feedback }: SiteVisitFeedback & { id: string }) => {
      const { data: visit, error } = await supabase
        .from("site_visits")
        .update({
          ...feedback,
          status: "completed" as SiteVisitStatus,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return visit;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-visits"] });
      toast.success("Feedback submitted successfully!");
    },
    onError: (error) => {
      toast.error("Failed to submit feedback: " + error.message);
    },
  });
}
