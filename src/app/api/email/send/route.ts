import { NextResponse, type NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { emailLogs } from '@/lib/db/schema'
import { createClient } from '@/lib/supabase/server'
import { sendEmail } from '@/lib/email'
import { customEmail } from '@/lib/email/templates/custom-email'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { to, toName, subject, message, customerId, submissionId } = body

    if (!to || !subject || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const html = customEmail(toName || 'there', subject, message)
    const result = await sendEmail({ to, subject, html })

    await db.insert(emailLogs).values({
      toEmail: to,
      toName: toName || null,
      subject,
      templateType: 'custom',
      customerId: customerId || null,
      submissionId: submissionId || null,
      resendId: result?.id || null,
      status: 'sent',
      metadata: { message },
    })

    return NextResponse.json({ success: true, id: result?.id })
  } catch (err) {
    console.error('Send email error:', err)
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
