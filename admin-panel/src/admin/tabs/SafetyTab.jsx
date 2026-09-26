import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card } from '../../components/AdminUIComponents'
import { SecondaryPageShell } from './SecondaryPageShell'

export default function SafetyTab ({
  alerts = [],
  stations = [],
  onAcknowledge,
  onResolve,
  highlightedAlertId,
}) {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState(null)

  useEffect(() => {
    document.getElementById('admin-main-content')?.scrollTo({
      top: 0,
      behavior: 'auto',
    })
  }, [activeSection])

  const highlightedAlertRef = useRef(null)
  const emergencyAlertsSectionRef = useRef(null)
  const policeStationsSectionRef = useRef(null)
  const safetySettingsSectionRef = useRef(null)

  const statusClass = {
    pending: 'bg-[#FFF4DF] text-[#B86B00] border-[#FFD98A]',
    acknowledged: 'bg-[#EAFBF2] text-[#15803D] border-[#BBE7C9]',
    resolved: 'bg-[#EEF2FF] text-[#4F46E5] border-[#C7D2FE]',
  }

  const activeAlerts = alerts.filter(
    (alert) =>
      !['acknowledged', 'resolved'].includes(
        String(alert.status).toLowerCase()
      )
  )

  return (
    <div className="space-y-6">
      {activeSection === null && (
        <SecondaryPageShell
          title="Safety"
        subtitle="Emergency controls & safety operations"
        rows={[
          {
            title: 'Emergency Alerts',
            description: 'View and manage emergency alerts',
            icon: 'ri-alarm-warning-line',
            tone: 'orange',
            onClick: () => setActiveSection('emergency'),
          },
          {
            title: 'Police Stations',
            description: 'Manage nearby police stations',
            icon: 'ri-police-car-line',
            tone: 'blue',
            onClick: () => setActiveSection('police'),
          },
          {
            title: 'Safety Settings',
            description: 'Configure safety features',
            icon: 'ri-settings-3-line',
            tone: 'green',
            onClick: () => setActiveSection('settings'),
          },
          {
            title: 'Emergency Contacts',
            description: 'Manage emergency contacts',
            icon: 'ri-contacts-line',
            tone: 'purple',
            onClick: () => setActiveSection('contacts'),
          },
          {
            title: 'Blocked Users',
            description: 'View blocked users list',
            icon: 'ri-user-forbid-line',
            tone: 'navy',
            onClick: () => setActiveSection('blocked'),
          },
        ]}
        />
      )}

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

      {activeSection === 'emergency' && (
        <Card className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-0 pb-28 shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-[#E5E7EB] px-5 py-4">
            <div>
              <h3 className="font-bold text-[#111827]">
                Emergency Alerts
              </h3>
              <p className="mt-0.5 text-xs text-[#6B7280]">
                Rider emergency alarms requiring admin attention.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setActiveSection(null)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-[#111827] hover:bg-slate-50"
            >
              Back
            </button>
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
                const status = String(alert.status).toLowerCase()

                return (
                  <div
                    key={alert._id}
                    className="p-5 transition hover:bg-[#FFFCF5]"
                  >
                    <div className="flex flex-col gap-4">
                      <div className="flex gap-3">
                        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#FEF2F2] text-[#DC2626]">
                          <i className="ri-alarm-warning-line text-xl" />
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-bold text-[#111827]">
                              {alert.riderName || 'Unknown rider'}
                            </h4>

                            <span
                              className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase ${
                                statusClass[status] ||
                                'border-slate-200 bg-slate-100 text-slate-700'
                              }`}
                            >
                              {alert.status || 'Unknown'}
                            </span>
                          </div>

                          <p className="mt-1 text-sm text-[#6B7280]">
                            {alert.type || 'Emergency alarm'}
                            {alert.city ? ` • ${alert.city}` : ''}
                          </p>

                          {alert.phone && (
                            <p className="mt-1 text-sm text-[#6B7280]">
                              <i className="ri-phone-line mr-1" />
                              {alert.phone}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 border-t border-[#E5E7EB] pt-3">
                        {status !== 'acknowledged' &&
                          status !== 'resolved' && (
                            <button
                              type="button"
                              onClick={() => onAcknowledge?.(alert._id)}
                              className="inline-flex items-center gap-2 rounded-xl bg-[#FFB21C] px-3 py-2 text-sm font-bold text-[#0B1B2B]"
                            >
                              <i className="ri-check-line" />
                              Acknowledge
                            </button>
                          )}

                        {status !== 'resolved' && (
                          <button
                            type="button"
                            onClick={() => onResolve?.(alert._id)}
                            className="inline-flex items-center gap-2 rounded-xl bg-[#DC2626] px-3 py-2 text-sm font-bold text-white"
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
      )}

      {activeSection === 'police' && (
        <Card className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-0 pb-28 shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-[#E5E7EB] px-5 py-4">
            <div>
              <h3 className="font-bold text-[#111827]">
                Police Stations
              </h3>
              <p className="mt-0.5 text-xs text-[#6B7280]">
                Available police contacts for emergency response.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setActiveSection(null)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-[#111827] hover:bg-slate-50"
            >
              Back
            </button>
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
      )}

      {activeSection === 'settings' && (
        <Card className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-0 pb-28 shadow-sm">
          <div className="border-b border-[#E5E7EB] bg-[#0B1B2B] px-5 py-5 sm:px-6">
            <div className="flex items-center justify-between gap-3">
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

              <button
                type="button"
                onClick={() => setActiveSection(null)}
                className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-[#111827] hover:bg-slate-100"
              >
                Back
              </button>
            </div>

            <div className="mt-4 flex w-fit items-center gap-2 rounded-full bg-[#EAFBF2] px-3 py-1.5 text-xs font-bold text-[#15803D]">
              <span className="h-2 w-2 rounded-full bg-[#22C55E]" />
              Rule Active
            </div>
          </div>

          <div className="p-5 sm:p-6">
            <div className="grid gap-5 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
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

              <div className="flex justify-center">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-[#FFF4DF] text-[#B86B00]">
                  <i className="ri-arrow-right-line hidden text-xl lg:block" />
                  <i className="ri-arrow-down-line text-xl lg:hidden" />
                </div>
              </div>

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
      )}

      {activeSection === 'blocked' && (
        <Card className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-0 pb-28 shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-[#E5E7EB] px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#EEF2F7] text-[#0B1B2B]">
                <i className="ri-user-forbid-line text-xl" />
              </div>

              <div>
                <h3 className="font-bold text-[#111827]">
                  Blocked Users
                </h3>
                <p className="mt-0.5 text-xs text-[#6B7280]">
                  View and manage blocked users.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveSection(null)}
              className="rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-sm font-semibold text-[#111827] transition hover:bg-[#F7F9FC]"
            >
              Back
            </button>
          </div>

          <div className="flex min-h-[240px] flex-col items-center justify-center px-5 py-10 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#EEF2F7] text-[#0B1B2B]">
              <i className="ri-user-forbid-line text-2xl" />
            </div>

            <h4 className="mt-4 font-bold text-[#111827]">
              Blocked users
            </h4>

            <p className="mt-1 max-w-md text-sm leading-6 text-[#6B7280]">
              Blocked user management is not configured in the current Safety data source.
            </p>
          </div>
        </Card>
      )}

      {activeSection === 'contacts' && (
        <Card className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-0 pb-28 shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-[#E5E7EB] px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#F3EEFF] text-[#7C3AED]">
                <i className="ri-contacts-line text-xl" />
              </div>

              <div>
                <h3 className="font-bold text-[#111827]">
                  Emergency Contacts
                </h3>

                <p className="mt-0.5 text-xs text-[#6B7280]">
                  Manage emergency contacts.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveSection(null)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-[#111827] hover:bg-slate-50"
            >
              Back
            </button>
          </div>

          <div className="flex min-h-[240px] flex-col items-center justify-center px-5 py-10 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#F3EEFF] text-[#7C3AED]">
              <i className="ri-contacts-line text-2xl" />
            </div>

            <h4 className="mt-4 font-bold text-[#111827]">
              Emergency contacts
            </h4>

            <p className="mt-1 max-w-md text-sm leading-6 text-[#6B7280]">
              Emergency contact management is not configured in the current
              Safety data source.
            </p>
          </div>
        </Card>
      )}

    </div>
  )
}
