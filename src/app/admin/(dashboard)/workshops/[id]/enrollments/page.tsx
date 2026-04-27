'use client'

import { useState, useEffect, use } from 'react'
import { ArrowLeft, Loader2, Users, Award, Send } from 'lucide-react'
import StatusBadge from '@/components/admin/StatusBadge'
import Link from 'next/link'
import { toast } from 'sonner'

type Workshop = {
  id: string
  title: string
  category: string
  dateDisplay: string
  location: string
  instructor: string | null
  totalSpots: number
  spotsFilled: number
}

type Enrollment = {
  enrollment: {
    id: string
    enrollmentStatus: string
    certificateSentAt: string | null
    createdAt: string
  }
  submission: {
    name: string
    email: string
    phone: string | null
  }
}

const CERT_TEMPLATES = [
  { key: 'classic', name: 'Classic' },
  { key: 'modern', name: 'Modern' },
  { key: 'minimal', name: 'Minimal' },
  { key: 'creative', name: 'Creative' },
  { key: 'dark', name: 'Dark' },
]

export default function EnrollmentsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [workshop, setWorkshop] = useState<Workshop | null>(null)
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [certTemplate, setCertTemplate] = useState('classic')
  const [certTitle, setCertTitle] = useState('Certificate of Completion')
  const [certBody, setCertBody] = useState('has successfully completed the workshop')
  const [customLine, setCustomLine] = useState('')
  const [sending, setSending] = useState(false)
  const [progress, setProgress] = useState<{ sent: number; total: number } | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [wRes, eRes] = await Promise.all([
          fetch(`/api/workshops/${id}`),
          fetch(`/api/workshops/${id}/enrollments`),
        ])
        if (wRes.ok) setWorkshop(await wRes.json())
        if (eRes.ok) setEnrollments(await eRes.json())
      } catch {
        toast.error('Failed to load data')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  const toggleSelect = (enrollmentId: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(enrollmentId) ? next.delete(enrollmentId) : next.add(enrollmentId)
      return next
    })
  }

  const selectAll = () => {
    const uncertified = enrollments
      .filter(e => e.enrollment.enrollmentStatus !== 'certified')
      .map(e => e.enrollment.id)
    setSelected(new Set(uncertified))
  }

  const handleSendCertificates = async () => {
    if (!workshop || selected.size === 0) return
    if (!confirm(`Send certificates to ${selected.size} participant${selected.size !== 1 ? 's' : ''}?`)) return

    setSending(true)
    setProgress({ sent: 0, total: selected.size })

    const participants = enrollments
      .filter(e => selected.has(e.enrollment.id))
      .map(e => ({
        enrollmentId: e.enrollment.id,
        name: e.submission.name,
        email: e.submission.email,
      }))

    try {
      const res = await fetch('/api/certificates/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participants,
          workshopTitle: workshop.title,
          template: certTemplate,
          content: {
            title: certTitle,
            body: certBody,
            instructor: workshop.instructor || 'Neelakar Creative House',
            dates: workshop.dateDisplay,
            location: workshop.location,
            customLine: customLine || undefined,
          },
        }),
      })

      if (!res.ok) throw new Error()
      const data = await res.json()
      setProgress({ sent: data.sent, total: participants.length })
      toast.success(`${data.sent} certificate${data.sent !== 1 ? 's' : ''} sent!`)

      const eRes = await fetch(`/api/workshops/${id}/enrollments`)
      if (eRes.ok) setEnrollments(await eRes.json())
      setSelected(new Set())
    } catch {
      toast.error('Failed to send certificates')
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 size={24} className="animate-spin text-white/20" /></div>
  }

  if (!workshop) {
    return <div className="text-center py-20 text-white/30">Workshop not found</div>
  }

  const uncertifiedCount = enrollments.filter(e => e.enrollment.enrollmentStatus !== 'certified').length

  return (
    <div className="space-y-6 max-w-4xl">
      <Link href="/admin/workshops" className="inline-flex items-center gap-2 text-sm text-white/30 hover:text-white transition-colors">
        <ArrowLeft size={16} /> Back to workshops
      </Link>

      <div>
        <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
          <Users size={28} className="text-neel-rust" />
          {workshop.title}
        </h1>
        <p className="text-white/40 mt-1">{workshop.dateDisplay} &middot; {workshop.location} &middot; {enrollments.length} enrolled</p>
      </div>

      {/* Enrollments table */}
      <div className="bg-white/[0.03] rounded-2xl border border-white/[0.06] overflow-hidden">
        {enrollments.length === 0 ? (
          <div className="p-12 text-center text-white/25">
            <Users size={36} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm font-medium">No enrollments yet</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left px-4 py-3 w-8">
                  <input type="checkbox" checked={selected.size === uncertifiedCount && uncertifiedCount > 0} onChange={() => selected.size === uncertifiedCount ? setSelected(new Set()) : selectAll()} className="rounded border-white/20" />
                </th>
                <th className="text-left px-4 py-3 text-[11px] text-white/25 uppercase tracking-wider font-medium">Participant</th>
                <th className="text-left px-4 py-3 text-[11px] text-white/25 uppercase tracking-wider font-medium">Status</th>
                <th className="text-left px-4 py-3 text-[11px] text-white/25 uppercase tracking-wider font-medium">Certificate</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map(({ enrollment: e, submission: s }) => (
                <tr key={e.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.has(e.id)}
                      onChange={() => toggleSelect(e.id)}
                      disabled={e.enrollmentStatus === 'certified'}
                      className="rounded border-white/20 disabled:opacity-30"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-white">{s.name}</p>
                    <p className="text-xs text-white/25">{s.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={e.enrollmentStatus} />
                  </td>
                  <td className="px-4 py-3">
                    {e.certificateSentAt ? (
                      <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                        <Award size={12} /> Sent {new Date(e.certificateSentAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                    ) : (
                      <span className="text-xs text-white/20">Not sent</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Certificate controls */}
      {enrollments.length > 0 && (
        <div className="bg-white/[0.03] rounded-2xl border border-white/[0.06] p-6 space-y-4">
          <h2 className="font-display text-lg font-semibold text-white flex items-center gap-2">
            <Award size={20} className="text-neel-rust" /> Send Certificates
          </h2>

          <div>
            <p className="text-[11px] text-white/25 uppercase tracking-wider font-medium mb-2">Template</p>
            <div className="flex gap-2">
              {CERT_TEMPLATES.map(t => (
                <button key={t.key} onClick={() => setCertTemplate(t.key)} className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${certTemplate === t.key ? 'bg-white/[0.08] text-white' : 'bg-white/[0.03] text-white/40 hover:bg-white/[0.06]'}`}>
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] text-white/25 uppercase tracking-wider font-medium mb-1.5">Certificate Title</label>
              <input value={certTitle} onChange={e => setCertTitle(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-white/[0.06] bg-white/[0.03] text-sm text-white outline-none focus:border-white/15 transition-all" />
            </div>
            <div>
              <label className="block text-[11px] text-white/25 uppercase tracking-wider font-medium mb-1.5">Custom Line (optional)</label>
              <input value={customLine} onChange={e => setCustomLine(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-white/[0.06] bg-white/[0.03] text-sm text-white outline-none focus:border-white/15 transition-all placeholder:text-white/15" placeholder="e.g. with distinction" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-white/25 uppercase tracking-wider font-medium mb-1.5">Certificate Body Text</label>
            <input value={certBody} onChange={e => setCertBody(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-white/[0.06] bg-white/[0.03] text-sm text-white outline-none focus:border-white/15 transition-all" />
          </div>

          {progress && (
            <div className="p-3 rounded-lg bg-green-500/10 text-sm text-green-400 font-medium">
              Sent {progress.sent} of {progress.total} certificates
            </div>
          )}

          <button
            onClick={handleSendCertificates}
            disabled={sending || selected.size === 0}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white/[0.08] text-white text-sm font-medium hover:bg-white/[0.12] disabled:opacity-50 transition-all"
          >
            {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            Send to {selected.size} Participant{selected.size !== 1 ? 's' : ''}
          </button>
        </div>
      )}
    </div>
  )
}
