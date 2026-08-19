import React, { useEffect, useRef } from 'react'
import { Card, AlertCard } from '../../components/AdminUIComponents'

export default function SafetyTab ({ alerts = [], stations = [], onAcknowledge, onResolve, highlightedAlertId }) {
  const highlightedAlertRef = useRef(null)
  const statusClass = {
    pending: 'bg-[#FFF3E0] text-[#B8860B] border-[#FFE0B2]',
    acknowledged: 'bg-[#EAFBF2] text-[#1FAA59] border-[#BBEB5C]',
    resolved: 'bg-[#EEF2FF] text-[#4F46E5] border-[#C7D2FE]',
  }

  useEffect(() => {
    highlightedAlertRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [highlightedAlertId, alerts])

  return (
    <div className="space-y-6">
      <AlertCard
        type="warning"
        title="Safety control center"
        message="Review active alerts, acknowledge them, and trigger the nearest police contact workflow for rider safety events."
      />

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <Card className="p-0 overflow-hidden">
          <div className="border-b border-slate-200 px-5 py-4">
            <h3 className="text-lg font-bold text-[#111827]">Emergency alerts</h3>
          </div>
          <div className="divide-y divide-slate-200">
            {alerts.length === 0 ? (
              <div className="px-5 py-8 text-sm text-slate-500">No active emergency alerts.</div>
            ) : (
              alerts.map((alert) => (
                <div key={alert._id} ref={String(alert._id) === String(highlightedAlertId) ? highlightedAlertRef : null} className={`px-5 py-4 ${String(alert._id) === String(highlightedAlertId) ? 'bg-[#FFF8F0] ring-2 ring-inset ring-[#FFA726]/50' : ''}`}>
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-[#111827]">{alert.riderName || 'Unknown rider'}</p>
                        <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${statusClass[alert.status] || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                          {alert.status}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-slate-600">{alert.type} • {alert.city}</p>
                      <p className="mt-1 text-sm text-slate-600">{alert.phone}</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {alert.status !== 'acknowledged' && alert.status !== 'resolved' && (
                        <button
                          type="button"
                          onClick={() => onAcknowledge?.(alert._id)}
                          className="rounded-lg bg-[#FFA726] px-3 py-2 text-sm font-medium text-[#111827] hover:bg-[#f59e0b]"
                        >
                          Acknowledge
                        </button>
                      )}
                      {alert.status !== 'resolved' && (
                        <button
                          type="button"
                          onClick={() => onResolve?.(alert._id)}
                          className="rounded-lg border border-[#E5484D] bg-[#FEE2E2] px-3 py-2 text-sm font-medium text-[#E5484D] hover:bg-[#FECACA]"
                        >
                          Resolve & call police
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card className="p-0 overflow-hidden">
          <div className="border-b border-slate-200 px-5 py-4">
            <h3 className="text-lg font-bold text-[#111827]">Nearest police stations</h3>
          </div>
          <div className="space-y-3 p-5">
            {stations.length === 0 ? (
              <p className="text-sm text-slate-500">No police station data available.</p>
            ) : (
              stations.map((station, index) => (
                <div key={`${station.name}-${index}`} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-[#111827]">{station.name}</p>
                      <p className="text-xs text-slate-500">{station.phone}</p>
                    </div>
                    <a
                      href={`tel:${station.phone.replace(/[^\d+]/g, '')}`}
                      className="inline-flex items-center rounded-lg bg-[#111827] px-2.5 py-1.5 text-xs font-medium text-white"
                    >
                      Call
                    </a>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      <Card className="border-l-4 border-l-[#FFA726] p-5 sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#B86B00]">Safety</p>
            <h3 className="mt-1 text-lg font-bold text-[#111827]">Driver Allocation Rules</h3>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#EAFBF2] px-3 py-1.5 text-sm font-semibold text-[#1FAA59]">
            <span className="h-2 w-2 rounded-full bg-[#1FAA59]" /> Status: Active
          </span>
        </div>

        <div className="mt-5 rounded-xl bg-[#FFF8F0] p-4 sm:p-5">
          <div className="flex flex-col gap-3 text-sm text-[#111827] sm:flex-row sm:items-center sm:gap-5">
            <div className="font-semibold">
              <span className="mr-2 text-[#FFA726]">●</span>Female passenger — Bike ride
              <p className="mt-1 pl-5 font-normal text-[#6B7280]">Female passenger requesting a bike ride</p>
            </div>
            <span className="hidden text-xl text-[#FFA726] sm:block">↓</span>
            <span className="ml-5 text-xl text-[#FFA726] sm:hidden">↓</span>
            <p className="font-semibold text-[#111827]">Female drivers only</p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 text-sm sm:grid-cols-[auto_1fr] sm:items-start">
          <p className="font-semibold text-[#111827]">Rule:</p>
          <p className="font-semibold text-[#111827]">Female passenger + Bike → Female driver only</p>
          <p className="font-semibold text-[#111827]">Description:</p>
          <p className="leading-6 text-[#6B7280]">Female passengers requesting bike rides are automatically assigned only to eligible female drivers.</p>
        </div>
      </Card>
    </div>
  )
}
