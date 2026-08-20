import React from 'react'

export default function MobileRecordCard ({ title, subtitle, badge, children, actions, checked, onCheck }) {
  return (
    <article className="rounded-2xl border border-[#E6EBF2] bg-white p-4 shadow-[0_2px_10px_rgba(15,23,42,0.05)]">
      <div className="flex items-start gap-3">
        {onCheck && <input type="checkbox" checked={checked} onChange={onCheck} className="mt-1 h-4 w-4 shrink-0 accent-[#FFB21C]" />}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0"><h3 className="truncate text-sm font-bold text-[#152238]">{title}</h3>{subtitle && <p className="mt-1 truncate text-xs text-[#718096]">{subtitle}</p>}</div>
            {badge}
          </div>
          {children && <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs">{children}</dl>}
          {actions && <div className="mt-4 flex flex-wrap gap-2 border-t border-[#EEF1F5] pt-3">{actions}</div>}
        </div>
      </div>
    </article>
  )
}

export function MobileField ({ label, value }) {
  return <div className="min-w-0"><dt className="text-[10px] font-semibold uppercase tracking-wide text-[#9CA3AF]">{label}</dt><dd className="mt-0.5 truncate text-xs font-medium text-[#536174]">{value || '—'}</dd></div>
}
