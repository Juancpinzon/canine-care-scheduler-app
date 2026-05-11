import { useMemo } from 'react'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'
import { useAppointments, useUpdateAppointmentStatus } from '@/hooks/useAppointments'
import ClientLayout from '@/components/client/ClientLayout'
import type { AppointmentStatus, AppointmentWithRelations } from '@/types'

const STATUS_CONFIG: Record<AppointmentStatus, { label: string; bg: string; color: string }> = {
  pending:     { label: 'Pendiente',   bg: 'rgba(201,168,76,0.14)',  color: '#C9A84C' },
  confirmed:   { label: 'Confirmada',  bg: 'rgba(34,197,94,0.12)',   color: '#22C55E' },
  in_progress: { label: 'En curso',    bg: 'rgba(96,165,250,0.12)',  color: '#60A5FA' },
  completed:   { label: 'Completada',  bg: 'rgba(148,163,184,0.12)', color: '#94A3B8' },
  cancelled:   { label: 'Cancelada',   bg: 'rgba(239,68,68,0.12)',   color: '#EF4444' },
  no_show:     { label: 'No asistió',  bg: 'rgba(239,68,68,0.10)',   color: '#F87171' },
}

const SIZE_LABELS: Record<string, string> = {
  xs: 'XS', small: 'S', medium: 'M', large: 'L', xl: 'XL', xxl: 'XXL',
}

function formatDate(dateStr: string) {
  return format(parseISO(dateStr), "EEEE d 'de' MMMM", { locale: es })
}

function formatTime(timeStr: string) {
  const [h, m] = timeStr.split(':')
  const hour = parseInt(h)
  const ampm = hour >= 12 ? 'pm' : 'am'
  const hour12 = hour % 12 || 12
  return `${hour12}:${m} ${ampm}`
}

interface AppointmentCardProps {
  appt: AppointmentWithRelations
  canCancel: boolean
  onCancel: () => void
  cancelling: boolean
}

function AppointmentCard({ appt, canCancel, onCancel, cancelling }: AppointmentCardProps) {
  const s = STATUS_CONFIG[appt.status]
  return (
    <div
      style={{
        background: '#0C0C0C',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 12,
        padding: '20px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 500, color: '#F0EDE8', marginBottom: 2 }}>
            {appt.service?.name ?? '—'}
          </div>
          <div style={{ fontSize: 12, color: 'rgba(240,237,232,0.4)' }}>
            {appt.dog?.name}{appt.dog?.size ? ` · ${SIZE_LABELS[appt.dog.size] ?? appt.dog.size}` : ''}
          </div>
        </div>
        <span
          style={{
            fontSize: 11,
            letterSpacing: '0.05em',
            padding: '4px 10px',
            borderRadius: 999,
            background: s.bg,
            color: s.color,
            fontWeight: 500,
            whiteSpace: 'nowrap',
          }}
        >
          {s.label}
        </span>
      </div>

      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        <div style={{ fontSize: 13, color: 'rgba(240,237,232,0.6)', textTransform: 'capitalize' }}>
          {formatDate(appt.scheduled_date)}
        </div>
        <div style={{ fontSize: 13, color: 'rgba(240,237,232,0.6)' }}>
          {formatTime(appt.scheduled_time)}
        </div>
        {appt.price_charged_usd != null && (
          <div style={{ fontSize: 13, color: '#C9A84C', marginLeft: 'auto' }}>
            ${appt.price_charged_usd.toFixed(2)}
          </div>
        )}
      </div>

      {canCancel && (
        <div style={{ paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button
            onClick={onCancel}
            disabled={cancelling}
            style={{
              background: cancelling ? 'rgba(239,68,68,0.05)' : 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.2)',
              color: cancelling ? 'rgba(239,68,68,0.4)' : '#EF4444',
              padding: '10px 20px',
              fontSize: 12,
              letterSpacing: '0.06em',
              cursor: cancelling ? 'not-allowed' : 'pointer',
              borderRadius: 6,
              transition: 'background 0.15s',
              minHeight: 40,
            }}
          >
            {cancelling ? 'Cancelando...' : 'Cancelar cita'}
          </button>
        </div>
      )}
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
      <span style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C9A84C' }}>
        {children}
      </span>
      <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
    </div>
  )
}

export default function MisCitas() {
  const { user } = useAuth()
  const { data: appointments, isLoading } = useAppointments(
    user ? { clientId: user.id } : undefined,
  )
  const updateStatus = useUpdateAppointmentStatus()

  const { upcoming, history } = useMemo(() => {
    if (!appointments) return { upcoming: [], history: [] }
    const upcoming: AppointmentWithRelations[] = []
    const history: AppointmentWithRelations[] = []
    for (const a of appointments) {
      if (['pending', 'confirmed', 'in_progress'].includes(a.status)) {
        upcoming.push(a)
      } else {
        history.push(a)
      }
    }
    upcoming.sort((a, b) =>
      `${a.scheduled_date}${a.scheduled_time}`.localeCompare(`${b.scheduled_date}${b.scheduled_time}`),
    )
    history.sort((a, b) =>
      `${b.scheduled_date}${b.scheduled_time}`.localeCompare(`${a.scheduled_date}${a.scheduled_time}`),
    )
    return { upcoming, history }
  }, [appointments])

  async function handleCancel(appt: AppointmentWithRelations) {
    if (!user) return
    try {
      await updateStatus.mutateAsync({
        id: appt.id,
        status: 'cancelled',
        changedBy: user.id,
        reason: 'Cancelado por el cliente',
      })
      toast.success('Cita cancelada')
    } catch {
      toast.error('No se pudo cancelar la cita')
    }
  }

  return (
    <ClientLayout>
      <div style={{ maxWidth: 720 }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 34, fontWeight: 400, color: '#F0EDE8', marginBottom: 8 }}>
          Mis citas
        </h1>
        <p style={{ fontSize: 13, color: 'rgba(240,237,232,0.4)', marginBottom: 40 }}>
          Historial y próximas citas de tu mascota en Q4 Paws.
        </p>

        {isLoading ? (
          <div style={{ color: 'rgba(240,237,232,0.3)', fontSize: 14 }}>Cargando citas...</div>
        ) : (
          <>
            {/* UPCOMING */}
            <section style={{ marginBottom: 48 }}>
              <SectionTitle>Próximas</SectionTitle>
              {upcoming.length === 0 ? (
                <div
                  style={{
                    background: '#0C0C0C',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 12,
                    padding: '32px 24px',
                    textAlign: 'center',
                    color: 'rgba(240,237,232,0.3)',
                    fontSize: 13,
                  }}
                >
                  No tienes citas próximas.{' '}
                  <a href="/reservar" style={{ color: '#C9A84C', textDecoration: 'none' }}>
                    Reservar una cita →
                  </a>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {upcoming.map((appt) => (
                    <AppointmentCard
                      key={appt.id}
                      appt={appt}
                      canCancel={appt.status === 'pending' || appt.status === 'confirmed'}
                      onCancel={() => handleCancel(appt)}
                      cancelling={updateStatus.isPending}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* HISTORY */}
            <section>
              <SectionTitle>Historial</SectionTitle>
              {history.length === 0 ? (
                <div
                  style={{
                    color: 'rgba(240,237,232,0.25)',
                    fontSize: 13,
                    padding: '16px 0',
                  }}
                >
                  Aún no tienes citas completadas.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {history.map((appt) => (
                    <AppointmentCard
                      key={appt.id}
                      appt={appt}
                      canCancel={false}
                      onCancel={() => {}}
                      cancelling={false}
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </ClientLayout>
  )
}
