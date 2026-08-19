import React, { useMemo, useState } from 'react'
import { AlertCard, Card } from '../../components/AdminUIComponents'
import { SecondaryPageShell } from './SecondaryPageShell'

const EMPTY_FORM = {
  name: '',
  vehicleType: 'BIKE',
  baseFare: '',
  perKm: '',
  platformFee: '',
  active: true,
}

const money = (value) =>
  `₹${Number(value || 0).toLocaleString('en-IN')}`

const date = (value) =>
  value ? new Date(value).toLocaleString('en-IN') : '—'

const vehicleIcon = (type) => {
  if (type === 'BIKE') return 'ri-motorbike-line'
  if (type === 'AUTO') return 'ri-taxi-line'
  return 'ri-car-line'
}

export default function ServicesTab ({
  services = [],
  loading,
  error,
  onSave,
  onDelete,
}) {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [form, setForm] = useState(null)
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState('')

  const filteredServices = useMemo(() => {
    const query = search.trim().toLowerCase()

    return services.filter((service) => {
      const statusMatches =
        status === 'all' ||
        (status === 'active' && service.active !== false) ||
        (status === 'inactive' && service.active === false)

      const searchMatches =
        !query ||
        [service.name, service.vehicleType]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(query)

      return statusMatches && searchMatches
    })
  }, [services, search, status])

  const activeCount = services.filter(
    (service) => service.active !== false
  ).length

  const inactiveCount = services.filter(
    (service) => service.active === false
  ).length

  const openCreate = () => {
    setForm({ ...EMPTY_FORM })
    setFormError('')
  }

  const openEdit = (service) => {
    setForm({
      _id: service._id,
      name: service.name || '',
      vehicleType: service.vehicleType || 'BIKE',
      baseFare: String(service.baseFare ?? ''),
      perKm: String(service.perKm ?? ''),
      platformFee: String(service.platformFee ?? ''),
      active: service.active !== false,
    })

    setFormError('')
  }

  const submit = async (event) => {
    event.preventDefault()

    const name = form.name.trim()
    const numericFields = ['baseFare', 'perKm', 'platformFee']

    if (
      !name ||
      numericFields.some(
        (field) =>
          form[field] === '' ||
          Number(form[field]) < 0
      )
    ) {
      setFormError(
        'Name and non-negative fare values are required.'
      )
      return
    }

    setSaving(true)
    setFormError('')

    try {
      await onSave(form._id, {
        name,
        vehicleType: form.vehicleType,
        baseFare: Number(form.baseFare),
        perKm: Number(form.perKm),
        platformFee: Number(form.platformFee),
        active: form.active,
      })

      setForm(null)
    } catch (saveError) {
      setFormError(
        saveError?.response?.data?.message ||
          saveError?.message ||
          'Unable to save service.'
      )
    } finally {
      setSaving(false)
    }
  }

  const remove = async (service) => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${service.name}? This cannot be undone.`
      )
    ) {
      return
    }

    setDeletingId(service._id)

    try {
      await onDelete(service._id)
    } catch (deleteError) {
      window.alert(
        deleteError?.response?.data?.message ||
          deleteError?.message ||
          'Unable to delete service.'
      )
    } finally {
      setDeletingId('')
    }
  }

  const fields = [
    ['baseFare', 'Base fare'],
    ['perKm', 'Per KM fare'],
    ['platformFee', 'Platform fee'],
  ]

  return (
    <div className="space-y-6">

      <SecondaryPageShell
        title="Services"
        subtitle="Manage service offerings and pricing"
        rows={[
          { title: 'Service List', description: 'View and manage all services', icon: 'ri-list-check-2', tone: 'blue' },
          { title: 'Service Categories', description: 'Manage service categories', icon: 'ri-folder-3-line', tone: 'green' },
          { title: 'Pricing Settings', description: 'Configure pricing rules', icon: 'ri-price-tag-3-line', tone: 'orange' },
          { title: 'Surge Settings', description: 'Manage surge pricing', icon: 'ri-line-chart-line', tone: 'purple' },
          { title: 'Service Availability', description: 'Manage service availability', icon: 'ri-checkbox-circle-line', tone: 'navy' },
        ]}
      />

      {/* Page Header */}
      <div className="hidden rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm sm:p-6">

        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[#111827]">
              Services
            </h2>

            <p className="mt-1 text-sm text-[#6B7280]">
              Manage RideEasy services
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">

            <div className="flex items-center gap-2 rounded-xl border border-[#E5E7EB] bg-[#F7F9FC] px-3 py-2">

              <div className="grid h-9 w-9 place-items-center rounded-lg bg-[#EAFBF2] text-[#16A34A]">
                <i className="ri-checkbox-circle-line" />
              </div>

              <div>
                <p className="text-[11px] text-[#6B7280]">
                  Active
                </p>

                <p className="font-bold text-[#111827]">
                  {activeCount}
                </p>
              </div>

            </div>

            <div className="flex items-center gap-2 rounded-xl border border-[#E5E7EB] bg-[#F7F9FC] px-3 py-2">

              <div className="grid h-9 w-9 place-items-center rounded-lg bg-[#F1F5F9] text-[#64748B]">
                <i className="ri-pause-circle-line" />
              </div>

              <div>
                <p className="text-[11px] text-[#6B7280]">
                  Inactive
                </p>

                <p className="font-bold text-[#111827]">
                  {inactiveCount}
                </p>
              </div>

            </div>

            <button
              type="button"
              onClick={openCreate}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FFB21C] px-4 py-2.5 text-sm font-bold text-[#0B1B2B] shadow-sm transition hover:bg-[#FFC34D]"
            >
              <i className="ri-add-line text-base" />
              Add Service
            </button>

          </div>
        </div>

      </div>

      {/* Error */}
      {error && (
        <AlertCard
          type="error"
          title="Unable to load services"
          message={error}
        />
      )}

      {/* Search / Filters */}
      <Card className="rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm">

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">

          <div className="relative flex-1">

            <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]" />

            <input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search services..."
              className="w-full rounded-xl border border-[#E5E7EB] bg-[#F7F9FC] py-2.5 pl-11 pr-4 text-sm text-[#111827] placeholder:text-[#9CA3AF] outline-none transition focus:border-[#FFB21C] focus:ring-2 focus:ring-[#FFB21C]/20"
            />

          </div>

          <div className="relative">

            <i className="ri-filter-3-line absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />

            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value)
              }
              className="w-full appearance-none rounded-xl border border-[#E5E7EB] bg-[#F7F9FC] py-2.5 pl-10 pr-9 text-sm font-medium text-[#111827] outline-none transition focus:border-[#FFB21C] sm:w-[170px]"
            >
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <i className="ri-arrow-down-s-line pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />

          </div>

        </div>

      </Card>

      {/* Desktop Table */}
      <Card className="hidden overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white p-0 shadow-sm md:block">

        {loading ? (
          <Loading />
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full min-w-[900px] text-left text-sm">

              <thead className="border-b border-[#E5E7EB] bg-[#F7F9FC]">

                <tr>

                  {[
                    'Service',
                    'Vehicle',
                    'Base fare',
                    'Per KM',
                    'Platform fee',
                    'Status',
                    'Updated',
                    'Actions',
                  ].map((label) => (
                    <th
                      key={label}
                      className="whitespace-nowrap px-4 py-3.5 text-xs font-bold uppercase tracking-wide text-[#6B7280]"
                    >
                      {label}
                    </th>
                  ))}

                </tr>

              </thead>

              <tbody className="divide-y divide-[#E5E7EB]">

                {filteredServices.length ? (
                  filteredServices.map((service) => (
                    <ServiceRow
                      key={service._id}
                      service={service}
                      onEdit={openEdit}
                      onDelete={remove}
                      deleting={
                        deletingId === service._id
                      }
                    />
                  ))
                ) : (
                  <EmptyRow />
                )}

              </tbody>

            </table>

          </div>
        )}

      </Card>

      {/* Mobile Cards */}
      <div className="space-y-3 md:hidden">

        {loading ? (
          <Card className="rounded-2xl border border-[#E5E7EB]">
            <Loading />
          </Card>
        ) : filteredServices.length ? (
          filteredServices.map((service) => (
            <ServiceCard
              key={service._id}
              service={service}
              onEdit={openEdit}
              onDelete={remove}
              deleting={
                deletingId === service._id
              }
            />
          ))
        ) : (
          <Card className="rounded-2xl border border-[#E5E7EB]">
            <p className="py-10 text-center text-sm text-[#6B7280]">
              No services match the current filters.
            </p>
          </Card>
        )}

      </div>

      {/* Add / Edit Modal */}
      {form && (
        <div
          className="fixed inset-0 z-50 flex items-end bg-[#0B1B2B]/60 p-0 sm:items-center sm:justify-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="service-form-title"
        >

          <form
            onSubmit={submit}
            className="max-h-[92dvh] w-full overflow-y-auto rounded-t-2xl bg-white p-5 shadow-2xl sm:max-w-xl sm:rounded-2xl sm:p-6"
          >

            <div className="mb-5 flex items-start justify-between gap-4">

              <div>

                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#B86B00]">
                  Service Configuration
                </p>

                <h3
                  id="service-form-title"
                  className="mt-1 text-xl font-bold text-[#111827]"
                >
                  {form._id
                    ? 'Edit Service'
                    : 'Add Service'}
                </h3>

                <p className="mt-1 text-sm text-[#6B7280]">
                  All fare amounts are in INR.
                </p>

              </div>

              <button
                type="button"
                onClick={() => setForm(null)}
                className="grid h-9 w-9 place-items-center rounded-lg text-[#6B7280] transition hover:bg-[#F7F9FC] hover:text-[#111827]"
                aria-label="Close"
              >
                <i className="ri-close-line text-xl" />
              </button>

            </div>

            {formError && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {formError}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">

              <Field
                label="Service name"
                value={form.name}
                onChange={(value) =>
                  setForm({
                    ...form,
                    name: value,
                  })
                }
                className="sm:col-span-2"
              />

              <label className="space-y-1.5">

                <span className="text-sm font-semibold text-[#111827]">
                  Vehicle type
                </span>

                <select
                  value={form.vehicleType}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      vehicleType:
                        event.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-[#E5E7EB] bg-white px-3 py-2.5 text-sm text-[#111827] outline-none transition focus:border-[#FFB21C] focus:ring-2 focus:ring-[#FFB21C]/20"
                >
                  <option value="BIKE">Bike</option>
                  <option value="AUTO">Auto</option>
                  <option value="CAR">Car</option>
                </select>

              </label>

              <label className="flex items-end gap-2 rounded-xl border border-[#E5E7EB] px-3 py-2.5">

                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      active:
                        event.target.checked,
                    })
                  }
                  className="mb-0.5 h-4 w-4 accent-[#FFB21C]"
                />

                <span className="text-sm font-semibold text-[#111827]">
                  Active service
                </span>

              </label>

              {fields.map(([field, label]) => (
                <Field
                  key={field}
                  label={label}
                  type="number"
                  value={form[field]}
                  onChange={(value) =>
                    setForm({
                      ...form,
                      [field]: value,
                    })
                  }
                />
              ))}

            </div>

            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={() => setForm(null)}
                className="rounded-xl border border-[#E5E7EB] px-4 py-2.5 text-sm font-semibold text-[#111827] transition hover:bg-[#F7F9FC]"
              >
                Cancel
              </button>

              <button
                disabled={saving}
                type="submit"
                className="rounded-xl bg-[#FFB21C] px-4 py-2.5 text-sm font-bold text-[#0B1B2B] transition hover:bg-[#FFC34D] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? 'Saving…'
                  : 'Save Service'}
              </button>

            </div>

          </form>

        </div>
      )}

    </div>
  )
}

function Field ({
  label,
  type = 'text',
  value,
  onChange,
  className = '',
}) {
  return (
    <label className={`space-y-1.5 ${className}`}>

      <span className="text-sm font-semibold text-[#111827]">
        {label}
      </span>

      <input
        required
        type={type}
        min={
          type === 'number'
            ? '0'
            : undefined
        }
        step={
          type === 'number'
            ? '0.01'
            : undefined
        }
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full rounded-xl border border-[#E5E7EB] bg-white px-3 py-2.5 text-sm text-[#111827] outline-none transition focus:border-[#FFB21C] focus:ring-2 focus:ring-[#FFB21C]/20"
      />

    </label>
  )
}

function Status ({ active }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ${
        active !== false
          ? 'bg-[#EAFBF2] text-[#16A34A]'
          : 'bg-[#F1F5F9] text-[#64748B]'
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          active !== false
            ? 'bg-[#22C55E]'
            : 'bg-[#94A3B8]'
        }`}
      />

      {active !== false
        ? 'Active'
        : 'Inactive'}
    </span>
  )
}

