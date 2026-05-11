import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth, 
  startOfYear, 
  endOfYear, 
  format, 
  eachDayOfInterval, 
  parseISO,
  subMonths,
  eachMonthOfInterval
} from 'date-fns'
import { es } from 'date-fns/locale'

export type ReportPeriod = 'week' | 'month' | 'year'

export interface ReportKPIs {
  totalRevenue: number
  completedAppointments: number
  averageTicket: number
  noShowRate: number
}

export interface ChartDataPoint {
  label: string
  value: number
}

export interface MonthlyReportRow {
  month: string
  appointments: number
  revenue: number
  average: number
}

export function useReports(period: ReportPeriod) {
  return useQuery({
    queryKey: ['reports', period],
    queryFn: async () => {
      // Get current date in America/New_York
      const etString = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/New_York',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).format(new Date())

      // Parse the ET string to a Date object that date-fns can work with as if it were local
      const now = new Date(etString)
      let start: Date
      let end: Date

      if (period === 'week') {
        start = startOfWeek(now, { weekStartsOn: 1 })
        end = endOfWeek(now, { weekStartsOn: 1 })
      } else if (period === 'month') {
        start = startOfMonth(now)
        end = endOfMonth(now)
      } else {
        start = startOfYear(now)
        end = endOfYear(now)
      }

      const startDateStr = format(start, 'yyyy-MM-dd')
      const endDateStr = format(end, 'yyyy-MM-dd')

      // 1. Fetch appointments for the selected period
      const { data: periodAppointments, error: periodError } = await supabase
        .from('appointments')
        .select(`
          id,
          status,
          price_charged_usd,
          scheduled_date,
          service:services(name)
        `)
        .gte('scheduled_date', startDateStr)
        .lte('scheduled_date', endDateStr)

      if (periodError) throw periodError

      // 2. Fetch all-time appointments for Section 4 (historical day of week)
      const { data: allAppointments, error: allError } = await supabase
        .from('appointments')
        .select('scheduled_date')

      if (allError) throw allError

      // 3. Fetch last 6 months for Section 5
      const sixMonthsAgo = startOfMonth(subMonths(now, 5))
      const { data: last6MonthsAppts, error: sixMonthsError } = await supabase
        .from('appointments')
        .select('scheduled_date, price_charged_usd, status')
        .gte('scheduled_date', format(sixMonthsAgo, 'yyyy-MM-dd'))
        .eq('status', 'completed')

      if (sixMonthsError) throw sixMonthsError

      // CALCULATIONS

      // KPIs
      const completed = periodAppointments.filter(a => a.status === 'completed')
      const totalRevenue = completed.reduce((sum, a) => sum + (a.price_charged_usd ?? 0), 0)
      const completedCount = completed.length
      const averageTicket = completedCount > 0 ? totalRevenue / completedCount : 0
      const noShowCount = periodAppointments.filter(a => a.status === 'no_show').length
      const noShowRate = periodAppointments.length > 0 ? (noShowCount / periodAppointments.length) * 100 : 0

      const kpis: ReportKPIs = {
        totalRevenue,
        completedAppointments: completedCount,
        averageTicket,
        noShowRate
      }

      // Revenue per day
      const days = eachDayOfInterval({ start, end })
      const revenueByDay: ChartDataPoint[] = days.map(day => {
        const dateStr = format(day, 'yyyy-MM-dd')
        const revenue = periodAppointments
          .filter(a => a.status === 'completed' && a.scheduled_date === dateStr)
          .reduce((sum, a) => sum + (a.price_charged_usd ?? 0), 0)
        
        return {
          label: format(day, 'dd MMM', { locale: es }),
          value: revenue
        }
      })

      // Most requested services
      const serviceCounts: Record<string, number> = {}
      completed.forEach(a => {
        const service = a.service as { name: string } | null
        const name = service?.name || 'Desconocido'
        serviceCounts[name] = (serviceCounts[name] || 0) + 1
      })
      const popularServices: ChartDataPoint[] = Object.entries(serviceCounts)
        .map(([label, value]) => ({ label, value }))
        .sort((a, b) => b.value - a.value)

      // Appointments by day of week (historical)
      const dayOfWeekCounts: number[] = [0, 0, 0, 0, 0, 0, 0] // Sun-Sat
      const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
      
      allAppointments.forEach(a => {
        const date = parseISO(a.scheduled_date)
        const day = date.getDay()
        dayOfWeekCounts[day]++
      })
      
      // Reorder to Lun-Dom
      const weekData: ChartDataPoint[] = [
        { label: 'Lun', value: dayOfWeekCounts[1] },
        { label: 'Mar', value: dayOfWeekCounts[2] },
        { label: 'Mié', value: dayOfWeekCounts[3] },
        { label: 'Jue', value: dayOfWeekCounts[4] },
        { label: 'Vie', value: dayOfWeekCounts[5] },
        { label: 'Sáb', value: dayOfWeekCounts[6] },
        { label: 'Dom', value: dayOfWeekCounts[0] },
      ]

      // Monthly Table (last 6 months)
      const months = eachMonthOfInterval({ start: sixMonthsAgo, end: now })
      const monthlyData: MonthlyReportRow[] = months.map(month => {
        const monthStr = format(month, 'yyyy-MM')
        const monthAppts = last6MonthsAppts.filter(a => a.scheduled_date.startsWith(monthStr))
        const revenue = monthAppts.reduce((sum, a) => sum + (a.price_charged_usd ?? 0), 0)
        const count = monthAppts.length
        
        return {
          month: format(month, 'MMMM yyyy', { locale: es }),
          appointments: count,
          revenue: revenue,
          average: count > 0 ? revenue / count : 0
        }
      }).reverse()

      return {
        kpis,
        revenueByDay,
        popularServices,
        weekData,
        monthlyData
      }
    }
  })
}
