import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API = 'https://api.resend.com/emails'
const FROM = 'Q4 Paws Dog Grooming <no-reply@q4paws.com>'
const BUSINESS_PHONE = '+1 (321) 318-8760'
const BUSINESS_INSTAGRAM = '@q4paws'
const TZ = 'America/New_York'

function formatTime(t: string): string {
  try {
    const [h, m] = t.split(':').map(Number)
    const ampm = h >= 12 ? 'PM' : 'AM'
    const hour = h % 12 || 12
    return `${hour}:${String(m).padStart(2, '0')} ${ampm}`
  } catch {
    return t
  }
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString('es-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: TZ,
  })
}

/** Returns "yyyy-MM-dd" for today and tomorrow in ET. */
function etDates(): { today: string; tomorrow: string } {
  const now = new Date()
  const etFormatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  const today = etFormatter.format(now)

  const tomorrowDate = new Date(now)
  tomorrowDate.setDate(tomorrowDate.getDate() + 1)
  const tomorrow = etFormatter.format(tomorrowDate)

  return { today, tomorrow }
}

/** Returns the current hour:minute in ET as total minutes from midnight. */
function etMinutesNow(): number {
  const now = new Date()
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TZ,
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  }).formatToParts(now)
  const h = parseInt(parts.find(p => p.type === 'hour')!.value)
  const m = parseInt(parts.find(p => p.type === 'minute')!.value)
  return h * 60 + m
}

function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

