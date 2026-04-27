'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Send, Loader2, Clock, CheckCircle2, XCircle, Eye, X } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

type EmailLog = {
  id: string
  toEmail: string
  toName: string | null
  subject: string
  templateType: string
  status: string
  createdAt: string
}

export default function EmailComposerPage() {
  const [to, setTo] = useState('')
  const [toName, setToName] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [recentEmails, setRecentEmails] = useState<EmailLog[]>([])
  const [loadingLogs, setLoadingLogs] = useState(true)

  useEffect(() => {
    fetch('/api/email/logs?limit=10')
      .then(r => r.ok ? r.json() : { logs: [] })
      .then(d => setRecentEmails(d.logs || []))
      .catch(() => {})
      .finally(() => setLoadingLogs(false))
  }, [])

  const handleSend = async () => {
    if (!to || !subject || !message) {
      toast.error('Please fill in all fields')
      return
    }
    setSending(true)
    try {
      const res = await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, toName, subject, message }),
      })
      if (!res.ok) throw new Error()
      toast.success('Email sent successfully')
      setRecentEmails(prev => [{
        id: crypto.randomUUID(),
        toEmail: to,
        toName,
        subject,
        templateType: 'custom',
        status: 'sent',
        createdAt: new Date().toISOString(),
      }, ...prev].slice(0, 10))
      setTo('')
      setToName('')
      setSubject('')
      setMessage('')
    } catch {
      toast.error('Failed to send email')
    } finally {
      setSending(false)
    }
  }

  const timeAgo = (dateStr: string) => {
    const mins = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000)
    if (mins < 1) return 'Just now'
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  const inputClass = 'w-full px-4 py-3 rounded-xl border border-white/[0.06] bg-white/[0.04] text-sm text-white outline-none focus:border-white/15 transition-all placeholder:text-white/15'

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Email</h1>
          <p className="text-white/30 mt-1 text-sm">Send branded emails to customers</p>
        </div>
        <Link
          href="/admin/email/bulk"
          className="px-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.08] text-white/60 text-sm font-medium hover:bg-white/[0.1] hover:text-white transition-all"
        >
          Bulk Email
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Composer */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-white/[0.04] flex items-center gap-2">
            <Mail size={16} className="text-neel-rust" />
            <span className="text-sm font-medium text-white/70">New Email</span>
          </div>

          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] text-white/20 uppercase tracking-wider mb-1.5 font-medium">Recipient Email *</p>
                <input type="email" value={to} onChange={e => setTo(e.target.value)} className={inputClass} placeholder="recipient@email.com" />
              </div>
              <div>
                <p className="text-[10px] text-white/20 uppercase tracking-wider mb-1.5 font-medium">Recipient Name</p>
                <input value={toName} onChange={e => setToName(e.target.value)} className={inputClass} placeholder="Their name (for greeting)" />
              </div>
            </div>

            <div>
              <p className="text-[10px] text-white/20 uppercase tracking-wider mb-1.5 font-medium">Subject *</p>
              <input value={subject} onChange={e => setSubject(e.target.value)} className={inputClass} placeholder="Email subject line" />
            </div>

            <div>
              <p className="text-[10px] text-white/20 uppercase tracking-wider mb-1.5 font-medium">Message *</p>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                className={`${inputClass} resize-none`}
                rows={8}
                placeholder="Write your message here...&#10;&#10;Double line break creates a new paragraph."
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setShowPreview(true)}
                disabled={!message.trim()}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-white/30 text-sm hover:text-white/60 disabled:opacity-20 transition-colors"
              >
                <Eye size={14} />
                Preview
              </button>
              <button
                onClick={handleSend}
                disabled={sending || !to || !subject || !message}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-neel-rust text-white text-sm font-semibold hover:brightness-110 active:scale-[0.98] disabled:opacity-30 transition-all"
              >
                {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                {sending ? 'Sending...' : 'Send Email'}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Recent Emails */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-white/[0.04] flex items-center gap-2">
            <Clock size={14} className="text-white/30" />
            <span className="text-sm font-medium text-white/50">Recent Emails</span>
          </div>

          <div className="p-3">
            {loadingLogs ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 size={18} className="animate-spin text-white/15" />
              </div>
            ) : recentEmails.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-white/15">
                <Mail size={24} className="mb-2 opacity-40" />
                <p className="text-xs">No emails sent yet</p>
              </div>
            ) : (
              <div className="space-y-0.5">
                {recentEmails.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 px-3 py-3 rounded-xl hover:bg-white/[0.02] transition-colors"
                  >
                    <div className="mt-0.5 shrink-0">
                      {log.status === 'sent' ? (
                        <CheckCircle2 size={14} className="text-emerald-400/60" />
                      ) : (
                        <XCircle size={14} className="text-red-400/60" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-white/60 font-medium truncate">{log.toName || log.toEmail}</p>
                      <p className="text-xs text-white/25 truncate mt-0.5">{log.subject}</p>
                      <p className="text-[10px] text-white/15 mt-1">{timeAgo(log.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-lg bg-[#111] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06]">
                <span className="text-sm font-medium text-white/60">Email Preview</span>
                <button onClick={() => setShowPreview(false)} className="p-1.5 rounded-lg hover:bg-white/[0.06] text-white/30 transition-colors">
                  <X size={16} />
                </button>
              </div>
              <div className="p-6">
                <div className="bg-[#faf8f4] rounded-xl p-6 text-[#1a1a1a]">
                  <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[#e5e0d8]">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C9561E] to-[#D4A84B] flex items-center justify-center">
                      <span className="text-white text-xs font-black">N</span>
                    </div>
                    <span className="font-semibold text-sm text-[#2c2c2c]">Neelakar Creative House</span>
                  </div>
                  <h2 className="text-lg font-bold mb-3">{subject || 'Subject line'}</h2>
                  <p className="text-sm text-[#555] mb-3">Hi {toName || 'there'},</p>
                  {message.split('\n\n').map((p, i) => (
                    <p key={i} className="text-sm text-[#555] mb-2 whitespace-pre-wrap">{p}</p>
                  ))}
                  <div className="mt-6 pt-4 border-t border-[#e5e0d8]">
                    <p className="text-[11px] text-[#999]">Sent from Neelakar Creative House</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