function Actions ({
  service,
  onEdit,
  onDelete,
  deleting,
}) {
  return (
    <div className="flex gap-2">

      <button
        type="button"
        onClick={() => onEdit(service)}
        className="inline-flex items-center gap-1.5 rounded-lg bg-[#FFF4DF] px-3 py-2 text-xs font-bold text-[#B86B00] transition hover:bg-[#FFE9B8]"
      >
        <i className="ri-edit-line" />
        Edit
      </button>

      <button
        type="button"
        disabled={deleting}
        onClick={() => onDelete(service)}
        className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-[#DC2626] transition hover:bg-red-100 disabled:opacity-50"
      >
        <i className="ri-delete-bin-line" />
        {deleting
          ? 'Deleting…'
          : 'Delete'}
      </button>

    </div>
  )
}

function ServiceRow ({
  service,
  onEdit,
  onDelete,
  deleting,
}) {
  return (
    <tr className="transition-colors hover:bg-[#FFFCF5]">

      <td className="px-4 py-4">

        <div className="flex items-center gap-3">

          <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#FFF4DF] text-[#B86B00]">
            <i
              className={`${vehicleIcon(
                service.vehicleType
              )} text-lg`}
            />
          </div>

          <div>
            <p className="font-bold text-[#111827]">
              {service.name}
            </p>

            <p className="mt-0.5 text-xs text-[#9CA3AF]">
              RideEasy service
            </p>
          </div>

        </div>

      </td>

      <td className="px-4 py-4">

        <span className="rounded-lg bg-[#F7F9FC] px-2.5 py-1 text-xs font-bold text-[#6B7280]">
          {service.vehicleType}
        </span>

      </td>

      <td className="px-4 py-4 font-bold text-[#111827]">
        {money(service.baseFare)}
      </td>

      <td className="px-4 py-4 font-semibold text-[#6B7280]">
        {money(service.perKm)}
      </td>

      <td className="px-4 py-4 font-semibold text-[#B86B00]">
        {money(service.platformFee)}
      </td>

      <td className="px-4 py-4">
        <Status active={service.active} />
      </td>

      <td className="whitespace-nowrap px-4 py-4 text-xs text-[#6B7280]">
        {date(
          service.updatedAt ||
            service.createdAt
        )}
      </td>

      <td className="px-4 py-4">
        <Actions
          service={service}
          onEdit={onEdit}
          onDelete={onDelete}
          deleting={deleting}
        />
      </td>

    </tr>
  )
}

function EmptyRow () {
  return (
    <tr>
      <td
        colSpan={8}
        className="px-4 py-12 text-center"
      >

        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#F7F9FC] text-[#9CA3AF]">
          <i className="ri-settings-3-line text-2xl" />
        </div>

        <p className="mt-3 text-sm font-semibold text-[#111827]">
          No services found
        </p>

        <p className="mt-1 text-xs text-[#6B7280]">
          There are currently no services.
        </p>

      </td>
    </tr>
  )
}

function Loading () {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center text-center">

      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#FFF4DF] text-[#FFB21C]">
        <i className="ri-loader-4-line animate-spin text-2xl" />
      </div>

      <p className="mt-4 text-sm font-medium text-[#6B7280]">
        Loading services…
      </p>

    </div>
  )
}

