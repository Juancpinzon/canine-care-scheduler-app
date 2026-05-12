import { useState, useMemo } from 'react'
import { Search, ChevronDown, ChevronUp } from 'lucide-react'
import { useDogs } from '@/hooks/useDogs'
import { useClients } from '@/hooks/useClients'
import { useAppointments } from '@/hooks/useAppointments'
import { C, SIZE_SHORT, StatusBadge } from '@/components/admin/AppointmentCard'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import type { Dog } from '@/types'

function DogExpandedDetails({ dog, clientName }: { dog: Dog, clientName: string }) {
  // To get appointments for a specific dog, we can fetch all for client and filter by dog, 
  // or useAppointments if it supports filtering by dog. Currently it only filters by clientId and date.
  // We will fetch by clientId and then filter by dog_id.
  const { data: allClientAppointments = [], isLoading: loadingAppts } = useAppointments({ clientId: dog.owner_id })
  const dogAppointments = useMemo(() => allClientAppointments.filter(a => a.dog_id === dog.id), [allClientAppointments, dog.id])

  return (
    <div style={{ padding: '20px', background: '#0A0A0A', borderTop: `1px solid ${C.subtleBorder}`, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
      
      {/* Dog Info */}
      <div style={{ flex: '1 1 300px' }}>
        <h4 style={{ margin: '0 0 12px', color: C.gold, fontSize: 13, textTransform: 'uppercase', letterSpacing: 1 }}>
          Perfil de Mascota
        </h4>
        <div style={{ background: C.surface, border: `1px solid ${C.goldBorder}`, borderRadius: 8, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: C.textMuted, fontSize: 13 }}>Dueño:</span>
            <span style={{ color: C.text, fontSize: 13, fontWeight: 500 }}>{clientName}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: C.textMuted, fontSize: 13 }}>Peso:</span>
            <span style={{ color: C.text, fontSize: 13 }}>{dog.weight_lbs ? `${dog.weight_lbs} lbs` : '—'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: C.textMuted, fontSize: 13 }}>Color:</span>
            <span style={{ color: C.text, fontSize: 13 }}>{dog.color || '—'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: C.textMuted, fontSize: 13 }}>Esterilizado:</span>
            <span style={{ color: C.text, fontSize: 13 }}>{dog.is_neutered === null ? '—' : dog.is_neutered ? 'Sí' : 'No'}</span>
          </div>
        </div>

        <h4 style={{ margin: '20px 0 12px', color: C.gold, fontSize: 13, textTransform: 'uppercase', letterSpacing: 1 }}>
          Notas y Comportamiento
        </h4>
        <div style={{ background: C.surface, border: `1px solid ${C.goldBorder}`, borderRadius: 8, padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <div style={{ color: C.textMuted, fontSize: 12, marginBottom: 4 }}>Alergias:</div>
            <div style={{ color: C.text, fontSize: 13 }}>{dog.allergies || 'Ninguna registrada'}</div>
          </div>
          <div>
            <div style={{ color: C.textMuted, fontSize: 12, marginBottom: 4 }}>Notas Médicas:</div>
            <div style={{ color: C.text, fontSize: 13 }}>{dog.medical_notes || 'Ninguna registrada'}</div>
          </div>
          <div>
            <div style={{ color: C.textMuted, fontSize: 12, marginBottom: 4 }}>Comportamiento:</div>
            <div style={{ color: C.text, fontSize: 13 }}>{dog.behavior_notes || 'Ninguno registrado'}</div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            {dog.is_dog_friendly && <span style={{ background: 'rgba(52,211,153,0.1)', color: '#34D399', padding: '2px 8px', borderRadius: 4, fontSize: 11 }}>Dog Friendly</span>}
            {dog.is_human_friendly && <span style={{ background: 'rgba(52,211,153,0.1)', color: '#34D399', padding: '2px 8px', borderRadius: 4, fontSize: 11 }}>Human Friendly</span>}
          </div>
        </div>
      </div>

      {/* Appointments section */}
      <div style={{ flex: '1 1 300px' }}>
        <h4 style={{ margin: '0 0 12px', color: C.gold, fontSize: 13, textTransform: 'uppercase', letterSpacing: 1 }}>
          Historial de Servicios ({dogAppointments.length})
        </h4>
        {loadingAppts ? (
          <div style={{ color: C.textSubtle, fontSize: 13 }}>Cargando historial...</div>
        ) : dogAppointments.length === 0 ? (
          <div style={{ color: C.textSubtle, fontSize: 13 }}>Sin historial de servicios.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {dogAppointments.map(appt => (
              <div key={appt.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: C.surface, border: `1px solid ${C.goldBorder}`, borderRadius: 8, padding: '10px 12px' }}>
                <div>
                  <div style={{ color: C.text, fontSize: 13, fontWeight: 500 }}>
                    {format(parseISO(appt.scheduled_date), "d MMM yyyy", { locale: es })}
                  </div>
                  <div style={{ color: C.textMuted, fontSize: 11, marginTop: 2 }}>
                    ✂️ {appt.service?.name ?? 'Servicio'}
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

function DogRow({ dog, clientName }: { dog: Dog, clientName: string }) {
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
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: C.goldSubtle,
            border: `1px solid ${C.goldBorder}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            flexShrink: 0
          }}
        >
          {dog.photo_url ? (
            <img src={dog.photo_url} alt={dog.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ color: C.gold, fontSize: 20, fontFamily: 'Cormorant Garamond, serif' }}>
              {dog.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span style={{ color: C.text, fontSize: 18, fontWeight: 600, fontFamily: 'Cormorant Garamond, serif', lineHeight: 1.2 }}>
              {dog.name}
            </span>
            {dog.size && (
              <span style={{ background: C.goldSubtle, color: C.gold, border: `1px solid ${C.goldBorder}`, borderRadius: 4, padding: '1px 7px', fontSize: 10, letterSpacing: 0.5 }}>
                {SIZE_SHORT[dog.size] ?? dog.size}
              </span>
            )}
          </div>
          <div style={{ color: C.textMuted, fontSize: 13, marginTop: 4, display: 'flex', gap: 6, alignItems: 'center' }}>
            <span>{dog.breed ?? 'Raza desconocida'}</span>
            <span>·</span>
            <span>👤 {clientName}</span>
          </div>
        </div>

        <div style={{ color: C.textSubtle }}>
          {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </div>

      {expanded && <DogExpandedDetails dog={dog} clientName={clientName} />}
    </div>
  )
}

export default function Mascotas() {
  const { data: allDogs = [], isLoading: loadingDogs } = useDogs()
  const { data: allClients = [], isLoading: loadingClients } = useClients()
  const [searchTerm, setSearchTerm] = useState('')

  const clientsMap = useMemo(() => {
    const map = new Map<string, string>()
    allClients.forEach(c => {
      map.set(c.id, c.full_name || 'Sin Nombre')
    })
    return map
  }, [allClients])

  const filteredDogs = useMemo(() => {
    if (!searchTerm) return allDogs
    const term = searchTerm.toLowerCase()
    return allDogs.filter(d => {
      const name = d.name?.toLowerCase() ?? ''
      const breed = d.breed?.toLowerCase() ?? ''
      const ownerName = (clientsMap.get(d.owner_id) || '').toLowerCase()
      return name.includes(term) || breed.includes(term) || ownerName.includes(term)
    })
  }, [allDogs, searchTerm, clientsMap])

  const isLoading = loadingDogs || loadingClients

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
          Gestión de Mascotas
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
              Directorio de Perros
            </h1>
            <div style={{ color: C.textMuted, fontSize: 13, marginTop: 4 }}>
              {filteredDogs.length} perro{filteredDogs.length !== 1 ? 's' : ''} registrado{filteredDogs.length !== 1 ? 's' : ''}
            </div>
          </div>

          <div style={{ position: 'relative', width: '100%', maxWidth: 300 }}>
            <Search size={16} color={C.textMuted} style={{ position: 'absolute', left: 12, top: 12 }} />
            <input
              type="text"
              placeholder="Buscar por nombre, raza o dueño..."
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
            Cargando perros...
          </div>
        ) : filteredDogs.length === 0 ? (
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
              No se encontraron perros con esos términos de búsqueda.
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filteredDogs.map(dog => (
              <DogRow 
                key={dog.id} 
                dog={dog} 
                clientName={clientsMap.get(dog.owner_id) || 'Desconocido'} 
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
