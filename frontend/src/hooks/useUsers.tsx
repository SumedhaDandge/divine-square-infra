import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { divineSquareService } from "@/services/DivineInfraService";
import { toast } from "sonner";

export const useUsers = () => {
    const queryClient = useQueryClient();

    const { data, isLoading, error } = useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const res = await divineSquareService.listUsers();
            return res.data;
        },
        staleTime: 5 * 60 * 1000,
    });

    const createUser = useMutation({
        mutationFn: async (userData: any) => {
            return await divineSquareService.createUser(userData);
        },
        onSuccess: (data: any) => {
             if(data.status === 201) {
                 toast.success("User created successfully");
                 queryClient.invalidateQueries({ queryKey: ["users"] });
             } else {
                 toast.error(data.message || "Failed to create user");
             }
        },
        onError: (error: any) => {
             toast.error(error.message || "Failed to create user");
        }
    });

    return {
        users: data || [],
        isLoading,
        error,
        createUser,
        fetchUsers: () => queryClient.invalidateQueries({ queryKey: ["users"] })
    };
};
