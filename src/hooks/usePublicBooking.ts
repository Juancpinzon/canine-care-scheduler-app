import { useMutation } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { DogSize, DogSex, Service } from '@/types'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export interface PublicBookingPayload {
  ownerName: string
  ownerEmail: string
  ownerPhone: string
  dogName: string
  dogBreed: string
  dogSize: DogSize
  dogSex: DogSex
  dogIsNeutered: boolean
  service: Service
  scheduledDate: string   // "yyyy-MM-dd"
  scheduledTime: string   // "HH:mm"
  priceCharged: number
}

export interface PublicBookingResult {
  appointmentId: string
}

// Requires Supabase email confirmation DISABLED in project settings.
// Flow: signUp → profile upsert → dog insert → appointment insert.
export function usePublicBooking() {
  return useMutation({
    mutationFn: async (p: PublicBookingPayload): Promise<PublicBookingResult> => {
      const tempPwd = `${crypto.randomUUID()}-${crypto.randomUUID()}`

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: p.ownerEmail.trim().toLowerCase(),
        password: tempPwd,
        options: { data: { full_name: p.ownerName, phone: p.ownerPhone } },
      })

      if (authError) throw authError
      if (!authData.user) throw new Error('No se pudo crear la cuenta')

      const uid = authData.user.id

      // Upsert in case the on_auth_user_created trigger already created the row
      const { error: profileErr } = await supabase.from('profiles').upsert(
        {
          id: uid,
          role: 'client',
          full_name: p.ownerName,
          phone: p.ownerPhone,
          preferred_language: 'es',
        } as never,
        { onConflict: 'id' },
      )
      if (profileErr) throw profileErr

      const { data: dog, error: dogErr } = await supabase
        .from('dogs')
        .insert({
          owner_id: uid,
          name: p.dogName,
          breed: p.dogBreed || null,
          size: p.dogSize,
          sex: p.dogSex,
          is_neutered: p.dogIsNeutered,
          is_dog_friendly: true,
          is_human_friendly: true,
          is_active: true,
        } as never)
        .select('id')
        .single()
      if (dogErr) throw dogErr

      const { data: appt, error: apptErr } = await supabase
        .from('appointments')
        .insert({
          client_id: uid,
          dog_id: (dog as { id: string }).id,
          service_id: p.service.id,
          scheduled_date: p.scheduledDate,
          scheduled_time: p.scheduledTime,
          duration_minutes: p.service.duration_minutes,
          price_charged_usd: p.priceCharged,
          status: 'pending',
          reminder_24h_sent: false,
          reminder_2h_sent: false,
        } as never)
        .select('id')
        .single()
      if (apptErr) throw apptErr

      const appointmentId = (appt as { id: string }).id

      // Fire-and-forget: send confirmation email via Edge Function
      fetch(`${SUPABASE_URL}/functions/v1/send-confirmation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ appointment_id: appointmentId }),
      }).catch(e => console.warn('send-confirmation call failed:', e))

      return { appointmentId }
    },
  })
}
