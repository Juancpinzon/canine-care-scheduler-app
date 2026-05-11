import { useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import {
  LayoutDashboard,
  Calendar,
  ClipboardList,
  Users,
  PawPrint,
  Scissors,
  Image as ImageIcon,
  Clock,
  BarChart3,
  LogOut,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'

const NAV_ITEMS = [
  { path: '/admin',            label: 'Dashboard',  Icon: LayoutDashboard },
  { path: '/admin/calendario', label: 'Calendario', Icon: Calendar },
  { path: '/admin/citas',      label: 'Citas',      Icon: ClipboardList },
  { path: '/admin/clientes',   label: 'Clientes',   Icon: Users },
  { path: '/admin/mascotas',   label: 'Mascotas',   Icon: PawPrint },
  { path: '/admin/servicios',  label: 'Servicios',  Icon: Scissors },
  { path: '/admin/galeria',    label: 'Galería',    Icon: ImageIcon },
  { path: '/admin/horarios',   label: 'Horarios',   Icon: Clock },
  { path: '/admin/reportes',   label: 'Reportes',   Icon: BarChart3 },
]

interface Props {
  children: React.ReactNode
}

export default function AdminLayout({ children }: Props) {
  const { isAdmin, isAuthenticated, isLoading, profile, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (isLoading) return
    if (!isAuthenticated) {
      navigate('/login', { replace: true })
      return
    }
    if (!isAdmin) {
      navigate('/', { replace: true })
    }
  }, [isLoading, isAuthenticated, isAdmin, navigate])

  async function handleSignOut() {
    await signOut()
    toast.success('Sesión cerrada')
    navigate('/', { replace: true })
  }

  if (isLoading || !isAuthenticated || !isAdmin) return null

  const currentPath = location.pathname

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
        * { box-sizing: border-box; }
        .q4-admin-root { background: #080808; color: #F0EDE8; min-height: 100vh; font-family: 'DM Sans', sans-serif; display: flex; }
        .q4-admin-sidebar { width: 200px; min-height: 100vh; background: #0C0C0C; border-right: 1px solid rgba(255,255,255,0.07); display: flex; flex-direction: column; padding: 28px 0 20px; position: fixed; top: 0; left: 0; bottom: 0; overflow-y: auto; z-index: 20; }
        .q4-admin-main { margin-left: 200px; flex: 1; min-height: 100vh; }
        .q4-admin-bottom-nav { display: none; }
        .q4-admin-main-mobile { display: none; }
        @media (max-width: 768px) {
          .q4-admin-sidebar { display: none; }
          .q4-admin-main { display: none; }
          .q4-admin-bottom-nav { display: flex; position: fixed; bottom: 0; left: 0; right: 0; z-index: 50; background: #0C0C0C; border-top: 1px solid rgba(255,255,255,0.07); height: 60px; overflow-x: auto; }
          .q4-admin-main-mobile { display: block; min-height: 100vh; padding-bottom: 72px; }
        }
        .q4-admin-nav-link { display: flex; align-items: center; gap: 10px; padding: 10px 20px; text-decoration: none; font-size: 12.5px; letter-spacing: 0.02em; transition: background 0.15s; border-left: 2px solid transparent; color: rgba(240,237,232,0.45); }
        .q4-admin-nav-link:hover { background: rgba(201,168,76,0.05); color: rgba(240,237,232,0.75); }
        .q4-admin-nav-link.active { border-left-color: #C9A84C; background: rgba(201,168,76,0.07); color: #C9A84C; }
        .q4-admin-bottom-item { flex: 1; min-width: 56px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px; text-decoration: none; font-size: 9px; letter-spacing: 0.05em; text-transform: uppercase; border: none; background: none; cursor: pointer; padding: 4px 2px; color: rgba(240,237,232,0.35); }
        .q4-admin-bottom-item.active { color: #C9A84C; }
      `}</style>

      <div className="q4-admin-root">
        {/* ── DESKTOP SIDEBAR ──────────────────────────────────────────────── */}
        <aside className="q4-admin-sidebar">
          <div style={{ padding: '0 20px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: 8 }}>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 18, fontWeight: 400, letterSpacing: '0.18em', color: '#C9A84C' }}>
              Q4 PAWS
            </div>
            <div style={{ fontSize: 9, color: 'rgba(240,237,232,0.3)', marginTop: 3, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              {profile?.full_name || 'Admin'}
            </div>
          </div>

          <nav style={{ flex: 1 }}>
            {NAV_ITEMS.map(({ path, label, Icon }) => {
              const active = path === '/admin'
                ? currentPath === '/admin'
                : currentPath.startsWith(path)
              return (
                <Link
                  key={path}
                  to={path}
                  className={`q4-admin-nav-link${active ? ' active' : ''}`}
                >
                  <Icon size={15} strokeWidth={1.8} />
                  {label}
                </Link>
              )
            })}
          </nav>

          <div style={{ padding: '0 20px', marginTop: 8 }}>
            <button
              onClick={handleSignOut}
              style={{
                width: '100%',
                background: 'none',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(240,237,232,0.35)',
                padding: '9px 10px',
                fontSize: 10,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                borderRadius: 6,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                fontFamily: 'DM Sans, sans-serif',
                transition: 'color 0.15s, border-color 0.15s',
              }}
            >
              <LogOut size={12} />
              Salir
            </button>
          </div>
        </aside>

        {/* ── DESKTOP CONTENT ───────────────────────────────────────────────── */}
        <main className="q4-admin-main">{children}</main>

        {/* ── MOBILE CONTENT ────────────────────────────────────────────────── */}
        <main className="q4-admin-main-mobile">{children}</main>

        {/* ── MOBILE BOTTOM NAV ─────────────────────────────────────────────── */}
        <nav className="q4-admin-bottom-nav" aria-label="Navegación admin">
          {NAV_ITEMS.map(({ path, label, Icon }) => {
            const active = path === '/admin'
              ? currentPath === '/admin'
              : currentPath.startsWith(path)
            return (
              <Link
                key={path}
                to={path}
                className={`q4-admin-bottom-item${active ? ' active' : ''}`}
              >
                <Icon size={18} strokeWidth={1.8} />
                {label}
              </Link>
            )
          })}
          <button
            onClick={handleSignOut}
            className="q4-admin-bottom-item"
          >
            <LogOut size={18} strokeWidth={1.8} />
            Salir
          </button>
        </nav>
      </div>
    </>
  )
}
