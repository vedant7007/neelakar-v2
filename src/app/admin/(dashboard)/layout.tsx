import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/admin/Sidebar'
import TopBar from '@/components/admin/TopBar'
import AdminThemeProvider from '@/components/admin/AdminThemeProvider'
import { db } from '@/lib/db'
import { adminProfiles } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/')

  let displayName = user.email
  try {
    const profile = await db
      .select({ displayName: adminProfiles.displayName })
      .from(adminProfiles)
      .where(eq(adminProfiles.id, user.id))
      .limit(1)
    if (profile[0]) displayName = profile[0].displayName
  } catch {
    // DB not connected yet
  }

  return (
    <AdminThemeProvider>
      <div className="flex min-h-screen bg-[var(--admin-bg)] transition-colors duration-300">
        <Sidebar />
        <div className="flex-1 ml-[260px] transition-all duration-200">
          <TopBar userEmail={user.email} displayName={displayName} />
          <main className="p-8">
            {children}
          </main>
        </div>
      </div>
    </AdminThemeProvider>
  )
}
