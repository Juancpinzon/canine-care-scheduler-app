import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import {
  Image as ImageIcon,
  Upload,
  Trash2,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  Loader2,
  Plus
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import {
  useGalleryPhotos,
  useUploadPhoto,
  useDeletePhoto,
  useUpdatePhoto,
  useReorderPhotos
} from '@/hooks/useGallery'
import type { GalleryPhoto } from '@/types'

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  bg: '#080808',
  surface: '#0C0C0C',
  card: '#080808',
  cardHover: '#0F0F0F',
  gold: '#C9A84C',
  goldMuted: 'rgba(201,168,76,0.35)',
  goldSubtle: 'rgba(201,168,76,0.08)',
  goldBorder: 'rgba(201,168,76,0.12)',
  subtleBorder: 'rgba(255,255,255,0.07)',
  text: '#F0EDE8',
  textMuted: 'rgba(240,237,232,0.38)',
  textSubtle: 'rgba(240,237,232,0.22)',
}

export default function AdminGaleria() {
  const navigate = useNavigate()
  const { isAdmin, isAuthenticated, isLoading: authLoading } = useAuth()
  const { data: photos = [], isLoading: loadingPhotos } = useGalleryPhotos(true)
  
  const uploadPhoto = useUploadPhoto()
  const deletePhoto = useDeletePhoto()
  const updatePhoto = useUpdatePhoto()
  const reorderPhotos = useReorderPhotos()
  
  const [isUploading, setIsUploading] = useState(false)
  const [caption, setCaption] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ─── Handlers ───────────────────────────────────────────────────────────────

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (event) => {
        const img = new Image()
        img.src = event.target?.result as string
        img.onload = () => {
          const canvas = document.createElement('canvas')
          let width = img.width
          let height = img.height

          // Max dimension 1200px
          const MAX_SIZE = 1200
          if (width > height) {
            if (width > MAX_SIZE) {
              height *= MAX_SIZE / width
              width = MAX_SIZE
            }
          } else {
            if (height > MAX_SIZE) {
              width *= MAX_SIZE / height
              height = MAX_SIZE
            }
          }

          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          ctx?.drawImage(img, 0, 0, width, height)

          canvas.toBlob((blob) => {
            if (blob) {
              resolve(new File([blob], file.name, { type: 'image/jpeg' }))
            } else {
              reject(new Error('Canvas toBlob error'))
            }
          }, 'image/jpeg', 0.8) // 80% quality
        }
      }
      reader.onerror = (error) => reject(error)
    })
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (photos.length >= 50) {
      toast.error('Límite de 50 fotos alcanzado')
      return
    }

    setIsUploading(true)
    try {
      let fileToUpload = file
      if (file.size > 2 * 1024 * 1024) {
        toast.info('Comprimiendo imagen...')
        fileToUpload = await compressImage(file)
      }

      await uploadPhoto.mutateAsync({ file: fileToUpload, caption })
      setCaption('')
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (error: any) {
      console.error(error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleToggleVisible = async (photo: GalleryPhoto) => {
    await updatePhoto.mutateAsync({ id: photo.id, is_visible: !photo.is_visible })
    toast.success(photo.is_visible ? 'Foto ocultada' : 'Foto visible')
  }

  const handleDelete = async (photo: GalleryPhoto) => {
    if (window.confirm('¿Estás segura de eliminar esta foto?')) {
      await deletePhoto.mutateAsync(photo)
    }
  }

  const movePhoto = async (index: number, direction: 'up' | 'down') => {
    const newPhotos = [...photos]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    
    if (targetIndex < 0 || targetIndex >= photos.length) return

    const temp = newPhotos[index]
    newPhotos[index] = newPhotos[targetIndex]
    newPhotos[targetIndex] = temp

    // Update sort_order for all to be safe, or just the two
    const updates = newPhotos.map((p, i) => ({ id: p.id, sort_order: i }))
    await reorderPhotos.mutateAsync(updates)
  }

  if (authLoading) return null
  if (!isAuthenticated || !isAdmin) return null

  return (
    <div style={{ background: C.bg, minHeight: '100vh', fontFamily: 'DM Sans, sans-serif', color: C.text }}>
      <header style={{ background: C.surface, borderBottom: `1px solid ${C.goldBorder}`, padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10 }}>
        <div>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 22, fontWeight: 600, color: C.gold, lineHeight: 1.1 }}>Galería</div>
          <div style={{ color: C.textSubtle, fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', marginTop: 2 }}>Gestionar fotos públicas</div>
        </div>
        <div style={{ fontSize: 13, color: C.textMuted }}>
          {photos.length}/50 fotos
        </div>
      </header>

      <main style={{ padding: '24px 16px', maxWidth: 1000, margin: '0 auto' }}>
        {/* Upload Section */}
        <section style={{ background: C.surface, border: `1px solid ${C.goldBorder}`, borderRadius: 12, padding: 24, marginBottom: 32 }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 20, marginBottom: 16, color: C.gold }}>Subir nueva foto</h2>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 280 }}>
              <label style={{ display: 'block', fontSize: 12, color: C.textMuted, marginBottom: 8 }}>Pie de foto (opcional)</label>
              <input
                type="text"
                placeholder="Ej: Golden Retriever después de su Full Groom"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                style={{ width: '100%', background: '#080808', border: `1px solid ${C.subtleBorder}`, borderRadius: 8, padding: '12px 16px', color: C.text, fontSize: 14, outline: 'none' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading || photos.length >= 50}
                style={{
                  background: C.gold,
                  color: '#080808',
                  border: 'none',
                  borderRadius: 8,
                  padding: '12px 24px',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: (isUploading || photos.length >= 50) ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  opacity: (isUploading || photos.length >= 50) ? 0.6 : 1,
                  height: 48
                }}
              >
                {isUploading ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
                {isUploading ? 'Subiendo...' : 'Seleccionar y subir'}
              </button>
            </div>
          </div>
          <p style={{ fontSize: 11, color: C.textSubtle, marginTop: 12 }}>Máximo 5MB. Se recomienda formato horizontal o cuadrado.</p>
        </section>

        {/* Photos Grid */}
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, paddingBottom: 10, borderBottom: `1px solid ${C.subtleBorder}` }}>
            <span style={{ color: C.textSubtle, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase' }}>Fotos actuales</span>
          </div>

          {loadingPhotos ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: C.textMuted }}>Cargando galería...</div>
          ) : photos.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '64px 24px', background: C.surface, borderRadius: 12, border: `1px dashed ${C.goldBorder}` }}>
              <ImageIcon size={48} style={{ color: C.goldSubtle, marginBottom: 16 }} />
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 20, color: C.textMuted }}>No hay fotos en la galería</div>
              <p style={{ fontSize: 14, color: C.textSubtle, marginTop: 8 }}>Sube tu primer trabajo para mostrarlo en la landing page.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
              {photos.map((photo, index) => (
                <div
                  key={photo.id}
                  style={{
                    background: C.surface,
                    border: `1px solid ${C.goldBorder}`,
                    borderRadius: 12,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    opacity: photo.is_visible ? 1 : 0.6
                  }}
                >
                  <div style={{ position: 'relative', paddingTop: '75%', background: '#000' }}>
                    <img
                      src={photo.photo_url}
                      alt={photo.caption || ''}
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 4 }}>
                      <button
                        onClick={() => movePhoto(index, 'up')}
                        disabled={index === 0}
                        style={{ background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: 4, padding: 4, color: '#fff', cursor: index === 0 ? 'default' : 'pointer', opacity: index === 0 ? 0.3 : 1 }}
                      >
                        <ChevronUp size={16} />
                      </button>
                      <button
                        onClick={() => movePhoto(index, 'down')}
                        disabled={index === photos.length - 1}
                        style={{ background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: 4, padding: 4, color: '#fff', cursor: index === photos.length - 1 ? 'default' : 'pointer', opacity: index === photos.length - 1 ? 0.3 : 1 }}
                      >
                        <ChevronDown size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div style={{ padding: 16, flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <p style={{ fontSize: 13, color: photo.caption ? C.text : C.textSubtle, fontStyle: photo.caption ? 'normal' : 'italic', marginBottom: 16, flex: 1 }}>
                      {photo.caption || 'Sin pie de foto'}
                    </p>
                    
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => handleToggleVisible(photo)}
                        style={{
                          flex: 1,
                          background: 'transparent',
                          border: `1px solid ${C.subtleBorder}`,
                          borderRadius: 6,
                          padding: '8px',
                          color: photo.is_visible ? C.textMuted : C.gold,
                          fontSize: 12,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 6
                        }}
                      >
                        {photo.is_visible ? <EyeOff size={14} /> : <Eye size={14} />}
                        {photo.is_visible ? 'Ocultar' : 'Mostrar'}
                      </button>
                      <button
                        onClick={() => handleDelete(photo)}
                        style={{
                          background: 'rgba(239,68,68,0.1)',
                          border: '1px solid rgba(239,68,68,0.2)',
                          borderRadius: 6,
                          padding: '8px 12px',
                          color: '#EF4444',
                          cursor: 'pointer'
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
