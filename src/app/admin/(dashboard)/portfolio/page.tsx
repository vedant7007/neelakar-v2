'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ImageIcon, Plus, Loader2, Pencil, Trash2, X } from 'lucide-react'
import { toast } from 'sonner'

type PortfolioItem = {
  id: string
  title: string
  category: string | null
  imageUrl: string | null
  context: string
  subtitle: string | null
  sortOrder: number
  isActive: boolean
}

const CONTEXTS = ['portfolio', 'production_photo', 'production_video'] as const
const CONTEXT_LABELS: Record<string, string> = { portfolio: 'Portfolio', production_photo: 'Production (Photo)', production_video: 'Production (Video)' }

export default function PortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<string>('portfolio')
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<PortfolioItem | null>(null)
  const [form, setForm] = useState({ title: '', category: '', imageUrl: '', context: 'portfolio', subtitle: '', sortOrder: 0, isActive: true })
  const [saving, setSaving] = useState(false)

  const fetchItems = async () => {
    try {
      const res = await fetch('/api/portfolio')
      if (res.ok) setItems(await res.json())
    } catch { /* */ } finally { setLoading(false) }
  }

  useEffect(() => { fetchItems() }, [])

  const filtered = items.filter(i => i.context === tab)

  const openCreate = () => {
    setForm({ title: '', category: '', imageUrl: '', context: tab, subtitle: '', sortOrder: 0, isActive: true })
    setEditing(null)
    setCreating(true)
  }

  const openEdit = (p: PortfolioItem) => {
    setForm({ title: p.title, category: p.category || '', imageUrl: p.imageUrl || '', context: p.context, subtitle: p.subtitle || '', sortOrder: p.sortOrder, isActive: p.isActive })
    setEditing(p)
    setCreating(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const url = editing ? `/api/portfolio/${editing.id}` : '/api/portfolio'
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
    if (!confirm('Delete this item?')) return
    try {
      await fetch(`/api/portfolio/${id}`, { method: 'DELETE' })
      toast.success('Deleted')
      fetchItems()
    } catch { toast.error('Failed') }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold text-white flex items-center gap-3">
          <ImageIcon size={28} className="text-neel-rust" /> Portfolio
        </h1>
        <button onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/[0.08] text-white text-sm font-medium hover:bg-white/[0.12] transition-colors">
          <Plus size={16} /> Add Item
        </button>
      </div>

      <div className="flex gap-1 bg-white/[0.03] rounded-lg p-1 w-fit">
        {CONTEXTS.map(c => (
          <button key={c} onClick={() => setTab(c)} className={`relative px-4 py-2 rounded-md text-sm font-medium transition-colors ${tab === c ? 'text-white' : 'text-white/30'}`}>
            {tab === c && <motion.div layoutId="port-tab" className="absolute inset-0 bg-white/[0.08] rounded-md shadow-sm" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />}
            <span className="relative z-10">{CONTEXT_LABELS[c]}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 size={24} className="animate-spin text-white/20" /></div>
      ) : filtered.length === 0 ? (
        <div className="bg-white/[0.03] rounded-2xl border border-white/[0.06] p-12 text-center text-white/25">
          <ImageIcon size={36} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">No items in this category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(p => (
            <div key={p.id} className="bg-white/[0.03] rounded-2xl border border-white/[0.06] overflow-hidden hover:shadow-md transition-shadow">
              {p.imageUrl ? (
                <div className="aspect-[4/3] bg-white/[0.03] overflow-hidden">
                  <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="aspect-[4/3] bg-white/[0.03] flex items-center justify-center">
                  <ImageIcon size={32} className="text-white/20" />
                </div>
              )}
              <div className="p-4">
                <h3 className="font-medium text-sm text-white">{p.title}</h3>
                {p.category && <p className="text-xs text-white/25 mt-0.5">{p.category}</p>}
                <div className="flex items-center gap-1 mt-3">
                  {!p.isActive && <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/[0.06] text-white/40 font-medium">Inactive</span>}
                  <button onClick={() => openEdit(p)} className="p-1.5 rounded-md hover:bg-white/[0.04] text-white/25"><Pencil size={14} /></button>
                  <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-md hover:bg-red-500/10 text-red-400"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {creating && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50" onClick={() => setCreating(false)} />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="fixed inset-x-4 top-[10%] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-lg bg-[#111] rounded-2xl shadow-2xl z-50 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-lg font-bold text-white">{editing ? 'Edit' : 'New'} Portfolio Item</h2>
                <button onClick={() => setCreating(false)} className="p-2 rounded-lg hover:bg-white/[0.04] text-white"><X size={18} /></button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] text-white/25 uppercase tracking-wider font-medium mb-1.5">Title *</label>
                  <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="w-full px-4 py-2.5 rounded-lg border border-white/[0.06] bg-white/[0.03] text-sm text-white outline-none focus:border-white/15 transition-all" />
                </div>
                <div>
                  <label className="block text-[11px] text-white/25 uppercase tracking-wider font-medium mb-1.5">Category</label>
                  <input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full px-4 py-2.5 rounded-lg border border-white/[0.06] bg-white/[0.03] text-sm text-white outline-none focus:border-white/15 transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] text-white/25 uppercase tracking-wider font-medium mb-1.5">Image URL</label>
                <input value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} className="w-full px-4 py-2.5 rounded-lg border border-white/[0.06] bg-white/[0.03] text-sm text-white outline-none focus:border-white/15 transition-all placeholder:text-white/15" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-[11px] text-white/25 uppercase tracking-wider font-medium mb-1.5">Subtitle</label>
                <input value={form.subtitle} onChange={e => setForm(f => ({ ...f, subtitle: e.target.value }))} className="w-full px-4 py-2.5 rounded-lg border border-white/[0.06] bg-white/[0.03] text-sm text-white outline-none focus:border-white/15 transition-all" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))} className="rounded border-white/20" />
                <span className="text-sm text-white">Active</span>
              </label>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setCreating(false)} className="px-4 py-2.5 rounded-lg text-sm text-white/40 hover:bg-white/[0.04] transition-colors">Cancel</button>
                <button onClick={handleSave} disabled={saving || !form.title} className="px-6 py-2.5 rounded-lg bg-white/[0.08] text-white text-sm font-medium hover:bg-white/[0.12] disabled:opacity-50 transition-all flex items-center gap-2">
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
