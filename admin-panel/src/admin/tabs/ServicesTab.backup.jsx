import React, { useMemo, useState } from 'react'
import { AlertCard, Card } from '../../components/AdminUIComponents'

const EMPTY_FORM = {
  name: '',
  vehicleType: 'BIKE',
  baseFare: '',
  perKm: '',
  platformFee: '',
  active: true,
}

const money = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`
const date = (value) => value ? new Date(value).toLocaleString('en-IN') : '—'

export default function ServicesTab ({ services = [], loading, error, onSave, onDelete }) {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [form, setForm] = useState(null)
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState('')

  const filteredServices = useMemo(() => {
    const query = search.trim().toLowerCase()
    return services.filter((service) => {
      const statusMatches = status === 'all' || (status === 'active' ? service.active !== false : service.active === false)
      const searchMatches = !query || [service.name, service.vehicleType].filter(Boolean).join(' ').toLowerCase().includes(query)
      return statusMatches && searchMatches
    })
  }, [services, search, status])

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
    const numericFields = [ 'baseFare', 'perKm', 'platformFee' ]
    if (!name || numericFields.some((field) => form[field] === '' || Number(form[field]) < 0)) {
      setFormError('Name and non-negative fare values are required.')
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
      setFormError(saveError?.response?.data?.message || saveError?.message || 'Unable to save service.')
    } finally {
      setSaving(false)
    }
  }

  const remove = async (service) => {
    if (!window.confirm(`Are you sure you want to delete ${service.name}? This cannot be undone.`)) return
    setDeletingId(service._id)
    try {
      await onDelete(service._id)
    } catch (deleteError) {
      window.alert(deleteError?.response?.data?.message || deleteError?.message || 'Unable to delete service.')
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
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-end sm:justify-between sm:p-5">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6B7280]">Configuration</p>
          <h2 className="mt-1 text-xl font-bold text-[#111827]">Services</h2>
          <p className="mt-1 text-sm text-[#6B7280]">Manage the service catalogue and its displayed fare settings.</p>
        </div>
        <button type="button" onClick={openCreate} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#FFA726] px-4 py-2.5 text-sm font-semibold text-[#111827] hover:bg-[#ffb74d]">
          <i className="ri-add-line" /> Add Service
        </button>
      </div>

      {error && <AlertCard type="error" title="Unable to load services" message={error} />}

      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="relative flex-1">
            <span className="sr-only">Search services</span>
            <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search service or vehicle type" className="w-full rounded-lg border border-slate-200 bg-[#FAFAFA] py-2 pl-10 pr-3 text-sm text-[#111827] focus:border-[#FFA726] focus:outline-none focus:ring-2 focus:ring-[#FFA726]/20" />
          </label>
          <select value={status} onChange={(event) => setStatus(event.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-[#111827] focus:border-[#FFA726] focus:outline-none">
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </Card>

      <Card className="hidden overflow-hidden p-0 md:block">
        {loading ? <Loading /> : <div className="overflow-x-auto"><table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-[#F9FAFB]"><tr>
            {['Service', 'Vehicle', 'Base fare', 'Per KM', 'Platform fee', 'Status', 'Updated', 'Actions'].map((label) => <th key={label} className="whitespace-nowrap px-4 py-3 font-semibold text-[#111827]">{label}</th>)}
          </tr></thead>
          <tbody className="divide-y divide-slate-200">
            {filteredServices.length ? filteredServices.map((service) => <ServiceRow key={service._id} service={service} onEdit={openEdit} onDelete={remove} deleting={deletingId === service._id} />) : <EmptyRow />}
          </tbody>
        </table></div>}
      </Card>

      <div className="space-y-3 md:hidden">
        {loading ? <Card><Loading /></Card> : filteredServices.length ? filteredServices.map((service) => <ServiceCard key={service._id} service={service} onEdit={openEdit} onDelete={remove} deleting={deletingId === service._id} />) : <Card><p className="py-8 text-center text-sm text-[#6B7280]">No services match the current filters.</p></Card>}
      </div>

      {form && <div className="fixed inset-0 z-50 flex items-end bg-[#111827]/50 p-0 sm:items-center sm:justify-center sm:p-6" role="dialog" aria-modal="true" aria-labelledby="service-form-title">
        <form onSubmit={submit} className="max-h-[92dvh] w-full overflow-y-auto rounded-t-2xl bg-white p-5 shadow-2xl sm:max-w-xl sm:rounded-2xl sm:p-6">
          <div className="mb-5 flex items-start justify-between gap-4"><div><h3 id="service-form-title" className="text-xl font-bold text-[#111827]">{form._id ? 'Edit Service' : 'Add Service'}</h3><p className="mt-1 text-sm text-[#6B7280]">All fare amounts are in INR.</p></div><button type="button" onClick={() => setForm(null)} className="rounded-lg p-1 text-[#6B7280] hover:bg-slate-100" aria-label="Close"><i className="ri-close-line text-xl" /></button></div>
          {formError && <div className="mb-4 rounded-lg border border-[#FECACA] bg-[#FEE2E2] px-3 py-2 text-sm text-[#B91C1C]">{formError}</div>}
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Service name" value={form.name} onChange={(value) => setForm({ ...form, name: value })} className="sm:col-span-2" />
            <label className="space-y-1"><span className="text-sm font-medium text-[#111827]">Vehicle type</span><select value={form.vehicleType} onChange={(event) => setForm({ ...form, vehicleType: event.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-[#FFA726] focus:outline-none"><option value="BIKE">Bike</option><option value="AUTO">Auto</option><option value="CAR">Car</option></select></label>
            <label className="flex items-end gap-2 rounded-lg border border-slate-200 px-3 py-2"><input type="checkbox" checked={form.active} onChange={(event) => setForm({ ...form, active: event.target.checked })} className="h-4 w-4 accent-[#FFA726]" /><span className="text-sm font-medium text-[#111827]">Active service</span></label>
            {fields.map(([field, label]) => <Field key={field} label={label} type="number" value={form[field]} onChange={(value) => setForm({ ...form, [field]: value })} />)}
          </div>
          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><button type="button" onClick={() => setForm(null)} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-[#111827] hover:bg-slate-50">Cancel</button><button disabled={saving} type="submit" className="rounded-lg bg-[#FFA726] px-4 py-2.5 text-sm font-semibold text-[#111827] disabled:cursor-not-allowed disabled:opacity-60">{saving ? 'Saving…' : 'Save Service'}</button></div>
        </form>
      </div>}
    </div>
  )
}

function Field ({ label, type = 'text', value, onChange, className = '' }) {
  return <label className={`space-y-1 ${className}`}><span className="text-sm font-medium text-[#111827]">{label}</span><input required type={type} min={type === 'number' ? '0' : undefined} step={type === 'number' ? '0.01' : undefined} value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-[#111827] focus:border-[#FFA726] focus:outline-none" /></label>
}

function Status ({ active }) { return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${active !== false ? 'bg-[#EAFBF2] text-[#1FAA59]' : 'bg-slate-100 text-[#6B7280]'}`}>{active !== false ? 'Active' : 'Inactive'}</span> }
function Actions ({ service, onEdit, onDelete, deleting }) { return <div className="flex gap-2"><button type="button" onClick={() => onEdit(service)} className="rounded-lg px-2 py-1 text-xs font-semibold text-[#B86B00] hover:bg-[#FFF3E0]">Edit</button><button type="button" disabled={deleting} onClick={() => onDelete(service)} className="rounded-lg px-2 py-1 text-xs font-semibold text-[#E5484D] hover:bg-[#FEE2E2] disabled:opacity-50">{deleting ? 'Deleting…' : 'Delete'}</button></div> }
function ServiceRow ({ service, onEdit, onDelete, deleting }) { return <tr className="hover:bg-[#FFF8F0]"><td className="px-4 py-3 font-semibold text-[#111827]">{service.name}</td><td className="px-4 py-3 text-[#6B7280]">{service.vehicleType}</td><td className="px-4 py-3">{money(service.baseFare)}</td><td className="px-4 py-3">{money(service.perKm)}</td><td className="px-4 py-3">{money(service.platformFee)}</td><td className="px-4 py-3"><Status active={service.active} /></td><td className="whitespace-nowrap px-4 py-3 text-xs text-[#6B7280]">{date(service.updatedAt || service.createdAt)}</td><td className="px-4 py-3"><Actions service={service} onEdit={onEdit} onDelete={onDelete} deleting={deleting} /></td></tr> }
function EmptyRow () { return <tr><td colSpan={8} className="px-4 py-10 text-center text-sm text-[#6B7280]">No services match the current filters.</td></tr> }
function Loading () { return <div className="py-12 text-center text-sm text-[#6B7280]"><i className="ri-loader-4-line mr-2 inline-block animate-spin text-xl text-[#FFA726]" />Loading services…</div> }
function ServiceCard ({ service, onEdit, onDelete, deleting }) { return <Card className="space-y-4"><div className="flex items-start justify-between gap-3"><div><h3 className="font-bold text-[#111827]">{service.name}</h3><p className="mt-1 text-sm text-[#6B7280]">{service.vehicleType}</p></div><Status active={service.active} /></div><div className="grid grid-cols-3 gap-2 text-center text-xs"><div className="rounded-lg bg-slate-50 p-2"><p className="text-[#6B7280]">Base</p><p className="mt-1 font-semibold text-[#111827]">{money(service.baseFare)}</p></div><div className="rounded-lg bg-slate-50 p-2"><p className="text-[#6B7280]">Per KM</p><p className="mt-1 font-semibold text-[#111827]">{money(service.perKm)}</p></div><div className="rounded-lg bg-slate-50 p-2"><p className="text-[#6B7280]">Platform</p><p className="mt-1 font-semibold text-[#111827]">{money(service.platformFee)}</p></div></div><p className="text-xs text-[#6B7280]">Updated {date(service.updatedAt || service.createdAt)}</p><Actions service={service} onEdit={onEdit} onDelete={onDelete} deleting={deleting} /></Card> }
