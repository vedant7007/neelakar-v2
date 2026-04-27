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
    const { recipients, subject, message } = body as {
      recipients: { email: string; name: string }[]
      subject: string
      message: string
    }

    if (!recipients?.length || !subject || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const results: { email: string; success: boolean; error?: string }[] = []

    for (const recipient of recipients) {
      try {
        const html = customEmail(recipient.name || 'there', subject, message)
        const result = await sendEmail({ to: recipient.email, subject, html })

        await db.insert(emailLogs).values({
          toEmail: recipient.email,
          toName: recipient.name,
          subject,
          templateType: 'bulk',
          resendId: result?.id || null,
          status: 'sent',
          metadata: { message },
        })

        results.push({ email: recipient.email, success: true })
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error'
        results.push({ email: recipient.email, success: false, error: errorMsg })

        await db.insert(emailLogs).values({
          toEmail: recipient.email,
          toName: recipient.name,
          subject,
          templateType: 'bulk',
          status: 'failed',
          errorMessage: errorMsg,
          metadata: { message },
        })
      }
    }

    const sent = results.filter(r => r.success).length
    const failed = results.filter(r => !r.success).length

    return NextResponse.json({ sent, failed, results })
  } catch (err) {
    console.error('Bulk email error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
