import { useQuery } from '@tanstack/react-query'
import { addMinutes, format, parse, isBefore, isEqual } from 'date-fns'
import { supabase } from '@/lib/supabase'
import type { BusinessSchedule, BlockedDate } from '@/types'

const SLOT_INTERVAL_MINUTES = 30
const REFERENCE_DATE = '2000-01-01'

function generateSlots(openTime: string, closeTime: string, durationMinutes: number): string[] {
  const base = new Date(REFERENCE_DATE)
  const open = parse(openTime, 'HH:mm', base)
  const close = parse(closeTime, 'HH:mm', base)
  const lastStart = addMinutes(close, -durationMinutes)
  const slots: string[] = []
  let current = open
  while (isBefore(current, lastStart) || isEqual(current, lastStart)) {
    slots.push(format(current, 'HH:mm'))
    current = addMinutes(current, SLOT_INTERVAL_MINUTES)
  }
  return slots
}

export interface AvailabilityResult {
  isOpen: boolean
  isBlocked: boolean
  slots: string[]
  schedule: BusinessSchedule | null
}

export function useAvailability(date: string, durationMinutes: number = 60) {
  return useQuery({
    queryKey: ['availability', date, durationMinutes],
    queryFn: async (): Promise<AvailabilityResult> => {
      // date string like "2026-05-15" — parse at midnight to get correct day
      const dayOfWeek = new Date(`${date}T00:00:00`).getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6

      const [scheduleRes, blockedRes, appointmentsRes] = await Promise.all([
        supabase
          .from('business_schedules')
          .select('*')
          .eq('day_of_week', dayOfWeek)
          .single(),
        supabase
          .from('blocked_dates')
          .select('id')
          .eq('date', date),
        supabase
          .from('appointments')
          .select('scheduled_time')
          .eq('scheduled_date', date)
          .not('status', 'in', '(cancelled,no_show)'),
      ])

      const schedule = scheduleRes.data as BusinessSchedule | null
      const isBlocked = (blockedRes.data?.length ?? 0) > 0

      if (!schedule?.is_open || isBlocked) {
        return { isOpen: false, isBlocked, slots: [], schedule }
      }

      const allSlots = generateSlots(
        schedule.open_time!,
        schedule.close_time!,
        durationMinutes,
      )

      const takenTimes = (appointmentsRes.data ?? []).map(a => a.scheduled_time)

      const available = allSlots.filter(slot => {
        const count = takenTimes.filter(t => t === slot).length
        return count < schedule.max_concurrent_appointments
      })

      return { isOpen: true, isBlocked: false, slots: available, schedule }
    },
    enabled: !!date,
  })
}

export function useBusinessSchedules() {
  return useQuery({
    queryKey: ['business_schedules'],
    queryFn: async (): Promise<BusinessSchedule[]> => {
      const { data, error } = await supabase
        .from('business_schedules')
        .select('*')
        .order('day_of_week')
      if (error) throw error
      return data as BusinessSchedule[]
    },
  })
}

export function useBlockedDates() {
  return useQuery({
    queryKey: ['blocked_dates'],
    queryFn: async (): Promise<BlockedDate[]> => {
      const { data, error } = await supabase
        .from('blocked_dates')
        .select('*')
        .order('date')
      if (error) throw error
      return data as BlockedDate[]
    },
  })
}
