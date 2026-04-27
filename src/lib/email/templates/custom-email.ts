import { emailLayout } from './base'

export function customEmail(recipientName: string, subject: string, body: string) {
  const htmlBody = body
    .split('\n\n')
    .map(p => `<p>${p.replace(/\n/g, '<br />')}</p>`)
    .join('')

  return emailLayout(`
    <h1>${subject}</h1>
    <p>Hi ${recipientName},</p>
    ${htmlBody}
    <hr class="divider" />
    <p style="font-size: 13px;">Sent from Neelakar Creative House</p>
  `)
}