function reminder24hHtml(data: {
  ownerName: string
  dogName: string
  serviceName: string
  scheduledDate: string
  scheduledTime: string
  durationMinutes: number
  priceCharged: number
}): string {
  const { ownerName, dogName, serviceName, scheduledDate, scheduledTime, durationMinutes, priceCharged } = data
  const rows = [
    ['Servicio', serviceName],
    ['Mascota', dogName],
    ['Fecha', formatDate(scheduledDate)],
    ['Hora', formatTime(scheduledTime)],
    ['Duración', `${durationMinutes} minutos`],
    ['Precio estimado', `$${priceCharged.toFixed(2)}`],
  ]
  const rowsHtml = rows.map(([label, value]) => `
    <tr>
      <td style="padding:10px 0;color:rgba(240,237,232,0.55);font-size:13px;border-bottom:1px solid rgba(255,255,255,0.06);width:40%;vertical-align:top;">${label}</td>
      <td style="padding:10px 0;color:#F0EDE8;font-size:13px;border-bottom:1px solid rgba(255,255,255,0.06);text-align:right;">${value}</td>
    </tr>`).join('')

  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#080808;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#080808;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;">

        <tr><td style="padding-bottom:28px;text-align:center;">
          <div style="font-size:28px;font-weight:600;color:#C9A84C;letter-spacing:1px;margin-bottom:4px;">Q4 Paws</div>
          <div style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:rgba(240,237,232,0.35);">Dog Grooming · Kissimmee, FL</div>
        </td></tr>

        <tr><td style="padding-bottom:24px;">
          <div style="background:rgba(201,168,76,0.08);border:1px solid rgba(201,168,76,0.2);border-radius:10px;padding:14px 18px;text-align:center;">
            <div style="font-size:22px;margin-bottom:4px;">🐾</div>
            <div style="color:#C9A84C;font-size:15px;font-weight:600;">Recordatorio — tu cita es mañana</div>
          </div>
        </td></tr>

        <tr><td style="padding-bottom:24px;">
          <p style="margin:0;color:#F0EDE8;font-size:15px;line-height:1.6;">Hola <strong style="color:#C9A84C;">${ownerName}</strong>,</p>
          <p style="margin:10px 0 0;color:rgba(240,237,232,0.6);font-size:14px;line-height:1.7;">
            Te recordamos que mañana tienes cita para <strong style="color:#F0EDE8;">${dogName}</strong> en Q4 Paws.
            ¡Te esperamos!
          </p>
        </td></tr>

        <tr><td style="background:#0C0C0C;border:1px solid rgba(201,168,76,0.14);border-radius:14px;padding:24px;">
          <div style="font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#C9A84C;margin-bottom:16px;">Detalles de tu cita</div>
          <table width="100%" cellpadding="0" cellspacing="0">${rowsHtml}</table>
        </td></tr>

        <tr><td style="padding-top:20px;">
          <div style="background:rgba(201,168,76,0.06);border:1px solid rgba(201,168,76,0.14);border-radius:10px;padding:14px 16px;color:rgba(240,237,232,0.55);font-size:13px;line-height:1.6;">
            ¿Necesitas cancelar o cambiar la hora? Llámanos al
            <a href="tel:+13213188760" style="color:#C9A84C;text-decoration:none;">${BUSINESS_PHONE}</a>
            o escríbenos en Instagram
            <a href="https://instagram.com/q4paws" style="color:#C9A84C;text-decoration:none;">${BUSINESS_INSTAGRAM}</a>
            con anticipación.
          </div>
        </td></tr>

        <tr><td style="padding-top:32px;text-align:center;border-top:1px solid rgba(255,255,255,0.06);">
          <p style="margin:0;color:rgba(240,237,232,0.25);font-size:12px;line-height:1.8;">
            Q4 Paws Dog Grooming · Kissimmee, FL<br/>
            <a href="tel:+13213188760" style="color:rgba(201,168,76,0.5);text-decoration:none;">${BUSINESS_PHONE}</a>
            &nbsp;·&nbsp;
            <a href="https://instagram.com/q4paws" style="color:rgba(201,168,76,0.5);text-decoration:none;">${BUSINESS_INSTAGRAM}</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function reminder2hHtml(data: {
  ownerName: string
  dogName: string
  serviceName: string
  scheduledDate: string
  scheduledTime: string
  durationMinutes: number
}): string {
  const { ownerName, dogName, serviceName, scheduledDate, scheduledTime, durationMinutes } = data
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#080808;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#080808;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;">

        <tr><td style="padding-bottom:28px;text-align:center;">
          <div style="font-size:28px;font-weight:600;color:#C9A84C;letter-spacing:1px;margin-bottom:4px;">Q4 Paws</div>
          <div style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:rgba(240,237,232,0.35);">Dog Grooming · Kissimmee, FL</div>
        </td></tr>

        <tr><td style="padding-bottom:24px;">
          <div style="background:rgba(201,168,76,0.08);border:1px solid rgba(201,168,76,0.2);border-radius:10px;padding:14px 18px;text-align:center;">
            <div style="font-size:22px;margin-bottom:4px;">⏰</div>
            <div style="color:#C9A84C;font-size:15px;font-weight:600;">Tu cita es en 2 horas</div>
          </div>
        </td></tr>

        <tr><td style="padding-bottom:24px;">
          <p style="margin:0;color:#F0EDE8;font-size:15px;line-height:1.6;">Hola <strong style="color:#C9A84C;">${ownerName}</strong>,</p>
          <p style="margin:10px 0 0;color:rgba(240,237,232,0.6);font-size:14px;line-height:1.7;">
            ¡Tu cita para <strong style="color:#F0EDE8;">${dogName}</strong> es en 2 horas! Te esperamos en Q4 Paws.
          </p>
        </td></tr>

        <tr><td style="background:#0C0C0C;border:1px solid rgba(201,168,76,0.14);border-radius:14px;padding:20px 24px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:8px 0;color:rgba(240,237,232,0.55);font-size:13px;width:40%;">Servicio</td>
              <td style="padding:8px 0;color:#F0EDE8;font-size:13px;text-align:right;">${serviceName}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:rgba(240,237,232,0.55);font-size:13px;">Fecha</td>
              <td style="padding:8px 0;color:#F0EDE8;font-size:13px;text-align:right;">${formatDate(scheduledDate)}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:rgba(240,237,232,0.55);font-size:13px;">Hora</td>
              <td style="padding:8px 0;color:#C9A84C;font-size:15px;font-weight:700;text-align:right;">${formatTime(scheduledTime)}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;color:rgba(240,237,232,0.55);font-size:13px;">Duración</td>
              <td style="padding:8px 0;color:#F0EDE8;font-size:13px;text-align:right;">${durationMinutes} minutos</td>
            </tr>
          </table>
        </td></tr>

        <tr><td style="padding-top:20px;">
          <div style="background:rgba(201,168,76,0.06);border:1px solid rgba(201,168,76,0.14);border-radius:10px;padding:14px 16px;color:rgba(240,237,232,0.55);font-size:13px;line-height:1.6;">
            📞 ¿Algún problema de último minuto? Llámanos al
            <a href="tel:+13213188760" style="color:#C9A84C;text-decoration:none;">${BUSINESS_PHONE}</a>
          </div>
        </td></tr>

        <tr><td style="padding-top:32px;text-align:center;border-top:1px solid rgba(255,255,255,0.06);">
          <p style="margin:0;color:rgba(240,237,232,0.25);font-size:12px;line-height:1.8;">
            Q4 Paws Dog Grooming · Kissimmee, FL<br/>
            <a href="tel:+13213188760" style="color:rgba(201,168,76,0.5);text-decoration:none;">${BUSINESS_PHONE}</a>
            &nbsp;·&nbsp;
            <a href="https://instagram.com/q4paws" style="color:rgba(201,168,76,0.5);text-decoration:none;">${BUSINESS_INSTAGRAM}</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

async function sendEmail(to: string, subject: string, html: string, apiKey: string): Promise<void> {
  const res = await fetch(RESEND_API, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: FROM, to: [to], subject, html }),
  })
  if (!res.ok) {
    const err = await res.text()
    console.error(`Resend error sending to ${to}:`, err)
  }
}

