import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Profile } from '@/types'

export function useSearchClients(search: string) {
  return useQuery({
    queryKey: ['clients', 'search', search],
    queryFn: async (): Promise<Profile[]> => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'client')
        .or(`full_name.ilike.%${search}%,phone.ilike.%${search}%`)
        .order('full_name')
        .limit(10)
      if (error) throw error
      return (data ?? []) as Profile[]
    },
    enabled: search.trim().length >= 2,
  })
}

export function useClients() {
  return useQuery({
    queryKey: ['clients'],
    queryFn: async (): Promise<Profile[]> => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'client')
        .order('full_name')
      if (error) throw error
      return (data ?? []) as Profile[]
    },
  })
}
