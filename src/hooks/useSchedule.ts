import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { BusinessSchedule, BlockedDate } from "@/types";

// ─── Business Schedule ────────────────────────────────────────────────────────

export function useBusinessSchedule() {
  return useQuery({
    queryKey: ["business_schedules"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("business_schedules")
        .select("*")
        .order("day_of_week");
      if (error) throw error;
      return data as BusinessSchedule[];
    },
  });
}

export function useUpdateSchedule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (
      payload: Pick<
        BusinessSchedule,
        | "id"
        | "is_open"
        | "open_time"
        | "close_time"
        | "max_concurrent_appointments"
      >,
    ) => {
      const { id, ...fields } = payload;
      const { error } = await supabase
        .from("business_schedules")
        .update(fields)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["business_schedules"] }),
  });
}

// ─── Blocked Dates ────────────────────────────────────────────────────────────

/** Solo trae fechas >= hoy para no llenar la lista con historial */
export function useBlockedDates() {
  return useQuery({
    queryKey: ["blocked_dates"],
    queryFn: async () => {
      const today = new Date().toISOString().split("T")[0];
      const { data, error } = await supabase
        .from("blocked_dates")
        .select("*")
        .gte("date", today)
        .order("date");
      if (error) throw error;
      // La columna `date` viene como string "YYYY-MM-DD" desde Postgres
      return data as Array<Omit<BlockedDate, "date"> & { date: string }>;
    },
  });
}

export function useAddBlockedDate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ date, reason }: { date: string; reason?: string }) => {
      const { error } = await supabase
        .from("blocked_dates")
        .insert({ date, reason: reason || null });
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["blocked_dates"] }),
  });
}

export function useRemoveBlockedDate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("blocked_dates")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["blocked_dates"] }),
  });
}
