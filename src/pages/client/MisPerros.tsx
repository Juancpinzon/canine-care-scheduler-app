import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'
import { useDogs, useCreateDog, useUpdateDog } from '@/hooks/useDogs'
import { useAppointments } from '@/hooks/useAppointments'
import { useLanguage } from '@/contexts/LanguageContext'
import ClientLayout from '@/components/client/ClientLayout'
import type { Dog, DogSize, DogSex } from '@/types'

const SIZE_LABELS: Record<DogSize, string> = {
  xs: 'XS — Muy pequeño', small: 'S — Pequeño', medium: 'M — Mediano',
  large: 'L — Grande', xl: 'XL — Extra grande', xxl: 'XXL — Gigante',
}

const dogSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  breed: z.string().optional(),
  size: z.enum(['xs', 'small', 'medium', 'large', 'xl', 'xxl']).nullable().optional(),
  sex: z.enum(['male', 'female']).nullable().optional(),
  is_neutered: z.boolean().optional(),
  date_of_birth: z.string().optional(),
  color: z.string().optional(),
  allergies: z.string().optional(),
  medical_notes: z.string().optional(),
  is_dog_friendly: z.boolean().optional(),
  is_human_friendly: z.boolean().optional(),
})

type DogFormData = z.infer<typeof dogSchema>

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: '#0A0A0A',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8,
  padding: '12px 14px',
  color: '#F0EDE8',
  fontSize: 14,
  outline: 'none',
  fontFamily: 'DM Sans, sans-serif',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 10,
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
  color: 'rgba(240,237,232,0.4)',
  marginBottom: 6,
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {children}
      {error && <p style={{ fontSize: 12, color: '#EF4444', marginTop: 4 }}>{error}</p>}
    </div>
  )
}

