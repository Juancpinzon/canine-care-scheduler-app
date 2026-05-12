import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { format, parse } from 'date-fns'
import { es } from 'date-fns/locale'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'
import { useAppointments, useUpdateAppointmentStatus } from '@/hooks/useAppointments'
import { NewAppointmentModal } from '@/components/admin/NewAppointmentModal'
import { AppointmentDetailPanel } from '@/components/admin/AppointmentDetailPanel'
import { AppointmentCard, StatCard, C, STATUS } from '@/components/admin/AppointmentCard'
import type { AppointmentStatus, AppointmentWithRelations } from '@/types'

// Extracted components and constants are now in src/components/admin/AppointmentCard.tsx

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
