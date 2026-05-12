import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { format, parse } from 'date-fns'
import { es } from 'date-fns/locale'
import { DayPicker } from 'react-day-picker'
import type { Matcher } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { toast } from 'sonner'
import { useServices } from '@/hooks/useServices'
import { useAvailability, useBusinessSchedules, useBlockedDates } from '@/hooks/useAvailability'
import { usePublicBooking } from '@/hooks/usePublicBooking'
import { getPriceForSize } from '@/types'
import type { Service, DogSize, DogSex } from '@/types'
import { useLanguage } from '@/contexts/LanguageContext'

// ─── Design tokens ─────────────────────────────────────────────────────────────
const C = {
  bg: '#080808',
  surface: '#0C0C0C',
  card: '#0F0F0F',
  gold: '#C9A84C',
  goldBorder: 'rgba(201,168,76,0.12)',
  goldMuted: 'rgba(201,168,76,0.35)',
  goldSubtle: 'rgba(201,168,76,0.08)',
  text: '#F0EDE8',
  textMuted: 'rgba(240,237,232,0.38)',
  textSubtle: 'rgba(240,237,232,0.22)',
  border: 'rgba(255,255,255,0.07)',
  errorBg: 'rgba(239,68,68,0.07)',
  errorBorder: 'rgba(239,68,68,0.25)',
  errorText: '#EF4444',
}

const SIZES: { value: DogSize; labelKey: string; descKey: string }[] = [
  { value: 'xs',     labelKey: 'Mini / Toy',     descKey: 'Chihuahua, Yorkie, Maltés · ≤5 lbs' },
  { value: 'small',  labelKey: 'Pequeño',         descKey: 'Shih Tzu, Poodle mini · 5–20 lbs' },
  { value: 'medium', labelKey: 'Mediano',          descKey: 'Cocker, Beagle, Frenchie · 20–40 lbs' },
  { value: 'large',  labelKey: 'Grande',           descKey: 'Golden, Lab, Husky · 40–70 lbs' },
  { value: 'xl',     labelKey: 'Extra Grande',     descKey: 'Bernés, Boxer · 70–100 lbs' },
  { value: 'xxl',    labelKey: 'XXL / Gigante',    descKey: 'San Bernardo, Gran Danés · 100+ lbs' },
]

// ─── Helpers ────────────────────────────────────────────────────────────────────
function getMinPrice(svc: Service): number | null {
  const prices = [svc.price_xs, svc.price_small].filter((p): p is number => p !== null)
  return prices.length ? Math.min(...prices) : null
}

function fmtTime(t: string) {
  try { return format(parse(t, 'HH:mm', new Date()), 'h:mm a') } catch { return t }
}

function fmtDate(d: Date) {
  return format(d, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })
}

// ─── Shared UI atoms ───────────────────────────────────────────────────────────
function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label style={{ display: 'block', color: C.textMuted, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>
      {children}
    </label>
  )
}

function TextInput({
  value, onChange, placeholder, type = 'text', required,
}: {
  value: string; onChange: (v: string) => void
  placeholder?: string; type?: string; required?: boolean
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      style={{
        width: '100%', boxSizing: 'border-box',
        background: '#080808',
        border: `1px solid ${C.goldBorder}`,
        borderRadius: 8,
        padding: '13px 14px',
        color: C.text, fontSize: 15, outline: 'none',
        fontFamily: 'DM Sans, sans-serif',
        colorScheme: 'dark',
      }}
    />
  )
}

function PrimaryBtn({
  children, onClick, disabled, type = 'button',
}: {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit'
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        background: disabled ? 'rgba(201,168,76,0.25)' : C.gold,
        border: 'none', borderRadius: 10,
        padding: '0 28px',
        height: 56, minWidth: 140,
        color: disabled ? 'rgba(240,237,232,0.3)' : '#080808',
        fontSize: 15, fontWeight: 700,
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: 'DM Sans, sans-serif',
        transition: 'all 0.15s',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </button>
  )
}

