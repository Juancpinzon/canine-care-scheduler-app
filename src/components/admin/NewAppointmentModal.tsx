import { useState, useEffect, useMemo } from 'react'
import { format, parse } from 'date-fns'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useSearchClients } from '@/hooks/useClients'
import { useDogs } from '@/hooks/useDogs'
import { useServices } from '@/hooks/useServices'
import { useAvailability } from '@/hooks/useAvailability'
import { useCreateAppointment } from '@/hooks/useAppointments'
import { getPriceForSize } from '@/types'
import type { Profile, Dog, Service, DogSize } from '@/types'

interface Props {
  open: boolean
  onClose: () => void
  adminId: string
}

const SIZE_LABELS: Record<string, string> = {
  xs: 'Mini',
  small: 'Pequeño',
  medium: 'Mediano',
  large: 'Grande',
  xl: 'XL',
  xxl: 'XXL',
}

const STEP_LABELS = ['Cliente', 'Perro', 'Servicio', 'Fecha y Hora', 'Confirmar']

export function NewAppointmentModal({ open, onClose, adminId }: Props) {
  const [step, setStep] = useState(1)
  const [clientSearch, setClientSearch] = useState('')
  const [selectedClient, setSelectedClient] = useState<Profile | null>(null)
  const [selectedDog, setSelectedDog] = useState<Dog | null>(null)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [saving, setSaving] = useState(false)

  const { data: searchResults = [], isFetching: searching } = useSearchClients(clientSearch)
  const { data: clientDogs = [], isLoading: loadingDogs } = useDogs(selectedClient?.id)
  const { data: services = [] } = useServices()
  const { data: availability, isLoading: loadingSlots } = useAvailability(
    selectedDate,
    selectedService?.duration_minutes ?? 60,
  )
  const createAppointment = useCreateAppointment()

  useEffect(() => {
    if (!open) {
      setStep(1)
      setClientSearch('')
      setSelectedClient(null)
      setSelectedDog(null)
      setSelectedService(null)
      setSelectedDate('')
      setSelectedTime('')
      setSaving(false)
    }
  }, [open])

  const estimatedPrice = useMemo(() => {
    if (!selectedService || !selectedDog?.size) return null
    return getPriceForSize(selectedService, selectedDog.size as DogSize)
  }, [selectedService, selectedDog?.size])

  const todayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' })

  async function handleSave() {
    if (!selectedClient || !selectedDog || !selectedService || !selectedDate || !selectedTime) return
    setSaving(true)
    try {
      await createAppointment.mutateAsync({
        client_id: selectedClient.id,
        dog_id: selectedDog.id,
        service_id: selectedService.id,
        scheduled_date: selectedDate,
        scheduled_time: selectedTime,
        duration_minutes: selectedService.duration_minutes,
        price_charged_usd: estimatedPrice ?? 0,
      })
      toast.success('Cita creada exitosamente')
      onClose()
    } catch (err) {
      toast.error('No se pudo crear la cita. Intenta de nuevo.')
    } finally {
      setSaving(false)
    }
  }

  function formatTime(t: string) {
    try {
      return format(parse(t, 'HH:mm', new Date()), 'h:mm a')
    } catch {
      return t
    }
  }

  const canGoNext = (() => {
    if (step === 1) return !!selectedClient
    if (step === 2) return !!selectedDog
    if (step === 3) return !!selectedService
    if (step === 4) return !!selectedDate && !!selectedTime
    return false
  })()

  // Shared styles
  const cardBase: React.CSSProperties = {
    border: '1px solid rgba(201,168,76,0.15)',
    borderRadius: 10,
    padding: '14px 16px',
    cursor: 'pointer',
    transition: 'all 0.15s',
    background: '#0F0F0F',
  }

  const cardSelected: React.CSSProperties = {
    ...cardBase,
    border: '1px solid #C9A84C',
    background: 'rgba(201,168,76,0.06)',
  }

  return (
    <Dialog open={open} onOpenChange={v => !v && onClose()}>
      <DialogContent
        style={{
          background: '#0C0C0C',
          border: '1px solid rgba(201,168,76,0.15)',
          borderRadius: 16,
          maxWidth: 520,
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          fontFamily: 'DM Sans, sans-serif',
        }}
      >
        {/* Header */}
        <DialogHeader style={{ padding: '24px 24px 0' }}>
          <DialogTitle
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 22,
              fontWeight: 600,
              color: '#C9A84C',
            }}
          >
            Nueva Cita
          </DialogTitle>
          {/* Step indicator */}
          <div style={{ display: 'flex', gap: 6, marginTop: 16, marginBottom: 4 }}>
            {STEP_LABELS.map((label, i) => {
              const s = i + 1
              const active = s === step
              const done = s < step
              return (
                <div key={s} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div
                    style={{
                      height: 3,
                      width: '100%',
                      borderRadius: 2,
                      background: done || active ? '#C9A84C' : 'rgba(201,168,76,0.15)',
                      transition: 'background 0.2s',
                    }}
                  />
                  <span
                    style={{
                      fontSize: 10,
                      color: active ? '#C9A84C' : done ? 'rgba(201,168,76,0.5)' : 'rgba(240,237,232,0.2)',
                      letterSpacing: 0.5,
                    }}
                  >
                    {label}
                  </span>
                </div>
              )
            })}
          </div>
        </DialogHeader>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>

          {/* STEP 1: Cliente */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', color: 'rgba(240,237,232,0.45)', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>
                  Buscar por nombre o teléfono
                </label>
                <input
                  type="text"
                  value={clientSearch}
                  onChange={e => {
                    setClientSearch(e.target.value)
                    setSelectedClient(null)
                  }}
                  placeholder="Ej: María García o 321..."
                  autoFocus
                  style={{
                    width: '100%',
                    background: '#080808',
                    border: '1px solid rgba(201,168,76,0.18)',
                    borderRadius: 8,
                    padding: '12px 14px',
                    color: '#F0EDE8',
                    fontSize: 14,
                    outline: 'none',
                    boxSizing: 'border-box',
                    fontFamily: 'DM Sans, sans-serif',
                  }}
                />
              </div>

              {clientSearch.trim().length >= 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {searching && (
                    <div style={{ color: 'rgba(240,237,232,0.3)', fontSize: 13, textAlign: 'center', padding: '12px 0' }}>
                      Buscando...
                    </div>
                  )}
                  {!searching && searchResults.length === 0 && (
                    <div style={{ color: 'rgba(240,237,232,0.3)', fontSize: 13, textAlign: 'center', padding: '12px 0' }}>
                      No se encontraron clientes
                    </div>
                  )}
                  {searchResults.map(client => (
                    <button
                      key={client.id}
                      onClick={() => {
                        setSelectedClient(client)
                        setSelectedDog(null)
                      }}
                      style={selectedClient?.id === client.id ? cardSelected : cardBase}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ color: '#F0EDE8', fontSize: 14, fontWeight: 500 }}>
                            {client.full_name ?? '(Sin nombre)'}
                          </div>
                          <div style={{ color: 'rgba(240,237,232,0.38)', fontSize: 12, marginTop: 2 }}>
                            {client.phone ?? 'Sin teléfono'}
                          </div>
                        </div>
                        {selectedClient?.id === client.id && (
                          <span style={{ color: '#C9A84C', fontSize: 16 }}>✓</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {selectedClient && (
                <div
                  style={{
                    background: 'rgba(201,168,76,0.06)',
                    border: '1px solid rgba(201,168,76,0.2)',
                    borderRadius: 8,
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <span style={{ color: '#C9A84C', fontSize: 18 }}>✓</span>
                  <div>
                    <div style={{ color: '#F0EDE8', fontSize: 13, fontWeight: 500 }}>{selectedClient.full_name}</div>
                    <div style={{ color: 'rgba(240,237,232,0.38)', fontSize: 12 }}>{selectedClient.phone}</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Perro */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ color: 'rgba(240,237,232,0.45)', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>
                Perros de {selectedClient?.full_name}
              </div>

              {loadingDogs && (
                <div style={{ color: 'rgba(240,237,232,0.3)', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>
                  Cargando perros...
                </div>
              )}

              {!loadingDogs && clientDogs.length === 0 && (
                <div
                  style={{
                    background: 'rgba(239,68,68,0.06)',
                    border: '1px solid rgba(239,68,68,0.2)',
                    borderRadius: 8,
                    padding: '16px',
                    color: 'rgba(240,237,232,0.5)',
                    fontSize: 13,
                    textAlign: 'center',
                  }}
                >
                  Este cliente no tiene perros registrados
                </div>
              )}

              {clientDogs.map(dog => (
                <button
                  key={dog.id}
                  onClick={() => setSelectedDog(dog)}
                  style={selectedDog?.id === dog.id ? cardSelected : cardBase}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: '50%',
                          background: 'rgba(201,168,76,0.12)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 18,
                        }}
                      >
                        🐾
                      </div>
                      <div>
                        <div style={{ color: '#F0EDE8', fontSize: 14, fontWeight: 500 }}>{dog.name}</div>
                        <div style={{ color: 'rgba(240,237,232,0.38)', fontSize: 12, marginTop: 1 }}>
                          {dog.breed ?? 'Raza desconocida'} ·{' '}
                          <span
                            style={{
                              background: 'rgba(201,168,76,0.12)',
                              color: '#C9A84C',
                              padding: '1px 6px',
                              borderRadius: 4,
                              fontSize: 11,
                            }}
                          >
                            {SIZE_LABELS[dog.size ?? ''] ?? dog.size ?? '—'}
                          </span>
                        </div>
                      </div>
                    </div>
                    {selectedDog?.id === dog.id && (
                      <span style={{ color: '#C9A84C', fontSize: 16 }}>✓</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* STEP 3: Servicio */}
          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ color: 'rgba(240,237,232,0.45)', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>
                Seleccionar servicio
              </div>
              {services.map(svc => {
                const price = selectedDog?.size ? getPriceForSize(svc, selectedDog.size as DogSize) : null
                const isSelected = selectedService?.id === svc.id
                return (
                  <button
                    key={svc.id}
                    onClick={() => {
                      setSelectedService(svc)
                      setSelectedDate('')
                      setSelectedTime('')
                    }}
                    style={isSelected ? cardSelected : cardBase}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ color: '#F0EDE8', fontSize: 14, fontWeight: 500 }}>{svc.name}</div>
                        <div style={{ color: 'rgba(240,237,232,0.38)', fontSize: 12, marginTop: 2 }}>
                          {svc.duration_minutes} min
                          {svc.description ? ` · ${svc.description}` : ''}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ color: '#C9A84C', fontSize: 15, fontWeight: 600 }}>
                          {price != null ? `$${price}` : '—'}
                        </div>
                        {isSelected && (
                          <span style={{ color: '#C9A84C', fontSize: 13 }}>✓</span>
                        )}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}

          {/* STEP 4: Fecha y Hora */}
          {step === 4 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={{ display: 'block', color: 'rgba(240,237,232,0.45)', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>
                  Fecha
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  min={todayStr}
                  onChange={e => {
                    setSelectedDate(e.target.value)
                    setSelectedTime('')
                  }}
                  style={{
                    width: '100%',
                    background: '#080808',
                    border: '1px solid rgba(201,168,76,0.18)',
                    borderRadius: 8,
                    padding: '12px 14px',
                    color: '#F0EDE8',
                    fontSize: 14,
                    outline: 'none',
                    boxSizing: 'border-box',
                    fontFamily: 'DM Sans, sans-serif',
                    colorScheme: 'dark',
                  }}
                />
              </div>

              {selectedDate && (
                <div>
                  <label style={{ display: 'block', color: 'rgba(240,237,232,0.45)', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>
                    Hora disponible
                  </label>
                  {loadingSlots && (
                    <div style={{ color: 'rgba(240,237,232,0.3)', fontSize: 13, textAlign: 'center', padding: '12px 0' }}>
                      Verificando disponibilidad...
                    </div>
                  )}
                  {!loadingSlots && availability && !availability.isOpen && (
                    <div
                      style={{
                        background: 'rgba(239,68,68,0.06)',
                        border: '1px solid rgba(239,68,68,0.2)',
                        borderRadius: 8,
                        padding: '12px 14px',
                        color: 'rgba(239,68,68,0.8)',
                        fontSize: 13,
                      }}
                    >
                      {availability.isBlocked ? 'Día bloqueado por la administración' : 'El negocio está cerrado este día'}
                    </div>
                  )}
                  {!loadingSlots && availability?.isOpen && availability.slots.length === 0 && (
                    <div
                      style={{
                        background: 'rgba(239,68,68,0.06)',
                        border: '1px solid rgba(239,68,68,0.2)',
                        borderRadius: 8,
                        padding: '12px 14px',
                        color: 'rgba(239,68,68,0.8)',
                        fontSize: 13,
                      }}
                    >
                      No hay horarios disponibles para este día
                    </div>
                  )}
                  {!loadingSlots && availability?.slots && availability.slots.length > 0 && (
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))',
                        gap: 8,
                      }}
                    >
                      {availability.slots.map(slot => (
                        <button
                          key={slot}
                          onClick={() => setSelectedTime(slot)}
                          style={{
                            background: selectedTime === slot ? '#C9A84C' : '#080808',
                            border: `1px solid ${selectedTime === slot ? '#C9A84C' : 'rgba(201,168,76,0.18)'}`,
                            borderRadius: 8,
                            padding: '10px 8px',
                            color: selectedTime === slot ? '#080808' : '#F0EDE8',
                            fontSize: 13,
                            fontWeight: selectedTime === slot ? 600 : 400,
                            cursor: 'pointer',
                            fontFamily: 'DM Sans, sans-serif',
                            transition: 'all 0.15s',
                          }}
                        >
                          {formatTime(slot)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STEP 5: Confirmar */}
          {step === 5 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ color: 'rgba(240,237,232,0.45)', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>
                Resumen de la cita
              </div>

              {[
                { label: 'Cliente', value: selectedClient?.full_name ?? '—' },
                { label: 'Teléfono', value: selectedClient?.phone ?? '—' },
                { label: 'Perro', value: `${selectedDog?.name ?? '—'} (${SIZE_LABELS[selectedDog?.size ?? ''] ?? selectedDog?.size ?? '—'})` },
                { label: 'Raza', value: selectedDog?.breed ?? '—' },
                { label: 'Servicio', value: selectedService?.name ?? '—' },
                { label: 'Duración', value: selectedService ? `${selectedService.duration_minutes} min` : '—' },
                { label: 'Fecha', value: selectedDate ? new Date(`${selectedDate}T12:00:00`).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '—' },
                { label: 'Hora', value: selectedTime ? formatTime(selectedTime) : '—' },
                { label: 'Precio estimado', value: estimatedPrice != null ? `$${estimatedPrice.toFixed(2)}` : '—' },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 10 }}>
                  <span style={{ color: 'rgba(240,237,232,0.38)', fontSize: 13 }}>{row.label}</span>
                  <span style={{ color: row.label === 'Precio estimado' ? '#C9A84C' : '#F0EDE8', fontSize: 13, fontWeight: row.label === 'Precio estimado' ? 600 : 400, textAlign: 'right', maxWidth: '60%' }}>
                    {row.value}
                  </span>
                </div>
              ))}

              <div
                style={{
                  background: 'rgba(201,168,76,0.06)',
                  border: '1px solid rgba(201,168,76,0.15)',
                  borderRadius: 8,
                  padding: '10px 14px',
                  color: 'rgba(240,237,232,0.5)',
                  fontSize: 12,
                  marginTop: 4,
                }}
              >
                La cita se creará con status <strong style={{ color: '#34D399' }}>Confirmado</strong>
              </div>
            </div>
          )}
        </div>

        {/* Footer / Navigation */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            display: 'flex',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          {step > 1 ? (
            <button
              onClick={() => setStep(s => (s - 1) as typeof step)}
              disabled={saving}
              style={{
                background: 'transparent',
                border: '1px solid rgba(201,168,76,0.2)',
                borderRadius: 8,
                padding: '12px 20px',
                color: 'rgba(240,237,232,0.6)',
                fontSize: 14,
                cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif',
                flex: '0 0 auto',
                height: 48,
              }}
            >
              ← Atrás
            </button>
          ) : (
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: '1px solid rgba(201,168,76,0.2)',
                borderRadius: 8,
                padding: '12px 20px',
                color: 'rgba(240,237,232,0.6)',
                fontSize: 14,
                cursor: 'pointer',
                fontFamily: 'DM Sans, sans-serif',
                flex: '0 0 auto',
                height: 48,
              }}
            >
              Cancelar
            </button>
          )}

          {step < 5 ? (
            <button
              onClick={() => setStep(s => (s + 1) as typeof step)}
              disabled={!canGoNext}
              style={{
                background: canGoNext ? '#C9A84C' : 'rgba(201,168,76,0.2)',
                border: 'none',
                borderRadius: 8,
                padding: '12px 24px',
                color: canGoNext ? '#080808' : 'rgba(240,237,232,0.3)',
                fontSize: 14,
                fontWeight: 600,
                cursor: canGoNext ? 'pointer' : 'not-allowed',
                fontFamily: 'DM Sans, sans-serif',
                flex: 1,
                height: 48,
                transition: 'all 0.15s',
              }}
            >
              Siguiente →
            </button>
          ) : (
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                background: saving ? 'rgba(52,211,153,0.4)' : '#34D399',
                border: 'none',
                borderRadius: 8,
                padding: '12px 24px',
                color: '#080808',
                fontSize: 14,
                fontWeight: 700,
                cursor: saving ? 'not-allowed' : 'pointer',
                fontFamily: 'DM Sans, sans-serif',
                flex: 1,
                height: 48,
                transition: 'all 0.15s',
              }}
            >
              {saving ? 'Guardando...' : '✓ Crear Cita'}
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
