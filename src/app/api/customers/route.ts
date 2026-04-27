import { NextResponse, type NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { customers } from '@/lib/db/schema'
import { createClient } from '@/lib/supabase/server'
import { desc, sql, and, eq } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const url = new URL(request.url)
    const status = url.searchParams.get('status')
    const search = url.searchParams.get('search')
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '20')
    const offset = (page - 1) * limit

    const conditions = []
    if (status && status !== 'all') conditions.push(eq(customers.status, status))
    if (search) {
      conditions.push(
        sql`(${customers.name} ILIKE ${'%' + search + '%'} OR ${customers.email} ILIKE ${'%' + search + '%'})`,
      )
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined

    const [items, countResult] = await Promise.all([
      db.select().from(customers).where(where)
        .orderBy(desc(customers.lastContactAt))
        .limit(limit).offset(offset),
      db.select({ count: sql<number>`count(*)::int` }).from(customers).where(where),
    ])

    return NextResponse.json({
      customers: items,
      total: countResult[0]?.count || 0,
      page,
      limit,
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
