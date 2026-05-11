import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API = 'https://api.resend.com/emails'
const FROM = 'Q4 Paws Dog Grooming <no-reply@q4paws.com>'
const BUSINESS_EMAIL = 'q4pawsdg@gmail.com'
const BUSINESS_PHONE = '+1 (321) 318-8760'
const BUSINESS_INSTAGRAM = '@q4paws'

const SIZE_LABELS: Record<string, string> = {
  xs: 'Mini / Toy (≤5 lbs)',
  small: 'Pequeño (5–20 lbs)',
  medium: 'Mediano (20–40 lbs)',
  large: 'Grande (40–70 lbs)',
  xl: 'Extra Grande (70–100 lbs)',
  xxl: 'XXL / Gigante (100+ lbs)',
}

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
    timeZone: 'America/New_York',
  })
}

function confirmationHtml(data: {
  ownerName: string
  dogName: string
  serviceName: string
  dogSize: string
  scheduledDate: string
  scheduledTime: string
  durationMinutes: number
  priceCharged: number
}): string {
  const { ownerName, dogName, serviceName, dogSize, scheduledDate, scheduledTime, durationMinutes, priceCharged } = data
  const rows = [
    ['Servicio', serviceName],
    ['Mascota', dogName],
    ['Tamaño', SIZE_LABELS[dogSize] ?? dogSize],
    ['Fecha', formatDate(scheduledDate)],
    ['Hora', formatTime(scheduledTime)],
    ['Duración', `${durationMinutes} minutos`],
    ['Precio estimado', `$${priceCharged.toFixed(2)}`],
  ]

  const rowsHtml = rows.map(([label, value]) => `
    <tr>
      <td style="padding: 10px 0; color: rgba(240,237,232,0.55); font-size: 13px; border-bottom: 1px solid rgba(255,255,255,0.06); vertical-align: top; width: 40%;">${label}</td>
      <td style="padding: 10px 0; color: #F0EDE8; font-size: 13px; border-bottom: 1px solid rgba(255,255,255,0.06); text-align: right;">${value}</td>
    </tr>`).join('')

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Confirmación de cita — Q4 Paws</title>
</head>
<body style="margin:0;padding:0;background:#080808;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#080808;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:560px;">

          <!-- Header -->
          <tr>
            <td style="padding-bottom:32px;text-align:center;">
              <div style="font-size:28px;font-weight:600;color:#C9A84C;letter-spacing:1px;margin-bottom:4px;">Q4 Paws</div>
              <div style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:rgba(240,237,232,0.35);">Dog Grooming · Kissimmee, FL</div>
            </td>
          </tr>

          <!-- Status badge -->
          <tr>
            <td style="padding-bottom:28px;text-align:center;">
              <div style="display:inline-block;background:rgba(52,211,153,0.1);border:1px solid rgba(52,211,153,0.3);border-radius:99px;padding:6px 18px;color:#34d399;font-size:13px;font-weight:600;">
                ✓ &nbsp;Reserva Recibida
              </div>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding-bottom:24px;">
              <p style="margin:0;color:#F0EDE8;font-size:16px;line-height:1.6;">
                Hola <strong style="color:#C9A84C;">${ownerName}</strong>,
              </p>
              <p style="margin:10px 0 0;color:rgba(240,237,232,0.6);font-size:14px;line-height:1.7;">
                Hemos recibido tu solicitud de cita para <strong style="color:#F0EDE8;">${dogName}</strong>.
                Tu cita está <strong style="color:#C9A84C;">pendiente de confirmación</strong> — Sophia se comunicará contigo
                para confirmarla.
              </p>
            </td>
          </tr>

          <!-- Summary card -->
          <tr>
            <td style="background:#0C0C0C;border:1px solid rgba(201,168,76,0.14);border-radius:14px;padding:24px;">
              <div style="font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#C9A84C;margin-bottom:16px;">Resumen de tu cita</div>
              <table width="100%" cellpadding="0" cellspacing="0">
                ${rowsHtml}
              </table>
            </td>
          </tr>

          <!-- Note -->
          <tr>
            <td style="padding-top:20px;">
              <div style="background:rgba(201,168,76,0.06);border:1px solid rgba(201,168,76,0.14);border-radius:10px;padding:14px 16px;color:rgba(240,237,232,0.55);font-size:13px;line-height:1.6;">
                📞 Q4 Paws te contactará para confirmar tu cita. Si necesitas cancelar o cambiar la fecha, llámanos al
                <a href="tel:+13213188760" style="color:#C9A84C;text-decoration:none;">${BUSINESS_PHONE}</a>
                o escríbenos en Instagram
                <a href="https://instagram.com/q4paws" style="color:#C9A84C;text-decoration:none;">${BUSINESS_INSTAGRAM}</a>.
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding-top:36px;text-align:center;border-top:1px solid rgba(255,255,255,0.06);margin-top:32px;">
              <p style="margin:0;color:rgba(240,237,232,0.25);font-size:12px;line-height:1.8;">
                Q4 Paws Dog Grooming · Kissimmee, FL<br/>
                <a href="tel:+13213188760" style="color:rgba(201,168,76,0.5);text-decoration:none;">${BUSINESS_PHONE}</a>
                &nbsp;·&nbsp;
                <a href="https://instagram.com/q4paws" style="color:rgba(201,168,76,0.5);text-decoration:none;">${BUSINESS_INSTAGRAM}</a>
                &nbsp;·&nbsp;
                <a href="mailto:${BUSINESS_EMAIL}" style="color:rgba(201,168,76,0.5);text-decoration:none;">${BUSINESS_EMAIL}</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    })
  }

  try {
    const { appointment_id } = await req.json()
    if (!appointment_id) {
      return new Response(JSON.stringify({ error: 'appointment_id requerido' }), { status: 400 })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SERVICE_ROLE_KEY')!,
    )

    const { data: appt, error } = await supabase
      .from('appointments')
      .select(`
        id, scheduled_date, scheduled_time, duration_minutes, price_charged_usd,
        profiles!appointments_client_id_fkey ( full_name, id ),
        dogs ( name, size ),
        services ( name )
      `)
      .eq('id', appointment_id)
      .single()

    if (error || !appt) {
      return new Response(JSON.stringify({ error: 'Cita no encontrada' }), { status: 404 })
    }

    const profile = appt.profiles as { full_name: string; id: string } | null
    const dog = appt.dogs as { name: string; size: string } | null
    const service = appt.services as { name: string } | null

    if (!profile || !dog || !service) {
      return new Response(JSON.stringify({ error: 'Datos incompletos de la cita' }), { status: 422 })
    }

    // Get client email from auth
    const { data: userData } = await supabase.auth.admin.getUserById(profile.id)
    const clientEmail = userData?.user?.email
    if (!clientEmail) {
      return new Response(JSON.stringify({ error: 'Email del cliente no encontrado' }), { status: 422 })
    }

    const html = confirmationHtml({
      ownerName: profile.full_name,
      dogName: dog.name,
      serviceName: service.name,
      dogSize: dog.size,
      scheduledDate: appt.scheduled_date,
      scheduledTime: appt.scheduled_time,
      durationMinutes: appt.duration_minutes,
      priceCharged: appt.price_charged_usd,
    })

    // Send to client
    const resendRes = await fetch(RESEND_API, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM,
        to: [clientEmail],
        subject: `🐾 Reserva recibida — ${dog.name} · Q4 Paws`,
        html,
      }),
    })

    if (!resendRes.ok) {
      const err = await resendRes.text()
      console.error('Resend error (client):', err)
    }

    // Notify Sophia
    const adminNotifyRes = await fetch(RESEND_API, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM,
        to: [BUSINESS_EMAIL],
        subject: `Nueva cita: ${dog.name} (${profile.full_name}) — ${formatDate(appt.scheduled_date)} ${formatTime(appt.scheduled_time)}`,
        html: `<p style="font-family:sans-serif;color:#333;">
          <strong>Nueva cita recibida</strong><br/><br/>
          Cliente: ${profile.full_name} &lt;${clientEmail}&gt;<br/>
          Mascota: ${dog.name} (${SIZE_LABELS[dog.size] ?? dog.size})<br/>
          Servicio: ${service.name}<br/>
          Fecha: ${formatDate(appt.scheduled_date)}<br/>
          Hora: ${formatTime(appt.scheduled_time)}<br/>
          Precio: $${appt.price_charged_usd.toFixed(2)}
        </p>`,
      }),
    })

    if (!adminNotifyRes.ok) {
      const err = await adminNotifyRes.text()
      console.error('Resend error (admin):', err)
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    })
  } catch (err) {
    console.error('send-confirmation error:', err)
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 })
  }
})
