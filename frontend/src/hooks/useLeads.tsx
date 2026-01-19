import { useDataContext } from "@/contex/DataContext";
import { divineSquareService } from "@/services/DivineInfraService";
import { useState } from "react";

const useLeads = () => {
  const { setLeads } = useDataContext();
  const [isLoading, setIsLoading] = useState(false);

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      // Replace with actual API call
      const response = await divineSquareService.listLeads();
      console.log("Leads response:", response);
      if (response.status === 200) {
        setLeads(response.data);
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    fetchLeads,
    isLoading,
  };
};

export default useLeads;