function ServiceCard ({
  service,
  onEdit,
  onDelete,
  deleting,
}) {
  return (
    <Card className="rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm">

      <div className="flex items-start justify-between gap-3">

        <div className="flex items-center gap-3">

          <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#FFF4DF] text-[#B86B00]">
            <i
              className={`${vehicleIcon(
                service.vehicleType
              )} text-xl`}
            />
          </div>

          <div>
            <h3 className="font-bold text-[#111827]">
              {service.name}
            </h3>

            <p className="mt-1 text-sm text-[#6B7280]">
              {service.vehicleType}
            </p>
          </div>

        </div>

        <Status active={service.active} />

      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">

        <div className="rounded-xl bg-[#F7F9FC] p-3">
          <p className="text-[11px] text-[#6B7280]">
            Base
          </p>
          <p className="mt-1 font-bold text-[#111827]">
            {money(service.baseFare)}
          </p>
        </div>

        <div className="rounded-xl bg-[#F7F9FC] p-3">
          <p className="text-[11px] text-[#6B7280]">
            Per KM
          </p>
          <p className="mt-1 font-bold text-[#111827]">
            {money(service.perKm)}
          </p>
        </div>

        <div className="rounded-xl bg-[#FFF9E8] p-3">
          <p className="text-[11px] text-[#6B7280]">
            Platform
          </p>
          <p className="mt-1 font-bold text-[#B86B00]">
            {money(service.platformFee)}
          </p>
        </div>

      </div>

      <p className="mt-4 text-xs text-[#6B7280]">
        Updated{' '}
        {date(
          service.updatedAt ||
            service.createdAt
        )}
      </p>

      <div className="mt-4">
        <Actions
          service={service}
          onEdit={onEdit}
          onDelete={onDelete}
          deleting={deleting}
        />
      </div>

    </Card>
  )
}
