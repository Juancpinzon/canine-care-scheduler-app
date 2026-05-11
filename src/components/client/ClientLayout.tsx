import { useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'

const NAV_ITEMS = [
  { path: '/mis-citas',  label: 'Citas',     icon: CalendarIcon },
  { path: '/mis-perros', label: 'Mis Perros', icon: PawIcon },
  { path: '/perfil',     label: 'Perfil',    icon: UserIcon },
]

function CalendarIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#C9A84C' : 'rgba(240,237,232,0.4)'} strokeWidth="1.8">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

function PawIcon({ active }: { active: boolean }) {
  const c = active ? '#C9A84C' : 'rgba(240,237,232,0.4)'
  return (
    <svg width="22" height="22" viewBox="0 0 100 100" fill={c}>
      <circle cx="28" cy="35" r="9" />
      <circle cx="50" cy="24" r="9" />
      <circle cx="72" cy="35" r="9" />
      <ellipse cx="50" cy="66" rx="22" ry="20" />
    </svg>
  )
}

function UserIcon({ active }: { active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#C9A84C' : 'rgba(240,237,232,0.4)'} strokeWidth="1.8">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

interface Props {
  children: React.ReactNode
}

export default function ClientLayout({ children }: Props) {
  const { isAuthenticated, isAdmin, isLoading, profile, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (isLoading) return
    if (!isAuthenticated) {
      navigate('/login', { replace: true })
      return
    }
    if (isAdmin) {
      navigate('/admin', { replace: true })
    }
  }, [isLoading, isAuthenticated, isAdmin, navigate])

  async function handleSignOut() {
    await signOut()
    toast.success('Sesión cerrada')
    navigate('/', { replace: true })
  }

  if (isLoading || !isAuthenticated || isAdmin) return null

  const currentPath = location.pathname

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
        * { box-sizing: border-box; }
        .q4-client-root { background: #080808; color: #F0EDE8; min-height: 100vh; font-family: 'DM Sans', sans-serif; }
        .q4-sidebar { width: 220px; min-height: 100vh; background: #0C0C0C; border-right: 1px solid rgba(255,255,255,0.07); display: flex; flex-direction: column; padding: 32px 0 24px; position: fixed; top: 0; left: 0; }
        .q4-main-desktop { margin-left: 220px; min-height: 100vh; padding: 40px 48px; }
        .q4-bottom-nav { display: none; }
        .q4-main-mobile { display: none; }
        @media (max-width: 768px) {
          .q4-sidebar { display: none; }
          .q4-main-desktop { display: none; }
          .q4-bottom-nav { display: flex; position: fixed; bottom: 0; left: 0; right: 0; z-index: 50; background: #0C0C0C; border-top: 1px solid rgba(255,255,255,0.07); height: 64px; }
          .q4-main-mobile { display: block; padding: 20px 16px 80px; }
        }
        .q4-nav-link { display: flex; align-items: center; gap: 12px; padding: 12px 24px; text-decoration: none; font-size: 13px; letter-spacing: 0.03em; transition: background 0.15s; border-left: 2px solid transparent; }
        .q4-nav-link:hover { background: rgba(201,168,76,0.05); }
        .q4-nav-link.active { border-left-color: #C9A84C; background: rgba(201,168,76,0.06); }
        .q4-bottom-nav-item { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; text-decoration: none; font-size: 10px; letter-spacing: 0.05em; text-transform: uppercase; border: none; background: none; cursor: pointer; }
      `}</style>

      <div className="q4-client-root">
        {/* DESKTOP SIDEBAR */}
        <aside className="q4-sidebar">
          <div style={{ padding: '0 24px 32px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 20, fontWeight: 400, letterSpacing: '0.18em', color: '#C9A84C' }}>
              Q4 PAWS
            </div>
            <div style={{ fontSize: 10, color: 'rgba(240,237,232,0.35)', marginTop: 4, letterSpacing: '0.05em' }}>
              {profile?.full_name || 'Portal cliente'}
            </div>
          </div>

          <nav style={{ flex: 1, paddingTop: 16 }}>
            {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
              const active = currentPath === path
              return (
                <Link
                  key={path}
                  to={path}
                  className={`q4-nav-link${active ? ' active' : ''}`}
                  style={{ color: active ? '#C9A84C' : 'rgba(240,237,232,0.5)' }}
                >
                  <Icon active={active} />
                  {label}
                </Link>
              )
            })}
          </nav>

          <div style={{ padding: '0 24px' }}>
            <button
              onClick={handleSignOut}
              style={{
                width: '100%',
                background: 'none',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(240,237,232,0.4)',
                padding: '10px',
                fontSize: 11,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'border-color 0.15s, color 0.15s',
              }}
            >
              Cerrar sesión
            </button>
          </div>
        </aside>

        {/* DESKTOP CONTENT */}
        <main className="q4-main-desktop">{children}</main>

        {/* MOBILE CONTENT */}
        <main className="q4-main-mobile">{children}</main>

        {/* MOBILE BOTTOM NAV */}
        <nav className="q4-bottom-nav">
          {NAV_ITEMS.map(({ path, label, icon: Icon }) => {
            const active = currentPath === path
            return (
              <Link
                key={path}
                to={path}
                className="q4-bottom-nav-item"
                style={{ color: active ? '#C9A84C' : 'rgba(240,237,232,0.35)' }}
              >
                <Icon active={active} />
                {label}
              </Link>
            )
          })}
          <button
            onClick={handleSignOut}
            className="q4-bottom-nav-item"
            style={{ color: 'rgba(240,237,232,0.25)', flex: 0.7 }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Salir
          </button>
        </nav>
      </div>
    </>
  )
}
