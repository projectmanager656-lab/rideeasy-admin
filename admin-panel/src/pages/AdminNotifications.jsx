import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'
import { AlertCard, Card } from '../components/AdminUIComponents'
import { adminApi } from '../services/adminApi'
import { getReadAlertIds, isAlertUnread, markAlertRead, markAlertsRead } from '../admin/notificationReadState'

const FILTERS = [ 'All', 'Emergency', 'Rides', 'Drivers', 'System' ]
const formatTime = (value) => value ? new Date(value).toLocaleString('en-IN') : 'Not available'

export default function AdminNotifications () {
  const navigate = useNavigate()
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [, setReadVersion] = useState(0)
  const [workingId, setWorkingId] = useState('')

  const loadAlerts = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const response = await adminApi.getEmergencyAlerts()
      setAlerts(response.alerts || [])
    } catch (loadError) {
      setError(loadError?.response?.data?.message || 'Unable to load notifications')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadAlerts() }, [loadAlerts])

  const visibleAlerts = useMemo(() => {
    if (filter !== 'All' && filter !== 'Emergency') return []
    const query = search.trim().toLowerCase()
    return alerts.filter((alert) => !query || [
      alert.riderName, alert.driverName, alert.rideId, alert.ride?._id,
      alert.city, alert.location?.address, 'Emergency Alert',
    ].filter(Boolean).join(' ').toLowerCase().includes(query))
  }, [alerts, filter, search])

  const markRead = (alert) => {
    markAlertRead(alert._id)
    setReadVersion((version) => version + 1)
  }

  const markAllRead = () => {
    markAlertsRead(alerts)
    setReadVersion((version) => version + 1)
  }

  const acknowledge = async (alert) => {
    setWorkingId(alert._id)
    try {
      const response = await adminApi.acknowledgeEmergencyAlert(alert._id)
      setAlerts((current) => current.map((item) => String(item._id) === String(alert._id) ? { ...item, ...response.alert } : item))
      markRead(alert)
    } catch (actionError) {
      window.alert(actionError?.response?.data?.message || 'Unable to acknowledge emergency')
    } finally {
      setWorkingId('')
    }
  }

  const resolve = async (alert) => {
    setWorkingId(alert._id)
    try {
      const response = await adminApi.resolveEmergencyAlert(alert._id)
      setAlerts((current) => current.map((item) => String(item._id) === String(alert._id) ? { ...item, ...response.alert } : item))
      markRead(alert)
      const phone = response.nearestPolice?.phone?.replace(/[^\d+]/g, '')
      if (!phone) {
        window.alert('Emergency resolved, but no phone number is available for the nearest police station.')
        return
      }
      window.location.href = `tel:${phone}`
    } catch (actionError) {
      window.alert(actionError?.response?.data?.message || 'Unable to resolve emergency')
    } finally {
      setWorkingId('')
    }
  }

  const viewEmergency = (alert) => {
    markRead(alert)
    navigate('/admin/dashboard', { state: { tab: 'safety', alertId: alert._id } })
  }

  return <AdminLayout tab="notifications" setTab={(nextTab) => navigate('/admin/dashboard', { state: { tab: nextTab } })} onRefresh={loadAlerts} onLogout={() => { localStorage.removeItem('adminToken'); navigate('/admin') }} emergencyAlerts={alerts}>
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-end sm:justify-between sm:p-6">
        <div><h1 className="text-2xl font-bold text-[#111827]">Notifications</h1><p className="mt-1 text-sm text-[#6B7280]">Stay updated about important RideEasy activity.</p></div>
        <button type="button" onClick={markAllRead} className="rounded-lg border border-[#FFA726] px-4 py-2.5 text-sm font-semibold text-[#B86B00] hover:bg-[#FFF3E0]">Mark all as read</button>
      </div>

      <Card className="p-4">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {FILTERS.map((item) => <button key={item} type="button" onClick={() => setFilter(item)} className={`shrink-0 rounded-full px-3 py-2 text-sm font-semibold ${filter === item ? 'bg-[#FFA726] text-[#111827]' : 'bg-slate-100 text-[#6B7280] hover:bg-[#FFF3E0]'}`}>{item}</button>)}
        </div>
        <label className="relative mt-4 block"><span className="sr-only">Search notifications</span><i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" /><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search notifications…" className="w-full rounded-lg border border-slate-200 bg-[#FAFAFA] py-2.5 pl-10 pr-3 text-sm text-[#111827] focus:border-[#FFA726] focus:outline-none focus:ring-2 focus:ring-[#FFA726]/20" /></label>
      </Card>

      {error && <AlertCard type="error" title="Unable to load notifications" message="Unable to load notifications" />}
      {loading ? <Card><div className="py-12 text-center text-sm text-[#6B7280]"><i className="ri-loader-4-line mr-2 inline-block animate-spin text-xl text-[#FFA726]" />Loading notifications…</div></Card> : !error && (visibleAlerts.length ? <div className="space-y-3">{visibleAlerts.map((alert) => <EmergencyNotification key={alert._id} alert={alert} unread={isAlertUnread(alert, getReadAlertIds())} working={workingId === alert._id} onRead={markRead} onView={viewEmergency} onAcknowledge={acknowledge} onResolve={resolve} />)}</div> : <EmptyState filter={filter} />)}
    </div>
  </AdminLayout>
}

