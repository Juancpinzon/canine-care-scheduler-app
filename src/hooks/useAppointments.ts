import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Appointment, AppointmentStatus, AppointmentWithRelations } from '@/types'

interface AppointmentFilters {
  date?: string
  status?: AppointmentStatus
  clientId?: string
}

export function useAppointments(filters?: AppointmentFilters) {
  return useQuery({
    queryKey: ['appointments', filters],
    queryFn: async (): Promise<AppointmentWithRelations[]> => {
      let query = supabase
        .from('appointments')
        .select(`
          *,
          dog:dogs(name, breed, size),
          client:profiles(full_name, phone),
          service:services(name, duration_minutes)
        `)
        .order('scheduled_date', { ascending: true })
        .order('scheduled_time', { ascending: true })

      if (filters?.date) query = query.eq('scheduled_date', filters.date)
      if (filters?.status) query = query.eq('status', filters.status)
      if (filters?.clientId) query = query.eq('client_id', filters.clientId)

      const { data, error } = await query
      if (error) throw error
      return data as AppointmentWithRelations[]
    },
  })
}

export function useAppointment(id: string) {
  return useQuery({
    queryKey: ['appointments', id],
    queryFn: async (): Promise<AppointmentWithRelations> => {
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          dog:dogs(name, breed, size),
          client:profiles(full_name, phone),
          service:services(name, duration_minutes)
        `)
        .eq('id', id)
        .single()
      if (error) throw error
      return data as AppointmentWithRelations
    },
    enabled: !!id,
  })
}

export function useCreateAppointment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: {
      client_id: string
      dog_id: string
      service_id: string
      scheduled_date: string
      scheduled_time: string
      duration_minutes: number
      price_charged_usd: number
      notes_client?: string
      notes_admin?: string
    }): Promise<Appointment> => {
      const { data, error } = await supabase
        .from('appointments')
        .insert(payload)
        .select()
        .single()
      if (error) throw error
      return data as Appointment
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
    },
  })
}

export function useUpdateAppointmentStatus() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      status,
      reason,
      changedBy,
    }: {
      id: string
      status: AppointmentStatus
      reason?: string
      changedBy: string
    }) => {
      const { data: current, error: fetchError } = await supabase
        .from('appointments')
        .select('status')
        .eq('id', id)
        .single()
      if (fetchError) throw fetchError

      const { error: updateError } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', id)
      if (updateError) throw updateError

      await supabase.from('appointment_status_history').insert({
        appointment_id: id,
        old_status: current.status,
        new_status: status,
        changed_by: changedBy,
        reason: reason ?? null,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
    },
  })
}

export function useUpdateAppointmentNotes() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      notes_admin,
      groomer_notes,
    }: {
      id: string
      notes_admin?: string
      groomer_notes?: string
    }) => {
      const { error } = await supabase
        .from('appointments')
        .update({ notes_admin, groomer_notes })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] })
    },
  })
}