function CheckboxField({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
      <div
        onClick={() => onChange(!checked)}
        style={{
          width: 20, height: 20, borderRadius: 4,
          border: `1px solid ${checked ? '#C9A84C' : 'rgba(255,255,255,0.15)'}`,
          background: checked ? 'rgba(201,168,76,0.15)' : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, cursor: 'pointer',
        }}
      >
        {checked && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="#C9A84C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <span style={{ fontSize: 13, color: 'rgba(240,237,232,0.6)' }}>{label}</span>
    </label>
  )
}

interface DogFormProps {
  dog?: Dog
  ownerId: string
  onClose: () => void
}

function DogForm({ dog, ownerId, onClose }: DogFormProps) {
  const createDog = useCreateDog()
  const updateDog = useUpdateDog()

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<DogFormData>({
    resolver: zodResolver(dogSchema),
    defaultValues: dog
      ? {
          name: dog.name,
          breed: dog.breed ?? '',
          size: dog.size,
          sex: dog.sex,
          is_neutered: dog.is_neutered ?? false,
          date_of_birth: dog.date_of_birth ?? '',
          color: dog.color ?? '',
          allergies: dog.allergies ?? '',
          medical_notes: dog.medical_notes ?? '',
          is_dog_friendly: dog.is_dog_friendly,
          is_human_friendly: dog.is_human_friendly,
        }
      : {
          is_neutered: false,
          is_dog_friendly: true,
          is_human_friendly: true,
        },
  })

  const isNeutered = watch('is_neutered') ?? false
  const isDogFriendly = watch('is_dog_friendly') ?? true
  const isHumanFriendly = watch('is_human_friendly') ?? true

  async function onSubmit(data: DogFormData) {
    try {
      if (dog) {
        await updateDog.mutateAsync({
          id: dog.id,
          name: data.name,
          breed: data.breed || null,
          size: data.size || null,
          sex: data.sex || null,
          is_neutered: data.is_neutered ?? false,
          date_of_birth: data.date_of_birth || null,
          color: data.color || null,
          allergies: data.allergies || null,
          medical_notes: data.medical_notes || null,
          is_dog_friendly: data.is_dog_friendly ?? true,
          is_human_friendly: data.is_human_friendly ?? true,
        })
        toast.success('Perfil de mascota actualizado')
      } else {
        await createDog.mutateAsync({
          owner_id: ownerId,
          name: data.name,
          breed: data.breed || null,
          size: data.size || null,
          sex: data.sex || null,
          is_neutered: data.is_neutered ?? false,
          date_of_birth: data.date_of_birth || null,
          weight_lbs: null,
          color: data.color || null,
          photo_url: null,
          vet_name: null,
          vet_phone: null,
          allergies: data.allergies || null,
          medical_notes: data.medical_notes || null,
          vaccination_rabies_date: null,
          vaccination_bordetella_date: null,
          vaccination_dhpp_date: null,
          is_dog_friendly: data.is_dog_friendly ?? true,
          is_human_friendly: data.is_human_friendly ?? true,
          behavior_notes: null,
          is_active: true,
        })
        toast.success('Mascota agregada')
      }
      onClose()
    } catch {
      toast.error('No se pudo guardar. Intenta de nuevo.')
    }
  }

  const isPending = createDog.isPending || updateDog.isPending

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
        padding: '0',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#0C0C0C',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px 16px 0 0',
          width: '100%',
          maxWidth: 600,
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '28px 24px 40px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 24, fontWeight: 400, color: '#F0EDE8', margin: 0 }}>
            {dog ? 'Editar mascota' : 'Agregar mascota'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(240,237,232,0.4)', fontSize: 20, lineHeight: 1 }}>✕</button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <Field label="Nombre *" error={errors.name?.message}>
            <input {...register('name')} placeholder="Nombre del perro" style={inputStyle} />
          </Field>

          <Field label="Raza">
            <input {...register('breed')} placeholder="Ej. Golden Retriever" style={inputStyle} />
          </Field>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Tamaño">
              <select {...register('size')} style={{ ...inputStyle, appearance: 'none' }}>
                <option value="">Seleccionar</option>
                {(Object.entries(SIZE_LABELS) as [DogSize, string][]).map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            </Field>

            <Field label="Sexo">
              <select {...register('sex')} style={{ ...inputStyle, appearance: 'none' }}>
                <option value="">Seleccionar</option>
                <option value="male">Macho</option>
                <option value="female">Hembra</option>
              </select>
            </Field>
          </div>

          <Field label="Fecha de nacimiento">
            <input {...register('date_of_birth')} type="date" style={inputStyle} />
          </Field>

          <Field label="Color del pelaje">
            <input {...register('color')} placeholder="Ej. Negro, blanco y café" style={inputStyle} />
          </Field>

          <Field label="Alergias">
            <input {...register('allergies')} placeholder="Ej. Alergia a pulgas, ninguna" style={inputStyle} />
          </Field>

          <Field label="Notas médicas">
            <textarea
              {...register('medical_notes')}
              placeholder="Condiciones, medicamentos, vacunas especiales..."
              rows={3}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </Field>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '4px 0' }}>
            <CheckboxField
              label="Castrado / esterilizado"
              checked={isNeutered}
              onChange={(v) => setValue('is_neutered', v)}
            />
            <CheckboxField
              label="Amigable con otros perros"
              checked={isDogFriendly}
              onChange={(v) => setValue('is_dog_friendly', v)}
            />
            <CheckboxField
              label="Amigable con personas"
              checked={isHumanFriendly}
              onChange={(v) => setValue('is_human_friendly', v)}
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            style={{
              background: isPending ? 'rgba(201,168,76,0.5)' : '#C9A84C',
              color: '#080808',
              border: 'none',
              borderRadius: 10,
              padding: '16px',
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: isPending ? 'not-allowed' : 'pointer',
              marginTop: 8,
              minHeight: 56,
              transition: 'background 0.2s',
            }}
          >
            {isPending ? 'Guardando...' : dog ? 'Guardar cambios' : 'Agregar mascota'}
          </button>
        </form>
      </div>
    </div>
  )
}

function DogAvatar({ dog }: { dog: Dog }) {
  if (dog.photo_url) {
    return (
      <img
        src={dog.photo_url}
        alt={dog.name}
        style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(201,168,76,0.2)' }}
      />
    )
  }
  return (
    <div
      style={{
        width: 56, height: 56, borderRadius: '50%',
        background: 'rgba(201,168,76,0.1)',
        border: '1px solid rgba(201,168,76,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'Cormorant Garamond, serif',
        fontSize: 22, fontWeight: 600, color: '#C9A84C',
        flexShrink: 0,
      }}
    >
      {dog.name.charAt(0).toUpperCase()}
    </div>
  )
}

