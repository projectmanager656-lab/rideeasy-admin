import React, { useMemo, useState } from 'react'
import { SecondaryPageShell, SecondarySection } from './SecondaryPageShell'

const cases = [
  {
    id: 'SUP-1001',
    type: 'User',
    category: 'Ride Cancellation',
    subject: 'Cancellation fee query',
    description: 'User requested clarification about a cancellation fee applied after driver assignment.',
    user: 'Demo User',
    phone: '—',
    rideId: 'RIDE-1001',
    rideStatus: 'Cancelled',
    cancellationReason: 'Selected wrong drop-off',
    cancellationFee: '₹25',
    priority: 'High',
    status: 'Open',
    owner: 'Unassigned',
    createdAt: '18 Sep 2026, 10:12 AM',
  },
  {
    id: 'SUP-1002',
    type: 'Driver',
    category: 'Lost Item',
    subject: 'Passenger item reported missing',
    description: 'Driver reported a possible item left inside the vehicle after a completed ride.',
    user: 'Demo Driver',
    phone: '—',
    rideId: 'RIDE-1002',
    rideStatus: 'Completed',
    cancellationReason: '—',
    cancellationFee: '₹0',
    priority: 'Medium',
    status: 'In Review',
    owner: 'Support Team',
    createdAt: '18 Sep 2026, 09:42 AM',
  },
  {
    id: 'SUP-1003',
    type: 'User',
    category: 'Payment',
    subject: 'Payment clarification',
    description: 'User requested help understanding the final ride amount.',
    user: 'Demo User',
    phone: '—',
    rideId: 'RIDE-1003',
    rideStatus: 'Completed',
    cancellationReason: '—',
    cancellationFee: '₹0',
    priority: 'Low',
    status: 'Resolved',
    owner: 'Support Team',
    createdAt: '17 Sep 2026, 04:20 PM',
  },
]

const filters = ['All', 'User', 'Driver', 'Open', 'In Review', 'Escalated', 'Resolved']

const statusClasses = {
  Open: 'bg-[#FFF4DF] text-[#B86B00]',
  'In Review': 'bg-[#EAF4FF] text-[#2563EB]',
  Escalated: 'bg-[#FDECEC] text-[#DC2626]',
  Resolved: 'bg-[#EAFBF2] text-[#16A34A]',
}

const priorityClasses = {
  High: 'bg-[#FDECEC] text-[#DC2626]',
  Medium: 'bg-[#FFF4DF] text-[#B86B00]',
  Low: 'bg-[#EEF2F7] text-[#64748B]',
}

