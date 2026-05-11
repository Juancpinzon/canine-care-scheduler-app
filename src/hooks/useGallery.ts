import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { GalleryPhoto } from '@/types'
import { toast } from 'sonner'

export function useGalleryPhotos(includeHidden = false) {
  return useQuery({
    queryKey: ['gallery', includeHidden],
    queryFn: async (): Promise<GalleryPhoto[]> => {
      let query = supabase
        .from('gallery_photos')
        .select('*')
        .order('sort_order', { ascending: true })
      
      if (!includeHidden) {
        query = query.eq('is_visible', true)
      }
      
      const { data, error } = await query
      if (error) throw error
      return data as GalleryPhoto[]
    },
  })
}

export function useUploadPhoto() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ file, caption }: { file: File, caption?: string }) => {
      // 1. Validar límite de 50 fotos
      const { count } = await supabase
        .from('gallery_photos')
        .select('*', { count: 'exact', head: true })
      
      if (count && count >= 50) {
        throw new Error('Límite de 50 fotos alcanzado. Elimina alguna antes de subir más.')
      }

      // 2. Comprimir si es necesario (> 2MB) - La compresión se hace en el componente antes de llamar a esto
      // Pero por seguridad validamos tamaño
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('La imagen es demasiado grande (máx 5MB)')
      }

      // 3. Subir a Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`
      const filePath = `photos/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('gallery')
        .getPublicUrl(filePath)

      // 4. Obtener el siguiente sort_order
      const { data: maxSort } = await supabase
        .from('gallery_photos')
        .select('sort_order')
        .order('sort_order', { ascending: false })
        .limit(1)
      
      const nextSort = (maxSort?.[0]?.sort_order ?? 0) + 1

      // 5. Registrar en DB
      const { data, error: dbError } = await supabase
        .from('gallery_photos')
        .insert({
          photo_url: publicUrl,
          caption,
          sort_order: nextSort,
          is_visible: true
        })
        .select()
        .single()

      if (dbError) throw dbError
      return data as GalleryPhoto
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] })
      toast.success('Foto subida correctamente')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al subir la foto')
    }
  })
}

export function useUpdatePhoto() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<GalleryPhoto> & { id: string }) => {
      const { data, error } = await supabase
        .from('gallery_photos')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data as GalleryPhoto
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] })
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al actualizar la foto')
    }
  })
}

export function useDeletePhoto() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (photo: GalleryPhoto) => {
      // 1. Eliminar de Storage
      const path = photo.photo_url.split('/').pop()
      if (path) {
        await supabase.storage
          .from('gallery')
          .remove([`photos/${path}`])
      }

      // 2. Eliminar de DB
      const { error } = await supabase
        .from('gallery_photos')
        .delete()
        .eq('id', photo.id)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] })
      toast.success('Foto eliminada')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al eliminar la foto')
    }
  })
}

export function useReorderPhotos() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (photos: { id: string, sort_order: number }[]) => {
      // Usamos un loop ya que Supabase no tiene upsert por bulk sort_order fácilmente sin RPC
      // Pero para < 50 items está bien
      const promises = photos.map(p => 
        supabase
          .from('gallery_photos')
          .update({ sort_order: p.sort_order })
          .eq('id', p.id)
      )
      
      const results = await Promise.all(promises)
      const error = results.find(r => r.error)?.error
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] })
    },
    onError: (error: any) => {
      toast.error(error.message || 'Error al reordenar')
    }
  })
}
