import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Dog } from '@/types'

export function useDogs(ownerId?: string) {
  return useQuery({
    queryKey: ['dogs', ownerId],
    queryFn: async (): Promise<Dog[]> => {
      let query = supabase
        .from('dogs')
        .select('*')
        .eq('is_active', true)
        .order('name')
      if (ownerId) query = query.eq('owner_id', ownerId)
      const { data, error } = await query
      if (error) throw error
      return data as Dog[]
    },
  })
}

export function useDog(id: string) {
  return useQuery({
    queryKey: ['dogs', id],
    queryFn: async (): Promise<Dog> => {
      const { data, error } = await supabase
        .from('dogs')
        .select('*')
        .eq('id', id)
        .single()
      if (error) throw error
      return data as Dog
    },
    enabled: !!id,
  })
}

type CreateDogPayload = Omit<Dog, 'id' | 'created_at' | 'updated_at'>

export function useCreateDog() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: CreateDogPayload): Promise<Dog> => {
      const { data, error } = await supabase
        .from('dogs')
        .insert(payload)
        .select()
        .single()
      if (error) throw error
      return data as Dog
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['dogs', variables.owner_id] })
      queryClient.invalidateQueries({ queryKey: ['dogs', undefined] })
    },
  })
}

export function useUpdateDog() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Dog> & { id: string }): Promise<Dog> => {
      const { data, error } = await supabase
        .from('dogs')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data as Dog
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dogs'] })
    },
  })
}

export function useDeactivateDog() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('dogs')
        .update({ is_active: false })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dogs'] })
    },
  })
}
