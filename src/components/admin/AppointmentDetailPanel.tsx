import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { useUpdateAppointmentPhotos, useUpdateAppointmentNotes } from '@/hooks/useAppointments'
import type { AppointmentWithRelations } from '@/types'

const C = {
  gold: '#C9A84C',
  goldSubtle: 'rgba(201,168,76,0.08)',
  goldBorder: 'rgba(201,168,76,0.12)',
  text: '#F0EDE8',
  textMuted: 'rgba(240,237,232,0.38)',
  textSubtle: 'rgba(240,237,232,0.22)',
  subtleBorder: 'rgba(255,255,255,0.07)',
}

// ─── Photo upload zone ────────────────────────────────────────────────────────
function PhotoZone({
  appointmentId,
  type,
  url,
}: {
  appointmentId: string
  type: 'before' | 'after'
  url: string | null | undefined
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const uploadPhoto = useUpdateAppointmentPhotos()
  const [localUrl, setLocalUrl] = useState<string | null>(null)
  const displayUrl = localUrl ?? url
  const isUploading = uploadPhoto.isPending
  const label = type === 'before' ? 'Antes' : 'Después'

  async function handleFile(file: File) {
    const preview = URL.createObjectURL(file)
    setLocalUrl(preview)
    try {
      const finalUrl = await uploadPhoto.mutateAsync({ appointmentId, type, file })
      URL.revokeObjectURL(preview)
      setLocalUrl(finalUrl)
      toast.success(`Foto "${label.toLowerCase()}" subida correctamente`)
    } catch {
      URL.revokeObjectURL(preview)
      setLocalUrl(null)
      toast.error('Error al subir la foto. Intenta de nuevo.')
    }
  }

  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      {/* Label */}
      <div
        style={{
          color: C.textSubtle,
          fontSize: 10,
          letterSpacing: 1.5,
          textTransform: 'uppercase',
          marginBottom: 8,
          textAlign: 'center',
        }}
      >
        {label}
      </div>

      {/* Photo zone — clickable on all devices */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => !isUploading && inputRef.current?.click()}
        onKeyDown={e => e.key === 'Enter' && !isUploading && inputRef.current?.click()}
        style={{
          background: C.goldSubtle,
          border: `1.5px dashed ${displayUrl ? 'transparent' : C.goldBorder}`,
          borderRadius: 10,
          aspectRatio: '4/3',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: isUploading ? 'wait' : 'pointer',
          overflow: 'hidden',
          position: 'relative',
          outline: 'none',
        }}
      >
        {displayUrl ? (
          <img
            src={displayUrl}
            alt={`Foto ${label.toLowerCase()}`}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <>
            <svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke={C.gold}
              strokeWidth="1.5"
              opacity="0.5"
            >
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
            <span style={{ color: C.textSubtle, fontSize: 11, marginTop: 10, textAlign: 'center', padding: '0 8px' }}>
              Sin foto
            </span>
          </>
        )}

        {/* Uploading overlay */}
        {isUploading && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(8,8,8,0.75)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
            }}
          >
            <div
              style={{
                width: 28,
                height: 28,
                border: `2.5px solid ${C.goldBorder}`,
                borderTopColor: C.gold,
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }}
            />
            <span style={{ color: C.gold, fontSize: 12 }}>Subiendo...</span>
          </div>
        )}

        {/* Change hint overlay when photo exists */}
        {displayUrl && !isUploading && (
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              background: 'rgba(8,8,8,0.6)',
              padding: '5px 0',
              textAlign: 'center',
            }}
          >
            <span style={{ color: C.textMuted, fontSize: 10 }}>📷 Cambiar</span>
          </div>
        )}
      </div>

      {/* Mobile-friendly large button */}
      <button
        onClick={() => !isUploading && inputRef.current?.click()}
        disabled={isUploading}
        style={{
          display: 'block',
          width: '100%',
          marginTop: 8,
          background: 'transparent',
          border: `1px solid ${C.goldBorder}`,
          borderRadius: 8,
          padding: '0 8px',
          color: isUploading ? C.textSubtle : C.textMuted,
          fontSize: 12,
          cursor: isUploading ? 'wait' : 'pointer',
          fontFamily: 'DM Sans, sans-serif',
          textAlign: 'center',
          height: 44,
          whiteSpace: 'nowrap',
          transition: 'border-color 0.15s',
        }}
      >
        {isUploading ? 'Subiendo...' : `📷 Subir foto ${label.toLowerCase()}`}
      </button>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={e => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
          e.target.value = ''
        }}
      />
    </div>
  )
}

