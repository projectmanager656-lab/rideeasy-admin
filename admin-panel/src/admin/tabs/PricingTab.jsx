import React, { useEffect, useMemo, useState } from 'react'
import { Card } from '../../components/AdminUIComponents'

const EMPTY_FORM = {
  rideType: 'AUTO',
  cityZone: '',
  baseFare: '',
  distanceRate: '',
  timeRate: '',
  minimumFare: '',
  fees: '0',
  tax: '0',
  effectiveFrom: '',
  effectiveTo: '',
}

const toInputDate = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toISOString().slice(0, 16)
}

const formatDate = (value) => {
  if (!value) return 'Open ended'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleString()
}

const statusClasses = {
  DRAFT: 'bg-[#FFF7E6] text-[#B86B00] border-[#F6D99A]',
  ACTIVE: 'bg-[#EAFBF2] text-[#15803D] border-[#BBE7C9]',
  INACTIVE: 'bg-[#F3F4F6] text-[#6B7280] border-[#D1D5DB]',
}

export default function PricingTab({
  fareConfigurations = [],
  fareLoading = false,
  fareError = '',
  onCreateFare,
  onUpdateFare,
  onUpdateFareStatus,
  onLoadHistory,
  onPreviewFare,
}) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [editingId, setEditingId] = useState(null)
  const [formError, setFormError] = useState('')
  const [preview, setPreview] = useState(null)
  const [previewLoading, setPreviewLoading] = useState(false)
  const [history, setHistory] = useState([])
  const [historyLoading, setHistoryLoading] = useState(false)

  const sortedConfigurations = useMemo(
    () =>
      [...fareConfigurations].sort((a, b) => {
        const rideCompare = String(a.rideType || '').localeCompare(
          String(b.rideType || ''),
        )

        if (rideCompare !== 0) return rideCompare

        const zoneCompare = String(a.cityZone || '').localeCompare(
          String(b.cityZone || ''),
        )

        if (zoneCompare !== 0) return zoneCompare

        return Number(b.version || 0) - Number(a.version || 0)
      }),
    [fareConfigurations],
  )

  const resetForm = () => {
    setForm(EMPTY_FORM)
    setEditingId(null)
    setFormError('')
    setPreview(null)
  }

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const validateForm = () => {
    const requiredNumbers = [
      ['baseFare', 'Base fare'],
      ['distanceRate', 'Distance rate'],
      ['timeRate', 'Time rate'],
      ['minimumFare', 'Minimum fare'],
      ['fees', 'Fees'],
      ['tax', 'Tax'],
    ]

    if (!form.cityZone.trim()) {
      return 'City / zone is required.'
    }

    for (const [field, label] of requiredNumbers) {
      if (form[field] === '') {
        return `${label} is required.`
      }

      const value = Number(form[field])

      if (!Number.isFinite(value)) {
        return `${label} must be a valid number.`
      }

      if (value < 0) {
        return `${label} cannot be negative.`
      }
    }

    if (!form.effectiveFrom) {
      return 'Effective from is required.'
    }

    const from = new Date(form.effectiveFrom)

    if (Number.isNaN(from.getTime())) {
      return 'Effective from is invalid.'
    }

    if (form.effectiveTo) {
      const to = new Date(form.effectiveTo)

      if (Number.isNaN(to.getTime())) {
        return 'Effective to is invalid.'
      }

      if (to <= from) {
        return 'Effective to must be after effective from.'
      }
    }

    return ''
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const error = validateForm()

    if (error) {
      setFormError(error)
      return
    }

    setFormError('')

    const payload = {
      rideType: form.rideType,
      cityZone: form.cityZone.trim(),
      baseFare: Number(form.baseFare),
      distanceRate: Number(form.distanceRate),
      timeRate: Number(form.timeRate),
      minimumFare: Number(form.minimumFare),
      fees: Number(form.fees),
      tax: Number(form.tax),
      effectiveFrom: new Date(form.effectiveFrom).toISOString(),
      effectiveTo: form.effectiveTo
        ? new Date(form.effectiveTo).toISOString()
        : null,
    }

    try {
      if (editingId) {
        await onUpdateFare(editingId, payload)
      } else {
        await onCreateFare(payload)
      }

      resetForm()
    } catch (error) {
      setFormError(
        error?.response?.data?.message ||
          error?.message ||
          'Unable to save fare configuration.',
      )
    }
  }

  const handleEdit = (configuration) => {
    if (configuration.status !== 'DRAFT') {
      setFormError(
        'Only draft configurations can be edited. Active and historical versions remain unchanged.',
      )
      return
    }

    setEditingId(configuration._id || configuration.id)

    setForm({
      rideType: configuration.rideType || 'AUTO',
      cityZone: configuration.cityZone || '',
      baseFare: String(configuration.baseFare ?? ''),
      distanceRate: String(configuration.distanceRate ?? ''),
      timeRate: String(configuration.timeRate ?? ''),
      minimumFare: String(configuration.minimumFare ?? ''),
      fees: String(configuration.fees ?? '0'),
      tax: String(configuration.tax ?? '0'),
      effectiveFrom: toInputDate(configuration.effectiveFrom),
      effectiveTo: toInputDate(configuration.effectiveTo),
    })

    setFormError('')
    setPreview(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleStatusChange = async (configuration, nextStatus) => {
    const id = configuration._id || configuration.id

    const message =
      nextStatus === 'ACTIVE'
        ? `Activate ${configuration.rideType} / ${configuration.cityZone} version ${configuration.version}?`
        : `Deactivate ${configuration.rideType} / ${configuration.cityZone} version ${configuration.version}?`

    if (!window.confirm(message)) return

    try {
      await onUpdateFareStatus(id, nextStatus)
    } catch (error) {
      setFormError(
        error?.response?.data?.message ||
          error?.message ||
          'Unable to update fare status.',
      )
    }
  }

  const handleHistory = async (configuration) => {
    const id = configuration._id || configuration.id

    setHistoryLoading(true)
    setFormError('')

    try {
      const result = await onLoadHistory(id)

      setHistory(result?.history || result?.configurations || [])
    } catch (error) {
      setFormError(
        error?.response?.data?.message ||
          error?.message ||
          'Unable to load fare history.',
      )
    } finally {
      setHistoryLoading(false)
    }
  }

  const handlePreview = async () => {
    const error = validateForm()

    if (error) {
      setFormError(error)
      return
    }

    const distance = Number(
      window.prompt('Sample distance in km:', '5') || '0',
    )

    const time = Number(
      window.prompt('Sample ride time in minutes:', '15') || '0',
    )

    if (
      !Number.isFinite(distance) ||
      distance < 0 ||
      !Number.isFinite(time) ||
      time < 0
    ) {
      setFormError('Sample distance and time must be valid non-negative numbers.')
      return
    }

    setPreviewLoading(true)
    setFormError('')

    try {
      const result = await onPreviewFare({
        baseFare: Number(form.baseFare),
        distanceRate: Number(form.distanceRate),
        timeRate: Number(form.timeRate),
        minimumFare: Number(form.minimumFare),
        fees: Number(form.fees),
        tax: Number(form.tax),
        distance,
        time,
      })

      setPreview(result?.breakdown || result)
    } catch (error) {
      setFormError(
        error?.response?.data?.message ||
          error?.message ||
          'Unable to calculate fare preview.',
      )
    } finally {
      setPreviewLoading(false)
    }
  }

  useEffect(() => {
    setHistory([])
  }, [fareConfigurations])

  if (fareLoading) {
    return (
      <div className="flex min-h-[360px] items-center justify-center">
        <Card className="rounded-2xl border border-[#E5E7EB] bg-white px-8 py-7 shadow-sm">
          <div className="flex items-center gap-3 text-sm font-medium text-[#6B7280]">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#FFF4DF] text-[#FFB21C]">
              <i className="ri-loader-4-line animate-spin text-xl" />
            </div>
            Loading fare configurations…
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[#111827]">
              Fare Configuration
            </h2>

            <p className="mt-1 max-w-3xl text-sm text-[#6B7280]">
              Configure versioned fares by ride category and city / zone with
              controlled effective periods.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-[#BBE7C9] bg-[#EAFBF2] px-4 py-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-white text-[#16A34A] shadow-sm">
              <i className="ri-settings-3-line text-xl" />
            </div>

            <div>
              <p className="text-xs text-[#6B7280]">Fare versions</p>
              <p className="font-bold text-[#15803D]">
                {fareConfigurations.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {fareError && (
        <div className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm text-[#B91C1C]">
          {fareError}
        </div>
      )}

      {formError && (
        <div className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm text-[#B91C1C]">
          {formError}
        </div>
      )}

      <Card className="rounded-2xl border border-[#E5E7EB] bg-white p-0 shadow-sm">
        <div className="border-b border-[#E5E7EB] px-5 py-4 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#FFF4DF] text-[#B86B00]">
                <i className="ri-money-rupee-circle-line text-lg" />
              </div>

              <div>
                <h3 className="font-bold text-[#111827]">
                  {editingId ? 'Edit Draft Fare' : 'Create Fare Configuration'}
                </h3>

                <p className="mt-0.5 text-xs text-[#6B7280]">
                  Active and historical versions cannot be silently rewritten.
                </p>
              </div>
            </div>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-[#D9DEE7] px-4 py-2 text-sm font-semibold text-[#475569] hover:bg-[#F7F9FC]"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <label className="text-sm font-semibold text-[#334155]">
              Ride Type
              <select
                name="rideType"
                value={form.rideType}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-[#D9DEE7] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#FFB21C]"
              >
                <option value="BIKE">BIKE</option>
                <option value="AUTO">AUTO</option>
                <option value="CAR">CAR</option>
              </select>
            </label>

            <label className="text-sm font-semibold text-[#334155]">
              City / Zone
              <input
                name="cityZone"
                value={form.cityZone}
                onChange={handleChange}
                placeholder="e.g. Pune / Zone 1"
                className="mt-2 w-full rounded-xl border border-[#D9DEE7] px-3 py-2.5 text-sm outline-none focus:border-[#FFB21C]"
              />
            </label>

            {[
              ['baseFare', 'Base Fare'],
              ['distanceRate', 'Distance Rate / km'],
              ['timeRate', 'Time Rate / min'],
              ['minimumFare', 'Minimum Fare'],
              ['fees', 'Fees'],
              ['tax', 'Tax (%)'],
            ].map(([name, label]) => (
              <label
                key={name}
                className="text-sm font-semibold text-[#334155]"
              >
                {label}
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="mt-2 w-full rounded-xl border border-[#D9DEE7] px-3 py-2.5 text-sm outline-none focus:border-[#FFB21C]"
                />
              </label>
            ))}

            <label className="text-sm font-semibold text-[#334155]">
              Effective From
              <input
                type="datetime-local"
                name="effectiveFrom"
                value={form.effectiveFrom}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-[#D9DEE7] px-3 py-2.5 text-sm outline-none focus:border-[#FFB21C]"
              />
            </label>

            <label className="text-sm font-semibold text-[#334155]">
              Effective To
              <input
                type="datetime-local"
                name="effectiveTo"
                value={form.effectiveTo}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-[#D9DEE7] px-3 py-2.5 text-sm outline-none focus:border-[#FFB21C]"
              />
            </label>
          </div>

          <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-[#E5E7EB] bg-[#F7F9FC] p-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-bold text-[#111827]">
                Save as Draft
              </p>

              <p className="mt-1 text-xs text-[#6B7280]">
                Activation is a separate confirmed action and is validated
                against overlapping active periods.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handlePreview}
                disabled={previewLoading}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#D9DEE7] bg-white px-4 py-2.5 text-sm font-bold text-[#334155] hover:bg-[#F8FAFC] disabled:opacity-60"
              >
                <i className="ri-calculator-line" />
                {previewLoading ? 'Calculating…' : 'Preview Fare'}
              </button>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FFB21C] px-5 py-2.5 text-sm font-bold text-[#0B1B2B] shadow-sm transition hover:bg-[#FFC34D]"
              >
                <i className="ri-save-line" />
                {editingId ? 'Update Draft' : 'Create Draft'}
              </button>
            </div>
          </div>

          {preview && (
            <div className="mt-5 rounded-2xl border border-[#BBE7C9] bg-[#EAFBF2] p-5">
              <h4 className="font-bold text-[#166534]">Fare Preview</h4>

              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {Object.entries(preview).map(([key, value]) => (
                  <div
                    key={key}
                    className="rounded-xl border border-[#D1FAE5] bg-white p-3"
                  >
                    <p className="text-xs text-[#6B7280]">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </p>
                    <p className="mt-1 text-sm font-bold text-[#111827]">
                      {typeof value === 'number'
                        ? value.toFixed(2)
                        : String(value)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </form>
      </Card>

      <Card className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-0 shadow-sm">
        <div className="border-b border-[#E5E7EB] px-5 py-4 sm:px-6">
          <h3 className="font-bold text-[#111827]">
            Fare Configuration List
          </h3>

          <p className="mt-0.5 text-xs text-[#6B7280]">
            Ride type, city / zone, version, status and effective period.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-[#F7F9FC] text-xs uppercase tracking-wide text-[#64748B]">
              <tr>
                <th className="px-5 py-3">Ride Type</th>
                <th className="px-5 py-3">City / Zone</th>
                <th className="px-5 py-3">Version</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Effective From</th>
                <th className="px-5 py-3">Effective To</th>
                <th className="px-5 py-3">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#E5E7EB]">
              {sortedConfigurations.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-5 py-10 text-center text-sm text-[#6B7280]"
                  >
                    No fare configurations found.
                  </td>
                </tr>
              ) : (
                sortedConfigurations.map((configuration) => {
                  const id = configuration._id || configuration.id

                  return (
                    <tr key={id} className="hover:bg-[#FCFDFE]">
                      <td className="px-5 py-4 font-semibold text-[#111827]">
                        {configuration.rideType}
                      </td>

                      <td className="px-5 py-4 text-[#475569]">
                        {configuration.cityZone}
                      </td>

                      <td className="px-5 py-4 font-bold text-[#111827]">
                        v{configuration.version}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${
                            statusClasses[configuration.status] ||
                            statusClasses.INACTIVE
                          }`}
                        >
                          {configuration.status}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-[#475569]">
                        {formatDate(configuration.effectiveFrom)}
                      </td>

                      <td className="px-5 py-4 text-[#475569]">
                        {formatDate(configuration.effectiveTo)}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-2">
                          {configuration.status === 'DRAFT' && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleEdit(configuration)}
                                className="rounded-lg border border-[#D9DEE7] px-3 py-1.5 text-xs font-bold text-[#334155] hover:bg-[#F7F9FC]"
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleStatusChange(configuration, 'ACTIVE')
                                }
                                className="rounded-lg bg-[#16A34A] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#15803D]"
                              >
                                Activate
                              </button>
                            </>
                          )}

                          {configuration.status === 'ACTIVE' && (
                            <button
                              type="button"
                              onClick={() =>
                                handleStatusChange(configuration, 'INACTIVE')
                              }
                              className="rounded-lg border border-[#FECACA] px-3 py-1.5 text-xs font-bold text-[#B91C1C] hover:bg-[#FEF2F2]"
                            >
                              Deactivate
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleHistory(configuration)}
                            className="rounded-lg border border-[#D9DEE7] px-3 py-1.5 text-xs font-bold text-[#4F46E5] hover:bg-[#EEF2FF]"
                          >
                            History
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {historyLoading && (
        <Card className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
          Loading version history…
        </Card>
      )}

      {history.length > 0 && (
        <Card className="rounded-2xl border border-[#E5E7EB] bg-white p-0 shadow-sm">
          <div className="border-b border-[#E5E7EB] px-5 py-4">
            <h3 className="font-bold text-[#111827]">Version History</h3>
            <p className="mt-0.5 text-xs text-[#6B7280]">
              Version, status, changed by and changed time.
            </p>
          </div>

          <div className="divide-y divide-[#E5E7EB]">
            {history.map((item) => (
              <div
                key={item._id || item.id}
                className="flex flex-col justify-between gap-3 px-5 py-4 sm:flex-row sm:items-center"
              >
                <div>
                  <p className="font-bold text-[#111827]">
                    {item.rideType} / {item.cityZone} — v{item.version}
                  </p>

                  <p className="mt-1 text-xs text-[#6B7280]">
                    Changed by:{' '}
                    {item.changedBy?.email || item.changedBy || 'Unknown'}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <span
                    className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${
                      statusClasses[item.status] || statusClasses.INACTIVE
                    }`}
                  >
                    {item.status}
                  </span>

                  <p className="mt-1 text-xs text-[#6B7280]">
                    {formatDate(item.updatedAt || item.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
