import React, { useState } from 'react'
import { SecondaryPageShell, SecondarySection } from './SecondaryPageShell'

const filters = ['All', 'User', 'Driver', 'Resolved']

export default function ComplaintsTab () {
  const [filter, setFilter] = useState('All')
  const [selectedComplaint, setSelectedComplaint] = useState(null)

  return (
    <SecondaryPageShell
      title="Complaints"
      subtitle="Review user & driver complaints"
      rows={[]}
    >
      <SecondarySection title="Complaints" subtitle="Complaint records will appear here when the complaints API is available.">
        <div className="border-b border-[#E6EBF2] px-4 py-3 sm:px-5">
          <div className="flex gap-2 overflow-x-auto">
            {filters.map((item) => <button key={item} type="button" onClick={() => setFilter(item)} className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${filter === item ? 'bg-[#FFB21C] text-[#0B1B2B]' : 'bg-[#F3F5F8] text-[#718096]'}`}>{item}</button>)}
          </div>
        </div>
        <button type="button" onClick={() => setSelectedComplaint(null)} className="flex w-full items-center gap-3 px-4 py-10 text-left sm:px-5">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#F3EEFF] text-[#7C3AED]"><i className="ri-chat-1-line text-lg" /></span>
          <span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-[#152238]">No complaints available</span><span className="mt-1 block text-xs text-[#718096]">Complaint details will be ready for the existing or future API.</span></span>
          <i className="ri-arrow-right-s-line text-xl text-[#718096]" />
        </button>
      </SecondarySection>
      {selectedComplaint && <div className="rounded-2xl border border-[#E6EBF2] bg-white p-5 shadow-sm"><h2 className="text-base font-bold text-[#152238]">Complaint {selectedComplaint.id}</h2></div>}
    </SecondaryPageShell>
  )
}
