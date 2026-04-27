'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Inbox, Search, Download, ChevronLeft, ChevronRight,
  Eye, Trash2, X, Loader2, MessageSquare, Send, ChevronDown, ChevronUp, Mail,
} from 'lucide-react'
import StatusBadge from '@/components/admin/StatusBadge'
import { toast } from 'sonner'

type Submission = {
  id: string; type: string; status: string; name: string; email: string
  phone: string | null; message: string | null; serviceInterest: string | null
  businessName: string | null; businessType: string | null; budgetRange: string | null
  timeline: string | null; projectDescription: string | null; preferredWorkshop: string | null
  adminNotes: string | null; createdAt: string
}

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'general', label: 'General' },
  { key: 'launchpad', label: 'Launchpad' },
  { key: 'workshop', label: 'Workshop' },
] as const

const STATUSES = ['all', 'new', 'contacted', 'in_progress', 'completed', 'archived'] as const

const TYPE_BG: Record<string, string> = {
  general: 'bg-[#4DB6AC]/10 text-[#4DB6AC]',
  launchpad: 'bg-[#E8845C]/10 text-[#E8845C]',
  workshop: 'bg-[#D4A84B]/10 text-[#D4A84B]',
}

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<string>('all')
  const [status, setStatus] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [selected, setSelected] = useState<Submission | null>(null)
  const [exporting, setExporting] = useState(false)
  const limit = 15

  const fetchSubmissions = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (tab !== 'all') params.set('type', tab)
    if (status !== 'all') params.set('status', status)
    if (search.trim()) params.set('search', search.trim())
    try {
      const res = await fetch(`/api/submissions?${params}`)
      if (!res.ok) throw new Error()
      const data = await res.json()
      setSubmissions(data.submissions)
      setTotal(data.total)
    } catch { toast.error('Failed to load submissions') }
    finally { setLoading(false) }
  }, [page, tab, status, search, limit])

  useEffect(() => { fetchSubmissions() }, [fetchSubmissions])
  useEffect(() => { setPage(1) }, [tab, status, search])

  const totalPages = Math.max(1, Math.ceil(total / limit))

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/submissions/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: newStatus }) })
      if (!res.ok) throw new Error()
      toast.success(`Status updated to ${newStatus.replace('_', ' ')}`)
      fetchSubmissions()
      if (selected?.id === id) setSelected(prev => prev ? { ...prev, status: newStatus } : null)
    } catch { toast.error('Failed to update status') }
  }

  const deleteSubmission = async (id: string) => {
    if (!confirm('Delete this submission?')) return
    try {
      const res = await fetch(`/api/submissions/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Submission deleted')
      setSelected(null)
      fetchSubmissions()
    } catch { toast.error('Failed to delete') }
  }

  const exportCSV = async () => {
    setExporting(true)
    try {
      const res = await fetch('/api/submissions/export')
      if (!res.ok) throw new Error()
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url; a.download = `submissions_${new Date().toISOString().split('T')[0]}.csv`
      a.click(); URL.revokeObjectURL(url)
      toast.success('CSV downloaded')
    } catch { toast.error('Failed to export') }
    finally { setExporting(false) }
  }

  const timeAgo = (dateStr: string) => {
    const mins = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000)
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    if (days < 7) return `${days}d ago`
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Submissions</h1>
          <p className="text-white/30 mt-1 text-sm">{total} total submission{total !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={exportCSV} disabled={exporting}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white/60 text-sm font-medium hover:bg-white/[0.1] hover:text-white transition-all disabled:opacity-50">
          {exporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
          Export CSV
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-white/[0.03] rounded-xl p-1 w-fit border border-white/[0.04]">
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t.key ? 'text-white' : 'text-white/30 hover:text-white/50'}`}>
            {tab === t.key && (
              <motion.div layoutId="submissions-tab" className="absolute inset-0 bg-white/[0.08] rounded-lg border border-white/[0.06]" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
            )}
            <span className="relative z-10">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm text-white placeholder:text-white/20 outline-none focus:border-white/15 transition-all" />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)}
          className="px-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm text-white/60 outline-none cursor-pointer [&>option]:bg-[#1a1a1a] [&>option]:text-white">
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s === 'all' ? 'All statuses' : s.replace('_', ' ').replace(/^\w/, c => c.toUpperCase())}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="animate-spin text-white/20" />
          </div>
        ) : submissions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-white/25">
            <Inbox size={40} className="mb-3 opacity-40" />
            <p className="text-sm font-medium">No submissions found</p>
            <p className="text-xs mt-1 text-white/15">
              {search || status !== 'all' || tab !== 'all' ? 'Try adjusting your filters' : 'Submissions will appear here when forms are submitted'}
            </p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.04]">
                <th className="text-left px-5 py-3.5 text-[11px] text-white/20 uppercase tracking-wider font-medium">Name</th>
                <th className="text-left px-5 py-3.5 text-[11px] text-white/20 uppercase tracking-wider font-medium">Type</th>
                <th className="text-left px-5 py-3.5 text-[11px] text-white/20 uppercase tracking-wider font-medium">Status</th>
                <th className="text-left px-5 py-3.5 text-[11px] text-white/20 uppercase tracking-wider font-medium hidden md:table-cell">Detail</th>
                <th className="text-left px-5 py-3.5 text-[11px] text-white/20 uppercase tracking-wider font-medium">Time</th>
                <th className="text-right px-5 py-3.5 text-[11px] text-white/20 uppercase tracking-wider font-medium sr-only">Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((s) => (
                <tr key={s.id} className="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors cursor-pointer" onClick={() => setSelected(s)}>
                  <td className="px-5 py-4">
                    <p className="font-medium text-white/80">{s.name}</p>
                    <p className="text-white/25 text-xs mt-0.5">{s.email}</p>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${TYPE_BG[s.type] || ''}`}>{s.type}</span>
                  </td>
                  <td className="px-5 py-4"><StatusBadge status={s.status} /></td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <p className="text-white/30 text-xs truncate max-w-[200px]">
                      {s.type === 'general' && s.serviceInterest}
                      {s.type === 'launchpad' && s.businessName}
                      {s.type === 'workshop' && s.preferredWorkshop}
                    </p>
                  </td>
                  <td className="px-5 py-4 text-white/20 text-xs whitespace-nowrap">{timeAgo(s.createdAt)}</td>
                  <td className="px-5 py-4 text-right">
                    <button onClick={(e) => { e.stopPropagation(); setSelected(s) }}
                      className="p-2 rounded-lg hover:bg-white/[0.06] text-white/20 hover:text-white/50 transition-colors">
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-white/20">Page {page} of {totalPages}</p>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="p-2 rounded-xl border border-white/[0.06] hover:bg-white/[0.04] disabled:opacity-20 text-white/40 transition-colors"><ChevronLeft size={16} /></button>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="p-2 rounded-xl border border-white/[0.06] hover:bg-white/[0.04] disabled:opacity-20 text-white/40 transition-colors"><ChevronRight size={16} /></button>
          </div>
        </div>
      )}

      <AnimatePresence>
        {selected && <SubmissionDetail submission={selected} onClose={() => setSelected(null)} onStatusChange={(s) => updateStatus(selected.id, s)} onDelete={() => deleteSubmission(selected.id)} onNotesUpdate={fetchSubmissions} />}
      </AnimatePresence>
    </div>
  )
}

function SubmissionDetail({ submission, onClose, onStatusChange, onDelete, onNotesUpdate }: {
  submission: Submission; onClose: () => void; onStatusChange: (status: string) => void; onDelete: () => void; onNotesUpdate: () => void
}) {
  const [notes, setNotes] = useState(submission.adminNotes || '')
  const [savingNotes, setSavingNotes] = useState(false)
  const [replyOpen, setReplyOpen] = useState(false)
  const [replySubject, setReplySubject] = useState(`Re: Your ${submission.type} inquiry — Neelakar Creative House`)
  const [replyMessage, setReplyMessage] = useState('')
  const [sending, setSending] = useState(false)

  const saveNotes = async () => {
    setSavingNotes(true)
    try {
      const res = await fetch(`/api/submissions/${submission.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ adminNotes: notes }) })
      if (!res.ok) throw new Error()
      toast.success('Notes saved')
      onNotesUpdate()
    } catch { toast.error('Failed to save notes') }
    finally { setSavingNotes(false) }
  }

  const sendReply = async () => {
    if (!replyMessage.trim() || !replySubject.trim()) {
      toast.error('Subject and message are required')
      return
    }
    setSending(true)
    try {
      const res = await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: submission.email,
          toName: submission.name,
          subject: replySubject,
          message: replyMessage,
          submissionId: submission.id,
        }),
      })
      if (!res.ok) throw new Error()
      toast.success(`Reply sent to ${submission.name}`)
      setReplyMessage('')
      setReplyOpen(false)
      if (submission.status === 'new') onStatusChange('contacted')
    } catch { toast.error('Failed to send reply') }
    finally { setSending(false) }
  }

  const detailRows: { label: string; value: string | null }[] = [
    { label: 'Name', value: submission.name },
    { label: 'Email', value: submission.email },
    { label: 'Phone', value: submission.phone },
    { label: 'Message', value: submission.message },
  ]
  if (submission.type === 'general') detailRows.push({ label: 'Service Interest', value: submission.serviceInterest })
  if (submission.type === 'launchpad') detailRows.push(
    { label: 'Business Name', value: submission.businessName },
    { label: 'Business Type', value: submission.businessType },
    { label: 'Budget Range', value: submission.budgetRange },
    { label: 'Timeline', value: submission.timeline },
    { label: 'Project Description', value: submission.projectDescription },
  )
  if (submission.type === 'workshop') detailRows.push({ label: 'Preferred Workshop', value: submission.preferredWorkshop })

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={onClose} />
      <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed right-0 top-0 h-full w-full max-w-lg bg-[#111] border-l border-white/[0.06] shadow-2xl z-50 overflow-y-auto">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <StatusBadge status={submission.status} />
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${TYPE_BG[submission.type] || ''}`}>{submission.type}</span>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/[0.06] text-white/30 transition-colors"><X size={18} /></button>
          </div>

          <div>
            <h2 className="font-display text-2xl font-bold text-white">{submission.name}</h2>
            <p className="text-white/30 text-sm mt-0.5">
              {new Date(submission.createdAt).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>

          <div>
            <p className="text-[11px] text-white/25 uppercase tracking-wider font-medium mb-2.5">Update Status</p>
            <div className="flex flex-wrap gap-2">
              {(['new', 'contacted', 'in_progress', 'completed', 'archived'] as const).map((s) => (
                <button key={s} onClick={() => onStatusChange(s)} disabled={submission.status === s}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${submission.status === s ? 'bg-neel-rust text-white' : 'bg-white/[0.04] text-white/40 hover:bg-white/[0.08] hover:text-white/70 border border-white/[0.04]'}`}>
                  {s.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {detailRows.map((row) => row.value ? (
              <div key={row.label}>
                <p className="text-[11px] text-white/25 uppercase tracking-wider font-medium mb-1">{row.label}</p>
                <p className="text-sm text-white/70 whitespace-pre-wrap">{row.value}</p>
              </div>
            ) : null)}
          </div>

          {/* Reply to Customer */}
          <div className="rounded-xl border border-white/[0.06] overflow-hidden">
            <button
              onClick={() => setReplyOpen(!replyOpen)}
              className="w-full flex items-center justify-between px-4 py-3.5 bg-white/[0.03] hover:bg-white/[0.05] transition-colors"
            >
              <span className="flex items-center gap-2 text-sm font-medium text-white/70">
                <Mail size={14} className="text-neel-rust" />
                Reply to {submission.name.split(' ')[0]}
              </span>
              {replyOpen ? <ChevronUp size={14} className="text-white/30" /> : <ChevronDown size={14} className="text-white/30" />}
            </button>

            <AnimatePresence>
              {replyOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 pt-3 space-y-3 border-t border-white/[0.04]">
                    <div>
                      <p className="text-[10px] text-white/20 uppercase tracking-wider mb-1.5">To</p>
                      <p className="text-sm text-white/50">{submission.name} &lt;{submission.email}&gt;</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-white/20 uppercase tracking-wider mb-1.5">Subject</p>
                      <input
                        type="text"
                        value={replySubject}
                        onChange={(e) => setReplySubject(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-sm text-white/70 placeholder:text-white/15 outline-none focus:border-white/15 transition-all"
                      />
                    </div>
                    <div>
                      <p className="text-[10px] text-white/20 uppercase tracking-wider mb-1.5">Message</p>
                      <textarea
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        rows={5}
                        placeholder={`Hi ${submission.name.split(' ')[0]}, thank you for reaching out...`}
                        className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-sm text-white/70 placeholder:text-white/15 outline-none focus:border-white/15 resize-none transition-all"
                      />
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <p className="text-[10px] text-white/15">Sent via Neelakar branded email</p>
                      <button
                        onClick={sendReply}
                        disabled={sending || !replyMessage.trim()}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neel-rust text-white text-sm font-semibold hover:brightness-110 active:scale-[0.98] disabled:opacity-30 transition-all"
                      >
                        {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                        {sending ? 'Sending...' : 'Send Reply'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div>
            <p className="text-[11px] text-white/25 uppercase tracking-wider font-medium mb-2 flex items-center gap-1.5"><MessageSquare size={12} /> Admin Notes</p>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} placeholder="Add internal notes..."
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm text-white/70 placeholder:text-white/15 outline-none focus:border-white/15 resize-none transition-all" />
            <button onClick={saveNotes} disabled={savingNotes || notes === (submission.adminNotes || '')}
              className="mt-2 px-4 py-2 rounded-lg bg-white/[0.06] text-white/60 text-xs font-medium hover:bg-white/[0.1] disabled:opacity-20 transition-all">
              {savingNotes ? 'Saving...' : 'Save Notes'}
            </button>
          </div>

          <div className="pt-4 border-t border-white/[0.04]">
            <button onClick={onDelete}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-red-400/60 hover:text-red-400 hover:bg-red-400/5 text-xs font-medium transition-colors">
              <Trash2 size={14} /> Delete Submission
            </button>
          </div>
        </div>
      </motion.div>
    </>
  )
}
