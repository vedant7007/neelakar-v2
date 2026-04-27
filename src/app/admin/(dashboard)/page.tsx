'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  Inbox, Users, GraduationCap, Mail,
  TrendingUp, ArrowUpRight, ArrowRight, Plus,
  Sparkles, Clock,
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar,
} from 'recharts'
import Link from 'next/link'
import { useAdminTheme } from '@/components/admin/AdminThemeProvider'

type Analytics = {
  stats: {
    totalSubmissions: number
    newSubmissions: number
    totalCustomers: number
    activeWorkshops: number
    totalEmails: number
  }
  submissionsByType: { type: string; count: number }[]
  submissionsByStatus: { status: string; count: number }[]
  recentSubmissions: { id: string; name: string; type: string; status: string; createdAt: string }[]
  submissionsOverTime: { date: string; count: number }[]
}

const TYPE_COLORS: Record<string, string> = { general: '#4DB6AC', launchpad: '#E8845C', workshop: '#D4A84B' }
const STATUS_COLORS: Record<string, string> = { new: '#60A5FA', contacted: '#FBBF24', in_progress: '#FB923C', completed: '#34D399', archived: '#6B7280' }

function AnimatedNumber({ value, duration = 1200 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0)
  const ref = useRef<number>(0)

  useEffect(() => {
    const start = ref.current
    const diff = value - start
    if (diff === 0) return
    const startTime = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - startTime) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      const current = Math.round(start + diff * eased)
      setDisplay(current)
      if (t < 1) requestAnimationFrame(tick)
      else ref.current = value
    }
    requestAnimationFrame(tick)
  }, [value, duration])

  return <>{display.toLocaleString('en-IN')}</>
}

const STAT_CONFIG = [
  { key: 'totalSubmissions' as const, label: 'Total Submissions', icon: Inbox, accent: '#4DB6AC' },
  { key: 'newSubmissions' as const, label: 'New & Unread', icon: Sparkles, accent: '#C9561E' },
  { key: 'totalCustomers' as const, label: 'Customers', icon: Users, accent: '#34D399' },
  { key: 'activeWorkshops' as const, label: 'Active Workshops', icon: GraduationCap, accent: '#D4A84B' },
  { key: 'totalEmails' as const, label: 'Emails Sent', icon: Mail, accent: '#A78BFA' },
]