function EmergencyNotification ({ alert, unread, working, onRead, onView, onAcknowledge, onResolve }) {
  const status = String(alert.status || 'pending').toLowerCase()
  const rideId = alert.rideId || alert.ride?._id || alert.ride
  const location = alert.city || alert.location?.address || alert.location?.name
  const unavailable = 'Not available'
  return <Card className={`border-l-4 p-4 sm:p-5 ${unread ? 'border-l-[#E5484D] bg-[#FFF8F8]' : 'border-l-slate-200'}`}><button type="button" onClick={() => onRead(alert)} className="block w-full text-left"><div className="flex gap-3"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#FEE2E2] text-[#E5484D]"><i className="ri-alarm-warning-line text-lg" /></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="font-bold text-[#111827]">Emergency Alert</h2><span className="rounded-full bg-[#FEE2E2] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#E5484D]">High priority</span>{unread && <span className="h-2 w-2 rounded-full bg-[#E5484D]" />}</div><div className="mt-4 grid gap-4 text-sm sm:grid-cols-3"><NotificationGroup title="Passenger / User" rows={[[ 'Name', alert.riderName ], [ 'Phone', alert.phone ]]} fallback={unavailable} /><NotificationGroup title="Driver" rows={[[ 'Name', alert.driverName ], [ 'Vehicle number', alert.vehicleNumber ], [ 'Vehicle type', alert.vehicleType ]]} fallback={unavailable} /><NotificationGroup title="Ride" rows={[[ 'Ride ID', rideId && `#${String(rideId)}` ], [ 'Location', location ], [ 'City', alert.city ], [ 'Emergency time', formatTime(alert.createdAt) ]]} fallback={unavailable} /></div></div></div></button><div className="mt-4 flex flex-col gap-3 border-t border-slate-200 pt-3 sm:flex-row sm:items-center sm:justify-between"><span className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${status === 'pending' ? 'bg-[#FFF3E0] text-[#B86B00]' : status === 'acknowledged' ? 'bg-[#EAFBF2] text-[#1FAA59]' : 'bg-slate-100 text-[#6B7280]'}`}>Status: {status}</span><div className="flex flex-wrap gap-2"><button type="button" onClick={() => onView(alert)} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-[#111827] hover:bg-slate-50">{status === 'resolved' ? 'View Details' : 'View Emergency'}</button>{status === 'pending' && <button disabled={working} type="button" onClick={() => onAcknowledge(alert)} className="rounded-lg bg-[#FFA726] px-3 py-2 text-xs font-semibold text-[#111827] disabled:opacity-50">Acknowledge</button>}{status !== 'resolved' && <button disabled={working} type="button" onClick={() => onResolve(alert)} className="rounded-lg bg-[#E5484D] px-3 py-2 text-xs font-semibold text-white disabled:opacity-50">Resolve & Call Police</button>}</div></div></Card>
}

function NotificationGroup ({ title, rows, fallback }) { return <div><h3 className="font-semibold text-[#111827]">{title}</h3><div className="mt-1.5 space-y-1 text-xs text-[#6B7280]">{rows.map(([label, value]) => <p key={label}><span className="font-medium text-[#111827]">{label}:</span> {value || fallback}</p>)}</div></div> }

function EmptyState ({ filter }) { return <Card className="py-14 text-center"><i className="ri-notification-3-line text-4xl text-[#FFA726]" /><h2 className="mt-3 font-bold text-[#111827]">No notifications</h2><p className="mt-1 text-sm text-[#6B7280]">{filter === 'All' || filter === 'Emergency' ? 'You’re all caught up.' : `No ${filter.toLowerCase()} notifications are available from the current API.`}</p></Card> }