export default function MisPerros() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const { data: dogs, isLoading } = useDogs(user ? { ownerId: user.id } : undefined)
  const { data: allAppointments } = useAppointments(user ? { clientId: user.id } : undefined)
  const [showForm, setShowForm] = useState(false)
  const [editingDog, setEditingDog] = useState<Dog | undefined>()
  const [isEditing, setIsEditing] = useState(false)

  const appointmentCountByDog = new Map<string, number>()
  if (allAppointments) {
    for (const a of allAppointments) {
      appointmentCountByDog.set(a.dog_id, (appointmentCountByDog.get(a.dog_id) ?? 0) + 1)
    }
  }

  function openAdd() {
    setEditingDog(undefined)
    setIsEditing(true)
    setShowForm(true)
  }

  function openEdit(dog: Dog) {
    setEditingDog(dog)
    setIsEditing(true)
    setShowForm(true)
  }

  function closeForm() {
    setShowForm(false)
    setIsEditing(false)
    setEditingDog(undefined)
  }

  return (
    <ClientLayout>
      <div style={{ maxWidth: 720 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40 }}>
          <div>
            <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 34, fontWeight: 400, color: '#F0EDE8', marginBottom: 8 }}>
              {t('portalNavDogs')}
            </h1>
            <p style={{ fontSize: 13, color: 'rgba(240,237,232,0.4)', margin: 0 }}>
              {t('myDogsSubtitle')}
            </p>
          </div>
          {!isEditing && (
            <button
              onClick={openAdd}
              style={{
                background: '#C9A84C', color: '#080808', border: 'none', borderRadius: 8,
                padding: '10px 20px', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}
            >
              + {t('addDog')}
            </button>
          )}
        </div>

        {isLoading ? (
          <div style={{ color: 'rgba(240,237,232,0.3)', fontSize: 14 }}>Cargando...</div>
        ) : dogs && dogs.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {dogs.map((dog) => {
              const apptCount = appointmentCountByDog.get(dog.id) ?? 0
              return (
                <div
                  key={dog.id}
                  style={{
                    background: '#0C0C0C',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 12,
                    padding: '18px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                  }}
                >
                  <DogAvatar dog={dog} />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 16, fontWeight: 500, color: '#F0EDE8', marginBottom: 2 }}>{dog.name}</div>
                    <div style={{ fontSize: 12, color: 'rgba(240,237,232,0.4)', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      {dog.breed && <span>{dog.breed}</span>}
                      {dog.size && <span>· {SIZE_LABELS[dog.size] ?? dog.size}</span>}
                      {dog.sex && <span>· {dog.sex === 'male' ? 'Macho' : 'Hembra'}</span>}
                    </div>
                    <div style={{ fontSize: 11, color: 'rgba(201,168,76,0.6)', marginTop: 4 }}>
                      {apptCount === 0 ? 'Sin citas' : `${apptCount} cita${apptCount !== 1 ? 's' : ''}`}
                    </div>
                  </div>

                  <button
                    onClick={() => openEdit(dog)}
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: 'rgba(240,237,232,0.5)',
                      padding: '8px 16px',
                      fontSize: 11,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      borderRadius: 6,
                      transition: 'background 0.15s',
                      whiteSpace: 'nowrap',
                      minHeight: 36,
                    }}
                  >
                    Editar
                  </button>
                </div>
              )
            })}
          </div>
        ) : (
          <div
            style={{
              background: '#0C0C0C',
              border: '1px dashed rgba(201,168,76,0.2)',
              borderRadius: 12,
              padding: '48px 24px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>
              <svg width="56" height="56" viewBox="0 0 100 100" fill="#C9A84C" style={{ margin: '0 auto', display: 'block' }}>
                <circle cx="28" cy="35" r="9" />
                <circle cx="50" cy="24" r="9" />
                <circle cx="72" cy="35" r="9" />
                <ellipse cx="50" cy="66" rx="22" ry="20" />
              </svg>
            </div>
            <p style={{ color: 'rgba(240,237,232,0.4)', fontSize: 14, margin: '0 0 20px' }}>
              {t('noDogs')}
            </p>
            <button
              onClick={openAdd}
              style={{
                background: 'rgba(201,168,76,0.1)',
                border: '1px solid rgba(201,168,76,0.3)',
                color: '#C9A84C',
                padding: '12px 24px',
                fontSize: 12,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                borderRadius: 6,
                minHeight: 44,
              }}
            >
              {t('addYourFirstDog')}
            </button>
          </div>
        )}
      </div>

      {showForm && user && (
        <DogForm dog={editingDog} ownerId={user.id} onClose={closeForm} />
      )}
    </ClientLayout>
  )
}
