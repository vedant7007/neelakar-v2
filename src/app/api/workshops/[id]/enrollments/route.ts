import { NextResponse, type NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { workshopEnrollments, submissions, customers } from '@/lib/db/schema'
import { createClient } from '@/lib/supabase/server'
import { eq, and } from 'drizzle-orm'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id: workshopId } = await params

    const enrollments = await db
      .select({
        enrollment: workshopEnrollments,
        submission: {
          name: submissions.name,
          email: submissions.email,
          phone: submissions.phone,
        },
      })
      .from(workshopEnrollments)
      .innerJoin(submissions, eq(workshopEnrollments.submissionId, submissions.id))
      .where(eq(workshopEnrollments.workshopId, workshopId))

    return NextResponse.json(enrollments)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id: workshopId } = await params
    const body = await request.json()
    const { submissionId } = body

    const [sub] = await db.select().from(submissions).where(eq(submissions.id, submissionId)).limit(1)
    if (!sub) return NextResponse.json({ error: 'Submission not found' }, { status: 404 })

    const [customer] = await db.select().from(customers).where(eq(customers.email, sub.email)).limit(1)

    const existing = await db
      .select().from(workshopEnrollments)
      .where(and(
        eq(workshopEnrollments.submissionId, submissionId),
        eq(workshopEnrollments.workshopId, workshopId),
      ))
      .limit(1)

    if (existing.length > 0) {
      return NextResponse.json({ error: 'Already enrolled' }, { status: 409 })
    }

    const [enrollment] = await db.insert(workshopEnrollments).values({
      submissionId,
      workshopId,
      customerId: customer?.id || null,
    }).returning()

    return NextResponse.json(enrollment, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
