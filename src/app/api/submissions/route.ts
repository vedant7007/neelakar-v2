import { NextResponse, type NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { submissions, customers, emailLogs } from '@/lib/db/schema'
import { submissionSchema } from '@/lib/validators/submission'
import { createClient } from '@/lib/supabase/server'
import { eq, desc, and, sql } from 'drizzle-orm'
import { sendEmail } from '@/lib/email'
import {
  generalConfirmation,
  launchpadConfirmation,
  workshopConfirmation,
} from '@/lib/email/templates/submission-confirmation'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = submissionSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: parsed.error.flatten() },
        { status: 400 },
      )
    }

    const data = parsed.data
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || null
    const ua = request.headers.get('user-agent') || null

    const [submission] = await db.insert(submissions).values({
      type: data.type,
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      message: data.message || null,
      serviceInterest: data.type === 'general' ? data.serviceInterest || null : null,
      businessName: data.type === 'launchpad' ? data.businessName : null,
      businessType: data.type === 'launchpad' ? data.businessType || null : null,
      budgetRange: data.type === 'launchpad' ? data.budgetRange || null : null,
      timeline: data.type === 'launchpad' ? data.timeline || null : null,
      projectDescription: data.type === 'launchpad' ? data.projectDescription : null,
      preferredWorkshop: data.type === 'workshop' ? data.preferredWorkshop || null : null,
      ipAddress: ip,
      userAgent: ua,
    }).returning()

    // Upsert customer record
    const existing = await db
      .select()
      .from(customers)
      .where(eq(customers.email, data.email))
      .limit(1)

    if (existing.length > 0) {
      const current = existing[0]
      const types = new Set(current.serviceTypes || [])
      types.add(data.type)

      await db
        .update(customers)
        .set({
          name: data.name,
          phone: data.phone || current.phone,
          serviceTypes: Array.from(types),
          totalSubmissions: sql`${customers.totalSubmissions} + 1`,
          lastContactAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(customers.id, current.id))
    } else {
      await db.insert(customers).values({
        email: data.email,
        name: data.name,
        phone: data.phone || null,
        serviceTypes: [data.type],
      })
    }

    // Send confirmation email (fire-and-forget, don't block response)
    try {
      let subject = ''
      let html = ''

      if (data.type === 'general') {
        subject = "We got your message — Neelakar Creative House"
        html = generalConfirmation(data.name)
      } else if (data.type === 'launchpad') {
        subject = "Your brand launch application — Neelakar Creative House"
        html = launchpadConfirmation(data.name, data.businessName)
      } else if (data.type === 'workshop') {
        subject = "Workshop enrollment received — Neelakar Creative House"
        html = workshopConfirmation(data.name, data.preferredWorkshop || null)
      }

      if (html) {
        const emailResult = await sendEmail({ to: data.email, subject, html })
        await db.insert(emailLogs).values({
          toEmail: data.email,
          toName: data.name,
          subject,
          templateType: `${data.type}_confirmation`,
          submissionId: submission.id,
          resendId: emailResult?.id || null,
          status: 'sent',
        })
      }
    } catch (emailErr) {
      console.error('Confirmation email failed:', emailErr)
    }

    return NextResponse.json({ success: true, id: submission.id }, { status: 201 })
  } catch (err) {
    console.error('Submission error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const url = new URL(request.url)
    const type = url.searchParams.get('type')
    const status = url.searchParams.get('status')
    const search = url.searchParams.get('search')
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    const conditions = []
    if (type && type !== 'all') conditions.push(eq(submissions.type, type))
    if (status && status !== 'all') conditions.push(eq(submissions.status, status))
    if (search) {
      conditions.push(
        sql`(${submissions.name} ILIKE ${'%' + search + '%'} OR ${submissions.email} ILIKE ${'%' + search + '%'})`,
      )
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined

    const [items, countResult] = await Promise.all([
      db
        .select()
        .from(submissions)
        .where(where)
        .orderBy(desc(submissions.createdAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(submissions)
        .where(where),
    ])

    return NextResponse.json({
      submissions: items,
      total: countResult[0]?.count || 0,
      page,
      limit,
    })
  } catch (err) {
    console.error('Fetch submissions error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