export default function ComplaintsTab () {
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [selectedCase, setSelectedCase] = useState(null)

  const filteredCases = useMemo(() => {
    const query = search.trim().toLowerCase()

    return cases.filter((item) => {
      const matchesFilter =
        filter === 'All' ||
        item.type === filter ||
        item.status === filter

      const matchesSearch =
        !query ||
        [
          item.id,
          item.subject,
          item.category,
          item.user,
          item.rideId,
        ].some((value) => String(value).toLowerCase().includes(query))

      return matchesFilter && matchesSearch
    })
  }, [filter, search])

  return (
    <SecondaryPageShell
      title="Support"
      subtitle="Review and investigate user & driver support cases"
      rows={[]}
    >
      <SecondarySection
        title="Support Cases"
        subtitle={`${filteredCases.length} case${filteredCases.length === 1 ? '' : 's'} shown · Demo data`}
      >
        <div className="border-b border-[#E6EBF2] p-4 sm:p-5">
          <div className="flex flex-col gap-3">
            <div className="relative">
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-[#718096]" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search case, ride, user or category..."
                className="h-10 w-full rounded-xl border border-[#E6EBF2] bg-[#FAFBFC] pl-9 pr-3 text-sm text-[#152238] outline-none focus:border-[#FFB21C]"
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {filters.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setFilter(item)}
                  className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ${
                    filter === item
                      ? 'bg-[#FFB21C] text-[#0B1B2B]'
                      : 'bg-[#F3F5F8] text-[#718096]'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="divide-y divide-[#E6EBF2]">
          {filteredCases.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedCase(item)}
              className="flex w-full items-start gap-3 p-4 text-left transition hover:bg-[#FAFBFC] sm:gap-4 sm:p-5"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#F3EEFF] text-[#7C3AED]">
                <i className={item.type === 'Driver' ? 'ri-steering-2-line text-lg' : 'ri-user-line text-lg'} />
              </span>

              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-[#152238]">{item.id}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${statusClasses[item.status]}`}>
                    {item.status}
                  </span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${priorityClasses[item.priority]}`}>
                    {item.priority}
                  </span>
                </span>

                <span className="mt-1 block truncate text-sm font-semibold text-[#152238]">
                  {item.subject}
                </span>

                <span className="mt-1 block truncate text-xs text-[#718096]">
                  {item.category} · {item.rideId} · {item.type}
                </span>

                <span className="mt-1 block text-[11px] text-[#94A3B8]">
                  {item.createdAt}
                </span>
              </span>

              <i className="ri-arrow-right-s-line mt-2 shrink-0 text-xl text-[#718096]" />
            </button>
          ))}

          {filteredCases.length === 0 && (
            <div className="px-5 py-12 text-center">
              <i className="ri-inbox-line text-3xl text-[#CBD5E1]" />
              <p className="mt-2 text-sm font-semibold text-[#152238]">No support cases found</p>
              <p className="mt-1 text-xs text-[#718096]">Try another search or filter.</p>
            </div>
          )}
        </div>
      </SecondarySection>

      {selectedCase && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1B2B]/50 p-4"
          onClick={() => setSelectedCase(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#E6EBF2] bg-white px-5 py-4">
              <div>
                <h2 className="text-lg font-bold text-[#152238]">
                  Case {selectedCase.id}
                </h2>
                <p className="mt-1 text-xs text-[#718096]">
                  {selectedCase.category} · {selectedCase.type}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCase(null)}
                className="grid h-9 w-9 place-items-center rounded-full bg-[#F3F5F8] text-[#64748B] transition hover:bg-[#E6EBF2]"
                aria-label="Close case details"
              >
                <i className="ri-close-line text-lg" />
              </button>
            </div>

            <div className="p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusClasses[selectedCase.status]}`}>
                  {selectedCase.status}
                </span>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${priorityClasses[selectedCase.priority]}`}>
                  {selectedCase.priority} Priority
                </span>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Info label="Subject" value={selectedCase.subject} />
                <Info label="User / Driver" value={selectedCase.user} />
                <Info label="Ride ID" value={selectedCase.rideId} />
                <Info label="Ride Status" value={selectedCase.rideStatus} />
                <Info label="Cancellation Reason" value={selectedCase.cancellationReason} />
                <Info label="Cancellation Fee" value={selectedCase.cancellationFee} />
                <Info label="Assigned Owner" value={selectedCase.owner} />
                <Info label="Created" value={selectedCase.createdAt} />
              </div>

              <div className="mt-5 rounded-xl border border-[#E6EBF2] bg-[#FAFBFC] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#718096]">
                  Investigation Context
                </p>
                <p className="mt-2 text-sm leading-6 text-[#152238]">
                  {selectedCase.description}
                </p>
              </div>

              <div className="mt-5 rounded-xl border border-[#E6EBF2] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#718096]">
                  Status History
                </p>

                <div className="mt-4 space-y-4">
                  <HistoryItem label="Case created" time={selectedCase.createdAt} />

                  {selectedCase.status !== 'Open' && (
                    <HistoryItem
                      label={`Current status: ${selectedCase.status}`}
                      time="Status transition timestamp unavailable"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </SecondaryPageShell>
  )
}

function Info ({ label, value }) {
  return (
    <div>
      <p className="text-xs text-[#718096]">{label}</p>
      <p className="mt-1 text-sm font-semibold text-[#152238]">{value || '—'}</p>
    </div>
  )
}

function HistoryItem ({ label, time }) {
  return (
    <div className="flex gap-3">
      <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[#FFB21C]" />
      <div>
        <p className="text-sm font-semibold text-[#152238]">{label}</p>
        <p className="mt-0.5 text-xs text-[#718096]">{time}</p>
      </div>
    </div>
  )
}
