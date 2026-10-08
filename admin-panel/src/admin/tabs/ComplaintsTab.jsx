import React, { useEffect, useMemo, useState } from 'react'
import { adminApi } from '../../services/adminApi'
import { SecondaryPageShell, SecondarySection } from './SecondaryPageShell'
import { useAdminLanguage } from '../../context/AdminLanguageContext'

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
  const { t } = useAdminLanguage()
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [selectedCase, setSelectedCase] = useState(null)
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    const loadSupportCases = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await adminApi.getSupportCases({}, controller.signal)

        const items = Array.isArray(response) ? response : []

        const mappedCases = items.map((item) => ({
          ...item,
          id: item.caseId || item._id,
          user:
            item.type === 'Driver'
              ? item.captain?.name || '—'
              : item.user?.name || '—',
          phone:
            item.type === 'Driver'
              ? item.captain?.phone || '—'
              : item.user?.phone || '—',
          rideId: item.ride?._id || '—',
          rideStatus: item.ride?.status || '—',
          cancellationReason: item.ride?.cancellationReason || '—',
          cancellationFee:
            item.ride?.cancellationFee != null
              ? `₹${item.ride.cancellationFee}`
              : '₹0',
          owner: item.assignedTo?.email || 'Unassigned',
          createdAt: item.createdAt
            ? new Date(item.createdAt).toLocaleString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })
            : '—',
        }))

        setCases(mappedCases)
      } catch (err) {
        if (err?.name === 'CanceledError' || err?.name === 'AbortError') {
          return
        }

        setError(err?.response?.data?.message || err?.message || 'Failed to load support cases')
        setCases([])
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    loadSupportCases()

    return () => controller.abort()
  }, [])

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

  const filterLabels = {
    All: t.supportAll,
    User: t.supportUser,
    Driver: t.supportDriver,
    Open: t.supportOpen,
    'In Review': t.supportInReview,
    Escalated: t.supportEscalated,
    Resolved: t.supportResolved,
  }

  const priorityLabels = {
    High: t.supportHigh,
    Medium: t.supportMedium,
    Low: t.supportLow,
  }

  const getStatusLabel = (value) => filterLabels[value] || value
  const getPriorityLabel = (value) => priorityLabels[value] || value

  return (
    <SecondaryPageShell
      title={t.helpSupport}
      subtitle={t.supportCasesSubtitle}
      rows={[]}
    >
      <SecondarySection
        title={t.supportCases}
        subtitle={`${filteredCases.length} ${filteredCases.length === 1 ? t.caseShown : t.casesShown}`}
      >
        <div className="border-b border-[#E6EBF2] p-4 sm:p-5">
          <div className="flex flex-col gap-3">
            <div className="relative">
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-[#718096]" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={t.searchSupportCases}
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
                  {filterLabels[item] || item}
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
                    {getStatusLabel(item.status)}
                  </span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${priorityClasses[item.priority]}`}>
                    {getPriorityLabel(item.priority)}
                  </span>
                </span>

                <span className="mt-1 block truncate text-sm font-semibold text-[#152238]">
                  {item.subject}
                </span>

                <span className="mt-1 block truncate text-xs text-[#718096]">
                  {item.category} · {item.rideId} · {getStatusLabel(item.type)}
                </span>

                <span className="mt-1 block text-[11px] text-[#94A3B8]">
                  {item.createdAt}
                </span>
              </span>

              <i className="ri-arrow-right-s-line mt-2 shrink-0 text-xl text-[#718096]" />
            </button>
          ))}

          {loading && (
            <div className="px-5 py-12 text-center">
              <i className="ri-loader-4-line animate-spin text-3xl text-[#FFB21C]" />
              <p className="mt-2 text-sm font-semibold text-[#152238]">{t.loadingSupportCases}</p>
            </div>
          )}

          {!loading && error && (
            <div className="px-5 py-12 text-center">
              <i className="ri-error-warning-line text-3xl text-[#DC2626]" />
              <p className="mt-2 text-sm font-semibold text-[#152238]">{t.unableLoadSupportCases}</p>
              <p className="mt-1 text-xs text-[#718096]">{error}</p>
            </div>
          )}

          {!loading && !error && filteredCases.length === 0 && (
            <div className="px-5 py-12 text-center">
              <i className="ri-inbox-line text-3xl text-[#CBD5E1]" />
              <p className="mt-2 text-sm font-semibold text-[#152238]">{t.noSupportCases}</p>
              <p className="mt-1 text-xs text-[#718096]">{t.tryAnotherSearchFilter}</p>
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
                  {t.caseLabel} {selectedCase.id}
                </h2>
                <p className="mt-1 text-xs text-[#718096]">
                  {selectedCase.category} · {selectedCase.type}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCase(null)}
                className="grid h-9 w-9 place-items-center rounded-full bg-[#F3F5F8] text-[#64748B] transition hover:bg-[#E6EBF2]"
                aria-label={t.closeCaseDetails}
              >
                <i className="ri-close-line text-lg" />
              </button>
            </div>

            <div className="p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusClasses[selectedCase.status]}`}>
                  {getStatusLabel(selectedCase.status)}
                </span>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${priorityClasses[selectedCase.priority]}`}>
                  {getPriorityLabel(selectedCase.priority)} {t.supportPriority}
                </span>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Info label={t.subject} value={selectedCase.subject} />
                <Info label={t.userDriver} value={selectedCase.user} />
                <Info label={t.rideIdLabel} value={selectedCase.rideId} />
                <Info label={t.rideStatus} value={selectedCase.rideStatus} />
                <Info label={t.cancellationReason} value={selectedCase.cancellationReason} />
                <Info label={t.cancellationFee} value={selectedCase.cancellationFee} />
                <Info label={t.assignedOwner} value={selectedCase.owner} />
                <Info label={t.created} value={selectedCase.createdAt} />
              </div>

              <div className="mt-5 rounded-xl border border-[#E6EBF2] bg-[#FAFBFC] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#718096]">
                  {t.investigationContext}
                </p>
                <p className="mt-2 text-sm leading-6 text-[#152238]">
                  {selectedCase.description}
                </p>
              </div>

              <div className="mt-5 rounded-xl border border-[#E6EBF2] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#718096]">
                  {t.statusHistory}
                </p>

                <div className="mt-4 space-y-4">
                  <HistoryItem label={t.caseCreated} time={selectedCase.createdAt} />

                  {selectedCase.status !== 'Open' && (
                    <HistoryItem
                      label={`${t.currentStatus}: ${getStatusLabel(selectedCase.status)}`}
                      time={t.statusTransitionUnavailable}
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
