'use client'

const STATUS_CONFIG: Record<string, { label: string; dot: string; bg: string }> = {
  new: { label: 'New', dot: 'bg-blue-400', bg: 'bg-blue-400/10 text-blue-300 border-blue-400/10' },
  contacted: { label: 'Contacted', dot: 'bg-amber-400', bg: 'bg-amber-400/10 text-amber-300 border-amber-400/10' },
  in_progress: { label: 'In Progress', dot: 'bg-orange-400', bg: 'bg-orange-400/10 text-orange-300 border-orange-400/10' },
  completed: { label: 'Completed', dot: 'bg-emerald-400', bg: 'bg-emerald-400/10 text-emerald-300 border-emerald-400/10' },
  archived: { label: 'Archived', dot: 'bg-gray-500', bg: 'bg-white/5 text-white/40 border-white/5' },
  active: { label: 'Active', dot: 'bg-emerald-400', bg: 'bg-emerald-400/10 text-emerald-300 border-emerald-400/10' },
  lead: { label: 'Lead', dot: 'bg-blue-400', bg: 'bg-blue-400/10 text-blue-300 border-blue-400/10' },
  inactive: { label: 'Inactive', dot: 'bg-gray-500', bg: 'bg-white/5 text-white/40 border-white/5' },
  enrolled: { label: 'Enrolled', dot: 'bg-blue-400', bg: 'bg-blue-400/10 text-blue-300 border-blue-400/10' },
  confirmed: { label: 'Confirmed', dot: 'bg-indigo-400', bg: 'bg-indigo-400/10 text-indigo-300 border-indigo-400/10' },
  attended: { label: 'Attended', dot: 'bg-purple-400', bg: 'bg-purple-400/10 text-purple-300 border-purple-400/10' },
  certified: { label: 'Certified', dot: 'bg-emerald-400', bg: 'bg-emerald-400/10 text-emerald-300 border-emerald-400/10' },
  cancelled: { label: 'Cancelled', dot: 'bg-red-400', bg: 'bg-red-400/10 text-red-300 border-red-400/10' },
}

export default function StatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.new

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${config.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  )
}
