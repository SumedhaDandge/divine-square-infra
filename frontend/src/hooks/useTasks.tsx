import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export type TaskType = "call" | "whatsapp" | "site_visit" | "reminder" | "email" | "meeting";

export interface Task {
  id: string;
  lead_id: string;
  type: TaskType;
  title: string;
  description: string | null;
  due_date: string;
  completed: boolean;
  completed_at: string | null;
  assigned_to: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  leads?: { id: string; name: string; phone: string } | null;
}

export interface CreateTaskData {
  lead_id: string;
  type: TaskType;
  title: string;
  description?: string;
  due_date: string;
}

export function useTasks() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select(`
          *,
          leads:lead_id (id, name, phone)
        `)
        .order("due_date", { ascending: true });

      if (error) throw error;
      return data as Task[];
    },
    enabled: !!user,
  });
}

export function useLeadTasks(leadId: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["tasks", "lead", leadId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("lead_id", leadId)
        .order("due_date", { ascending: false });

      if (error) throw error;
      return data as Task[];
    },
    enabled: !!user && !!leadId,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: CreateTaskData) => {
      if (!user) throw new Error("Not authenticated");

      const { data: task, error } = await supabase
        .from("tasks")
        .insert({
          ...data,
          created_by: user.id,
          assigned_to: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return task;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task created successfully!");
    },
    onError: (error) => {
      toast.error("Failed to create task: " + error.message);
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Task> & { id: string }) => {
      const { data: task, error } = await supabase
        .from("tasks")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return task;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task updated successfully!");
    },
    onError: (error) => {
      toast.error("Failed to update task: " + error.message);
    },
  });
}

export function useCompleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data: task, error } = await supabase
        .from("tasks")
        .update({
          completed: true,
          completed_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return task;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task completed!");
    },
    onError: (error) => {
      toast.error("Failed to complete task: " + error.message);
    },
  });
}
