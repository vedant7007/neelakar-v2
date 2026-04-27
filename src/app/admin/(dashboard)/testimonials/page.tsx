'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { MessageSquareQuote, Plus, Loader2, Pencil, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'

type Testimonial = {
  id: string
  context: string
  quote: string
  authorName: string
  authorRole: string | null
  sortOrder: number
  isActive: boolean
}

export default function TestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'main' | 'workshop'>('main')
  const [editing, setEditing] = useState<Testimonial | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({ context: 'main', quote: '', authorName: '', authorRole: '', sortOrder: 0, isActive: true })
  const [saving, setSaving] = useState(false)

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/testimonials')
      if (res.ok) setItems(await res.json())
    } catch { /* */ } finally { setLoading(false) }
  }

  useEffect(() => { fetchItems() }, [])

  const filtered = items.filter(i => i.context === tab)

  const openCreate = () => {
    setForm({ context: tab, quote: '', authorName: '', authorRole: '', sortOrder: 0, isActive: true })
    setEditing(null)
    setCreating(true)
  }

  const openEdit = (t: Testimonial) => {
    setForm({ context: t.context, quote: t.quote, authorName: t.authorName, authorRole: t.authorRole || '', sortOrder: t.sortOrder, isActive: t.isActive })
    setEditing(t)
    setCreating(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const url = editing ? `/api/testimonials/${editing.id}` : '/api/testimonials'
      const method = editing ? 'PATCH' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      if (!res.ok) throw new Error()
      toast.success(editing ? 'Updated' : 'Created')
      setCreating(false)
      setEditing(null)
      fetchItems()
    } catch { toast.error('Failed to save') } finally { setSaving(false) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return
    try {
      await fetch(`/api/testimonials/${id}`, { method: 'DELETE' })
      toast.success('Deleted')
      fetchItems()
    } catch { toast.error('Failed to delete') }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
          <MessageSquareQuote size={28} className="text-neel-rust" /> Testimonials
        </h1>
        <button onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/[0.08] text-white text-sm font-medium hover:bg-white/[0.12] transition-colors">
          <Plus size={16} /> Add Testimonial
        </button>
      </div>

      <div className="flex gap-1 bg-white/[0.03] rounded-lg p-1 w-fit">
        {(['main', 'workshop'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`relative px-4 py-2 rounded-md text-sm font-medium transition-colors ${tab === t ? 'text-white' : 'text-white/30'}`}>
            {tab === t && <motion.div layoutId="test-tab" className="absolute inset-0 bg-white/[0.08] rounded-md shadow-sm" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />}
            <span className="relative z-10">{t === 'main' ? 'Main Site' : 'Workshop'}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 size={24} className="animate-spin text-white/20" /></div>
      ) : filtered.length === 0 ? (
        <div className="bg-white/[0.03] rounded-2xl border border-white/[0.06] p-12 text-center text-white/25">
          <MessageSquareQuote size={36} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">No testimonials in this category</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(t => (
            <div key={t.id} className="bg-white/[0.03] rounded-2xl border border-white/[0.06] p-5 flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="text-sm text-white leading-relaxed italic">&ldquo;{t.quote}&rdquo;</p>
                <p className="text-xs text-white/30 mt-2 font-medium">-- {t.authorName}{t.authorRole ? `, ${t.authorRole}` : ''}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {!t.isActive && <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/[0.06] text-white/40 font-medium">Inactive</span>}
                <button onClick={() => openEdit(t)} className="p-1.5 rounded-md hover:bg-white/[0.04] text-white/25 hover:text-white transition-colors"><Pencil size={14} /></button>
                <button onClick={() => handleDelete(t.id)} className="p-1.5 rounded-md hover:bg-red-500/10 text-white/25 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {creating && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50" onClick={() => setCreating(false)} />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed inset-x-4 top-[15%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-lg bg-[#111] rounded-2xl shadow-2xl z-50 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-bold text-white">{editing ? 'Edit' : 'New'} Testimonial</h2>
                <button onClick={() => setCreating(false)} className="p-2 rounded-lg hover:bg-white/[0.04] text-white"><X size={18} /></button>
              </div>
              <div>
                <label className="block text-[11px] text-white/25 uppercase tracking-wider font-medium mb-1.5">Quote *</label>
                <textarea value={form.quote} onChange={e => setForm(f => ({ ...f, quote: e.target.value }))} rows={4} className="w-full px-4 py-3 rounded-lg border border-white/[0.06] bg-white/[0.03] text-sm text-white outline-none focus:border-white/15 resize-none transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] text-white/25 uppercase tracking-wider font-medium mb-1.5">Author Name *</label>
                  <input value={form.authorName} onChange={e => setForm(f => ({ ...f, authorName: e.target.value }))} className="w-full px-4 py-2.5 rounded-lg border border-white/[0.06] bg-white/[0.03] text-sm text-white outline-none focus:border-white/15 transition-all" />
                </div>
                <div>
                  <label className="block text-[11px] text-white/25 uppercase tracking-wider font-medium mb-1.5">Role</label>
                  <input value={form.authorRole} onChange={e => setForm(f => ({ ...f, authorRole: e.target.value }))} className="w-full px-4 py-2.5 rounded-lg border border-white/[0.06] bg-white/[0.03] text-sm text-white outline-none focus:border-white/15 transition-all placeholder:text-white/15" placeholder="e.g. Photographer" />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} className="rounded border-white/20" />
                <span className="text-sm text-white">Active</span>
              </label>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setCreating(false)} className="px-4 py-2.5 rounded-lg text-sm text-white/40 hover:bg-white/[0.04] transition-colors">Cancel</button>
                <button onClick={handleSave} disabled={saving || !form.quote || !form.authorName} className="px-6 py-2.5 rounded-lg bg-white/[0.08] text-white text-sm font-medium hover:bg-white/[0.12] disabled:opacity-50 transition-all flex items-center gap-2">
                  {saving && <Loader2 size={14} className="animate-spin" />} {editing ? 'Update' : 'Create'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