Deno.serve(async (req) => {
  // Allow manual trigger via HTTP POST as well as scheduled invocations
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SERVICE_ROLE_KEY')!,
    )
    const resendKey = Deno.env.get('RESEND_API_KEY')!

    const { today, tomorrow } = etDates()
    const nowMinutes = etMinutesNow()
    // 2-hour window: appointments whose time is between now and now+120 min
    const windowStart = nowMinutes
    const windowEnd = nowMinutes + 120

    let sent24h = 0
    let sent2h = 0

    // ── 24h reminders ─────────────────────────────────────────────────────────
    const { data: appts24h, error: err24h } = await supabase
      .from('appointments')
      .select(`
        id, scheduled_date, scheduled_time, duration_minutes, price_charged_usd,
        profiles!appointments_client_id_fkey ( id, full_name ),
        dogs ( name, size ),
        services ( name )
      `)
      .in('status', ['confirmed', 'pending'])
      .eq('reminder_24h_sent', false)
      .eq('scheduled_date', tomorrow)

    if (err24h) {
      console.error('Error fetching 24h appointments:', err24h)
    } else if (appts24h && appts24h.length > 0) {
      for (const appt of appts24h) {
        const profile = appt.profiles as { id: string; full_name: string } | null
        const dog = appt.dogs as { name: string; size: string } | null
        const service = appt.services as { name: string } | null
        if (!profile || !dog || !service) continue

        const { data: userData } = await supabase.auth.admin.getUserById(profile.id)
        const email = userData?.user?.email
        if (!email) continue

        const html = reminder24hHtml({
          ownerName: profile.full_name,
          dogName: dog.name,
          serviceName: service.name,
          scheduledDate: appt.scheduled_date,
          scheduledTime: appt.scheduled_time,
          durationMinutes: appt.duration_minutes,
          priceCharged: appt.price_charged_usd,
        })

        await sendEmail(
          email,
          `🐾 Recordatorio: cita de ${dog.name} mañana a las ${formatTime(appt.scheduled_time)}`,
          html,
          resendKey,
        )

        await supabase
          .from('appointments')
          .update({ reminder_24h_sent: true })
          .eq('id', appt.id)

        sent24h++
      }
    }

    // ── 2h reminders ──────────────────────────────────────────────────────────
    const { data: appts2h, error: err2h } = await supabase
      .from('appointments')
      .select(`
        id, scheduled_date, scheduled_time, duration_minutes, price_charged_usd,
        profiles!appointments_client_id_fkey ( id, full_name ),
        dogs ( name, size ),
        services ( name )
      `)
      .in('status', ['confirmed', 'pending'])
      .eq('reminder_2h_sent', false)
      .eq('scheduled_date', today)

    if (err2h) {
      console.error('Error fetching 2h appointments:', err2h)
    } else if (appts2h && appts2h.length > 0) {
      for (const appt of appts2h) {
        const apptMinutes = timeToMinutes(appt.scheduled_time)
        // Only send if the appointment is within the 2-hour lookahead window
        if (apptMinutes < windowStart || apptMinutes > windowEnd) continue

        const profile = appt.profiles as { id: string; full_name: string } | null
        const dog = appt.dogs as { name: string; size: string } | null
        const service = appt.services as { name: string } | null
        if (!profile || !dog || !service) continue

        const { data: userData } = await supabase.auth.admin.getUserById(profile.id)
        const email = userData?.user?.email
        if (!email) continue

        const html = reminder2hHtml({
          ownerName: profile.full_name,
          dogName: dog.name,
          serviceName: service.name,
          scheduledDate: appt.scheduled_date,
          scheduledTime: appt.scheduled_time,
          durationMinutes: appt.duration_minutes,
        })

        await sendEmail(
          email,
          `🐾 Tu cita es en 2 horas — Q4 Paws`,
          html,
          resendKey,
        )

        await supabase
          .from('appointments')
          .update({ reminder_2h_sent: true })
          .eq('id', appt.id)

        sent2h++
      }
    }

    console.log(`Reminders sent: ${sent24h} × 24h, ${sent2h} × 2h`)
    return new Response(
      JSON.stringify({ ok: true, sent_24h: sent24h, sent_2h: sent2h }),
      { headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } },
    )
  } catch (err) {
    console.error('send-reminders fatal error:', err)
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 })
  }
})
