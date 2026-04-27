import { Resend } from 'resend'

let _resend: Resend | null = null

function getResend() {
  if (_resend) return _resend
  const key = process.env.RESEND_API_KEY
  if (!key || key.startsWith('your_')) throw new Error('RESEND_API_KEY is not configured')
  _resend = new Resend(key)
  return _resend
}

const FROM_EMAIL = 'Neelakar Creative House <hello@neelakar.com>'

export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
}: {
  to: string | string[]
  subject: string
  html: string
  replyTo?: string
}) {
  const resend = getResend()
  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: Array.isArray(to) ? to : [to],
    subject,
    html,
    replyTo,
  })

  if (error) throw new Error(error.message)
  return data
}

export async function sendEmailWithAttachment({
  to,
  subject,
  html,
  attachments,
}: {
  to: string | string[]
  subject: string
  html: string
  attachments: { filename: string; content: Buffer }[]
}) {
  const resend = getResend()
  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: Array.isArray(to) ? to : [to],
    subject,
    html,
    attachments,
  })

  if (error) throw new Error(error.message)
  return data
}
