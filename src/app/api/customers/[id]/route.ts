import { NextResponse, type NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { customers, submissions } from '@/lib/db/schema'
import { createClient } from '@/lib/supabase/server'
import { eq, desc } from 'drizzle-orm'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const [customer] = await db
      .select().from(customers)
      .where(eq(customers.id, id)).limit(1)

    if (!customer) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const customerSubmissions = await db
      .select().from(submissions)
      .where(eq(submissions.email, customer.email))
      .orderBy(desc(submissions.createdAt))

    return NextResponse.json({ customer, submissions: customerSubmissions })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const body = await request.json()

    const updateData: Record<string, unknown> = { updatedAt: new Date() }
    if (body.status) updateData.status = body.status
    if (body.notes !== undefined) updateData.notes = body.notes

    const [updated] = await db
      .update(customers).set(updateData)
      .where(eq(customers.id, id)).returning()

    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
