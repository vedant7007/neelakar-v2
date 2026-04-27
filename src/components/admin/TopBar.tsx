'use client'

import { useRouter } from 'next/navigation'
import { LogOut, Search, Sun, Moon } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAdminTheme } from './AdminThemeProvider'
import { motion } from 'framer-motion'

interface TopBarProps {
  userEmail?: string
  displayName?: string
}

export default function TopBar({ userEmail, displayName }: TopBarProps) {
  const router = useRouter()
  const supabase = createClient()
  const { theme, toggle } = useAdminTheme()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const initials = (displayName || userEmail || 'A')
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const isDark = theme === 'dark'

  return (
    <header className="h-[72px] backdrop-blur-xl border-b flex items-center justify-between px-8 sticky top-0 z-40 transition-colors duration-300"
      style={{ background: isDark ? 'rgba(10,10,10,0.8)' : 'rgba(240,236,230,0.85)', borderColor: 'var(--admin-border)' }}>
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <div className="relative w-full">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--admin-text-muted)' }} />
          <input
            type="text"
            placeholder="Search anything..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-all"
            style={{
              background: 'var(--admin-input-bg)',
              borderColor: 'var(--admin-border)',
              color: 'var(--admin-text)',
            }}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <button
          onClick={toggle}
          className="relative w-14 h-8 rounded-full p-1 transition-colors duration-300"
          style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)' }}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          <motion.div
            animate={{ x: isDark ? 0 : 24 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="w-6 h-6 rounded-full flex items-center justify-center"
            style={{ background: isDark ? 'rgba(255,255,255,0.1)' : '#fff', boxShadow: isDark ? 'none' : '0 1px 3px rgba(0,0,0,0.1)' }}
          >
            {isDark ? <Moon size={12} className="text-white/60" /> : <Sun size={12} className="text-amber-500" />}
          </motion.div>
        </button>

        <div className="w-px h-8 mx-2" style={{ background: 'var(--admin-border)' }} />

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-neel-rust/80 to-neel-tallow/60 flex items-center justify-center text-white text-xs font-bold">
            {initials}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium leading-none" style={{ color: isDark ? 'rgba(255,255,255,0.8)' : '#1a1a1a' }}>
              {displayName || 'Admin'}
            </p>
            <p className="text-[11px] mt-0.5" style={{ color: 'var(--admin-text-muted)' }}>{userEmail}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="p-2.5 rounded-xl transition-all"
          style={{ color: 'var(--admin-text-muted)' }}
          title="Logout"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  )
}
