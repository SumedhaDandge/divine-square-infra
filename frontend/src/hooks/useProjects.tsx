import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";
import { divineSquareService } from "@/services/DivineInfraService";
import { useState } from "react";
import { useDataContext } from "@/contex/DataContext";



export const useProjects = () => {
  const { setProjects } = useDataContext();
  const [isLoading, setIsLoading] = useState(false);

  const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const response = await divineSquareService.listProjects();
        if (response.status === 200) {
        setProjects(response.data);
        } else {
          toast.error("Failed to fetch projects.");
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        toast.error("Failed to fetch projects.");
      } finally {
        setIsLoading(false);
      }
  };

  const createProject = async (project: any) => {
    // implement later
  };

  return { isLoading ,fetchProjects, createProject };
};

export default { useProjects };