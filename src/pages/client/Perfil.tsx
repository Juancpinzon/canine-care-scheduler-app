import { useState, useEffect, FormEvent } from 'react'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'
import ClientLayout from '@/components/client/ClientLayout'
import type { PreferredLanguage } from '@/types'

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: '#0A0A0A',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8,
  padding: '13px 14px',
  color: '#F0EDE8',
  fontSize: 14,
  outline: 'none',
  fontFamily: 'DM Sans, sans-serif',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 10,
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  color: 'rgba(240,237,232,0.4)',
  marginBottom: 6,
}

export default function Perfil() {
  const { profile, updateProfile } = useAuth()
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [language, setLanguage] = useState<PreferredLanguage>('es')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name ?? '')
      setPhone(profile.phone ?? '')
      setLanguage(profile.preferred_language ?? 'es')
    }
  }, [profile])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      await updateProfile({
        full_name: fullName.trim() || null,
        phone: phone.trim() || null,
        preferred_language: language,
      })
      toast.success('Perfil actualizado')
    } catch {
      toast.error('No se pudo guardar. Intenta de nuevo.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <ClientLayout>
      <div style={{ maxWidth: 480 }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 34, fontWeight: 400, color: '#F0EDE8', marginBottom: 8 }}>
          Mi perfil
        </h1>
        <p style={{ fontSize: 13, color: 'rgba(240,237,232,0.4)', marginBottom: 40 }}>
          Actualiza tus datos de contacto.
        </p>

        <div
          style={{
            background: '#0C0C0C',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 14,
            padding: '28px 24px',
          }}
        >
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={labelStyle}>Nombre completo</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Tu nombre"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Teléfono</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 321-000-0000"
                type="tel"
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Idioma preferido</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as PreferredLanguage)}
                style={{ ...inputStyle, appearance: 'none' }}
              >
                <option value="es">Español</option>
                <option value="en">English</option>
              </select>
            </div>

            <div
              style={{
                padding: '16px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 8,
              }}
            >
              <div style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(240,237,232,0.3)', marginBottom: 6 }}>
                Email (no editable)
              </div>
              <div style={{ fontSize: 14, color: 'rgba(240,237,232,0.5)' }}>
                {profile?.id ? '—' : '—'}
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              style={{
                background: saving ? 'rgba(201,168,76,0.5)' : '#C9A84C',
                color: '#080808',
                border: 'none',
                borderRadius: 10,
                padding: '16px',
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: saving ? 'not-allowed' : 'pointer',
                minHeight: 56,
                transition: 'background 0.2s',
                marginTop: 4,
                fontFamily: 'DM Sans, sans-serif',
              }}
            >
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </form>
        </div>
      </div>
    </ClientLayout>
  )
}
