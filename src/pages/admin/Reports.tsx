import { useState, useMemo } from 'react'
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Loader2, Download, TrendingUp, Calendar, Users, DollarSign } from 'lucide-react'
import { useReports, ReportPeriod, MonthlyReportRow } from '@/hooks/useReports'

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  bg: '#080808',
  surface: '#0C0C0C',
  card: '#080808',
  cardHover: '#0F0F0F',
  gold: '#C9A84C',
  goldMuted: 'rgba(201,168,76,0.35)',
  goldSubtle: 'rgba(201,168,76,0.08)',
  goldBorder: 'rgba(201,168,76,0.12)',
  subtleBorder: 'rgba(255,255,255,0.07)',
  text: '#F0EDE8',
  textMuted: 'rgba(240,237,232,0.38)',
  textSubtle: 'rgba(240,237,232,0.22)',
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function KPICard({ title, value, sub, icon: Icon, color = C.gold }: { title: string; value: string | number; sub?: string; icon: any; color?: string }) {
  return (
    <div
      style={{
        background: C.surface,
        border: `1px solid ${C.goldBorder}`,
        borderRadius: 16,
        padding: '24px',
        flex: 1,
        minWidth: 200,
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ position: 'absolute', top: -10, right: -10, opacity: 0.05 }}>
        <Icon size={80} color={color} />
      </div>
      <div style={{ color: C.textMuted, fontSize: 13, fontWeight: 500, letterSpacing: 0.5, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
        <Icon size={14} color={color} />
        {title}
      </div>
      <div
        style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: 32,
          fontWeight: 600,
          color: C.text,
          lineHeight: 1.1,
        }}
      >
        {value}
      </div>
      {sub && <div style={{ color: color, fontSize: 12, marginTop: 6, fontWeight: 500 }}>{sub}</div>}
    </div>
  )
}

