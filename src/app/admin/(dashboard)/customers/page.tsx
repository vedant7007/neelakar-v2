'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Users, Search, ChevronLeft, ChevronRight,
  Loader2, ArrowRight,
} from 'lucide-react'
import StatusBadge from '@/components/admin/StatusBadge'
import Link from 'next/link'

type Customer = {
  id: string
  name: string
  email: string
  phone: string | null
  serviceTypes: string[] | null
  status: string
  notes: string | null
  totalSubmissions: number
  firstContactAt: string
  lastContactAt: string
}

const STATUSES = ['all', 'active', 'lead', 'inactive'] as const

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const limit = 20

  const fetchCustomers = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (status !== 'all') params.set('status', status)
    if (search.trim()) params.set('search', search.trim())

    try {
      const res = await fetch(`/api/customers?${params}`)
      if (!res.ok) throw new Error()
      const data = await res.json()
      setCustomers(data.customers)
      setTotal(data.total)
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }, [page, status, search, limit])

  useEffect(() => { fetchCustomers() }, [fetchCustomers])
  useEffect(() => { setPage(1) }, [status, search])

  const totalPages = Math.max(1, Math.ceil(total / limit))

  const timeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const days = Math.floor(diff / 86400000)
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days}d ago`
    if (days < 30) return `${Math.floor(days / 7)}w ago`
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
          <Users size={28} className="text-neel-rust" />
          Customers
        </h1>
        <p className="text-white/40 mt-1">
          {total} customer{total !== 1 ? 's' : ''} total
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-white/[0.06] bg-white/[0.03] text-sm text-white placeholder:text-white/15 outline-none focus:border-white/15 focus:ring-2 focus:ring-neel-rust/5 transition-all"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-3 py-2.5 rounded-lg border border-white/[0.06] bg-white/[0.03] text-sm text-white outline-none focus:border-white/15 cursor-pointer [&>option]:bg-[#1a1a1a] [&>option]:text-white"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s === 'all' ? 'All statuses' : s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white/[0.03] rounded-2xl border border-white/[0.06] overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="animate-spin text-white/20" />
          </div>
        ) : customers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-white/25">
            <Users size={40} className="mb-3 opacity-40" />
            <p className="text-sm font-medium">No customers found</p>
            <p className="text-xs mt-1">
              {search || status !== 'all'
                ? 'Try adjusting your filters'
                : 'Customers are created automatically from form submissions'}
            </p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left px-4 py-3 text-[11px] text-white/25 uppercase tracking-wider font-medium">Customer</th>
                <th className="text-left px-4 py-3 text-[11px] text-white/25 uppercase tracking-wider font-medium">Status</th>
                <th className="text-left px-4 py-3 text-[11px] text-white/25 uppercase tracking-wider font-medium hidden md:table-cell">Services</th>
                <th className="text-left px-4 py-3 text-[11px] text-white/25 uppercase tracking-wider font-medium">Submissions</th>
                <th className="text-left px-4 py-3 text-[11px] text-white/25 uppercase tracking-wider font-medium hidden sm:table-cell">Last Contact</th>
                <th className="text-right px-4 py-3 text-[11px] text-white/25 uppercase tracking-wider font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <motion.tr
                  key={c.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-4 py-3.5">
                    <p className="font-medium text-white">{c.name}</p>
                    <p className="text-white/25 text-xs mt-0.5">{c.email}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="px-4 py-3.5 hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {c.serviceTypes?.slice(0, 3).map((s) => (
                        <span key={s} className="inline-flex px-2 py-0.5 rounded text-[10px] bg-white/[0.03] text-white/40">
                          {s}
                        </span>
                      ))}
                      {(c.serviceTypes?.length || 0) > 3 && (
                        <span className="text-[10px] text-white/25">+{c.serviceTypes!.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-white/70 font-medium">{c.totalSubmissions}</span>
                  </td>
                  <td className="px-4 py-3.5 text-white/25 text-xs whitespace-nowrap hidden sm:table-cell">
                    {timeAgo(c.lastContactAt)}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <Link
                      href={`/admin/customers/${c.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-white/25 hover:text-neel-rust transition-colors"
                    >
                      View
                      <ArrowRight size={14} />
                    </Link>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-white/25">
            Page {page} of {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg border border-white/[0.06] hover:bg-white/[0.04] disabled:opacity-30 transition-colors text-white"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-lg border border-white/[0.06] hover:bg-white/[0.04] disabled:opacity-30 transition-colors text-white"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
