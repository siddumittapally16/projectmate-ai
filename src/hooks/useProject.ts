import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useProject(id: string) {
  return useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("projects").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useTasks(projectId: string) {
  return useQuery({
    queryKey: ["tasks", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("project_id", projectId)
        .order("order_index");
      if (error) throw error;
      return data;
    },
  });
}

export function useFeatures(projectId: string) {
  return useQuery({
    queryKey: ["features", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_features")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at");
      if (error) throw error;
      return data;
    },
  });
}

export function usePhases(projectId: string) {
  return useQuery({
    queryKey: ["phases", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("roadmap_phases")
        .select("*")
        .eq("project_id", projectId)
        .order("order_index");
      if (error) throw error;
      return data;
    },
  });
}
