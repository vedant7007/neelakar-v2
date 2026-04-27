import { NextResponse, type NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { emailLogs } from '@/lib/db/schema'
import { createClient } from '@/lib/supabase/server'
import { desc } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const limit = Math.min(
      Number(request.nextUrl.searchParams.get('limit') || '20'),
      100
    )

    const logs = await db
      .select({
        id: emailLogs.id,
        toEmail: emailLogs.toEmail,
        toName: emailLogs.toName,
        subject: emailLogs.subject,
        templateType: emailLogs.templateType,
        status: emailLogs.status,
        createdAt: emailLogs.createdAt,
      })
      .from(emailLogs)
      .orderBy(desc(emailLogs.createdAt))
      .limit(limit)

    return NextResponse.json({ logs })
  } catch (err) {
    console.error('Email logs error:', err)
    return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 })
  }
}