function Section({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 24, fontWeight: 600, color: C.text, margin: 0 }}>
          {title}
        </h2>
        {action}
      </div>
      <div style={{ background: C.surface, border: `1px solid ${C.subtleBorder}`, borderRadius: 16, padding: '24px' }}>
        {children}
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Reports() {
  const [period, setPeriod] = useState<ReportPeriod>('month')
  const { data, isLoading } = useReports(period)

  const exportCSV = () => {
    if (!data?.monthlyData) return
    const headers = ['Mes', 'Citas', 'Ingresos (USD)', 'Promedio (USD)'].join(',')
    const rows = data.monthlyData.map(r => `"${r.month}",${r.appointments},${r.revenue.toFixed(2)},${r.average.toFixed(2)}`).join('\n')
    const csvContent = "\uFEFF" + headers + '\n' + rows // Added BOM for Excel UTF-8
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `reporte_mensual_${format(new Date(), 'yyyy-MM-dd')}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (isLoading) {
    return (
      <div style={{ background: C.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={32} color={C.gold} style={{ animation: 'spin 1s linear infinite' }} />
      </div>
    )
  }

  return (
    <div style={{ background: C.bg, minHeight: '100vh', padding: '40px 20px', fontFamily: 'DM Sans, sans-serif', color: C.text }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        
        {/* Header */}
        <header style={{ marginBottom: 48, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
          <div>
            <div style={{ color: C.gold, fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>
              Análisis de Negocio
            </div>
            <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 42, fontWeight: 600, margin: 0, lineHeight: 1 }}>
              Reportes y Métricas
            </h1>
          </div>

          <div style={{ display: 'flex', background: '#111', borderRadius: 12, padding: 4, border: `1px solid ${C.subtleBorder}` }}>
            {(['week', 'month', 'year'] as ReportPeriod[]).map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  border: 'none',
                  background: period === p ? C.gold : 'transparent',
                  color: period === p ? '#000' : C.textMuted,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textTransform: 'capitalize'
                }}
              >
                {p === 'week' ? 'Semana' : p === 'month' ? 'Mes' : 'Año'}
              </button>
            ))}
          </div>
        </header>

        {/* Section 1: KPIs */}
        <div style={{ display: 'flex', gap: 20, marginBottom: 48, flexWrap: 'wrap' }}>
          <KPICard 
            title="Total Ingresos" 
            value={`$${data?.kpis.totalRevenue.toLocaleString()}`} 
            sub="Citas completadas" 
            icon={DollarSign} 
          />
          <KPICard 
            title="Citas Completadas" 
            value={data?.kpis.completedAppointments || 0} 
            sub="En el período" 
            icon={Calendar} 
          />
          <KPICard 
            title="Ticket Promedio" 
            value={`$${data?.kpis.averageTicket.toFixed(2)}`} 
            sub="Por cita" 
            icon={TrendingUp} 
          />
          <KPICard 
            title="Tasa de No-Show" 
            value={`${data?.kpis.noShowRate.toFixed(1)}%`} 
            sub="Citas perdidas" 
            icon={Users} 
            color="#EF4444"
          />
        </div>

        {/* Section 2: Ingresos por día */}
        <Section title="Ingresos por Día">
          <div style={{ height: 350, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.revenueByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis 
                  dataKey="label" 
                  stroke={C.textSubtle} 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false}
                  dy={10}
                />
                <YAxis 
                  stroke={C.textSubtle} 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(val) => `$${val}`}
                />
                <Tooltip 
                  contentStyle={{ background: '#111', border: `1px solid ${C.goldBorder}`, borderRadius: 8, fontSize: 12, color: C.text }}
                  itemStyle={{ color: C.gold }}
                  formatter={(value: number) => [`$${value.toFixed(2)}`, 'Ingresos']}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={C.gold} 
                  strokeWidth={3} 
                  dot={{ fill: C.gold, r: 4, strokeWidth: 0 }} 
                  activeDot={{ r: 6, stroke: '#000', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Section>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 32, marginBottom: 40 }}>
          
          {/* Section 3: Servicios más solicitados */}
          <Section title="Servicios Populares">
            <div style={{ height: 300, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.popularServices} layout="vertical" margin={{ left: 40 }}>
                  <XAxis type="number" hide />
                  <YAxis 
                    dataKey="label" 
                    type="category" 
                    stroke={C.text} 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    width={100}
                  />
                  <Tooltip 
                    contentStyle={{ background: '#111', border: `1px solid ${C.goldBorder}`, borderRadius: 8, fontSize: 12 }}
                  />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                    {data?.popularServices.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? C.gold : C.goldMuted} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Section>

          {/* Section 4: Citas por día de la semana */}
          <Section title="Citas por Día (Histórico)">
            <div style={{ height: 300, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.weekData}>
                  <XAxis 
                    dataKey="label" 
                    stroke={C.textSubtle} 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={false}
                  />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                    contentStyle={{ background: '#111', border: `1px solid ${C.goldBorder}`, borderRadius: 8, fontSize: 12 }}
                  />
                  <Bar dataKey="value" fill={C.goldSubtle} stroke={C.goldMuted} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Section>
        </div>

        {/* Section 5: Tabla de ingresos por mes */}
        <Section 
          title="Resumen Mensual" 
          action={
            <button 
              onClick={exportCSV}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: 'transparent',
                border: `1px solid ${C.goldMuted}`,
                borderRadius: 8,
                padding: '8px 14px',
                color: C.gold,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Download size={14} />
              Exportar CSV
            </button>
          }
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${C.subtleBorder}` }}>
                  <th style={{ textAlign: 'left', padding: '12px 16px', color: C.textMuted, fontWeight: 500 }}>Mes</th>
                  <th style={{ textAlign: 'center', padding: '12px 16px', color: C.textMuted, fontWeight: 500 }}>Citas</th>
                  <th style={{ textAlign: 'right', padding: '12px 16px', color: C.textMuted, fontWeight: 500 }}>Ingresos</th>
                  <th style={{ textAlign: 'right', padding: '12px 16px', color: C.textMuted, fontWeight: 500 }}>Promedio</th>
                </tr>
              </thead>
              <tbody>
                {data?.monthlyData.map((row, i) => (
                  <tr key={row.month} style={{ borderBottom: i === data.monthlyData.length - 1 ? 'none' : `1px solid ${C.subtleBorder}`, transition: 'background 0.2s' }}>
                    <td style={{ padding: '16px', color: C.text, fontWeight: 500 }}>{row.month}</td>
                    <td style={{ padding: '16px', textAlign: 'center', color: C.text }}>{row.appointments}</td>
                    <td style={{ padding: '16px', textAlign: 'right', color: C.gold, fontWeight: 600 }}>${row.revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td style={{ padding: '16px', textAlign: 'right', color: C.textMuted }}>${row.average.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

      </div>
    </div>
  )
}
