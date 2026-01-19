import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export interface Quotation {
  id: string;
  lead_id: string;
  plot_id: string;
  base_price: number;
  discount_percentage: number;
  discount_amount: number;
  final_price: number;
  valid_until: string;
  terms: string | null;
  status: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  leads?: { id: string; name: string; phone: string } | null;
  plots?: { 
    id: string; 
    plot_number: string; 
    area_sqft: number;
    layouts: { id: string; name: string; project_id: string; projects: { id: string; name: string } } 
  } | null;
}

export interface CreateQuotationData {
  lead_id: string;
  plot_id: string;
  base_price: number;
  discount_percentage?: number;
  discount_amount?: number;
  final_price: number;
  valid_until: string;
  terms?: string;
}

export function useQuotations() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["quotations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quotations")
        .select(`
          *,
          leads:lead_id (id, name, phone),
          plots:plot_id (
            id, 
            plot_number, 
            area_sqft,
            layouts:layout_id (
              id,
              name,
              project_id,
              projects:project_id (id, name)
            )
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Quotation[];
    },
    enabled: !!user,
  });
}

export function useLeadQuotations(leadId: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["quotations", "lead", leadId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quotations")
        .select(`
          *,
          plots:plot_id (
            id, 
            plot_number, 
            area_sqft,
            layouts:layout_id (
              id,
              name,
              project_id,
              projects:project_id (id, name)
            )
          )
        `)
        .eq("lead_id", leadId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Quotation[];
    },
    enabled: !!user && !!leadId,
  });
}

export function useCreateQuotation() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: CreateQuotationData) => {
      if (!user) throw new Error("Not authenticated");

      const { data: quotation, error } = await supabase
        .from("quotations")
        .insert({
          ...data,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return quotation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotations"] });
      toast.success("Quotation created successfully!");
    },
    onError: (error) => {
      toast.error("Failed to create quotation: " + error.message);
    },
  });
}

export function useUpdateQuotation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Quotation> & { id: string }) => {
      const { data: quotation, error } = await supabase
        .from("quotations")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return quotation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quotations"] });
      toast.success("Quotation updated successfully!");
    },
    onError: (error) => {
      toast.error("Failed to update quotation: " + error.message);
    },
  });
}