function GhostBtn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        background: 'transparent',
        border: `1px solid ${C.goldBorder}`,
        borderRadius: 10,
        padding: '0 24px',
        height: 56, minWidth: 100,
        color: C.textMuted, fontSize: 14,
        cursor: 'pointer',
        fontFamily: 'DM Sans, sans-serif',
      }}
    >
      {children}
    </button>
  )
}

// ─── Step indicator ─────────────────────────────────────────────────────────────
function StepIndicator({ step, t }: { step: number; t: any }) {
  const steps = [t('step1'), t('step2'), t('step3'), t('confirm')];
  return (
    <div style={{ display: 'flex', gap: 6, padding: '0 0 4px' }}>
      {steps.map((label, i) => {
        const s = i + 1
        const done = s < step
        const active = s === step
        return (
          <div key={s} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div
                style={{
                  width: 24, height: 24, borderRadius: '50%',
                  background: done ? C.gold : active ? 'transparent' : 'transparent',
                  border: `2px solid ${done || active ? C.gold : C.goldBorder}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700,
                  color: done ? '#080808' : active ? C.gold : C.textSubtle,
                  flexShrink: 0,
                  transition: 'all 0.2s',
                }}
              >
                {done ? '✓' : s}
              </div>
            </div>
            <div
              style={{
                height: 2, width: '100%',
                background: done ? C.gold : active ? C.gold : C.goldBorder,
                borderRadius: 2,
                transition: 'background 0.2s',
              }}
            />
            <span
              style={{
                fontSize: 10, letterSpacing: 0.5,
                color: active ? C.gold : done ? 'rgba(201,168,76,0.5)' : C.textSubtle,
                textAlign: 'center',
              }}
            >
              {label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// ─── Calendar dark CSS ───────────────────────────────────────────────────────────
const CALENDAR_CSS = `
  .rdp { --rdp-cell-size: 40px; --rdp-accent-color: #C9A84C; margin: 0; font-family: 'DM Sans', sans-serif; }
  .rdp-months { justify-content: center; }
  .rdp-caption { display: flex; align-items: center; justify-content: space-between; padding: 4px 0 12px; }
  .rdp-caption_label { color: #F0EDE8; font-size: 15px; font-weight: 500; font-family: 'Cormorant Garamond', serif; letter-spacing: 0.5px; }
  .rdp-nav { display: flex; gap: 4px; }
  .rdp-nav_button { color: #C9A84C; border: 1px solid rgba(201,168,76,0.2); border-radius: 6px; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; background: transparent; cursor: pointer; }
  .rdp-nav_button:hover { background: rgba(201,168,76,0.1); }
  .rdp-nav_button svg { fill: #C9A84C; }
  .rdp-table { width: 100%; border-collapse: collapse; }
  .rdp-head_cell { color: rgba(240,237,232,0.38); font-size: 11px; font-weight: 500; letter-spacing: 1.5px; text-transform: uppercase; padding: 0 0 10px; text-align: center; }
  .rdp-day { color: #F0EDE8; border-radius: 8px; font-size: 14px; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; cursor: pointer; border: none; background: transparent; transition: all 0.12s; }
  .rdp-day:not([disabled]):hover { background: rgba(201,168,76,0.12); color: #C9A84C; }
  .rdp-day_selected:not([disabled]) { background: #C9A84C !important; color: #080808 !important; font-weight: 700; border-radius: 8px; }
  .rdp-day_today:not(.rdp-day_selected) { color: #C9A84C; font-weight: 600; position: relative; }
  .rdp-day_today:not(.rdp-day_selected)::after { content: ''; position: absolute; bottom: 4px; left: 50%; transform: translateX(-50%); width: 4px; height: 4px; border-radius: 50%; background: #C9A84C; }
  .rdp-day_outside { color: rgba(240,237,232,0.15) !important; }
  .rdp-day_disabled { color: rgba(240,237,232,0.18) !important; cursor: not-allowed !important; }
  .rdp-day_disabled:hover { background: transparent !important; color: rgba(240,237,232,0.18) !important; }
  .rdp-row td { padding: 2px; }
`

// ─── Main page ──────────────────────────────────────────────────────────────────
export default function Reservar() {
  const navigate = useNavigate()
  const { t } = useLanguage()

  // ── Wizard state ──
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  const [submitted, setSubmitted] = useState(false)

  // Step 1
  const [selectedService, setSelectedService] = useState<Service | null>(null)

  // Step 2
  const [dogName, setDogName] = useState('')
  const [dogBreed, setDogBreed] = useState('')
  const [dogSize, setDogSize] = useState<DogSize | ''>('')
  const [dogSex, setDogSex] = useState<DogSex | ''>('')
  const [dogNeutered, setDogNeutered] = useState(false)

  // Step 3
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [selectedTime, setSelectedTime] = useState('')

  // Step 4
  const [ownerName, setOwnerName] = useState('')
  const [ownerEmail, setOwnerEmail] = useState('')
  const [ownerPhone, setOwnerPhone] = useState('')
  const [submitError, setSubmitError] = useState('')

  // ── Data hooks ──
  const { data: services = [], isLoading: loadingServices } = useServices()
  const { data: schedules = [] } = useBusinessSchedules()
  const { data: blockedDateRows = [] } = useBlockedDates()
  const dateStr = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''
  const { data: availability, isLoading: loadingSlots } = useAvailability(
    dateStr,
    selectedService?.duration_minutes ?? 60,
  )
  const booking = usePublicBooking()

  // ── Derived ──
  const estimatedPrice = useMemo(() => {
    if (!selectedService || !dogSize) return null
    return getPriceForSize(selectedService, dogSize as DogSize)
  }, [selectedService, dogSize])

  const disabledDays = useMemo((): Matcher[] => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const matchers: Matcher[] = [{ before: today }]
    const closedDow = schedules.filter(s => !s.is_open).map(s => s.day_of_week)
    if (closedDow.length) matchers.push({ dayOfWeek: closedDow })
    blockedDateRows.forEach(bd => matchers.push(new Date(`${bd.date}T12:00:00`)))
    return matchers
  }, [schedules, blockedDateRows])

  const step2Valid = dogName.trim() !== '' && dogSize !== '' && dogSex !== ''
  const step3Valid = !!selectedDate && selectedTime !== ''
  const step4Valid = ownerName.trim() !== '' && ownerEmail.trim() !== '' && ownerPhone.trim() !== ''

  // ── Actions ──
  function goBack() {
    if (step === 1) { navigate('/') } else { setStep(s => (s - 1) as typeof s) }
  }

  async function handleConfirm() {
    if (!selectedService || !dogSize || !dogSex || !selectedDate || !selectedTime) return
    setSubmitError('')
    try {
      await booking.mutateAsync({
        ownerName, ownerEmail, ownerPhone,
        dogName, dogBreed, dogSize: dogSize as DogSize, dogSex: dogSex as DogSex, dogIsNeutered: dogNeutered,
        service: selectedService,
        scheduledDate: dateStr,
        scheduledTime: selectedTime,
        priceCharged: estimatedPrice ?? 0,
      })
      setSubmitted(true)
      window.scrollTo({ top: 0 })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : ''
      if (msg.toLowerCase().includes('already') || msg.toLowerCase().includes('registered')) {
        setSubmitError('Este email ya tiene una cuenta registrada. Por favor usa otro email o inicia sesión.')
      } else {
        setSubmitError('No se pudo completar la reserva. Por favor intenta de nuevo.')
      }
    }
  }

  // ──────────────────────────────────────────────────────────────────────────────
  // Success screen
  // ──────────────────────────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div style={{ background: C.bg, minHeight: '100vh', fontFamily: 'DM Sans, sans-serif', color: C.text }}>
        <style>{CALENDAR_CSS}</style>
        <div style={{ maxWidth: 560, margin: '0 auto', padding: '60px 20px 40px' }}>
          {/* Checkmark */}
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div
              style={{
                width: 72, height: 72, borderRadius: '50%',
                background: 'rgba(52,211,153,0.1)',
                border: '2px solid rgba(52,211,153,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 32, margin: '0 auto 20px',
              }}
            >
              ✓
            </div>
            <h1
              style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: 34, fontWeight: 600,
                color: C.text, margin: '0 0 10px', lineHeight: 1.2,
              }}
            >
              ¡Reserva Recibida!
            </h1>
            <p style={{ color: C.textMuted, fontSize: 15, margin: 0, lineHeight: 1.6 }}>
              Tu cita está <strong style={{ color: '#C9A84C' }}>pendiente de confirmación</strong>.<br />
              Te contactaremos al teléfono que dejaste para confirmar.
            </p>
          </div>

          {/* Booking summary */}
          <div
            style={{
              background: C.surface,
              border: `1px solid ${C.goldBorder}`,
              borderRadius: 16,
              padding: '24px',
              marginBottom: 28,
            }}
          >
            <div
              style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: 14, letterSpacing: 3, textTransform: 'uppercase',
                color: C.gold, marginBottom: 18,
              }}
            >
              Resumen de tu cita
            </div>
            {[
              { label: t('service'), value: selectedService?.name ?? '—' },
              { label: t('pet'), value: dogName },
              { label: 'Raza', value: dogBreed || '—' },
              { label: t('petSize'), value: SIZES.find(s => s.value === dogSize)?.labelKey ?? '—' },
              { label: t('date'), value: selectedDate ? fmtDate(selectedDate) : '—' },
              { label: t('time'), value: fmtTime(selectedTime) },
              { label: t('approximate_duration'), value: selectedService ? `${selectedService.duration_minutes} min` : '—' },
              { label: t('calculated_price'), value: estimatedPrice != null ? `$${estimatedPrice.toFixed(2)}` : '—' },
              { label: t('phone'), value: ownerPhone },
            ].map(row => (
              <div
                key={row.label}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                  borderBottom: `1px solid ${C.border}`, paddingBottom: 12, marginBottom: 12,
                  gap: 12,
                }}
              >
                <span style={{ color: C.textMuted, fontSize: 13 }}>{row.label}</span>
                <span
                  style={{
                    color: row.label === 'Precio estimado' ? C.gold : C.text,
                    fontSize: 13, fontWeight: row.label === 'Precio estimado' ? 600 : 400,
                    textAlign: 'right', textTransform: row.label === 'Fecha' ? 'capitalize' : undefined,
                  }}
                >
                  {row.value}
                </span>
              </div>
            ))}

            <div
              style={{
                background: C.goldSubtle,
                border: `1px solid ${C.goldBorder}`,
                borderRadius: 8, padding: '10px 14px', marginTop: 4,
                color: C.textMuted, fontSize: 12, lineHeight: 1.5,
              }}
            >
              📞 Q4 Paws te contactará al <strong style={{ color: C.text }}>{ownerPhone}</strong> para confirmar tu cita.
            </div>
          </div>

          {/* Contact info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <a
              href="/"
              style={{
                display: 'block', textAlign: 'center',
                background: C.gold, border: 'none', borderRadius: 10,
                padding: '16px', height: 56, lineHeight: '24px',
                color: '#080808', fontSize: 15, fontWeight: 700,
                textDecoration: 'none',
                fontFamily: 'DM Sans, sans-serif',
              }}
            >
              Volver al inicio
            </a>
            <div style={{ textAlign: 'center', color: C.textMuted, fontSize: 13 }}>
              ¿Dudas?{' '}
              <a href="tel:+13213188760" style={{ color: C.gold, textDecoration: 'none' }}>
                +1 (321) 318-8760
              </a>{' '}
              ·{' '}
              <a href="https://instagram.com/q4paws" target="_blank" rel="noreferrer" style={{ color: C.gold, textDecoration: 'none' }}>
                @q4paws
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ──────────────────────────────────────────────────────────────────────────────
  // Wizard layout
  // ──────────────────────────────────────────────────────────────────────────────
  return (
    <div style={{ background: C.bg, minHeight: '100vh', fontFamily: 'DM Sans, sans-serif', color: C.text }}>
      <style>{CALENDAR_CSS}</style>

      {/* Header */}
      <header
        style={{
          background: C.surface,
          borderBottom: `1px solid ${C.goldBorder}`,
          padding: '14px 20px',
          position: 'sticky', top: 0, zIndex: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 22, fontWeight: 600, color: C.gold, lineHeight: 1 }}>
            Q4 Paws
          </div>
          <div style={{ color: C.textSubtle, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', marginTop: 2 }}>
            Reservar cita
          </div>
        </div>
          <a href="/" style={{ color: C.textMuted, fontSize: 13, textDecoration: 'none' }}>← {t("home")}</a>
        </header>

        {/* Content */}
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '28px 16px 120px' }}>
          {/* Step indicator */}
          <div style={{ marginBottom: 32 }}>
            <StepIndicator step={step} t={t} />
          </div>

        {/* ── STEP 1: Servicio ── */}
        {step === 1 && (
          <div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 28, fontWeight: 600, color: C.text, margin: '0 0 6px' }}>
              Elige un servicio
            </h2>
            <p style={{ color: C.textMuted, fontSize: 14, margin: '0 0 24px', lineHeight: 1.6 }}>
              Todos los servicios incluyen baño con shampoo premium, secado profesional y revisión de orejas.
            </p>

            {loadingServices && (
              <div style={{ color: C.textMuted, fontSize: 14, textAlign: 'center', padding: '40px 0' }}>
                Cargando servicios...
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {services.map(svc => {
                const minPrice = getMinPrice(svc)
                const isSelected = selectedService?.id === svc.id
                return (
                  <button
                    key={svc.id}
                    onClick={() => { setSelectedService(svc); setStep(2) }}
                    style={{
                      background: isSelected ? 'rgba(201,168,76,0.06)' : C.surface,
                      border: `1px solid ${isSelected ? C.gold : C.goldBorder}`,
                      borderRadius: 14,
                      padding: '20px 22px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s',
                      width: '100%',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontFamily: 'Cormorant Garamond, serif',
                            fontSize: 22, fontWeight: 600, color: C.text,
                            marginBottom: 6, lineHeight: 1.2,
                          }}
                        >
                          {svc.name}
                        </div>
                        {svc.description && (
                          <div style={{ color: C.textMuted, fontSize: 13, lineHeight: 1.6, marginBottom: 10 }}>
                            {svc.description}
                          </div>
                        )}
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                          <span
                            style={{
                              background: C.goldSubtle, border: `1px solid ${C.goldBorder}`,
                              color: C.textMuted, borderRadius: 6, padding: '3px 10px', fontSize: 12,
                            }}
                          >
                            ⏱ {svc.duration_minutes} min
                          </span>
                          <span style={{ color: C.textSubtle, fontSize: 12 }}>XS → XXL</span>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ color: C.textSubtle, fontSize: 11, letterSpacing: 0.5, marginBottom: 2 }}>Desde</div>
                        <div
                          style={{
                            fontFamily: 'Cormorant Garamond, serif',
                            fontSize: 28, fontWeight: 600, color: C.gold, lineHeight: 1,
                          }}
                        >
                          {minPrice != null ? `$${minPrice}` : '—'}
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* ── STEP 2: Tu perro ── */}
        {step === 2 && (
          <div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 28, fontWeight: 600, color: C.text, margin: '0 0 6px' }}>
              Cuéntanos sobre tu perro
            </h2>
            <p style={{ color: C.textMuted, fontSize: 14, margin: '0 0 28px', lineHeight: 1.6 }}>
              Esta información nos ayuda a preparar el servicio ideal para tu mascota.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Nombre */}
              <div>
                <FieldLabel>Nombre del perro *</FieldLabel>
                <TextInput value={dogName} onChange={setDogName} placeholder="Ej: Luna, Max, Coco..." required />
              </div>

              {/* Raza */}
              <div>
                <FieldLabel>Raza (opcional)</FieldLabel>
                <TextInput value={dogBreed} onChange={setDogBreed} placeholder="Ej: Golden Retriever, Poodle..." />
              </div>

              {/* Tamaño */}
              <div>
                <FieldLabel>Tamaño *</FieldLabel>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {SIZES.map(sz => (
                    <button
                      key={sz.value}
                      type="button"
                      onClick={() => setDogSize(sz.value)}
                      style={{
                        background: dogSize === sz.value ? 'rgba(201,168,76,0.08)' : '#080808',
                        border: `1px solid ${dogSize === sz.value ? C.gold : C.goldBorder}`,
                        borderRadius: 10,
                        padding: '12px 16px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        transition: 'all 0.12s',
                      }}
                    >
                      <div>
                        <span style={{ color: C.text, fontSize: 14, fontWeight: 500 }}>{sz.label}</span>
                        <span style={{ color: C.textMuted, fontSize: 12, marginLeft: 10 }}>{sz.desc}</span>
                      </div>
                      {dogSize === sz.value && (
                        <span style={{ color: C.gold, fontSize: 16, flexShrink: 0 }}>✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sexo */}
              <div>
                <FieldLabel>Sexo *</FieldLabel>
                <div style={{ display: 'flex', gap: 10 }}>
                  {[{ value: 'male', label: '♂ Macho' }, { value: 'female', label: '♀ Hembra' }].map(s => (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => setDogSex(s.value as DogSex)}
                      style={{
                        flex: 1, height: 52,
                        background: dogSex === s.value ? 'rgba(201,168,76,0.08)' : '#080808',
                        border: `1px solid ${dogSex === s.value ? C.gold : C.goldBorder}`,
                        borderRadius: 10,
                        color: dogSex === s.value ? C.gold : C.textMuted,
                        fontSize: 14, fontWeight: dogSex === s.value ? 600 : 400,
                        cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                        transition: 'all 0.12s',
                      }}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Castrado */}
              <div>
                <button
                  type="button"
                  onClick={() => setDogNeutered(v => !v)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    background: 'transparent', border: 'none',
                    cursor: 'pointer', padding: 0, color: C.textMuted,
                    fontSize: 14, fontFamily: 'DM Sans, sans-serif',
                  }}
                >
                  <div
                    style={{
                      width: 22, height: 22, borderRadius: 5,
                      border: `2px solid ${dogNeutered ? C.gold : C.goldBorder}`,
                      background: dogNeutered ? C.gold : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, transition: 'all 0.12s',
                    }}
                  >
                    {dogNeutered && <span style={{ color: '#080808', fontSize: 13, fontWeight: 700, lineHeight: 1 }}>✓</span>}
                  </div>
                  <span>Está castrado / esterilizado</span>
                </button>
              </div>

              {/* Precio calculado */}
              {dogSize && selectedService && (
                <div
                  style={{
                    background: C.goldSubtle,
                    border: `1px solid ${C.goldBorder}`,
                    borderRadius: 10, padding: '16px 18px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ color: C.textMuted, fontSize: 12, marginBottom: 2 }}>Precio para tu perro</div>
                    <div style={{ color: C.textMuted, fontSize: 13 }}>
                      {selectedService.name} · {SIZES.find(s => s.value === dogSize)?.label}
                    </div>
                  </div>
                  <div
                    style={{
                      fontFamily: 'Cormorant Garamond, serif',
                      fontSize: 30, fontWeight: 600, color: C.gold,
                    }}
                  >
                    {estimatedPrice != null ? `$${estimatedPrice}` : '—'}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── STEP 3: Fecha y hora ── */}
        {step === 3 && (
          <div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 28, fontWeight: 600, color: C.text, margin: '0 0 6px' }}>
              Elige fecha y hora
            </h2>
            <p style={{ color: C.textMuted, fontSize: 14, margin: '0 0 24px', lineHeight: 1.6 }}>
              Solo se muestran los días y horarios disponibles en tiempo real.
            </p>

            {/* Calendar */}
            <div
              style={{
                background: C.surface,
                border: `1px solid ${C.goldBorder}`,
                borderRadius: 14, padding: '20px',
                marginBottom: 20,
              }}
            >
              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={day => { setSelectedDate(day); setSelectedTime('') }}
                disabled={disabledDays}
                fromDate={new Date()}
                locale={es}
                showOutsideDays={false}
              />
            </div>

            {/* Time slots */}
            {selectedDate && (
              <div>
                <div style={{ marginBottom: 12 }}>
                  <span style={{ color: C.textMuted, fontSize: 11, letterSpacing: 2, textTransform: 'uppercase' }}>
                    Horarios disponibles
                  </span>
                  <span style={{ color: C.textMuted, fontSize: 13, marginLeft: 8, textTransform: 'capitalize' }}>
                    · {fmtDate(selectedDate)}
                  </span>
                </div>

                {loadingSlots && (
                  <div style={{ color: C.textMuted, fontSize: 13, padding: '16px 0' }}>Verificando disponibilidad...</div>
                )}

                {!loadingSlots && availability && !availability.isOpen && (
                  <div
                    style={{
                      background: C.errorBg, border: `1px solid ${C.errorBorder}`,
                      borderRadius: 10, padding: '14px 16px',
                      color: 'rgba(239,68,68,0.8)', fontSize: 14,
                    }}
                  >
                    {availability.isBlocked
                      ? 'Este día está reservado para uso interno. Por favor elige otra fecha.'
                      : 'El negocio está cerrado este día. Por favor elige otro día.'}
                  </div>
                )}

                {!loadingSlots && availability?.isOpen && availability.slots.length === 0 && (
                  <div
                    style={{
                      background: C.errorBg, border: `1px solid ${C.errorBorder}`,
                      borderRadius: 10, padding: '14px 16px',
                      color: 'rgba(239,68,68,0.8)', fontSize: 14,
                    }}
                  >
                    No hay horarios disponibles para este día. Por favor elige otra fecha.
                  </div>
                )}

                {!loadingSlots && availability?.slots && availability.slots.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 8 }}>
                    {availability.slots.map(slot => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTime(slot)}
                        style={{
                          background: selectedTime === slot ? C.gold : C.surface,
                          border: `1px solid ${selectedTime === slot ? C.gold : C.goldBorder}`,
                          borderRadius: 10, padding: '13px 8px',
                          color: selectedTime === slot ? '#080808' : C.text,
                          fontSize: 14, fontWeight: selectedTime === slot ? 700 : 400,
                          cursor: 'pointer', fontFamily: 'DM Sans, sans-serif',
                          transition: 'all 0.12s', textAlign: 'center',
                          height: 52,
                        }}
                      >
                        {fmtTime(slot)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── STEP 4: Confirmación ── */}
        {step === 4 && (
          <div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 28, fontWeight: 600, color: C.text, margin: '0 0 6px' }}>
              Tus datos de contacto
            </h2>
            <p style={{ color: C.textMuted, fontSize: 14, margin: '0 0 28px', lineHeight: 1.6 }}>
              Te confirmaremos la cita por teléfono. Tus datos se mantienen privados.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 28 }}>
              <div>
                <FieldLabel>Nombre completo *</FieldLabel>
                <TextInput value={ownerName} onChange={setOwnerName} placeholder="Tu nombre y apellido" required />
              </div>
              <div>
                <FieldLabel>Email *</FieldLabel>
                <TextInput value={ownerEmail} onChange={setOwnerEmail} type="email" placeholder="tucorreo@email.com" required />
              </div>
              <div>
                <FieldLabel>Teléfono *</FieldLabel>
                <TextInput value={ownerPhone} onChange={setOwnerPhone} type="tel" placeholder="+1 (321) 000-0000" required />
              </div>
            </div>

            {/* Booking summary */}
            <div
              style={{
                background: C.surface,
                border: `1px solid ${C.goldBorder}`,
                borderRadius: 14, padding: '20px 22px',
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: 12, letterSpacing: 3, textTransform: 'uppercase',
                  color: C.gold, marginBottom: 16,
                }}
              >
                Resumen de tu cita
              </div>
              {[
                { label: 'Servicio', value: selectedService?.name ?? '—' },
                { label: 'Perro', value: `${dogName} · ${SIZES.find(s => s.value === dogSize)?.label ?? '—'}` },
                { label: 'Fecha', value: selectedDate ? fmtDate(selectedDate) : '—' },
                { label: 'Hora', value: fmtTime(selectedTime) },
                { label: 'Duración', value: selectedService ? `${selectedService.duration_minutes} min` : '—' },
              ].map(row => (
                <div
                  key={row.label}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                    gap: 12, padding: '9px 0',
                    borderBottom: `1px solid ${C.border}`,
                  }}
                >
                  <span style={{ color: C.textMuted, fontSize: 13 }}>{row.label}</span>
                  <span style={{ color: C.text, fontSize: 13, textAlign: 'right', textTransform: row.label === 'Fecha' ? 'capitalize' : undefined }}>
                    {row.value}
                  </span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, gap: 12 }}>
                <span style={{ color: C.textMuted, fontSize: 14 }}>Precio estimado</span>
                <span
                  style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontSize: 28, fontWeight: 600, color: C.gold,
                  }}
                >
                  {estimatedPrice != null ? `$${estimatedPrice.toFixed(2)}` : '—'}
                </span>
              </div>
            </div>

            <div
              style={{
                background: C.goldSubtle, border: `1px solid ${C.goldBorder}`,
                borderRadius: 8, padding: '12px 14px',
                color: C.textMuted, fontSize: 12, lineHeight: 1.6,
                marginBottom: 8,
              }}
            >
              Al confirmar, tu cita queda como <strong style={{ color: C.gold }}>pendiente</strong>. Sophia se comunicará contigo para la confirmación final.
            </div>

            {submitError && (
              <div
                style={{
                  background: C.errorBg, border: `1px solid ${C.errorBorder}`,
                  borderRadius: 8, padding: '12px 14px',
                  color: C.errorText, fontSize: 13, marginBottom: 8,
                }}
              >
                {submitError}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Sticky footer with nav buttons ── */}
      <div
        style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          background: C.surface,
          borderTop: `1px solid ${C.goldBorder}`,
          padding: '14px 16px',
          display: 'flex', justifyContent: 'space-between', gap: 12,
          zIndex: 20,
        }}
      >
        <GhostBtn onClick={goBack}>
          {step === 1 ? '← Inicio' : '← Atrás'}
        </GhostBtn>

        {/* Step 1: no explicit Next (selecting a card auto-advances) */}
        {step === 1 && (
          <PrimaryBtn disabled={!selectedService} onClick={() => setStep(2)}>
            Continuar →
          </PrimaryBtn>
        )}
        {step === 2 && (
          <PrimaryBtn disabled={!step2Valid} onClick={() => setStep(3)}>
            Continuar →
          </PrimaryBtn>
        )}
        {step === 3 && (
          <PrimaryBtn disabled={!step3Valid} onClick={() => setStep(4)}>
            Continuar →
          </PrimaryBtn>
        )}
        {step === 4 && (
          <PrimaryBtn disabled={!step4Valid || booking.isPending} onClick={handleConfirm}>
            {booking.isPending ? 'Reservando...' : 'Confirmar reserva ✓'}
          </PrimaryBtn>
        )}
      </div>
    </div>
  )
}
