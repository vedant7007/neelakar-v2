'use client'

import { useState, useEffect } from 'react'
import { Mail, Send, Loader2, Users, X, Plus } from 'lucide-react'
import { toast } from 'sonner'

type Recipient = { email: string; name: string }

export default function BulkEmailPage() {
  const [audience, setAudience] = useState<'customers' | 'manual'>('customers')
  const [recipients, setRecipients] = useState<Recipient[]>([])
  const [loadingRecipients, setLoadingRecipients] = useState(false)
  const [manualEmail, setManualEmail] = useState('')
  const [manualName, setManualName] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<{ sent: number; failed: number } | null>(null)

  useEffect(() => {
    if (audience === 'customers') {
      loadCustomers()
    } else {
      setRecipients([])
    }
  }, [audience])

  const loadCustomers = async () => {
    setLoadingRecipients(true)
    try {
      const res = await fetch('/api/customers?limit=500')
      if (!res.ok) throw new Error()
      const data = await res.json()
      setRecipients(data.customers.map((c: { email: string; name: string }) => ({ email: c.email, name: c.name })))
    } catch {
      toast.error('Failed to load customers')
    } finally {
      setLoadingRecipients(false)
    }
  }

  const addManual = () => {
    if (!manualEmail) return
    if (recipients.some(r => r.email === manualEmail)) {
      toast.error('Email already in list')
      return
    }
    setRecipients(prev => [...prev, { email: manualEmail, name: manualName || manualEmail }])
    setManualEmail('')
    setManualName('')
  }

  const removeRecipient = (email: string) => {
    setRecipients(prev => prev.filter(r => r.email !== email))
  }

  const handleSend = async () => {
    if (!recipients.length || !subject || !message) {
      toast.error('Please fill in all fields and add recipients')
      return
    }
    if (!confirm(`Send email to ${recipients.length} recipient${recipients.length !== 1 ? 's' : ''}?`)) return

    setSending(true)
    setResult(null)
    try {
      const res = await fetch('/api/email/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipients, subject, message }),
      })
      if (!res.ok) throw new Error()
      const data = await res.json()
      setResult({ sent: data.sent, failed: data.failed })
      toast.success(`Sent to ${data.sent} recipient${data.sent !== 1 ? 's' : ''}`)
    } catch {
      toast.error('Failed to send')
    } finally {
      setSending(false)
    }
  }

  const inputClass = 'w-full px-4 py-3 rounded-lg border border-white/[0.06] bg-white/[0.03] text-sm text-white outline-none focus:border-white/15 focus:ring-2 focus:ring-neel-rust/5 transition-all placeholder:text-white/15'

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
          <Mail size={28} className="text-neel-rust" />
          Bulk Email
        </h1>
        <p className="text-white/40 mt-1">Send emails to multiple recipients at once</p>
      </div>

      {/* Audience selector */}
      <div className="bg-white/[0.03] rounded-2xl border border-white/[0.06] p-6 space-y-4">
        <p className="text-[11px] text-white/25 uppercase tracking-wider font-medium">Audience</p>
        <div className="flex gap-2">
          <button
            onClick={() => setAudience('customers')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${audience === 'customers' ? 'bg-white/[0.08] text-white' : 'bg-white/[0.03] text-white/40 hover:bg-white/[0.06]'}`}
          >
            <Users size={14} className="inline mr-2" />All Customers
          </button>
          <button
            onClick={() => setAudience('manual')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${audience === 'manual' ? 'bg-white/[0.08] text-white' : 'bg-white/[0.03] text-white/40 hover:bg-white/[0.06]'}`}
          >
            Custom List
          </button>
        </div>

        {audience === 'manual' && (
          <div className="flex gap-2">
            <input value={manualEmail} onChange={e => setManualEmail(e.target.value)} className={`${inputClass} flex-1`} placeholder="email@example.com" type="email" />
            <input value={manualName} onChange={e => setManualName(e.target.value)} className={`${inputClass} w-40`} placeholder="Name" />
            <button onClick={addManual} className="p-3 rounded-lg bg-white/[0.08] text-white hover:bg-white/[0.12] transition-colors">
              <Plus size={16} />
            </button>
          </div>
        )}

        {loadingRecipients ? (
          <div className="flex items-center gap-2 text-sm text-white/25">
            <Loader2 size={14} className="animate-spin" /> Loading recipients...
          </div>
        ) : (
          <div>
            <p className="text-sm text-white/40 mb-2">{recipients.length} recipient{recipients.length !== 1 ? 's' : ''}</p>
            <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
              {recipients.slice(0, 50).map(r => (
                <span key={r.email} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/[0.03] text-xs text-white/40">
                  {r.name}
                  <button onClick={() => removeRecipient(r.email)} className="hover:text-red-500 transition-colors"><X size={12} /></button>
                </span>
              ))}
              {recipients.length > 50 && <span className="text-xs text-white/25">+{recipients.length - 50} more</span>}
            </div>
          </div>
        )}
      </div>

      {/* Compose */}
      <div className="bg-white/[0.03] rounded-2xl border border-white/[0.06] p-6 space-y-4">
        <div>
          <label className="block text-[11px] text-white/25 uppercase tracking-wider font-medium mb-1.5">Subject *</label>
          <input value={subject} onChange={e => setSubject(e.target.value)} className={inputClass} placeholder="Email subject" />
        </div>
        <div>
          <label className="block text-[11px] text-white/25 uppercase tracking-wider font-medium mb-1.5">Message *</label>
          <textarea value={message} onChange={e => setMessage(e.target.value)} className={`${inputClass} resize-none`} rows={8} placeholder="Write your message..." />
        </div>

        {result && (
          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
            <p className="text-sm text-green-400 font-medium">
              Sent: {result.sent} &middot; Failed: {result.failed}
            </p>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button onClick={handleSend} disabled={sending || !recipients.length || !subject || !message} className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white/[0.08] text-white text-sm font-medium hover:bg-white/[0.12] disabled:opacity-50 transition-all">
            {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            Send to {recipients.length} Recipient{recipients.length !== 1 ? 's' : ''}
          </button>
        </div>
      </div>
    </div>
  )
}
