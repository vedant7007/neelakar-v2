import { NextResponse, type NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { brands } from '@/lib/db/schema'
import { createClient } from '@/lib/supabase/server'
import { asc, eq } from 'drizzle-orm'

export async function GET() {
  try {
    const all = await db
      .select().from(brands)
      .where(eq(brands.isActive, true))
      .orderBy(asc(brands.sortOrder))

    return NextResponse.json(all)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const [created] = await db.insert(brands).values({
      name: body.name,
      industry: body.industry || null,
      sortOrder: body.sortOrder || 0,
      isActive: body.isActive ?? true,
    }).returning()

    return NextResponse.json(created, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
