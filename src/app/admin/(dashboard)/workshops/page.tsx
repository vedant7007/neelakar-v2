'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GraduationCap, Plus, Loader2, Pencil, Trash2,
  X, Users, Calendar,
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

type Workshop = {
  id: string
  title: string
  category: string
  slug: string
  description: string | null
  dateDisplay: string
  startDate: string
  endDate: string
  location: string
  duration: string
  level: string
  price: number
  priceDisplay: string
  totalSpots: number
  spotsFilled: number
  instructor: string | null
  highlight: boolean
  isActive: boolean
  sortOrder: number
}

const INITIAL: Omit<Workshop, 'id'> = {
  title: '', category: 'Photography', slug: '', description: '',
  dateDisplay: '', startDate: '', endDate: '', location: '',
  duration: '', level: 'Beginner', price: 0, priceDisplay: '',
  totalSpots: 20, spotsFilled: 0, instructor: '',
  highlight: false, isActive: true, sortOrder: 0,
}

export default function WorkshopsPage() {
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Workshop | null>(null)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState(INITIAL)
  const [saving, setSaving] = useState(false)

  const fetchWorkshops = async () => {
    try {
      const res = await fetch('/api/workshops')
      if (!res.ok) throw new Error()
      setWorkshops(await res.json())
    } catch { /* */ } finally { setLoading(false) }
  }

  useEffect(() => { fetchWorkshops() }, [])

  const openCreate = () => {
    setForm(INITIAL)
    setEditing(null)
    setCreating(true)
  }

  const openEdit = (w: Workshop) => {
    setForm(w)
    setEditing(w)
    setCreating(true)
  }

  const closeForm = () => {
    setCreating(false)
    setEditing(null)
  }

  const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

  const handleSave = async () => {
    setSaving(true)
    try {
      const payload = { ...form, slug: form.slug || slugify(form.title) }
      const url = editing ? `/api/workshops/${editing.id}` : '/api/workshops'
      const method = editing ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error()
      toast.success(editing ? 'Workshop updated' : 'Workshop created')
      closeForm()
      fetchWorkshops()
    } catch {
      toast.error('Failed to save')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this workshop?')) return
    try {
      const res = await fetch(`/api/workshops/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Workshop deleted')
      fetchWorkshops()
    } catch {
      toast.error('Failed to delete')
    }
  }

  const inputClass = 'w-full px-4 py-2.5 rounded-lg border border-white/[0.06] bg-white/[0.03] text-sm text-white outline-none focus:border-white/15 focus:ring-2 focus:ring-neel-rust/5 transition-all placeholder:text-white/15 [&>option]:bg-[#1a1a1a] [&>option]:text-white'
  const labelClass = 'block text-[11px] text-white/25 uppercase tracking-wider font-medium mb-1.5'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
            <GraduationCap size={28} className="text-neel-rust" />
            Workshops
          </h1>
          <p className="text-white/40 mt-1">{workshops.length} workshop{workshops.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/[0.08] text-white text-sm font-medium hover:bg-white/[0.12] transition-colors">
          <Plus size={16} /> New Workshop
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Loader2 size={24} className="animate-spin text-white/20" /></div>
      ) : workshops.length === 0 ? (
        <div className="bg-white/[0.03] rounded-2xl border border-white/[0.06] p-12 text-center text-white/25">
          <GraduationCap size={40} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm font-medium">No workshops yet</p>
          <p className="text-xs mt-1">Create your first workshop to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {workshops.map((w) => (
            <motion.div
              key={w.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/[0.03] rounded-2xl border border-white/[0.06] p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-display font-bold text-white">{w.title}</h3>
                  <p className="text-xs text-white/25 mt-0.5">{w.category} &middot; {w.level}</p>
                </div>
                <div className="flex items-center gap-1">
                  {!w.isActive && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/[0.06] text-white/40 font-medium">Inactive</span>
                  )}
                  {w.highlight && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-neel-tallow/10 text-neel-tallow font-medium">Featured</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-white/30 mb-4">
                <span className="flex items-center gap-1"><Calendar size={12} />{w.dateDisplay}</span>
                <span className="flex items-center gap-1"><Users size={12} />{w.spotsFilled}/{w.totalSpots} spots</span>
                <span className="font-medium text-neel-rust">{w.priceDisplay}</span>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => openEdit(w)} className="px-3 py-1.5 rounded-md bg-white/[0.03] text-xs font-medium text-white/40 hover:bg-white/[0.06] transition-colors flex items-center gap-1.5">
                  <Pencil size={12} /> Edit
                </button>
                <Link href={`/admin/workshops/${w.id}/enrollments`} className="px-3 py-1.5 rounded-md bg-white/[0.03] text-xs font-medium text-white/40 hover:bg-white/[0.06] transition-colors flex items-center gap-1.5">
                  <Users size={12} /> Enrollments
                </Link>
                <button onClick={() => handleDelete(w.id)} className="px-3 py-1.5 rounded-md text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-1.5">
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {creating && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50" onClick={closeForm} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-[5%] bottom-[5%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl bg-[#111] rounded-2xl shadow-2xl z-50 overflow-y-auto"
            >
              <div className="p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-xl font-bold text-white">
                    {editing ? 'Edit Workshop' : 'New Workshop'}
                  </h2>
                  <button onClick={closeForm} className="p-2 rounded-lg hover:bg-white/[0.04] text-white"><X size={18} /></button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Title *</label>
                    <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className={inputClass} placeholder="Workshop title" />
                  </div>
                  <div>
                    <label className={labelClass}>Slug</label>
                    <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} className={inputClass} placeholder="Auto-generated from title" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>Category</label>
                    <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className={inputClass}>
                      {['Photography', 'Videography', 'Light & Composition', 'Storytelling', 'Post-Production', 'Other'].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Level</label>
                    <select value={form.level} onChange={e => setForm(f => ({ ...f, level: e.target.value }))} className={inputClass}>
                      {['Beginner', 'Intermediate', 'Advanced', 'All Levels'].map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Location</label>
                    <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} className={inputClass} placeholder="e.g. Pune" />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Description</label>
                  <textarea value={form.description || ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className={`${inputClass} resize-none`} rows={3} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>Date Display</label>
                    <input value={form.dateDisplay} onChange={e => setForm(f => ({ ...f, dateDisplay: e.target.value }))} className={inputClass} placeholder="e.g. June 15-16, 2026" />
                  </div>
                  <div>
                    <label className={labelClass}>Start Date</label>
                    <input type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>End Date</label>
                    <input type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} className={inputClass} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>Duration</label>
                    <input value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} className={inputClass} placeholder="e.g. 2 days" />
                  </div>
                  <div>
                    <label className={labelClass}>Price (₹)</label>
                    <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: parseInt(e.target.value) || 0 }))} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Price Display</label>
                    <input value={form.priceDisplay} onChange={e => setForm(f => ({ ...f, priceDisplay: e.target.value }))} className={inputClass} placeholder="e.g. ₹4,999" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>Total Spots</label>
                    <input type="number" value={form.totalSpots} onChange={e => setForm(f => ({ ...f, totalSpots: parseInt(e.target.value) || 20 }))} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Instructor</label>
                    <input value={form.instructor || ''} onChange={e => setForm(f => ({ ...f, instructor: e.target.value }))} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Sort Order</label>
                    <input type="number" value={form.sortOrder} onChange={e => setForm(f => ({ ...f, sortOrder: parseInt(e.target.value) || 0 }))} className={inputClass} />
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} className="rounded border-white/20" />
                    <span className="text-sm text-white">Active</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.highlight} onChange={e => setForm(f => ({ ...f, highlight: e.target.checked }))} className="rounded border-white/20" />
                    <span className="text-sm text-white">Featured</span>
                  </label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/[0.06]">
                  <button onClick={closeForm} className="px-4 py-2.5 rounded-lg text-sm font-medium text-white/40 hover:bg-white/[0.04] transition-colors">Cancel</button>
                  <button onClick={handleSave} disabled={saving || !form.title} className="px-6 py-2.5 rounded-lg bg-white/[0.08] text-white text-sm font-medium hover:bg-white/[0.12] disabled:opacity-50 transition-all flex items-center gap-2">
                    {saving ? <Loader2 size={16} className="animate-spin" /> : null}
                    {editing ? 'Update' : 'Create'}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
