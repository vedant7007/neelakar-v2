'use client'

import { useState, useEffect, use } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Loader2, User, Mail, Phone,
  Calendar, MessageSquare, Save,
} from 'lucide-react'
import StatusBadge from '@/components/admin/StatusBadge'
import Link from 'next/link'
import { toast } from 'sonner'

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

type Submission = {
  id: string
  type: string
  status: string
  message: string | null
  serviceInterest: string | null
  businessName: string | null
  preferredWorkshop: string | null
  createdAt: string
}

const TYPE_COLORS: Record<string, string> = {
  general: 'bg-neel-softteal/10 text-neel-softteal',
  launchpad: 'bg-neel-rust/10 text-neel-rust',
  workshop: 'bg-neel-tallow/10 text-neel-tallow',
}

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [notes, setNotes] = useState('')
  const [savingNotes, setSavingNotes] = useState(false)
  const [customerStatus, setCustomerStatus] = useState('')

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await fetch(`/api/customers/${id}`)
        if (!res.ok) throw new Error()
        const data = await res.json()
        setCustomer(data.customer)
        setSubmissions(data.submissions)
        setNotes(data.customer.notes || '')
        setCustomerStatus(data.customer.status)
      } catch {
        toast.error('Failed to load customer')
      } finally {
        setLoading(false)
      }
    }
    fetchCustomer()
  }, [id])

  const saveChanges = async () => {
    setSavingNotes(true)
    try {
      const res = await fetch(`/api/customers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: customerStatus, notes }),
      })
      if (!res.ok) throw new Error()
      toast.success('Customer updated')
    } catch {
      toast.error('Failed to save')
    } finally {
      setSavingNotes(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 size={24} className="animate-spin text-white/20" />
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="text-center py-32">
        <p className="text-white/30">Customer not found</p>
        <Link href="/admin/customers" className="text-neel-rust text-sm mt-2 inline-block hover:underline">
          Back to customers
        </Link>
      </div>
    )
  }

  const hasChanges = notes !== (customer.notes || '') || customerStatus !== customer.status

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Back */}
      <Link
        href="/admin/customers"
        className="inline-flex items-center gap-2 text-sm text-white/30 hover:text-white transition-colors"
      >
        <ArrowLeft size={16} />
        Back to customers
      </Link>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/[0.03] rounded-2xl border border-white/[0.06] p-6"
      >
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-neel-rust/10 flex items-center justify-center">
              <User size={24} className="text-neel-rust" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-white">{customer.name}</h1>
              <div className="flex items-center gap-4 mt-1 text-sm text-white/30">
                <span className="flex items-center gap-1.5"><Mail size={14} />{customer.email}</span>
                {customer.phone && (
                  <span className="flex items-center gap-1.5"><Phone size={14} />{customer.phone}</span>
                )}
              </div>
            </div>
          </div>
          <StatusBadge status={customer.status} />
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/[0.06]">
          <div>
            <p className="text-[11px] text-white/25 uppercase tracking-wider font-medium">Total Submissions</p>
            <p className="text-xl font-bold text-white mt-1">{customer.totalSubmissions}</p>
          </div>
          <div>
            <p className="text-[11px] text-white/25 uppercase tracking-wider font-medium">First Contact</p>
            <p className="text-sm text-white mt-1 flex items-center gap-1.5">
              <Calendar size={14} className="text-white/20" />
              {new Date(customer.firstContactAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
          <div>
            <p className="text-[11px] text-white/25 uppercase tracking-wider font-medium">Last Contact</p>
            <p className="text-sm text-white mt-1 flex items-center gap-1.5">
              <Calendar size={14} className="text-white/20" />
              {new Date(customer.lastContactAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Services */}
        {customer.serviceTypes && customer.serviceTypes.length > 0 && (
          <div className="mt-4">
            <p className="text-[11px] text-white/25 uppercase tracking-wider font-medium mb-2">Services</p>
            <div className="flex flex-wrap gap-1.5">
              {customer.serviceTypes.map((s) => (
                <span key={s} className="inline-flex px-3 py-1 rounded-full text-xs bg-white/[0.03] text-white/70 font-medium">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Manage section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white/[0.03] rounded-2xl border border-white/[0.06] p-6"
        >
          <p className="text-[11px] text-white/25 uppercase tracking-wider font-medium mb-3">Update Status</p>
          <div className="flex flex-wrap gap-2">
            {(['active', 'lead', 'inactive'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setCustomerStatus(s)}
                className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
                  customerStatus === s
                    ? 'bg-white/[0.08] text-white'
                    : 'bg-white/[0.03] text-white/40 hover:bg-white/[0.06]'
                }`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Notes */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/[0.03] rounded-2xl border border-white/[0.06] p-6"
        >
          <p className="text-[11px] text-white/25 uppercase tracking-wider font-medium mb-3 flex items-center gap-1.5">
            <MessageSquare size={12} />
            Notes
          </p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Add notes about this customer..."
            className="w-full px-4 py-3 rounded-lg border border-white/[0.06] bg-white/[0.03] text-sm text-white placeholder:text-white/15 outline-none focus:border-white/15 focus:ring-2 focus:ring-neel-rust/5 resize-none transition-all"
          />
        </motion.div>
      </div>

      {/* Save button */}
      {hasChanges && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <button
            onClick={saveChanges}
            disabled={savingNotes}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/[0.08] text-white text-sm font-medium hover:bg-white/[0.12] disabled:opacity-50 transition-all"
          >
            {savingNotes ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Save Changes
          </button>
        </motion.div>
      )}

      {/* Submission History */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-white/[0.03] rounded-2xl border border-white/[0.06] p-6"
      >
        <h2 className="font-display text-lg font-semibold text-white mb-4">Submission History</h2>
        {submissions.length === 0 ? (
          <p className="text-sm text-white/25 py-8 text-center">No submissions yet</p>
        ) : (
          <div className="space-y-3">
            {submissions.map((s) => (
              <Link
                key={s.id}
                href="/admin/submissions"
                className="flex items-center justify-between p-4 rounded-lg border border-white/[0.06] hover:border-white/[0.1] hover:bg-white/[0.02] transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${TYPE_COLORS[s.type] || ''}`}>
                    {s.type}
                  </span>
                  <div>
                    <p className="text-sm text-white font-medium">
                      {s.type === 'general' && (s.serviceInterest || 'General inquiry')}
                      {s.type === 'launchpad' && (s.businessName || 'Brand launch')}
                      {s.type === 'workshop' && (s.preferredWorkshop || 'Workshop enrollment')}
                    </p>
                    {s.message && (
                      <p className="text-xs text-white/25 truncate max-w-[300px] mt-0.5">{s.message}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={s.status} />
                  <span className="text-xs text-white/25 whitespace-nowrap">
                    {new Date(s.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
