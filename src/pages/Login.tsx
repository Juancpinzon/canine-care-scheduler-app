import { useState, useEffect, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export default function Login() {
  const { signIn, isAuthenticated, isAdmin, isLoading } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate(isAdmin ? '/admin' : '/', { replace: true })
    }
  }, [isLoading, isAuthenticated, isAdmin, navigate])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await signIn(email, password)
    } catch {
      setError('Email o contraseña incorrectos. Verifica tus datos.')
    } finally {
      setSubmitting(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: '#0C0C0C',
    border: '1px solid rgba(201,168,76,0.18)',
    borderRadius: 8,
    padding: '14px 16px',
    color: '#F0EDE8',
    fontSize: 15,
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'DM Sans, sans-serif',
    transition: 'border-color 0.2s',
  }

  return (
    <div
      style={{
        background: '#080808',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        fontFamily: 'DM Sans, sans-serif',
      }}
    >
      <div style={{ width: '100%', maxWidth: 400 }}>
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 38,
              fontWeight: 600,
              color: '#C9A84C',
              letterSpacing: 2,
              lineHeight: 1.1,
            }}
          >
            Q4 Paws
          </div>
          <div
            style={{
              color: 'rgba(240,237,232,0.38)',
              fontSize: 12,
              letterSpacing: 3,
              textTransform: 'uppercase',
              marginTop: 8,
            }}
          >
            Panel de Administración
          </div>
        </div>

        {/* Card */}
        <div
          style={{
            background: '#0C0C0C',
            border: '1px solid rgba(201,168,76,0.12)',
            borderRadius: 16,
            padding: '32px 28px',
          }}
        >
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label
                style={{
                  display: 'block',
                  color: 'rgba(240,237,232,0.5)',
                  fontSize: 11,
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                  marginBottom: 8,
                }}
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="q4pawsdg@gmail.com"
                style={inputStyle}
              />
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  color: 'rgba(240,237,232,0.5)',
                  fontSize: 11,
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                  marginBottom: 8,
                }}
              >
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                style={inputStyle}
              />
            </div>

            {error && (
              <div
                style={{
                  background: 'rgba(239,68,68,0.08)',
                  border: '1px solid rgba(239,68,68,0.2)',
                  borderRadius: 8,
                  padding: '12px 16px',
                  color: '#EF4444',
                  fontSize: 13,
                  textAlign: 'center',
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              style={{
                background: submitting ? 'rgba(201,168,76,0.5)' : '#C9A84C',
                color: '#080808',
                border: 'none',
                borderRadius: 10,
                padding: '16px',
                fontSize: 15,
                fontWeight: 600,
                cursor: submitting ? 'not-allowed' : 'pointer',
                height: 56,
                fontFamily: 'DM Sans, sans-serif',
                letterSpacing: 0.5,
                marginTop: 4,
                transition: 'background 0.2s',
              }}
            >
              {submitting ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>
        </div>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <a
            href="/"
            style={{
              color: 'rgba(240,237,232,0.3)',
              fontSize: 13,
              textDecoration: 'none',
            }}
          >
            ← Volver al inicio
          </a>
        </div>
      </div>
    </div>
  )
}
