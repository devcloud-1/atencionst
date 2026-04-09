import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface AlertEmailParams {
  rating: number
  visit_type: string
  comment: string | null
  name: string | null
  phone: string | null
  email: string | null
}

export async function sendNegativeReviewAlert(params: AlertEmailParams) {
  const { rating, visit_type, comment, name, phone, email } = params

  const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating)
  const tipo = visit_type === 'reparacion' ? 'Reparación' : 'Consulta'
  const clienteInfo = [
    name ? `<b>Nombre:</b> ${name}` : null,
    phone ? `<b>Teléfono:</b> ${phone}` : null,
    email ? `<b>Email:</b> ${email}` : null,
  ].filter(Boolean).join('<br/>')

  await resend.emails.send({
    from: 'Alertas Reseñas <alertas@resend.dev>',
    to: process.env.ALERT_EMAIL!,
    subject: `⚠️ Reseña negativa (${rating}/5) — ${tipo}`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:24px;border:1px solid #fee2e2;border-radius:12px">
        <h2 style="color:#dc2626;margin-top:0">⚠️ Nueva reseña negativa</h2>
        <p style="font-size:28px;margin:0">${stars}</p>
        <p><b>Tipo de visita:</b> ${tipo}</p>
        ${comment ? `<p><b>Comentario:</b><br/><em>"${comment}"</em></p>` : '<p style="color:#999">Sin comentario</p>'}
        ${clienteInfo ? `<div style="background:#fef2f2;padding:12px;border-radius:8px;margin-top:12px">${clienteInfo}</div>` : '<p style="color:#999">Cliente anónimo</p>'}
        <hr style="margin:20px 0;border:none;border-top:1px solid #f3f4f6"/>
        <a href="${process.env.NEXT_PUBLIC_APP_URL ?? 'https://atencionst.vercel.app'}/admin" style="background:#dc2626;color:white;padding:10px 20px;border-radius:8px;text-decoration:none;font-size:14px">Ver en panel admin →</a>
      </div>
    `,
  })
}
