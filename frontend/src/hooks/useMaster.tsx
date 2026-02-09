
import { useDataContext } from "@/contex/DataContext";
import { divineSquareService } from "@/services/DivineInfraService";
import { toast } from "sonner";


export const useMaster = () => {
  const { setAmmeneities, setNearbyDevelopments , setLeadSources } = useDataContext();


  const fetchAmmeneities = async () => {
      try {
        const response = await divineSquareService.listAmmeneities();
        if (response.status === 200) {
        setAmmeneities(response?.data);
        } else {
            toast.error("Failed to fetch ammenities.");
        }
      } catch (error) {
        console.error("Error fetching ammenities:", error);
        toast.error("Failed to fetch ammenities.");
      } 
  };

  const fetchNearByDevelopments = async () => {
       try {
        const response = await divineSquareService.listNearByDevelopments();
        if (response.status === 200) {
        setNearbyDevelopments(response?.data);
        } else {
          toast.error("Failed to fetch nearby developments.");
        }
      } catch (error) {
        console.error("Error fetching nearby developments:", error);
        toast.error("Failed to fetch nearby developments.");
      }
  };

  const fetchLeadSources = async () => {
    try {
      const response = await divineSquareService.listLeadSources();
      if (response.status === 200) {
        setLeadSources(response?.data);
      } else {
        toast.error("Failed to fetch lead sources.");
      }
    } catch (error) {
      console.error("Error fetching lead sources:", error);
      toast.error("Failed to fetch lead sources.");
    }
  };

  return { fetchAmmeneities, fetchNearByDevelopments, fetchLeadSources };
};

export default { useMaster };