import { NextResponse, type NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { workshops, workshopEnrollments, submissions, customers, emailLogs } from '@/lib/db/schema'
import { eq, and, sql } from 'drizzle-orm'
import { z } from 'zod'
import { sendEmail } from '@/lib/email'
import { workshopConfirmation } from '@/lib/email/templates/submission-confirmation'

const registerSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(320),
  phone: z.string().max(30).optional(),
})

// Public workshop registration — creates a submission, enrollment, and customer record.
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: workshopId } = await params
    const body = await request.json()
    const parsed = registerSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 })
    }
    const { name, email, phone } = parsed.data

    const [workshop] = await db.select().from(workshops).where(eq(workshops.id, workshopId)).limit(1)
    if (!workshop || !workshop.isActive) {
      return NextResponse.json({ error: 'Workshop not found' }, { status: 404 })
    }
    if (workshop.spotsFilled >= workshop.totalSpots) {
      return NextResponse.json({ error: 'This workshop is full' }, { status: 409 })
    }

    // One seat per email per workshop
    const [duplicate] = await db
      .select({ id: workshopEnrollments.id })
      .from(workshopEnrollments)
      .innerJoin(submissions, eq(workshopEnrollments.submissionId, submissions.id))
      .where(and(
        eq(workshopEnrollments.workshopId, workshopId),
        eq(submissions.email, email),
      ))
      .limit(1)
    if (duplicate) {
      return NextResponse.json({ error: 'You are already registered for this workshop' }, { status: 409 })
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || null
    const ua = request.headers.get('user-agent') || null

    const [submission] = await db.insert(submissions).values({
      type: 'workshop',
      name,
      email,
      phone: phone || null,
      preferredWorkshop: workshop.title,
      ipAddress: ip,
      userAgent: ua,
    }).returning()

    // Upsert customer
    const [existing] = await db.select().from(customers).where(eq(customers.email, email)).limit(1)
    let customerId: string
    if (existing) {
      const types = new Set(existing.serviceTypes || [])
      types.add('workshop')
      await db.update(customers).set({
        name,
        phone: phone || existing.phone,
        serviceTypes: Array.from(types),
        totalSubmissions: sql`${customers.totalSubmissions} + 1`,
        lastContactAt: new Date(),
        updatedAt: new Date(),
      }).where(eq(customers.id, existing.id))
      customerId = existing.id
    } else {
      const [created] = await db.insert(customers).values({
        email,
        name,
        phone: phone || null,
        serviceTypes: ['workshop'],
      }).returning()
      customerId = created.id
    }

    await db.insert(workshopEnrollments).values({
      submissionId: submission.id,
      workshopId,
      customerId,
    })

    await db.update(workshops)
      .set({ spotsFilled: sql`${workshops.spotsFilled} + 1`, updatedAt: new Date() })
      .where(eq(workshops.id, workshopId))

    // Confirmation email — best effort, never blocks the registration
    try {
      const subject = 'Workshop enrollment received — Neelakar Creative House'
      const html = workshopConfirmation(name, workshop.title)
      const emailResult = await sendEmail({ to: email, subject, html })
      await db.insert(emailLogs).values({
        toEmail: email,
        toName: name,
        subject,
        templateType: 'workshop_confirmation',
        submissionId: submission.id,
        resendId: emailResult?.id || null,
        status: 'sent',
      })
    } catch (emailErr) {
      console.error('Workshop confirmation email failed:', emailErr)
    }

    return NextResponse.json({ success: true, id: submission.id }, { status: 201 })
  } catch (err) {
    console.error('Workshop registration error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
