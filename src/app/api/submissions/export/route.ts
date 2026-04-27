import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { submissions } from '@/lib/db/schema'
import { createClient } from '@/lib/supabase/server'
import { desc } from 'drizzle-orm'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const all = await db.select().from(submissions).orderBy(desc(submissions.createdAt))

    const headers = ['ID', 'Type', 'Status', 'Name', 'Email', 'Phone', 'Message', 'Service Interest', 'Business Name', 'Business Type', 'Budget', 'Timeline', 'Project Description', 'Preferred Workshop', 'Admin Notes', 'Created At']

    const escape = (val: string | null | undefined) => {
      if (!val) return ''
      const str = String(val).replace(/"/g, '""')
      return str.includes(',') || str.includes('"') || str.includes('\n') ? `"${str}"` : str
    }

    const rows = all.map((s) => [
      s.id, s.type, s.status, s.name, s.email, s.phone, s.message,
      s.serviceInterest, s.businessName, s.businessType, s.budgetRange,
      s.timeline, s.projectDescription, s.preferredWorkshop, s.adminNotes,
      s.createdAt.toISOString(),
    ].map(escape).join(','))

    const csv = [headers.join(','), ...rows].join('\n')

    return new Response(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="submissions_${new Date().toISOString().split('T')[0]}.csv"`,
      },
    })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
