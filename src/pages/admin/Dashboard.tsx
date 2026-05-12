import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { format, parse } from 'date-fns'
import { es } from 'date-fns/locale'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'
import { useAppointments, useUpdateAppointmentStatus } from '@/hooks/useAppointments'
import { NewAppointmentModal } from '@/components/admin/NewAppointmentModal'
import { AppointmentDetailPanel } from '@/components/admin/AppointmentDetailPanel'
import type { AppointmentStatus, AppointmentWithRelations } from '@/types'

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

// ─── Status configuration ─────────────────────────────────────────────────────
interface StatusConfig {
  label: string
  bg: string
  color: string
}

const STATUS: Record<AppointmentStatus, StatusConfig> = {
  pending:     { label: 'Pendiente',   bg: 'rgba(201,168,76,0.12)',  color: '#C9A84C' },
  confirmed:   { label: 'Confirmado',  bg: 'rgba(52,211,153,0.1)',   color: '#34D399' },
  in_progress: { label: 'En Progreso', bg: 'rgba(96,165,250,0.1)',   color: '#60A5FA' },
  completed:   { label: 'Completado',  bg: 'rgba(148,163,184,0.1)',  color: '#94A3B8' },
  cancelled:   { label: 'Cancelado',   bg: 'rgba(239,68,68,0.1)',    color: '#EF4444' },
  no_show:     { label: 'No Apareció', bg: 'rgba(239,68,68,0.1)',    color: '#EF4444' },
}

// Actions available per status
interface Action {
  label: string
  newStatus: AppointmentStatus
  bg: string
  color: string
}

function getActions(status: AppointmentStatus): Action[] {
  switch (status) {
    case 'pending':
      return [
        { label: 'Confirmar',   newStatus: 'confirmed',   bg: 'rgba(52,211,153,0.12)',  color: '#34D399' },
        { label: 'Cancelar',    newStatus: 'cancelled',   bg: 'rgba(239,68,68,0.1)',    color: '#EF4444' },
      ]
    case 'confirmed':
      return [
        { label: 'En Progreso', newStatus: 'in_progress', bg: 'rgba(96,165,250,0.12)',  color: '#60A5FA' },
        { label: 'Cancelar',    newStatus: 'cancelled',   bg: 'rgba(239,68,68,0.1)',    color: '#EF4444' },
      ]
    case 'in_progress':
      return [
        { label: 'Completar',   newStatus: 'completed',   bg: 'rgba(52,211,153,0.12)',  color: '#34D399' },
        { label: 'No Show',     newStatus: 'no_show',     bg: 'rgba(249,115,22,0.12)',  color: '#F97316' },
        { label: 'Cancelar',    newStatus: 'cancelled',   bg: 'rgba(239,68,68,0.1)',    color: '#EF4444' },
      ]
    default:
      return []
  }
}

const SIZE_SHORT: Record<string, string> = {
  xs: 'Mini', small: 'S', medium: 'M', large: 'L', xl: 'XL', xxl: 'XXL',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatTime(t: string) {
  try {
    return format(parse(t, 'HH:mm', new Date()), 'h:mm a')
  } catch {
    return t
  }
}

function formatPrice(p: number | null) {
  if (p == null) return '—'
  return `$${p.toFixed(2)}`
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ value, label, sub, accent }: { value: string; label: string; sub?: string; accent?: string }) {
  return (
    <div
      style={{
        background: C.surface,
        border: `1px solid ${C.goldBorder}`,
        borderRadius: 12,
        padding: '20px 22px',
        flex: 1,
        minWidth: 120,
      }}
    >
      <div
        style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: 36,
          fontWeight: 600,
          color: accent ?? C.text,
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div style={{ color: C.textMuted, fontSize: 12, marginTop: 6, letterSpacing: 0.5 }}>{label}</div>
      {sub && <div style={{ color: C.gold, fontSize: 11, marginTop: 3 }}>{sub}</div>}
    </div>
  )
}

