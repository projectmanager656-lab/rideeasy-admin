import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'
import { adminApi } from '../services/adminApi'
import { displayName } from '../admin/adminUtils'
import MobileRecordCard, { MobileField } from '../components/MobileRecordCard'

const statusStyles = {
  active: 'bg-[#EAFBF2] text-[#15803D]',
  inactive: 'bg-[#F1F5F9] text-[#64748B]',
  pending: 'bg-[#FFF4DF] text-[#B86B00]',
  blocked: 'bg-[#FEF2F2] text-[#DC2626]',
}

const vehicleStatus = (driver) => {
  if (driver.blocked) return { label: 'Blocked', key: 'blocked' }
  if (!driver.approved) return { label: 'Pending Verification', key: 'pending' }
  if (String(driver.status).toLowerCase() === 'active' || driver.isOnline) return { label: 'Active', key: 'active' }
  return { label: 'Inactive', key: 'inactive' }
}

const valueOrUnavailable = (value) => value || 'Not available'

export default function AdminVehicles () {
  const navigate = useNavigate()
  const [drivers, setDrivers] = useState([])
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const loadVehicles = useCallback(async (signal) => {
    setLoading(true)
    setError('')
    try {
      const [driverList, alertResponse] = await Promise.all([
        adminApi.getDrivers(signal),
        adminApi.getEmergencyAlerts(signal),
      ])
      if (signal?.aborted) return
      setDrivers(driverList)
      setAlerts(alertResponse.alerts || [])
    } catch (loadError) {
      if (signal?.aborted) return
      setError(loadError?.response?.data?.message || loadError?.message || 'Unable to load vehicles')
    } finally {
      if (!signal?.aborted) setLoading(false)
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    loadVehicles(controller.signal)
    return () => controller.abort()
  }, [loadVehicles])

  const filteredVehicles = useMemo(() => {
    const query = search.trim().toLowerCase()
    return drivers.filter((driver) => {
      const status = vehicleStatus(driver).key
      const matchesStatus = statusFilter === 'all' || status === statusFilter
      const matchesSearch = !query || [
        driver.vehicleNumber,
        driver.vehicleType,
        driver.vehicleModel,
        displayName(driver.name),
        driver.email,
      ].filter(Boolean).join(' ').toLowerCase().includes(query)
      return matchesStatus && matchesSearch
    })
  }, [drivers, search, statusFilter])

  return (
    <AdminLayout
      tab="vehicles"
      setTab={(nextTab) => navigate('/admin/dashboard', { state: { tab: nextTab } })}
      onRefresh={() => loadVehicles()}
      onLogout={() => {
        localStorage.removeItem('adminToken')
        navigate('/admin')
      }}
      emergencyAlerts={alerts}
    >
      <div className="space-y-5 pb-5 sm:space-y-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-[28px] font-bold tracking-[-0.04em] text-[#152238] sm:text-[32px]">Vehicles</h1>
            <p className="mt-1 text-sm text-[#718096]">Manage registered vehicles and verification status</p>
          </div>
          <button type="button" onClick={() => navigate('/admin/dashboard', { state: { tab: 'drivers' } })} className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#E6EBF2] bg-white text-[#152238] shadow-sm hover:bg-[#F8FAFC]" aria-label="Back to drivers">
            <i className="ri-arrow-left-line text-lg" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ['All Vehicles', drivers.length, 'ri-car-line', 'blue', 'all'],
            ['Active', drivers.filter((driver) => vehicleStatus(driver).key === 'active').length, 'ri-checkbox-circle-line', 'green', 'active'],
            ['Pending Verification', drivers.filter((driver) => vehicleStatus(driver).key === 'pending').length, 'ri-time-line', 'orange', 'pending'],
            ['Blocked', drivers.filter((driver) => vehicleStatus(driver).key === 'blocked').length, 'ri-forbid-2-line', 'red', 'blocked'],
          ].map(([label, count, icon, tone, filter]) => (
            <button key={label} type="button" onClick={() => setStatusFilter(filter)} className={`rounded-2xl border bg-white p-3 text-left shadow-[0_2px_10px_rgba(15,23,42,0.05)] ${statusFilter === filter ? 'border-[#FFB21C] ring-2 ring-[#FFB21C]/20' : 'border-[#E6EBF2]'}`}>
              <span className={`grid h-9 w-9 place-items-center rounded-xl ${tone === 'blue' ? 'bg-[#EAF4FF] text-[#2563EB]' : tone === 'green' ? 'bg-[#EAFBF2] text-[#16A34A]' : tone === 'orange' ? 'bg-[#FFF4DF] text-[#B86B00]' : 'bg-[#FEF2F2] text-[#DC2626]'}`}><i className={icon} /></span>
              <span className="mt-2 block text-[10px] font-semibold uppercase tracking-[0.08em] text-[#718096]">{label}</span>
              <strong className="mt-1 block text-xl text-[#152238]">{count}</strong>
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-[#E6EBF2] bg-white p-4 shadow-[0_2px_10px_rgba(15,23,42,0.05)]">
          <label className="relative block"><span className="sr-only">Search vehicles</span><i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-[#718096]" /><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search vehicle number, type or driver..." className="w-full rounded-xl border border-[#E6EBF2] bg-[#F7F9FC] py-2.5 pl-10 pr-3 text-sm text-[#152238] outline-none focus:border-[#FFB21C] focus:ring-2 focus:ring-[#FFB21C]/20" /></label>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#E6EBF2] bg-white shadow-[0_2px_10px_rgba(15,23,42,0.05)]">
          {error && <p className="border-b border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
          {loading ? <div className="py-16 text-center text-sm text-[#718096]"><i className="ri-loader-4-line mr-2 inline-block animate-spin text-xl text-[#FFB21C]" />Loading vehicles...</div> : filteredVehicles.length === 0 ? <div className="py-16 text-center"><i className="ri-car-line text-3xl text-[#9CA3AF]" /><p className="mt-3 text-sm font-semibold text-[#152238]">No vehicles found</p><p className="mt-1 text-xs text-[#718096]">Vehicle records are sourced from registered drivers.</p></div> : <><div className="space-y-3 p-3 md:hidden">{filteredVehicles.map((driver) => { const status = vehicleStatus(driver); return <MobileRecordCard key={driver._id} title={valueOrUnavailable(driver.vehicleNumber)} subtitle={displayName(driver.name) || 'Unnamed driver'} badge={<span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${statusStyles[status.key]}`}>{status.label}</span>}><MobileField label="Type" value={driver.vehicleType} /><MobileField label="Model" value={driver.vehicleModel || driver.model} /><MobileField label="RC" value={driver.rcStatus || driver.rc?.status} /><MobileField label="Insurance" value={driver.insuranceStatus || driver.insurance?.status} /><MobileField label="Registered" value={driver.registrationDate ? new Date(driver.registrationDate).toLocaleDateString('en-IN') : driver.createdAt ? new Date(driver.createdAt).toLocaleDateString('en-IN') : 'Not available'} /></MobileRecordCard>})}</div><div className="hidden overflow-x-auto md:block"><table className="w-full min-w-[1050px] text-left text-sm"><thead className="border-b border-[#E6EBF2] bg-[#F7F9FC]"><tr>{['Vehicle', 'Type', 'Model', 'Driver', 'RC status', 'Insurance status', 'Registration date', 'Vehicle status'].map((heading) => <th key={heading} className="whitespace-nowrap px-4 py-3 text-[10px] font-bold uppercase tracking-[0.08em] text-[#718096]">{heading}</th>)}</tr></thead><tbody className="divide-y divide-[#E6EBF2]">{filteredVehicles.map((driver) => { const status = vehicleStatus(driver); return <tr key={driver._id} className="hover:bg-[#FAFBFC]"><td className="px-4 py-4 font-bold text-[#152238]">{valueOrUnavailable(driver.vehicleNumber)}</td><td className="px-4 py-4 text-[#536174]">{valueOrUnavailable(driver.vehicleType)}</td><td className="px-4 py-4 text-[#536174]">{valueOrUnavailable(driver.vehicleModel || driver.model)}</td><td className="px-4 py-4"><p className="font-semibold text-[#152238]">{displayName(driver.name) || 'Unnamed driver'}</p><p className="mt-0.5 text-xs text-[#718096]">{driver.email || 'Not available'}</p></td><td className="px-4 py-4 text-xs text-[#718096]">{valueOrUnavailable(driver.rcStatus || driver.rc?.status)}</td><td className="px-4 py-4 text-xs text-[#718096]">{valueOrUnavailable(driver.insuranceStatus || driver.insurance?.status)}</td><td className="px-4 py-4 text-xs text-[#718096]">{driver.registrationDate ? new Date(driver.registrationDate).toLocaleDateString('en-IN') : driver.createdAt ? new Date(driver.createdAt).toLocaleDateString('en-IN') : 'Not available'}</td><td className="px-4 py-4"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[status.key]}`}>{status.label}</span></td></tr> })}</tbody></table></div></>}
        </div>
      </div>
    </AdminLayout>
  )
}