export default function AdminDashboard() {
  const [data, setData] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)
  const { theme } = useAdminTheme()
  const isDark = theme === 'dark'

  useEffect(() => {
    fetch('/api/analytics')
      .then(r => r.ok ? r.json() : null)
      .then(d => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const timeAgo = (dateStr: string) => {
    const mins = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000)
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  // Theme-aware colors
  const c = {
    heading: isDark ? '#ffffff' : '#2c2c2c',
    subtext: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(44,44,44,0.4)',
    muted: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(44,44,44,0.2)',
    faint: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(44,44,44,0.1)',
    cardBg: isDark ? 'rgba(255,255,255,0.03)' : '#f7f5f1',
    cardBorder: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
    statCardBg: (accent: string) => isDark ? `${accent}12` : '#f7f5f1',
    statCardBorder: (accent: string) => isDark ? `${accent}18` : 'rgba(0,0,0,0.05)',
    iconBg: (accent: string) => isDark ? `${accent}20` : `${accent}15`,
    statValue: isDark ? '#ffffff' : '#2c2c2c',
    statLabel: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(44,44,44,0.45)',
    tooltipBg: isDark ? '#1a1a1a' : '#faf8f5',
    tooltipBorder: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
    tooltipDateColor: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(44,44,44,0.4)',
    tooltipTextColor: isDark ? '#ffffff' : '#2c2c2c',
    axisColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(44,44,44,0.2)',
    axisLabelColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(44,44,44,0.25)',
    badgeBg: isDark ? 'rgba(52,211,153,0.1)' : 'rgba(52,211,153,0.1)',
    badgeColor: isDark ? '#34D399' : '#059669',
    recentRowHover: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
    nameColor: isDark ? 'rgba(255,255,255,0.8)' : 'rgba(44,44,44,0.8)',
    dotLabelColor: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(44,44,44,0.5)',
    dotCountColor: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(44,44,44,0.7)',
    linkColor: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(44,44,44,0.35)',
    skeletonBg: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)',
    quickBg: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
    quickBorder: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
    quickText: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(44,44,44,0.45)',
    quickTextHover: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(44,44,44,0.75)',
    quickIconColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(44,44,44,0.25)',
    cursorStroke: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
    chartDotStroke: isDark ? '#0a0a0a' : '#f7f5f1',
    emptyIcon: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(44,44,44,0.12)',
    emptyText: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(44,44,44,0.3)',
  }

  const TYPE_BG = (type: string) => {
    const color = TYPE_COLORS[type] || '#555'
    return { background: `${color}18`, color }
  }

  const STATUS_DOT_COLOR: Record<string, string> = { new: '#60A5FA', contacted: '#FBBF24', in_progress: '#FB923C', completed: '#34D399', archived: '#6B7280' }

  function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value?: number }>; label?: string }) {
    if (!active || !payload?.length) return null
    return (
      <div style={{ background: c.tooltipBg, border: `1px solid ${c.tooltipBorder}`, borderRadius: 12, padding: '10px 16px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
        <p style={{ color: c.tooltipDateColor, fontSize: 11, marginBottom: 4 }}>{label ? new Date(label).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' }) : ''}</p>
        <p style={{ color: c.tooltipTextColor, fontWeight: 600, fontSize: 13 }}>{payload[0].value} submissions</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-16 rounded-2xl" style={{ background: c.skeletonBg }} />
        <div className="grid grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => <div key={i} className="h-32 rounded-2xl" style={{ background: c.skeletonBg }} />)}
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 h-72 rounded-2xl" style={{ background: c.skeletonBg }} />
          <div className="h-72 rounded-2xl" style={{ background: c.skeletonBg }} />
        </div>
      </div>
    )
  }

  const stats = data?.stats || { totalSubmissions: 0, newSubmissions: 0, totalCustomers: 0, activeWorkshops: 0, totalEmails: 0 }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="font-display text-3xl font-bold tracking-tight" style={{ color: c.heading }}>
          {greeting()}
        </h1>
        <p className="mt-1 text-sm" style={{ color: c.subtext }}>Here&apos;s what&apos;s happening with Neelakar today.</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {STAT_CONFIG.map((stat, i) => {
          const Icon = stat.icon
          const value = stats[stat.key]
          return (
            <motion.div
              key={stat.key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              className="relative overflow-hidden rounded-2xl p-5 hover:scale-[1.02] transition-transform duration-300"
              style={{
                background: c.cardBg,
                border: `1px solid ${c.cardBorder}`,
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ background: c.iconBg(stat.accent), color: stat.accent }}
              >
                <Icon size={20} />
              </div>
              <p className="text-3xl font-bold font-display tracking-tight" style={{ color: c.statValue }}>
                <AnimatedNumber value={value} />
              </p>
              <p className="text-[13px] mt-1 font-medium" style={{ color: c.statLabel }}>{stat.label}</p>
            </motion.div>
          )
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Area Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 rounded-2xl p-6"
          style={{ background: c.cardBg, border: `1px solid ${c.cardBorder}` }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display text-lg font-semibold" style={{ color: c.heading }}>Submissions</h2>
              <p className="text-xs mt-0.5" style={{ color: c.subtext }}>Last 30 days</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ background: c.badgeBg, color: c.badgeColor }}>
              <TrendingUp size={14} />
              Active
            </div>
          </div>
          {data?.submissionsOverTime && data.submissionsOverTime.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={data.submissionsOverTime}>
                <defs>
                  <linearGradient id="gradientArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C9561E" stopOpacity={isDark ? 0.3 : 0.15} />
                    <stop offset="100%" stopColor="#C9561E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10, fill: c.axisLabelColor }}
                  tickFormatter={d => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: c.axisColor }}
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: c.cursorStroke }} />
                <Area type="monotone" dataKey="count" stroke="#C9561E" fill="url(#gradientArea)" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: '#C9561E', stroke: c.chartDotStroke, strokeWidth: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex flex-col items-center justify-center">
              <Clock size={32} className="mb-3" style={{ color: c.emptyIcon }} />
              <p className="text-sm" style={{ color: c.emptyText }}>Data will appear as submissions come in</p>
            </div>
          )}
        </motion.div>

        {/* Donut Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl p-6"
          style={{ background: c.cardBg, border: `1px solid ${c.cardBorder}` }}
        >
          <h2 className="font-display text-lg font-semibold mb-2" style={{ color: c.heading }}>By Type</h2>
          <p className="text-xs mb-4" style={{ color: c.subtext }}>Submission categories</p>
          {data?.submissionsByType && data.submissionsByType.length > 0 ? (
            <div className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={data.submissionsByType}
                    dataKey="count"
                    nameKey="type"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={72}
                    paddingAngle={4}
                    strokeWidth={0}
                  >
                    {data.submissionsByType.map((entry) => (
                      <Cell key={entry.type} fill={TYPE_COLORS[entry.type] || '#555'} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: c.tooltipBg, border: `1px solid ${c.tooltipBorder}`, borderRadius: 12, fontSize: 13, color: c.tooltipTextColor }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-2 w-full mt-2">
                {data.submissionsByType.map(t => (
                  <div key={t.type} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs" style={{ color: c.dotLabelColor }}>
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: TYPE_COLORS[t.type] }} />
                      <span className="capitalize">{t.type}</span>
                    </div>
                    <span className="text-xs font-semibold" style={{ color: c.dotCountColor }}>{t.count}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-sm" style={{ color: c.emptyText }}>No data yet</div>
          )}
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl p-6"
          style={{ background: c.cardBg, border: `1px solid ${c.cardBorder}` }}
        >
          <h2 className="font-display text-lg font-semibold mb-1" style={{ color: c.heading }}>Pipeline</h2>
          <p className="text-xs mb-5" style={{ color: c.subtext }}>Submission status breakdown</p>
          {data?.submissionsByStatus && data.submissionsByStatus.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={data.submissionsByStatus} layout="vertical" barSize={20}>
                <XAxis type="number" tick={{ fontSize: 10, fill: c.axisColor }} axisLine={false} tickLine={false} allowDecimals={false} />
                <YAxis
                  type="category"
                  dataKey="status"
                  tick={{ fontSize: 11, fill: c.dotLabelColor }}
                  width={85}
                  tickFormatter={s => s.replace('_', ' ')}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{ background: c.tooltipBg, border: `1px solid ${c.tooltipBorder}`, borderRadius: 12, fontSize: 13, color: c.tooltipTextColor }}
                />
                <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                  {data.submissionsByStatus.map((entry) => (
                    <Cell key={entry.status} fill={STATUS_COLORS[entry.status] || '#555'} fillOpacity={0.7} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-sm" style={{ color: c.emptyText }}>No data yet</div>
          )}
        </motion.div>

        {/* Recent submissions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="rounded-2xl p-6"
          style={{ background: c.cardBg, border: `1px solid ${c.cardBorder}` }}
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-display text-lg font-semibold" style={{ color: c.heading }}>Recent Activity</h2>
              <p className="text-xs mt-0.5" style={{ color: c.subtext }}>Latest submissions</p>
            </div>
            <Link href="/admin/submissions" className="text-xs hover:text-neel-rust transition-colors flex items-center gap-1 group" style={{ color: c.linkColor }}>
              View all <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          {data?.recentSubmissions && data.recentSubmissions.length > 0 ? (
            <div className="space-y-1">
              {data.recentSubmissions.map((s, i) => {
                const badge = TYPE_BG(s.type)
                return (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.05 }}
                    className="flex items-center justify-between py-3 px-3 -mx-3 rounded-xl transition-colors group"
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={e => (e.currentTarget.style.background = c.recentRowHover)}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-[11px] font-bold"
                        style={badge}
                      >
                        {s.type[0].toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: c.nameColor }}>{s.name}</p>
                        <p className="text-[11px] capitalize" style={{ color: c.subtext }}>{s.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: STATUS_DOT_COLOR[s.status] || '#6B7280' }} />
                        <span className="text-[11px] capitalize" style={{ color: c.subtext }}>{s.status.replace('_', ' ')}</span>
                      </div>
                      <span className="text-[11px]" style={{ color: c.muted }}>{timeAgo(s.createdAt)}</span>
                      <ArrowUpRight size={14} style={{ color: c.faint }} />
                    </div>
                  </motion.div>
                )
              })}
            </div>
          ) : (
            <div className="h-48 flex flex-col items-center justify-center">
              <Inbox size={32} className="mb-3" style={{ color: c.emptyIcon }} />
              <p className="text-sm" style={{ color: c.emptyText }}>No submissions yet</p>
              <p className="text-xs mt-1" style={{ color: c.muted }}>They&apos;ll appear here as they come in</p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        {[
          { label: 'New Workshop', href: '/admin/workshops', icon: Plus },
          { label: 'Compose Email', href: '/admin/email', icon: Mail },
          { label: 'Add Testimonial', href: '/admin/testimonials', icon: Plus },
          { label: 'All Submissions', href: '/admin/submissions', icon: Inbox },
        ].map(action => (
          <Link
            key={action.label}
            href={action.href}
            className="flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-medium transition-all group"
            style={{
              background: c.quickBg,
              border: `1px solid ${c.quickBorder}`,
              color: c.quickText,
            }}
            onMouseEnter={e => { e.currentTarget.style.color = c.quickTextHover }}
            onMouseLeave={e => { e.currentTarget.style.color = c.quickText }}
          >
            <action.icon size={16} style={{ color: c.quickIconColor }} className="group-hover:text-neel-rust transition-colors" />
            {action.label}
          </Link>
        ))}
      </motion.div>
    </div>
  )
}
