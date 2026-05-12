import { useState, useMemo } from 'react'
import { format, parseISO, isSameDay } from 'date-fns'
import { es } from 'date-fns/locale'
import { DayPicker } from 'react-day-picker'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'
import { useAppointments, useUpdateAppointmentStatus } from '@/hooks/useAppointments'
import { AppointmentCard, C, STATUS } from '@/components/admin/AppointmentCard'
import type { AppointmentStatus, AppointmentWithRelations } from '@/types'

export default function Calendario() {
  const { user } = useAuth()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  // Fetch all appointments
  const { data: allAppointments = [], isLoading } = useAppointments()
  const updateStatus = useUpdateAppointmentStatus()

  // Find days with appointments
  const daysWithAppointments = useMemo(() => {
    const days = new Set<string>()
    allAppointments.forEach(appt => {
      // appt.scheduled_date is "YYYY-MM-DD"
      days.add(appt.scheduled_date)
    })
    return Array.from(days).map(d => parseISO(d))
  }, [allAppointments])

  // Filter appointments for the selected date
  const selectedDayAppointments = useMemo(() => {
    if (!selectedDate) return []
    const selectedDateStr = format(selectedDate, 'yyyy-MM-dd')
    return allAppointments.filter(a => a.scheduled_date === selectedDateStr)
  }, [allAppointments, selectedDate])

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
      <header
        style={{
          background: C.surface,
          borderBottom: `1px solid ${C.goldBorder}`,
          padding: '14px 20px',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 22, fontWeight: 600, color: C.gold, lineHeight: 1.1 }}>
          Q4 Paws
        </div>
        <div style={{ color: C.textSubtle, fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', marginTop: 2 }}>
          Calendario
        </div>
      </header>

      <main style={{ padding: '24px 16px', maxWidth: 1000, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'flex-start' }}>
        
        {/* Sidebar with Calendar */}
        <div
          style={{
            background: C.surface,
            border: `1px solid ${C.goldBorder}`,
            borderRadius: 12,
            padding: '24px',
            flex: '1 1 300px',
            maxWidth: 400,
          }}
        >
          <style>
            {`
              .rdp {
                --rdp-cell-size: 40px;
                --rdp-accent-color: ${C.gold};
                --rdp-background-color: rgba(201,168,76,0.1);
                margin: 0;
              }
              .rdp-day_selected, .rdp-day_selected:focus-visible, .rdp-day_selected:hover {
                color: #080808;
                background-color: var(--rdp-accent-color);
              }
              .rdp-button:hover:not([disabled]):not(.rdp-day_selected) {
                background-color: var(--rdp-background-color);
              }
              .rdp-day {
                border-radius: 8px;
                font-size: 14px;
              }
              .rdp-caption_label {
                font-family: 'Cormorant Garamond', serif;
                font-size: 20px;
                font-weight: 600;
                color: ${C.gold};
              }
              .rdp-head_cell {
                color: ${C.textMuted};
                font-weight: 500;
                font-size: 12px;
                text-transform: uppercase;
              }
              .has-appointment {
                position: relative;
              }
              .has-appointment::after {
                content: '';
                position: absolute;
                bottom: 4px;
                left: 50%;
                transform: translateX(-50%);
                width: 4px;
                height: 4px;
                background-color: ${C.gold};
                border-radius: 50%;
              }
              .rdp-day_selected.has-appointment::after {
                background-color: #080808;
              }
            `}
          </style>
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={(day) => day && setSelectedDate(day)}
            locale={es}
            modifiers={{
              hasAppointment: daysWithAppointments
            }}
            modifiersClassNames={{
              hasAppointment: 'has-appointment'
            }}
          />
        </div>

        {/* Selected Day Details */}
        <div style={{ flex: '2 1 400px' }}>
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
              {selectedDate ? format(selectedDate, "EEEE d 'de' MMMM, yyyy", { locale: es }) : 'Selecciona un día'}
            </h1>
            <div style={{ color: C.textMuted, fontSize: 13, marginTop: 4 }}>
              {selectedDayAppointments.length} cita{selectedDayAppointments.length !== 1 ? 's' : ''} programada{selectedDayAppointments.length !== 1 ? 's' : ''}
            </div>
          </div>

          {isLoading ? (
            <div style={{ color: C.textMuted, fontSize: 14, textAlign: 'center', padding: '40px 0' }}>Cargando citas...</div>
          ) : selectedDayAppointments.length === 0 ? (
            <div
              style={{
                background: C.surface,
                border: `1px solid ${C.goldBorder}`,
                borderRadius: 12,
                padding: '48px 24px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 24, color: C.goldMuted, marginBottom: 8 }}>
                Día libre
              </div>
              <div style={{ color: C.textMuted, fontSize: 14 }}>
                No hay citas programadas para esta fecha.
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {selectedDayAppointments.map(appt => (
                <AppointmentCard
                  key={appt.id}
                  appt={appt}
                  onStatusChange={handleStatusChange}
                  loading={updatingId === appt.id}
                />
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  )
}
