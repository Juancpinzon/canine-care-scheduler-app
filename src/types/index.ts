export type DogSize = 'xs' | 'small' | 'medium' | 'large' | 'xl' | 'xxl'
export type DogSex = 'male' | 'female'
export type AppointmentStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'
export type UserRole = 'admin' | 'client'
export type PreferredLanguage = 'es' | 'en'

export interface Profile {
  id: string
  role: UserRole
  full_name: string | null
  phone: string | null
  preferred_language: PreferredLanguage
  avatar_url?: string | null
  created_at: string
  updated_at: string
}

export interface Dog {
  id: string
  owner_id: string
  name: string
  breed: string | null
  size: DogSize | null
  sex: DogSex | null
  is_neutered: boolean | null
  date_of_birth: string | null
  weight_lbs: number | null
  color: string | null
  photo_url: string | null
  vet_name: string | null
  vet_phone: string | null
  allergies: string | null
  medical_notes: string | null
  vaccination_rabies_date: string | null
  vaccination_bordetella_date: string | null
  vaccination_dhpp_date: string | null
  is_dog_friendly: boolean
  is_human_friendly: boolean
  behavior_notes: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Service {
  id: string
  name: string
  description: string | null
  duration_minutes: number
  price_xs: number | null
  price_small: number | null
  price_medium: number | null
  price_large: number | null
  price_xl: number | null
  price_xxl: number | null
  is_active: boolean
  sort_order: number
  created_at: string
}

export interface BusinessSchedule {
  id: string
  day_of_week: 0 | 1 | 2 | 3 | 4 | 5 | 6
  is_open: boolean
  open_time: string | null
  close_time: string | null
  max_concurrent_appointments: number
}

export interface BlockedDate {
  id: string
  date: string
  reason: string | null
  created_at: string
}

export interface Appointment {
  id: string
  client_id: string
  dog_id: string
  service_id: string
  scheduled_date: string
  scheduled_time: string
  duration_minutes: number
  status: AppointmentStatus
  price_charged_usd: number | null
  notes_client: string | null
  notes_admin: string | null
  groomer_notes: string | null
  before_photo_url: string | null
  after_photo_url: string | null
  reminder_24h_sent: boolean
  reminder_2h_sent: boolean
  created_at: string
  updated_at: string
}

export interface AppointmentStatusHistory {
  id: string
  appointment_id: string
  old_status: string | null
  new_status: string
  changed_by: string | null
  reason: string | null
  created_at: string
}

export interface GalleryPhoto {
  id: string
  photo_url: string
  caption: string | null
  is_visible: boolean
  sort_order: number
  created_at: string
}

export interface AppointmentWithRelations extends Appointment {
  dog: Pick<Dog, 'name' | 'breed' | 'size'>
  client: Pick<Profile, 'full_name' | 'phone'>
  service: Pick<Service, 'name' | 'duration_minutes'>
}

export function getPriceForSize(service: Service, size: DogSize): number | null {
  const map: Record<DogSize, keyof Service> = {
    xs:     'price_xs',
    small:  'price_small',
    medium: 'price_medium',
    large:  'price_large',
    xl:     'price_xl',
    xxl:    'price_xxl',
  }
  return service[map[size]] as number | null
}