// ─── Groomer notes ────────────────────────────────────────────────────────────
function GroomerNotes({ appt }: { appt: AppointmentWithRelations }) {
  const [notes, setNotes] = useState(appt.groomer_notes ?? '')
  const updateNotes = useUpdateAppointmentNotes()
  const isSaving = updateNotes.isPending

  async function handleSave() {
    try {
      await updateNotes.mutateAsync({ id: appt.id, groomer_notes: notes })
      toast.success('Notas guardadas')
    } catch {
      toast.error('No se pudieron guardar las notas')
    }
  }

  return (
    <div>
      <div
        style={{
          color: C.textSubtle,
          fontSize: 10,
          letterSpacing: 1.5,
          textTransform: 'uppercase',
          marginBottom: 8,
        }}
      >
        Notas del groomer
      </div>
      <textarea
        value={notes}
        onChange={e => setNotes(e.target.value)}
        placeholder="Comportamiento, observaciones del servicio, notas para próxima vez..."
        rows={3}
        style={{
          width: '100%',
          background: 'rgba(201,168,76,0.04)',
          border: `1px solid ${C.goldBorder}`,
          borderRadius: 8,
          padding: '10px 12px',
          color: C.text,
          fontSize: 13,
          fontFamily: 'DM Sans, sans-serif',
          resize: 'vertical',
          outline: 'none',
          boxSizing: 'border-box',
          lineHeight: 1.5,
        }}
        onFocus={e => {
          e.currentTarget.style.borderColor = 'rgba(201,168,76,0.4)'
        }}
        onBlur={e => {
          e.currentTarget.style.borderColor = C.goldBorder
        }}
      />
      <button
        onClick={handleSave}
        disabled={isSaving}
        style={{
          marginTop: 8,
          width: '100%',
          background: C.gold,
          border: 'none',
          borderRadius: 8,
          padding: '0 20px',
          color: '#080808',
          fontSize: 13,
          fontWeight: 700,
          cursor: isSaving ? 'not-allowed' : 'pointer',
          opacity: isSaving ? 0.7 : 1,
          fontFamily: 'DM Sans, sans-serif',
          height: 44,
          transition: 'opacity 0.15s',
        }}
      >
        {isSaving ? 'Guardando...' : 'Guardar notas'}
      </button>
    </div>
  )
}

// ─── Main panel ───────────────────────────────────────────────────────────────
export function AppointmentDetailPanel({ appt }: { appt: AppointmentWithRelations }) {
  return (
    <div
      style={{
        borderTop: `1px solid ${C.subtleBorder}`,
        padding: '16px 16px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        background: '#0A0A0A',
      }}
    >
      {/* Photos section */}
      <div>
        <div
          style={{
            color: C.textMuted,
            fontSize: 12,
            marginBottom: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <span>📷</span>
          <span style={{ letterSpacing: 0.3 }}>Fotos de la sesión</span>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <PhotoZone
            appointmentId={appt.id}
            type="before"
            url={appt.before_photo_url}
          />
          <PhotoZone
            appointmentId={appt.id}
            type="after"
            url={appt.after_photo_url}
          />
        </div>
      </div>

      {/* Groomer notes */}
      <GroomerNotes appt={appt} />

      {/* CSS for spinner */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
