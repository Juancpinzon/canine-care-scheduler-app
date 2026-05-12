import { useState } from 'react'
import { format, parse } from 'date-fns'
import { AppointmentDetailPanel } from '@/components/admin/AppointmentDetailPanel'
import type { AppointmentStatus, AppointmentWithRelations } from '@/types'

// ─── Design tokens ────────────────────────────────────────────────────────────
export const C = {
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

// ─── Status configuration ─────────────────────────────────────────────────────
export interface StatusConfig {
  label: string
  bg: string
  color: string
}

export const STATUS: Record<AppointmentStatus, StatusConfig> = {
  pending:     { label: 'Pendiente',   bg: 'rgba(201,168,76,0.12)',  color: '#C9A84C' },
  confirmed:   { label: 'Confirmado',  bg: 'rgba(52,211,153,0.1)',   color: '#34D399' },
  in_progress: { label: 'En Progreso', bg: 'rgba(96,165,250,0.1)',   color: '#60A5FA' },
  completed:   { label: 'Completado',  bg: 'rgba(148,163,184,0.1)',  color: '#94A3B8' },
  cancelled:   { label: 'Cancelado',   bg: 'rgba(239,68,68,0.1)',    color: '#EF4444' },
  no_show:     { label: 'No Apareció', bg: 'rgba(239,68,68,0.1)',    color: '#EF4444' },
}

export interface Action {
  label: string
  newStatus: AppointmentStatus
  bg: string
  color: string
}

export function getActions(status: AppointmentStatus): Action[] {
  switch (status) {
    case 'pending':
      return [
        { label: 'Confirmar',   newStatus: 'confirmed',   bg: 'rgba(52,211,153,0.12)',  color: '#34D399' },
        { label: 'Cancelar',    newStatus: 'cancelled',   bg: 'rgba(239,68,68,0.1)',    color: '#EF4444' },
      ]
    case 'confirmed':
      return [
        { label: 'En Progreso', newStatus: 'in_progress', bg: 'rgba(96,165,250,0.12)',  color: '#60A5FA' },
        { label: 'Cancelar',    newStatus: 'cancelled',   bg: 'rgba(239,68,68,0.1)',    color: '#EF4444' },
      ]
    case 'in_progress':
      return [
        { label: 'Completar',   newStatus: 'completed',   bg: 'rgba(52,211,153,0.12)',  color: '#34D399' },
        { label: 'No Show',     newStatus: 'no_show',     bg: 'rgba(249,115,22,0.12)',  color: '#F97316' },
        { label: 'Cancelar',    newStatus: 'cancelled',   bg: 'rgba(239,68,68,0.1)',    color: '#EF4444' },
      ]
    default:
      return []
  }
}

export const SIZE_SHORT: Record<string, string> = {
  xs: 'Mini', small: 'S', medium: 'M', large: 'L', xl: 'XL', xxl: 'XXL',
}

export function formatTime(t: string) {
  try {
    return format(parse(t, 'HH:mm', new Date()), 'h:mm a')
  } catch {
    return t
  }
}

export function formatPrice(p: number | null) {
  if (p == null) return '—'
  return `$${p.toFixed(2)}`
}

export function StatCard({ value, label, sub, accent }: { value: string; label: string; sub?: string; accent?: string }) {
  return (
    <div
      style={{
        background: C.surface,
        border: `1px solid ${C.goldBorder}`,
        borderRadius: 12,
        padding: '20px 22px',
        flex: 1,
        minWidth: 120,
      }}
    >
      <div
        style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontSize: 36,
          fontWeight: 600,
          color: accent ?? C.text,
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div style={{ color: C.textMuted, fontSize: 12, marginTop: 6, letterSpacing: 0.5 }}>{label}</div>
      {sub && <div style={{ color: C.gold, fontSize: 11, marginTop: 3 }}>{sub}</div>}
    </div>
  )
}

export function StatusBadge({ status }: { status: AppointmentStatus }) {
  const cfg = STATUS[status]
  return (
    <span
      style={{
        background: cfg.bg,
        color: cfg.color,
        border: `1px solid ${cfg.color}30`,
        borderRadius: 20,
        padding: '3px 10px',
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: 0.3,
        whiteSpace: 'nowrap',
      }}
    >
      {cfg.label}
    </span>
  )
}

export function AppointmentCard({
  appt,
  onStatusChange,
  loading,
}: {
  appt: AppointmentWithRelations
  onStatusChange: (appt: AppointmentWithRelations, s: AppointmentStatus) => void
  loading: boolean
}) {
  const [expanded, setExpanded] = useState(false)
  const actions = getActions(appt.status)
  const hasActions = actions.length > 0
  const hasDetailPanel = appt.status === 'in_progress' || appt.status === 'completed'
  const isExpandable = hasActions || hasDetailPanel

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
      {/* Main row */}
      <div
        onClick={() => isExpandable && setExpanded(e => !e)}
        style={{
          display: 'flex',
          alignItems: 'stretch',
          cursor: isExpandable ? 'pointer' : 'default',
          padding: '0',
        }}
      >
        {/* Time column */}
        <div
          style={{
            background: C.goldSubtle,
            borderRight: `1px solid ${C.goldBorder}`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px 14px',
            minWidth: 72,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 20,
              fontWeight: 600,
              color: C.gold,
              lineHeight: 1.1,
              textAlign: 'center',
            }}
          >
            {formatTime(appt.scheduled_time)}
          </div>
          <div style={{ color: C.textSubtle, fontSize: 10, marginTop: 4, textAlign: 'center' }}>
            {appt.duration_minutes}m
          </div>
        </div>

        {/* Info */}
        <div style={{ flex: 1, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 6, minWidth: 0 }}>
          {/* Dog + owner row */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span
                  style={{
                    color: C.text,
                    fontSize: 16,
                    fontWeight: 600,
                    fontFamily: 'Cormorant Garamond, serif',
                    lineHeight: 1.2,
                  }}
                >
                  {appt.dog?.name ?? '—'}
                </span>
                {appt.dog?.size && (
                  <span
                    style={{
                      background: C.goldSubtle,
                      color: C.gold,
                      border: `1px solid ${C.goldBorder}`,
                      borderRadius: 4,
                      padding: '1px 7px',
                      fontSize: 10,
                      letterSpacing: 0.5,
                    }}
                  >
                    {SIZE_SHORT[appt.dog.size] ?? appt.dog.size}
                  </span>
                )}
              </div>
              <div style={{ color: C.textMuted, fontSize: 12, marginTop: 2 }}>
                {appt.dog?.breed ?? 'Raza desconocida'}
              </div>
            </div>
            <StatusBadge status={appt.status} />
          </div>

          {/* Owner */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: C.textMuted, fontSize: 12 }}>👤</span>
            <span style={{ color: C.textMuted, fontSize: 12 }}>
              {appt.client?.full_name ?? '—'}
              {appt.client?.phone ? (
                <>
                  {' · '}
                  <a
                    href={`tel:${appt.client.phone}`}
                    onClick={e => e.stopPropagation()}
                    style={{ color: C.gold, textDecoration: 'none' }}
                  >
                    {appt.client.phone}
                  </a>
                </>
              ) : null}
            </span>
          </div>

          {/* Service + price */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
            <span style={{ color: C.textMuted, fontSize: 12 }}>
              ✂️ {appt.service?.name ?? '—'}
            </span>
            <span
              style={{
                color: C.gold,
                fontSize: 15,
                fontWeight: 600,
                fontFamily: 'Cormorant Garamond, serif',
              }}
            >
              {formatPrice(appt.price_charged_usd)}
            </span>
          </div>

          {/* Photo indicator when photos exist */}
          {hasDetailPanel && (appt.before_photo_url || appt.after_photo_url) && (
            <div style={{ display: 'flex', gap: 4, marginTop: 2 }}>
              {appt.before_photo_url && (
                <span style={{ color: C.gold, fontSize: 11 }}>📷 Antes</span>
              )}
              {appt.after_photo_url && (
                <span style={{ color: C.gold, fontSize: 11 }}>📷 Después</span>
              )}
            </div>
          )}
        </div>

        {/* Expand hint */}
        {isExpandable && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '0 12px',
              color: C.textSubtle,
              fontSize: 14,
              flexShrink: 0,
            }}
          >
            {expanded ? '▲' : '▼'}
          </div>
        )}
      </div>

      {/* Expanded section: actions + detail panel */}
      {isExpandable && expanded && (
        <>
          {/* Action buttons */}
          {hasActions && (
            <div
              style={{
                borderTop: `1px solid ${C.subtleBorder}`,
                padding: '12px 16px',
                display: 'flex',
                gap: 8,
                flexWrap: 'wrap',
                background: '#0A0A0A',
              }}
            >
              {actions.map(action => (
                <button
                  key={action.newStatus}
                  onClick={e => {
                    e.stopPropagation()
                    onStatusChange(appt, action.newStatus)
                  }}
                  disabled={loading}
                  style={{
                    background: action.bg,
                    border: `1px solid ${action.color}30`,
                    borderRadius: 8,
                    padding: '10px 16px',
                    color: action.color,
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.6 : 1,
                    fontFamily: 'DM Sans, sans-serif',
                    height: 44,
                    transition: 'opacity 0.15s',
                    whiteSpace: 'nowrap',
                    flex: '1 1 auto',
                    minWidth: 90,
                  }}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}

          {/* Photos + groomer notes panel */}
          {hasDetailPanel && <AppointmentDetailPanel appt={appt} />}
        </>
      )}
    </div>
  )
}
