import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { submissions, customers, workshops, emailLogs } from '@/lib/db/schema'
import { createClient } from '@/lib/supabase/server'
import { sql, eq, gte, and } from 'drizzle-orm'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const [
      totalSubmissions,
      newSubmissions,
      totalCustomers,
      activeWorkshops,
      totalEmails,
      submissionsByType,
      submissionsByStatus,
      recentSubmissions,
      submissionsOverTime,
    ] = await Promise.all([
      db.select({ count: sql<number>`count(*)::int` }).from(submissions),
      db.select({ count: sql<number>`count(*)::int` }).from(submissions).where(eq(submissions.status, 'new')),
      db.select({ count: sql<number>`count(*)::int` }).from(customers),
      db.select({ count: sql<number>`count(*)::int` }).from(workshops).where(eq(workshops.isActive, true)),
      db.select({ count: sql<number>`count(*)::int` }).from(emailLogs),
      db.select({
        type: submissions.type,
        count: sql<number>`count(*)::int`,
      }).from(submissions).groupBy(submissions.type),
      db.select({
        status: submissions.status,
        count: sql<number>`count(*)::int`,
      }).from(submissions).groupBy(submissions.status),
      db.select({
        id: submissions.id,
        name: submissions.name,
        type: submissions.type,
        status: submissions.status,
        createdAt: submissions.createdAt,
      }).from(submissions).orderBy(sql`${submissions.createdAt} desc`).limit(5),
      db.select({
        date: sql<string>`to_char(${submissions.createdAt}, 'YYYY-MM-DD')`,
        count: sql<number>`count(*)::int`,
      }).from(submissions)
        .where(gte(submissions.createdAt, thirtyDaysAgo))
        .groupBy(sql`to_char(${submissions.createdAt}, 'YYYY-MM-DD')`)
        .orderBy(sql`to_char(${submissions.createdAt}, 'YYYY-MM-DD')`),
    ])

    return NextResponse.json({
      stats: {
        totalSubmissions: totalSubmissions[0]?.count || 0,
        newSubmissions: newSubmissions[0]?.count || 0,
        totalCustomers: totalCustomers[0]?.count || 0,
        activeWorkshops: activeWorkshops[0]?.count || 0,
        totalEmails: totalEmails[0]?.count || 0,
      },
      submissionsByType,
      submissionsByStatus,
      recentSubmissions,
      submissionsOverTime,
    })
  } catch (err) {
    console.error('Analytics error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
