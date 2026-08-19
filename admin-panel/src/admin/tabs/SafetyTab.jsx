import React, { useEffect, useRef } from 'react'
import { Card } from '../../components/AdminUIComponents'
import { SecondaryPageShell } from './SecondaryPageShell'

export default function SafetyTab ({
  alerts = [],
  stations = [],
  onAcknowledge,
  onResolve,
  highlightedAlertId,
}) {
  const highlightedAlertRef = useRef(null)

  const statusClass = {
    pending: 'bg-[#FFF4DF] text-[#B86B00] border-[#FFD98A]',
    acknowledged: 'bg-[#EAFBF2] text-[#15803D] border-[#BBE7C9]',
    resolved: 'bg-[#EEF2FF] text-[#4F46E5] border-[#C7D2FE]',
  }

  useEffect(() => {
    highlightedAlertRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })
  }, [highlightedAlertId, alerts])

  const activeAlerts = alerts.filter(
    (alert) =>
      !['acknowledged', 'resolved'].includes(
        String(alert.status).toLowerCase()
      )
  )

  return (
    <div className="space-y-6">

      <SecondaryPageShell
        title="Safety"
        subtitle="Emergency controls & safety operations"
        rows={[
          { title: 'Emergency Alerts', description: 'View and manage emergency alerts', icon: 'ri-alarm-warning-line', tone: 'orange' },
          { title: 'Police Stations', description: 'Manage nearby police stations', icon: 'ri-police-car-line', tone: 'blue' },
          { title: 'Safety Settings', description: 'Configure safety features', icon: 'ri-settings-3-line', tone: 'green' },
          { title: 'Emergency Contacts', description: 'Manage emergency contacts', icon: 'ri-contacts-line', tone: 'purple' },
          { title: 'Blocked Users', description: 'View blocked users list', icon: 'ri-user-forbid-line', tone: 'navy' },
        ]}
      />

      {/* Page Header */}
      <div className="hidden rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm sm:p-6">

        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#B86B00]">
              Safety & Emergency
            </p>

            <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#111827]">
              Safety Control Center
            </h2>

            <p className="mt-1 max-w-2xl text-sm text-[#6B7280]">
              Monitor emergency alarms, manage rider safety events and review
              driver allocation rules.
            </p>
          </div>

          {/* Safety status */}
          <div className="flex items-center gap-3 rounded-xl border border-[#BBE7C9] bg-[#EAFBF2] px-4 py-3">

            <div className="grid h-10 w-10 place-items-center rounded-xl bg-white text-[#16A34A] shadow-sm">
              <i className="ri-shield-check-line text-xl" />
            </div>

            <div>
              <p className="text-xs text-[#6B7280]">
                Safety system
              </p>

              <p className="font-bold text-[#15803D]">
                Active
              </p>
            </div>

          </div>

        </div>
      </div>

      {/* Emergency Summary */}
      <div className="grid gap-4 sm:grid-cols-3">

        <div className="rounded-2xl border border-[#FECACA] bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-xs font-medium text-[#6B7280]">
                Active Emergencies
              </p>

              <p className="mt-1 text-2xl font-bold text-[#DC2626]">
                {activeAlerts.length}
              </p>
            </div>

            <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#FEF2F2] text-[#DC2626]">
              <i className="ri-alarm-warning-line text-xl" />
            </div>

          </div>

        </div>

        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-xs font-medium text-[#6B7280]">
                Emergency Alerts
              </p>

              <p className="mt-1 text-2xl font-bold text-[#111827]">
                {alerts.length}
              </p>
            </div>

            <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#FFF4DF] text-[#B86B00]">
              <i className="ri-notification-3-line text-xl" />
            </div>

          </div>

        </div>

        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-xs font-medium text-[#6B7280]">
                Police Stations
              </p>

              <p className="mt-1 text-2xl font-bold text-[#111827]">
                {stations.length}
              </p>
            </div>

            <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#EEF2FF] text-[#4F46E5]">
              <i className="ri-police-car-line text-xl" />
            </div>

          </div>

        </div>

      </div>

      {/* Emergency Alerts + Police */}
      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">

        {/* Emergency Alerts */}
        <Card className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-0 shadow-sm">

          <div className="border-b border-[#E5E7EB] px-5 py-4">

            <div className="flex items-center justify-between gap-3">

              <div>
                <h3 className="font-bold text-[#111827]">
                  Emergency Alerts
                </h3>

                <p className="mt-0.5 text-xs text-[#6B7280]">
                  Rider emergency alarms requiring admin attention.
                </p>
              </div>

              <span className="rounded-full bg-[#FEF2F2] px-2.5 py-1 text-xs font-bold text-[#DC2626]">
                {activeAlerts.length} active
              </span>

            </div>

          </div>

          <div className="divide-y divide-[#E5E7EB]">

            {alerts.length === 0 ? (

              <div className="flex min-h-[220px] flex-col items-center justify-center px-5 py-10 text-center">

                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#EAFBF2] text-[#16A34A]">
                  <i className="ri-shield-check-line text-2xl" />
                </div>

                <h4 className="mt-4 font-bold text-[#111827]">
                  No emergency alerts
                </h4>

                <p className="mt-1 text-sm text-[#6B7280]">
                  There are currently no rider safety events requiring attention.
                </p>

              </div>

            ) : (

              alerts.map((alert) => {

                const highlighted =
                  String(alert._id) ===
                  String(highlightedAlertId)

                const status =
                  String(alert.status).toLowerCase()

                return (
                  <div
                    key={alert._id}
                    ref={
                      highlighted
                        ? highlightedAlertRef
                        : null
                    }
                    className={`p-5 transition ${
                      highlighted
                        ? 'bg-[#FFF9E8] ring-2 ring-inset ring-[#FFB21C]'
                        : 'hover:bg-[#FFFCF5]'
                    }`}
                  >

                    <div className="flex flex-col gap-4">

                      {/* Alert information */}
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                        <div className="flex gap-3">

                          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#FEF2F2] text-[#DC2626]">
                            <i className="ri-alarm-warning-line text-xl" />
                          </div>

                          <div className="min-w-0">

                            <div className="flex flex-wrap items-center gap-2">

                              <h4 className="font-bold text-[#111827]">
                                {alert.riderName ||
                                  'Unknown rider'}
                              </h4>

                              <span
                                className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase ${statusClass[status] || 'border-slate-200 bg-slate-100 text-slate-700'}`}
                              >
                                {alert.status ||
                                  'Unknown'}
                              </span>

                            </div>

                            <p className="mt-1 text-sm text-[#6B7280]">
                              {alert.type ||
                                'Emergency alarm'}
                              {alert.city
                                ? ` • ${alert.city}`
                                : ''}
                            </p>

                            {alert.phone && (
                              <p className="mt-1 flex items-center gap-1.5 text-sm text-[#6B7280]">
                                <i className="ri-phone-line" />
                                {alert.phone}
                              </p>
                            )}

                          </div>

                        </div>

                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2 border-t border-[#E5E7EB] pt-3">

                        {status !== 'acknowledged' &&
                          status !== 'resolved' && (
                            <button
                              type="button"
                              onClick={() =>
                                onAcknowledge?.(
                                  alert._id
                                )
                              }
                              className="inline-flex items-center gap-2 rounded-xl bg-[#FFB21C] px-3 py-2 text-sm font-bold text-[#0B1B2B] transition hover:bg-[#FFC34D]"
                            >
                              <i className="ri-check-line" />
                              Acknowledge
                            </button>
                          )}

                        {status !== 'resolved' && (
                          <button
                            type="button"
                            onClick={() =>
                              onResolve?.(
                                alert._id
                              )
                            }
                            className="inline-flex items-center gap-2 rounded-xl bg-[#DC2626] px-3 py-2 text-sm font-bold text-white transition hover:bg-[#B91C1C]"
                          >
                            <i className="ri-phone-line" />
                            Resolve & Call Police
                          </button>
                        )}

                      </div>

                    </div>

                  </div>
                )
              })

            )}

          </div>
        </Card>

        {/* Police Stations */}
        <Card className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-0 shadow-sm">

          <div className="border-b border-[#E5E7EB] px-5 py-4">

            <h3 className="font-bold text-[#111827]">
              Nearest Police Stations
            </h3>

            <p className="mt-0.5 text-xs text-[#6B7280]">
              Available police contacts for emergency response.
            </p>

          </div>

          <div className="space-y-3 p-5">

            {stations.length === 0 ? (

              <div className="rounded-xl bg-[#F7F9FC] p-5 text-center">

                <i className="ri-police-car-line text-2xl text-[#9CA3AF]" />

                <p className="mt-2 text-sm text-[#6B7280]">
                  No police station data available.
                </p>

              </div>

            ) : (

              stations.map((station, index) => (

                <div
                  key={`${station.name}-${index}`}
                  className="rounded-xl border border-[#E5E7EB] bg-[#F7F9FC] p-4"
                >

                  <div className="flex items-center justify-between gap-3">

                    <div className="flex min-w-0 items-center gap-3">

                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#EEF2FF] text-[#4F46E5]">
                        <i className="ri-building-4-line" />
                      </div>

                      <div className="min-w-0">

                        <p className="truncate font-semibold text-[#111827]">
                          {station.name}
                        </p>

                        <p className="mt-0.5 text-xs text-[#6B7280]">
                          {station.phone}
                        </p>

                      </div>

                    </div>

                    <a
                      href={`tel:${String(
                        station.phone || ''
                      ).replace(/[^\d+]/g, '')}`}
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-[#0B1B2B] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#162D44]"
                    >
                      <i className="ri-phone-line" />
                      Call
                    </a>

                  </div>

                </div>

              ))

            )}

          </div>

        </Card>

      </div>

      {/* Driver Allocation Rules */}
      <Card className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-0 shadow-sm">

        {/* Rule header */}
        <div className="border-b border-[#E5E7EB] bg-[#0B1B2B] px-5 py-5 sm:px-6">

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

            <div className="flex items-center gap-3">

              <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#FFB21C] text-[#0B1B2B]">
                <i className="ri-shield-user-line text-xl" />
              </div>

              <div>

                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#FFB21C]">
                  Safety Configuration
                </p>

                <h3 className="mt-1 text-lg font-bold text-white">
                  Driver Allocation Rules
                </h3>

              </div>

            </div>

            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#EAFBF2] px-3 py-1.5 text-xs font-bold text-[#15803D]">
              <span className="h-2 w-2 rounded-full bg-[#22C55E]" />
              Rule Active
            </span>

          </div>

        </div>

        {/* Rule body */}
        <div className="p-5 sm:p-6">

          <div className="grid gap-5 lg:grid-cols-[1fr_auto_1fr] lg:items-center">

            {/* Passenger */}
            <div className="rounded-2xl border border-[#E5E7EB] bg-[#F7F9FC] p-5">

              <div className="flex items-center gap-3">

                <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#FFF4DF] text-[#B86B00]">
                  <i className="ri-user-heart-line text-xl" />
                </div>

                <div>

                  <p className="text-xs font-semibold uppercase tracking-wide text-[#9CA3AF]">
                    Passenger
                  </p>

                  <p className="mt-1 font-bold text-[#111827]">
                    Female passenger
                  </p>

                </div>

              </div>

              <div className="mt-4 rounded-xl bg-white p-3 text-sm text-[#6B7280]">
                Requests a <strong className="text-[#111827]">Bike</strong> ride.
              </div>

            </div>

            {/* Arrow */}
            <div className="flex justify-center">

              <div className="grid h-12 w-12 place-items-center rounded-full bg-[#FFF4DF] text-[#B86B00]">

                <i className="ri-arrow-right-line hidden text-xl lg:block" />

                <i className="ri-arrow-down-line text-xl lg:hidden" />

              </div>

            </div>

            {/* Driver */}
            <div className="rounded-2xl border-2 border-[#FFB21C] bg-[#FFF9E8] p-5">

              <div className="flex items-center gap-3">

                <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#FFB21C] text-[#0B1B2B]">
                  <i className="ri-steering-2-line text-xl" />
                </div>

                <div>

                  <p className="text-xs font-semibold uppercase tracking-wide text-[#B86B00]">
                    Driver Allocation
                  </p>

                  <p className="mt-1 font-bold text-[#111827]">
                    Female driver only
                  </p>

                </div>

              </div>

              <div className="mt-4 flex items-center gap-2 rounded-xl bg-white p-3 text-sm font-semibold text-[#15803D]">

                <i className="ri-checkbox-circle-fill" />

                Eligible female drivers only

              </div>

            </div>

          </div>

          {/* Rule statement */}
          <div className="mt-6 rounded-2xl border border-[#E5E7EB] bg-[#F7F9FC] p-5">

            <div className="flex items-start gap-3">

              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#0B1B2B] text-[#FFB21C]">
                <i className="ri-information-line" />
              </div>

              <div>

                <p className="font-bold text-[#111827]">
                  Active allocation rule
                </p>

                <p className="mt-1 text-sm leading-6 text-[#6B7280]">
                  Female passenger + Bike ride → Female driver only.
                  Female passengers requesting bike rides are automatically
                  assigned only to eligible female drivers.
                </p>

              </div>

            </div>

          </div>

        </div>

      </Card>

    </div>
  )
}
