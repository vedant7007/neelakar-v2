'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, Inbox, Users, GraduationCap,
  MessageSquareQuote, Image, FileText, Mail,
  Settings, PanelLeftClose, PanelLeft,
} from 'lucide-react'
import { useState } from 'react'
import { useAdminTheme } from './AdminThemeProvider'

const NAV_SECTIONS = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
      { label: 'Submissions', href: '/admin/submissions', icon: Inbox },
      { label: 'Customers', href: '/admin/customers', icon: Users },
    ],
  },
  {
    label: 'Content',
    items: [
      { label: 'Workshops', href: '/admin/workshops', icon: GraduationCap },
      { label: 'Testimonials', href: '/admin/testimonials', icon: MessageSquareQuote },
      { label: 'Portfolio', href: '/admin/portfolio', icon: Image },
      { label: 'Site Content', href: '/admin/content', icon: FileText },
    ],
  },
  {
    label: 'Communicate',
    items: [
      { label: 'Email', href: '/admin/email', icon: Mail },
    ],
  },
  {
    label: 'System',
    items: [
      { label: 'Settings', href: '/admin/settings', icon: Settings },
    ],
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const { theme } = useAdminTheme()
  const isDark = theme === 'dark'

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin'
    return pathname.startsWith(href)
  }

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="fixed left-0 top-0 h-screen z-50 flex flex-col border-r transition-colors duration-300"
      style={{ background: isDark ? '#0c0c0c' : '#1a1a1a', borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)' }}
    >
      {/* Logo */}
      <div className="h-[72px] flex items-center justify-between px-5 shrink-0">
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-2.5"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neel-rust to-neel-rust/70 flex items-center justify-center">
              <span className="font-display text-sm font-black text-white">N</span>
            </div>
            <div>
              <p className="font-display text-sm font-bold text-white tracking-tight leading-none">Neelakar</p>
              <p className="text-[10px] text-white/30 tracking-wider mt-0.5">CREATIVE HOUSE</p>
            </div>
          </motion.div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neel-rust to-neel-rust/70 flex items-center justify-center mx-auto">
            <span className="font-display text-sm font-black text-white">N</span>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-2 px-3 space-y-5 overflow-y-auto scrollbar-none">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            {!collapsed && (
              <p className="px-3 mb-2 text-[10px] font-semibold text-white/20 uppercase tracking-[0.2em]">
                {section.label}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = isActive(item.href)
                const Icon = item.icon

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200
                      ${active
                        ? 'text-white'
                        : 'text-white/40 hover:text-white/70 hover:bg-white/[0.03]'
                      }
                    `}
                  >
                    {active && (
                      <motion.div
                        layoutId="sidebar-active"
                        className="absolute inset-0 rounded-xl bg-white/[0.08] border border-white/[0.06]"
                        style={{
                          boxShadow: '0 0 20px rgba(201,86,30,0.08), inset 0 1px 0 rgba(255,255,255,0.03)',
                        }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    {active && (
                      <motion.div
                        layoutId="sidebar-glow"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-r-full bg-neel-rust"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    <Icon size={18} className="relative z-10 shrink-0" />
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="relative z-10 truncate"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Collapse toggle */}
      <div className="px-3 py-4 border-t border-white/[0.04]">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-white/25 hover:text-white/50 hover:bg-white/[0.03] transition-all text-xs"
        >
          {collapsed ? <PanelLeft size={16} /> : <PanelLeftClose size={16} />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </motion.aside>
  )
}