function StatusBadge({ status }: { status: AppointmentStatus }) {
  const cfg = STATUS[status]
  return (
    <span
      style={{
        background: cfg.bg,
        color: cfg.color,
        border: `1px solid ${cfg.color}30`,
        borderRadius: 20,
        padding: '3px 10px',
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: 0.3,
        whiteSpace: 'nowrap',
      }}
    >
      {cfg.label}
    </span>
  )
}

// ─── Appointment Card ─────────────────────────────────────────────────────────
function AppointmentCard({
  appt,
  onStatusChange,
  loading,
}: {
  appt: AppointmentWithRelations
  onStatusChange: (appt: AppointmentWithRelations, s: AppointmentStatus) => void
  loading: boolean
}) {
  const [expanded, setExpanded] = useState(false)
  const actions = getActions(appt.status)
  const hasActions = actions.length > 0
  const hasDetailPanel = appt.status === 'in_progress' || appt.status === 'completed'
  const isExpandable = hasActions || hasDetailPanel

  return (
    <div
      style={{
        background: C.surface,
        border: `1px solid ${expanded ? 'rgba(201,168,76,0.25)' : C.goldBorder}`,
        borderRadius: 12,
        overflow: 'hidden',
        transition: 'border-color 0.2s',
      }}
    >
      {/* Main row */}
      <div
        onClick={() => isExpandable && setExpanded(e => !e)}
        style={{
          display: 'flex',
          alignItems: 'stretch',
          cursor: isExpandable ? 'pointer' : 'default',
          padding: '0',
        }}
      >
        {/* Time column */}
        <div
          style={{
            background: C.goldSubtle,
            borderRight: `1px solid ${C.goldBorder}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px 14px',
            minWidth: 72,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 20,
              fontWeight: 600,
              color: C.gold,
              lineHeight: 1.1,
              textAlign: 'center',
            }}
          >
            {formatTime(appt.scheduled_time)}
          </div>
          <div style={{ color: C.textSubtle, fontSize: 10, marginTop: 4, textAlign: 'center' }}>
            {appt.duration_minutes}m
          </div>
        </div>

        {/* Info */}
        <div style={{ flex: 1, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
          {/* Dog + owner row */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span
                  style={{
                    color: C.text,
                    fontSize: 16,
                    fontWeight: 600,
                    fontFamily: 'Cormorant Garamond, serif',
                    lineHeight: 1.2,
                  }}
                >
                  {appt.dog?.name ?? '—'}
                </span>
                {appt.dog?.size && (
                  <span
                    style={{
                      background: C.goldSubtle,
                      color: C.gold,
                      border: `1px solid ${C.goldBorder}`,
                      borderRadius: 4,
                      padding: '1px 7px',
                      fontSize: 10,
                      letterSpacing: 0.5,
                    }}
                  >
                    {SIZE_SHORT[appt.dog.size] ?? appt.dog.size}
                  </span>
                )}
              </div>
              <div style={{ color: C.textMuted, fontSize: 12, marginTop: 2 }}>
                {appt.dog?.breed ?? 'Raza desconocida'}
              </div>
            </div>
            <StatusBadge status={appt.status} />
          </div>

          {/* Owner */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: C.textMuted, fontSize: 12 }}>👤</span>
            <span style={{ color: C.textMuted, fontSize: 12 }}>
              {appt.client?.full_name ?? '—'}
              {appt.client?.phone ? (
                <>
                  {' · '}
                  <a
                    href={`tel:${appt.client.phone}`}
                    onClick={e => e.stopPropagation()}
                    style={{ color: C.gold, textDecoration: 'none' }}
                  >
                    {appt.client.phone}
                  </a>
                </>
              ) : null}
            </span>
          </div>

          {/* Service + price */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
            <span style={{ color: C.textMuted, fontSize: 12 }}>
              ✂️ {appt.service?.name ?? '—'}
            </span>
            <span
              style={{
                color: C.gold,
                fontSize: 15,
                fontWeight: 600,
                fontFamily: 'Cormorant Garamond, serif',
              }}
            >
              {formatPrice(appt.price_charged_usd)}
            </span>
          </div>

          {/* Photo indicator when photos exist */}
          {hasDetailPanel && (appt.before_photo_url || appt.after_photo_url) && (
            <div style={{ display: 'flex', gap: 4, marginTop: 2 }}>
              {appt.before_photo_url && (
                <span style={{ color: C.gold, fontSize: 11 }}>📷 Antes</span>
              )}
              {appt.after_photo_url && (
                <span style={{ color: C.gold, fontSize: 11 }}>📷 Después</span>
              )}
            </div>
          )}
        </div>

        {/* Expand hint */}
        {isExpandable && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '0 12px',
              color: C.textSubtle,
              fontSize: 14,
              flexShrink: 0,
            }}
          >
            {expanded ? '▲' : '▼'}
          </div>
        )}
      </div>

      {/* Expanded section: actions + detail panel */}
      {isExpandable && expanded && (
        <>
          {/* Action buttons */}
          {hasActions && (
            <div
              style={{
                borderTop: `1px solid ${C.subtleBorder}`,
                padding: '12px 16px',
                display: 'flex',
                gap: 8,
                flexWrap: 'wrap',
                background: '#0A0A0A',
              }}
            >
              {actions.map(action => (
                <button
                  key={action.newStatus}
                  onClick={e => {
                    e.stopPropagation()
                    onStatusChange(appt, action.newStatus)
                  }}
                  disabled={loading}
                  style={{
                    background: action.bg,
                    border: `1px solid ${action.color}30`,
                    borderRadius: 8,
                    padding: '10px 16px',
                    color: action.color,
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.6 : 1,
                    fontFamily: 'DM Sans, sans-serif',
                    height: 44,
                    transition: 'opacity 0.15s',
                    whiteSpace: 'nowrap',
                    flex: '1 1 auto',
                    minWidth: 90,
                  }}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}

          {/* Photos + groomer notes panel */}
          {hasDetailPanel && <AppointmentDetailPanel appt={appt} />}
        </>
      )}
    </div>
  )
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { user } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' })
  const navigate = useNavigate()
  const { data: appointments = [], isLoading: loadingAppts, refetch } = useAppointments({ date: today })
  const updateStatus = useUpdateAppointmentStatus()

  const displayDate = new Date().toLocaleDateString('es-ES', {
    timeZone: 'America/New_York',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  // Summary stats — exclude cancelled & no_show from revenue
  const stats = useMemo(() => {
    const active = appointments.filter(a => a.status !== 'cancelled' && a.status !== 'no_show')
    const revenue = active.reduce((sum, a) => sum + (a.price_charged_usd ?? 0), 0)
    const pending = appointments.filter(a => a.status === 'pending').length
    const inProgress = appointments.filter(a => a.status === 'in_progress').length
    return { total: appointments.length, revenue, pending, inProgress }
  }, [appointments])

  async function handleStatusChange(appt: AppointmentWithRelations, newStatus: AppointmentStatus) {
    setUpdatingId(appt.id)
    try {
      await updateStatus.mutateAsync({
        id: appt.id,
        status: newStatus,
        changedBy: user?.id ?? 'admin',
      })
      toast.success(`Cita actualizada: ${STATUS[newStatus].label}`)
    } catch {
      toast.error('No se pudo actualizar la cita')
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div
      style={{
        background: C.bg,
        minHeight: '100vh',
        fontFamily: 'DM Sans, sans-serif',
        color: C.text,
      }}
    >
      {/* Top bar */}
      <header
        style={{
          background: C.surface,
          borderBottom: `1px solid ${C.goldBorder}`,
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 22,
              fontWeight: 600,
              color: C.gold,
              lineHeight: 1.1,
            }}
          >
            Q4 Paws
          </div>
          <div style={{ color: C.textSubtle, fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', marginTop: 2 }}>
            Panel Admin
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => refetch()}
            style={{
              background: 'transparent',
              border: `1px solid ${C.goldBorder}`,
              borderRadius: 8,
              padding: '8px 12px',
              color: C.textMuted,
              fontSize: 13,
              cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif',
            }}
          >
             ↻ Actualizar
          </button>
          <button
            onClick={() => navigate('/admin/reportes')}
            style={{
              background: 'transparent',
              border: `1px solid ${C.goldBorder}`,
              borderRadius: 8,
              padding: '8px 12px',
              color: C.gold,
              fontSize: 13,
              cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif',
            }}
          >
            📊 Reportes
          </button>
          <button
            onClick={() => setShowModal(true)}
            style={{
              background: C.gold,
              border: 'none',
              borderRadius: 10,
              padding: '12px 18px',
              color: '#080808',
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif',
              height: 44,
              whiteSpace: 'nowrap',
            }}
          >
            + Nueva Cita
          </button>
        </div>
      </header>

      <main style={{ padding: '20px 16px', maxWidth: 900, margin: '0 auto' }}>
        {/* Date heading */}
        <div style={{ marginBottom: 24 }}>
          <h1
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 28,
              fontWeight: 600,
              color: C.text,
              margin: 0,
              lineHeight: 1.2,
              textTransform: 'capitalize',
            }}
          >
            {displayDate}
          </h1>
          <div style={{ color: C.textMuted, fontSize: 13, marginTop: 4 }}>
            Vista diaria · Citas de hoy
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
          <StatCard
            value={String(stats.total)}
            label="Citas hoy"
            sub={stats.inProgress > 0 ? `${stats.inProgress} en progreso` : undefined}
          />
          <StatCard
            value={`$${stats.revenue.toFixed(0)}`}
            label="Ingresos estimados"
            accent={C.gold}
          />
          <StatCard
            value={String(stats.pending)}
            label="Pendientes de confirmar"
            accent={stats.pending > 0 ? C.gold : C.textMuted}
          />
        </div>

        {/* Appointment list */}
        {loadingAppts && (
          <div style={{ textAlign: 'center', padding: '48px 0', color: C.textMuted, fontSize: 14 }}>
            Cargando citas...
          </div>
        )}

        {!loadingAppts && appointments.length === 0 && (
          <div
            style={{
              background: C.surface,
              border: `1px solid ${C.goldBorder}`,
              borderRadius: 12,
              padding: '48px 24px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: 24,
                color: C.goldMuted,
                marginBottom: 8,
              }}
            >
              Sin citas para hoy
            </div>
            <div style={{ color: C.textMuted, fontSize: 14, marginBottom: 20 }}>
              No hay citas programadas para este día.
            </div>
            <button
              onClick={() => setShowModal(true)}
              style={{
                background: C.gold,
                border: 'none',
                borderRadius: 10,
                padding: '14px 24px',
                color: '#080808',
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif',
                height: 52,
              }}
            >
              + Crear primera cita del día
            </button>
          </div>
        )}

        {!loadingAppts && appointments.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* Section label */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 6,
                paddingBottom: 10,
                borderBottom: `1px solid ${C.subtleBorder}`,
              }}
            >
              <span style={{ color: C.textSubtle, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase' }}>
                Orden por hora
              </span>
              <span style={{ color: C.goldMuted, fontSize: 11 }}>
                {appointments.length} {appointments.length === 1 ? 'cita' : 'citas'}
              </span>
            </div>

            {appointments.map(appt => (
              <AppointmentCard
                key={appt.id}
                appt={appt}
                onStatusChange={handleStatusChange}
                loading={updatingId === appt.id}
              />
            ))}
          </div>
        )}
      </main>

      {/* New appointment modal */}
      <NewAppointmentModal
        open={showModal}
        onClose={() => setShowModal(false)}
        adminId={user?.id ?? ''}
      />
    </div>
  )
}
