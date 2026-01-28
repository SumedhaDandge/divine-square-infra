
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { divineSquareService } from "@/services/DivineInfraService";
import { toast } from "sonner";
import { useDataContext } from "@/contex/DataContext";

export interface Quotation {
  _id: string;
  lead: string;
  customerName: string;
  projectName: string;
  plotNo: string;
  area: number;
  rate: number;
  basicCost: number;
  downPayment: number;
  balanceAmount: number;
  registryAmount: number;
  stampDuty: number;
  miscellaneous: number;
  finalTotalAmount: number;
  pdfPath: string;
  createdAt: string;
  createdBy: string;
}

export interface CreateQuotationData {
  lead: string;
  projectName?: string;
  plotNo: string;
  area: number;
  rate: number;
  downPayment?: number;
  registryAmount?: number;
  stampDuty?: number;
  miscellaneous?: number;
}

export function useLeadQuotations(leadId: string) {
  return useQuery({
    queryKey: ["quotations", "lead", leadId],
    queryFn: async () => {
      if (!leadId) return [];
      const response = await divineSquareService.listQuotations(leadId);
      // Assuming response.data is the array
      return response as Quotation[];
    },
    enabled: !!leadId,
  });
}

export function useCreateQuotation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateQuotationData) => {
      const response = await divineSquareService.createQuotation(data);
      if (response.status === 201 || response.statusCode === 201) return response.data;
      throw new Error(response.message || "Failed to create quotation");
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["quotations", "lead", variables.lead] });
      toast.success("Quotation created successfully!");
    },
    onError: (error) => {
      toast.error("Failed to create quotation: " + error.message);
    },
  });
}
