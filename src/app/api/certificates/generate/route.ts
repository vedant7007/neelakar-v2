import { NextResponse, type NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { workshopEnrollments, emailLogs } from '@/lib/db/schema'
import { createClient } from '@/lib/supabase/server'
import { eq } from 'drizzle-orm'
import { sendEmailWithAttachment } from '@/lib/email'
import { certificateEmail } from '@/lib/email/templates/certificate-email'
import { generateCertificatePdf } from '@/lib/certificates'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { participants, workshopTitle, template, content } = body as {
      participants: {
        enrollmentId: string
        name: string
        email: string
      }[]
      workshopTitle: string
      template: string
      content: {
        title: string
        body: string
        instructor: string
        dates: string
        location: string
        customLine?: string
      }
    }

    if (!participants?.length || !workshopTitle || !template) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const results: { name: string; email: string; success: boolean; error?: string }[] = []

    for (const participant of participants) {
      try {
        const pdfBuffer = await generateCertificatePdf({
          template,
          participantName: participant.name,
          workshopTitle,
          ...content,
        })

        const html = certificateEmail(participant.name, workshopTitle)
        const subject = `Your Certificate — ${workshopTitle}`

        await sendEmailWithAttachment({
          to: participant.email,
          subject,
          html,
          attachments: [{
            filename: `Certificate_${participant.name.replace(/\s+/g, '_')}.pdf`,
            content: pdfBuffer,
          }],
        })

        await db
          .update(workshopEnrollments)
          .set({
            enrollmentStatus: 'certified',
            certificateSentAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(workshopEnrollments.id, participant.enrollmentId))

        await db.insert(emailLogs).values({
          toEmail: participant.email,
          toName: participant.name,
          subject,
          templateType: 'certificate',
          status: 'sent',
          metadata: { workshopTitle, template },
        })

        results.push({ name: participant.name, email: participant.email, success: true })
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error'
        results.push({ name: participant.name, email: participant.email, success: false, error: errorMsg })
      }
    }

    const sent = results.filter(r => r.success).length
    const failed = results.filter(r => !r.success).length

    return NextResponse.json({ sent, failed, results })
  } catch (err) {
    console.error('Certificate generation error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
