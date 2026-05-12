import { useState, useMemo } from 'react'
import { Search } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'
import { useAppointments, useUpdateAppointmentStatus } from '@/hooks/useAppointments'
import { AppointmentCard, C, STATUS } from '@/components/admin/AppointmentCard'
import type { AppointmentStatus, AppointmentWithRelations } from '@/types'

export default function Citas() {
  const { user } = useAuth()
  const { data: allAppointments = [], isLoading } = useAppointments()
  const updateStatus = useUpdateAppointmentStatus()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | 'all'>('all')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const filteredAppointments = useMemo(() => {
    return allAppointments.filter(appt => {
      // Status filter
      if (statusFilter !== 'all' && appt.status !== statusFilter) return false

      // Search filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase()
        const dogName = appt.dog?.name?.toLowerCase() ?? ''
        const clientName = appt.client?.full_name?.toLowerCase() ?? ''
        const clientPhone = appt.client?.phone?.toLowerCase() ?? ''
        if (!dogName.includes(term) && !clientName.includes(term) && !clientPhone.includes(term)) {
          return false
        }
      }

      return true
    })
  }, [allAppointments, searchTerm, statusFilter])

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
          Todas las citas
        </div>
      </header>

      <main style={{ padding: '24px 16px', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ marginBottom: 24, display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1
              style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: 28,
                fontWeight: 600,
                color: C.text,
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              Listado de Citas
            </h1>
            <div style={{ color: C.textMuted, fontSize: 13, marginTop: 4 }}>
              {filteredAppointments.length} cita{filteredAppointments.length !== 1 ? 's' : ''} encontrada{filteredAppointments.length !== 1 ? 's' : ''}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', width: 240 }}>
              <Search size={16} color={C.textMuted} style={{ position: 'absolute', left: 12, top: 12 }} />
              <input
                type="text"
                placeholder="Buscar perro, cliente, teléfono..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  background: C.surface,
                  border: `1px solid ${C.goldBorder}`,
                  borderRadius: 8,
                  padding: '10px 12px 10px 36px',
                  color: C.text,
                  fontSize: 13,
                  outline: 'none',
                  fontFamily: 'DM Sans, sans-serif',
                }}
              />
            </div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as AppointmentStatus | 'all')}
              style={{
                background: C.surface,
                border: `1px solid ${C.goldBorder}`,
                borderRadius: 8,
                padding: '10px 16px',
                color: C.text,
                fontSize: 13,
                outline: 'none',
                fontFamily: 'DM Sans, sans-serif',
                appearance: 'none',
                minWidth: 140,
                cursor: 'pointer',
              }}
            >
              <option value="all">Todos los estados</option>
              {Object.entries(STATUS).map(([key, config]) => (
                <option key={key} value={key}>{config.label}</option>
              ))}
            </select>
          </div>
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: C.textMuted, fontSize: 14 }}>
            Cargando citas...
          </div>
        ) : filteredAppointments.length === 0 ? (
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
              Sin resultados
            </div>
            <div style={{ color: C.textMuted, fontSize: 14 }}>
              No se encontraron citas con los filtros actuales.
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* Agrupar por fecha es una opción, pero por simplicidad listamos */}
            {filteredAppointments.map(appt => (
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
    </div>
  )
}
