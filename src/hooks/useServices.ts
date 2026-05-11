import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Service } from '@/types'

export function useServices(includeInactive = false) {
  return useQuery({
    queryKey: ['services', includeInactive],
    queryFn: async (): Promise<Service[]> => {
      let query = supabase
        .from('services')
        .select('*')
        .order('sort_order')
      
      if (!includeInactive) {
        query = query.eq('is_active', true)
      }
      
      const { data, error } = await query
      if (error) throw error
      return data as Service[]
    },
  })
}

export function useService(id: string) {
  return useQuery({
    queryKey: ['services', id],
    queryFn: async (): Promise<Service> => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', id)
        .single()
      if (error) throw error
      return data as Service
    },
    enabled: !!id,
  })
}

export function useCreateService() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (service: Omit<Service, 'id' | 'created_at' | 'sort_order'>) => {
      const { data: maxSort, error: maxError } = await supabase
        .from('services')
        .select('sort_order')
        .order('sort_order', { ascending: false })
        .limit(1)
      
      if (maxError) throw maxError
      
      const nextSort = (maxSort?.[0]?.sort_order ?? 0) + 1
      
      const { data, error } = await supabase
        .from('services')
        .insert({ ...service, sort_order: nextSort })
        .select()
        .single()
        
      if (error) throw error
      return data as Service
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] })
    },
  })
}

export function useUpdateService() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Service> & { id: string }) => {
      const { data, error } = await supabase
        .from('services')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data as Service
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['services'] })
      queryClient.invalidateQueries({ queryKey: ['services', variables.id] })
    },
  })
}

export function useDeleteService() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { count, error: countError } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('service_id', id)
      
      if (countError) throw countError
      
      if (count && count > 0) {
        throw new Error('Este servicio tiene citas registradas. Desactívalo en lugar de borrarlo.')
      }

      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] })
    },
  })
}
