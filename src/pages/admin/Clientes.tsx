import { useState, useMemo } from 'react'
import { Search, ChevronDown, ChevronUp, Phone, Mail } from 'lucide-react'
import { useClients } from '@/hooks/useClients'
import { useDogs } from '@/hooks/useDogs'
import { useAppointments } from '@/hooks/useAppointments'
import { C, SIZE_SHORT, StatusBadge } from '@/components/admin/AppointmentCard'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import type { Profile } from '@/types'

function ClientExpandedDetails({ clientId }: { clientId: string }) {
  const { data: dogs = [], isLoading: loadingDogs } = useDogs(clientId)
  const { data: appointments = [], isLoading: loadingAppts } = useAppointments({ clientId })

  return (
    <div style={{ padding: '20px', background: '#0A0A0A', borderTop: `1px solid ${C.subtleBorder}`, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
      
      {/* Dogs section */}
      <div style={{ flex: '1 1 300px' }}>
        <h4 style={{ margin: '0 0 12px', color: C.gold, fontSize: 13, textTransform: 'uppercase', letterSpacing: 1 }}>
          Mascotas Registradas ({dogs.length})
        </h4>
        {loadingDogs ? (
          <div style={{ color: C.textSubtle, fontSize: 13 }}>Cargando perros...</div>
        ) : dogs.length === 0 ? (
          <div style={{ color: C.textSubtle, fontSize: 13 }}>Sin perros registrados.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {dogs.map(dog => (
              <div key={dog.id} style={{ background: C.surface, border: `1px solid ${C.goldBorder}`, borderRadius: 8, padding: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ color: C.text, fontWeight: 600, fontSize: 15, fontFamily: 'Cormorant Garamond, serif' }}>{dog.name}</span>
                  {dog.size && (
                    <span style={{ background: C.goldSubtle, color: C.gold, borderRadius: 4, padding: '1px 6px', fontSize: 10 }}>
                      {SIZE_SHORT[dog.size] ?? dog.size}
                    </span>
                  )}
                </div>
                <div style={{ color: C.textMuted, fontSize: 12, marginTop: 4 }}>{dog.breed ?? 'Raza desconocida'}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Appointments section */}
      <div style={{ flex: '1 1 300px' }}>
        <h4 style={{ margin: '0 0 12px', color: C.gold, fontSize: 13, textTransform: 'uppercase', letterSpacing: 1 }}>
          Historial de Citas ({appointments.length})
        </h4>
        {loadingAppts ? (
          <div style={{ color: C.textSubtle, fontSize: 13 }}>Cargando historial...</div>
        ) : appointments.length === 0 ? (
          <div style={{ color: C.textSubtle, fontSize: 13 }}>Sin historial de citas.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {appointments.map(appt => (
              <div key={appt.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: C.surface, border: `1px solid ${C.goldBorder}`, borderRadius: 8, padding: '10px 12px' }}>
                <div>
                  <div style={{ color: C.text, fontSize: 13, fontWeight: 500 }}>
                    {format(parseISO(appt.scheduled_date), "d MMM yyyy", { locale: es })}
                  </div>
                  <div style={{ color: C.textMuted, fontSize: 11, marginTop: 2 }}>
                    ✂️ {appt.service?.name ?? 'Servicio'} · {appt.dog?.name ?? 'Perro'}
                  </div>
                </div>
                <StatusBadge status={appt.status} />
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}

function ClientRow({ client }: { client: Profile }) {
  const [expanded, setExpanded] = useState(false)

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
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '16px 20px',
          cursor: 'pointer',
          gap: 16,
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ color: C.text, fontSize: 18, fontWeight: 600, fontFamily: 'Cormorant Garamond, serif', lineHeight: 1.2 }}>
            {client.full_name || 'Sin Nombre'}
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 6, flexWrap: 'wrap' }}>
            {client.phone && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: C.textMuted, fontSize: 13 }}>
                <Phone size={14} color={C.gold} />
                <a href={`tel:${client.phone}`} onClick={e => e.stopPropagation()} style={{ color: 'inherit', textDecoration: 'none' }}>
                  {client.phone}
                </a>
              </div>
            )}
            {/* The email is usually in user auth, but Profile might not have it exposed directly unless added to table. If it's not there, omit it. Profile type has full_name, phone. */}
          </div>
        </div>

        <div style={{ color: C.textSubtle }}>
          {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </div>

      {expanded && <ClientExpandedDetails clientId={client.id} />}
    </div>
  )
}

export default function Clientes() {
  const { data: clients = [], isLoading } = useClients()
  const [searchTerm, setSearchTerm] = useState('')

  const filteredClients = useMemo(() => {
    if (!searchTerm) return clients
    const term = searchTerm.toLowerCase()
    return clients.filter(c => {
      const name = c.full_name?.toLowerCase() ?? ''
      const phone = c.phone?.toLowerCase() ?? ''
      return name.includes(term) || phone.includes(term)
    })
  }, [clients, searchTerm])

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
          Gestión de Clientes
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
              Directorio de Clientes
            </h1>
            <div style={{ color: C.textMuted, fontSize: 13, marginTop: 4 }}>
              {filteredClients.length} cliente{filteredClients.length !== 1 ? 's' : ''} registrado{filteredClients.length !== 1 ? 's' : ''}
            </div>
          </div>

          <div style={{ position: 'relative', width: '100%', maxWidth: 300 }}>
            <Search size={16} color={C.textMuted} style={{ position: 'absolute', left: 12, top: 12 }} />
            <input
              type="text"
              placeholder="Buscar por nombre o teléfono..."
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
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: C.textMuted, fontSize: 14 }}>
            Cargando clientes...
          </div>
        ) : filteredClients.length === 0 ? (
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
              No se encontraron clientes con esos términos de búsqueda.
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filteredClients.map(client => (
              <ClientRow key={client.id} client={client} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
