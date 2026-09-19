import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { SocketContext } from '../context/SocketContext'
import { AlertCard, Card } from '../components/AdminUIComponents'
import { adminApi } from '../services/adminApi'
import { getReadAlertIds, isAlertUnread, markAlertRead, markAlertsRead } from '../admin/notificationReadState'

const FILTERS = [ 'All', 'Emergency', 'Rides', 'Drivers', 'System' ]
const formatTime = (value) => value ? new Date(value).toLocaleString('en-IN') : 'Not available'

export default function AdminNotifications () {
  const { socket } = useContext(SocketContext)

  useEffect(() => {
    if (!socket) return

    const joinAdminRoom = () => {
      socket.emit('admin:live-operations:join')
    }

    joinAdminRoom()
    socket.on('connect', joinAdminRoom)

    return () => {
      socket.off('connect', joinAdminRoom)
    }
  }, [socket])


  useEffect(() => {
    if (!socket) return

    const addNotification = (notification) => {
      window.dispatchEvent(
        new CustomEvent('rideeasy:admin-notification', {
          detail: {
            ...notification,
            createdAt: notification.createdAt || new Date().toISOString(),
          },
        })
      )
    }

    const handleNewRide = (payload) => {
      addNotification({
        id: `ride-new-${payload?.rideId || Date.now()}`,
        type: 'ride',
        title: 'New Ride Arrived',
        message: 'A new ride request has arrived.',
        data: payload,
      })
    }

    const handleDriverStatus = (payload) => {
      const status = payload?.liveStatus
      if (status !== 'ONLINE' && status !== 'OFFLINE') return

      addNotification({
        id: `driver-${status.toLowerCase()}-${payload?.driverId || Date.now()}`,
        type: 'driver',
        title: status === 'ONLINE' ? 'Driver Online' : 'Driver Offline',
        message: status === 'ONLINE'
          ? 'A driver is now online.'
          : 'A driver has gone offline.',
        data: payload,
      })
    }

    const handleRideAccepted = (payload) => {
      addNotification({
        id: `ride-accepted-${payload?.rideId || Date.now()}`,
        type: 'ride',
        title: 'Ride Accepted',
        message: 'A driver has accepted a ride.',
        data: payload,
      })
    }

    const handleRideStarted = (payload) => {
      addNotification({
        id: `ride-started-${payload?.rideId || Date.now()}`,
        type: 'ride',
        title: 'Ride Started',
        message: 'A ride has started.',
        data: payload,
      })
    }

    const handleRideCompleted = (payload) => {
      addNotification({
        id: `ride-completed-${payload?.rideId || Date.now()}`,
        type: 'ride',
        title: 'Ride Completed',
        message: 'A ride has been completed.',
        data: payload,
      })
    }

    socket.on('admin:ride:new', handleNewRide)
    socket.on('driver:status-update', handleDriverStatus)
    socket.on('admin:ride:accepted', handleRideAccepted)
    socket.on('ride:started', handleRideStarted)
    socket.on('admin:ride:completed', handleRideCompleted)

    return () => {
      socket.off('admin:ride:new', handleNewRide)
      socket.off('driver:status-update', handleDriverStatus)
      socket.off('admin:ride:accepted', handleRideAccepted)
      socket.off('ride:started', handleRideStarted)
      socket.off('admin:ride:completed', handleRideCompleted)
    }
  }, [socket])
  const navigate = useNavigate()
  const [alerts, setAlerts] = useState([])
  const [realtimeNotifications, setRealtimeNotifications] = useState([])
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

  useEffect(() => {
    const handleRealtimeNotification = (event) => {
      const notification = event?.detail

      if (!notification?.id) return

      setRealtimeNotifications((current) => [
        notification,
        ...current.filter((item) => item.id !== notification.id),
      ])
    }

    window.addEventListener('rideeasy:admin-notification', handleRealtimeNotification)

    return () => {
      window.removeEventListener('rideeasy:admin-notification', handleRealtimeNotification)
    }
  }, [])

  const visibleNotifications = useMemo(() => {
    const query = search.trim().toLowerCase()

    const emergencyItems = filter === 'All' || filter === 'Emergency'
      ? alerts
          .filter((alert) => !query || [
            alert.riderName, alert.driverName, alert.rideId, alert.ride?._id,
            alert.city, alert.location?.address, 'Emergency Alert',
          ].filter(Boolean).join(' ').toLowerCase().includes(query))
          .map((alert) => ({
            kind: 'emergency',
            id: `emergency-${alert._id}`,
            createdAt: alert.createdAt,
            alert,
          }))
      : []

    const realtimeItems = filter === 'All'
      ? realtimeNotifications
      : realtimeNotifications.filter((notification) => {
          if (filter === 'Rides') return notification.type === 'ride'
          if (filter === 'Drivers') return notification.type === 'driver'
          if (filter === 'System') return notification.type === 'system'
          return false
        })

    const filteredRealtime = realtimeItems.filter((notification) => {
      if (!query) return true
      return [
        notification.title,
        notification.message,
        notification.type,
        notification.data?.rideId,
        notification.data?.driverId,
      ].filter(Boolean).join(' ').toLowerCase().includes(query)
    }).map((notification) => ({
      kind: 'realtime',
      id: notification.id,
      createdAt: notification.createdAt,
      notification,
    }))

    return [...emergencyItems, ...filteredRealtime]
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
  }, [alerts, realtimeNotifications, filter, search])

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

  return (
    <>
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
      {loading ? <Card><div className="py-12 text-center text-sm text-[#6B7280]"><i className="ri-loader-4-line mr-2 inline-block animate-spin text-xl text-[#FFA726]" />Loading notifications…</div></Card> : !error && (visibleNotifications.length ? <div className="space-y-3">{visibleNotifications.map((item) => item.kind === 'emergency' ? <EmergencyNotification key={item.id} alert={item.alert} unread={isAlertUnread(item.alert, getReadAlertIds())} working={workingId === item.alert._id} onRead={markRead} onView={viewEmergency} onAcknowledge={acknowledge} onResolve={resolve} /> : <RealtimeNotification key={item.id} notification={item.notification} />)}</div> : <EmptyState filter={filter} />)}
    </div>
    </>
  )
}

function EmergencyNotification ({ alert, unread, working, onRead, onView, onAcknowledge, onResolve }) {
  const status = String(alert.status || 'pending').toLowerCase()
  const rideId = alert.rideId || alert.ride?._id || alert.ride
  const location = alert.city || alert.location?.address || alert.location?.name
  const unavailable = 'Not available'
  return <Card className={`border-l-4 p-4 sm:p-5 ${unread ? 'border-l-[#E5484D] bg-[#FFF8F8]' : 'border-l-slate-200'}`}><button type="button" onClick={() => onRead(alert)} className="block w-full text-left"><div className="flex gap-3"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#FEE2E2] text-[#E5484D]"><i className="ri-alarm-warning-line text-lg" /></div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h2 className="font-bold text-[#111827]">Emergency Alert</h2><span className="rounded-full bg-[#FEE2E2] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#E5484D]">High priority</span>{unread && <span className="h-2 w-2 rounded-full bg-[#E5484D]" />}</div><div className="mt-4 grid gap-4 text-sm sm:grid-cols-3"><NotificationGroup title="Passenger / User" rows={[[ 'Name', alert.riderName ], [ 'Phone', alert.phone ]]} fallback={unavailable} /><NotificationGroup title="Driver" rows={[[ 'Name', alert.driverName ], [ 'Vehicle number', alert.vehicleNumber ], [ 'Vehicle type', alert.vehicleType ]]} fallback={unavailable} /><NotificationGroup title="Ride" rows={[[ 'Ride ID', rideId && `#${String(rideId)}` ], [ 'Location', location ], [ 'City', alert.city ], [ 'Emergency time', formatTime(alert.createdAt) ]]} fallback={unavailable} /></div></div></div></button><div className="mt-4 flex flex-col gap-3 border-t border-slate-200 pt-3 sm:flex-row sm:items-center sm:justify-between"><span className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-semibold ${status === 'pending' ? 'bg-[#FFF3E0] text-[#B86B00]' : status === 'acknowledged' ? 'bg-[#EAFBF2] text-[#1FAA59]' : 'bg-slate-100 text-[#6B7280]'}`}>Status: {status}</span><div className="flex flex-wrap gap-2"><button type="button" onClick={() => onView(alert)} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-[#111827] hover:bg-slate-50">{status === 'resolved' ? 'View Details' : 'View Emergency'}</button>{status === 'pending' && <button disabled={working} type="button" onClick={() => onAcknowledge(alert)} className="rounded-lg bg-[#FFA726] px-3 py-2 text-xs font-semibold text-[#111827] disabled:opacity-50">Acknowledge</button>}{status !== 'resolved' && <button disabled={working} type="button" onClick={() => onResolve(alert)} className="rounded-lg bg-[#E5484D] px-3 py-2 text-xs font-semibold text-white disabled:opacity-50">Resolve & Call Police</button>}</div></div></Card>
}

function RealtimeNotification ({ notification }) {
  const type = notification?.type === 'driver' ? 'driver' : 'ride'
  const isDriver = type === 'driver'

  return (
    <Card className="border-l-4 border-l-[#FFA726] bg-white p-4 sm:p-5">
      <div className="flex gap-3">
        <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${isDriver ? 'bg-[#EAFBF2] text-[#1FAA59]' : 'bg-[#FFF3E0] text-[#FFA726]'}`}>
          <i className={`${isDriver ? 'ri-steering-2-line' : 'ri-taxi-line'} text-lg`} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-bold text-[#111827]">
              {notification?.title || 'RideEasy Notification'}
            </h2>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#6B7280]">
              {type}
            </span>
            <span className="h-2 w-2 rounded-full bg-[#FFA726]" />
          </div>

          <p className="mt-2 text-sm text-[#6B7280]">
            {notification?.message || 'New activity received.'}
          </p>

          <p className="mt-3 text-xs text-[#9CA3AF]">
            {formatTime(notification?.createdAt)}
          </p>
        </div>
      </div>
    </Card>
  )
}

function NotificationGroup ({ title, rows, fallback }) { return <div><h3 className="font-semibold text-[#111827]">{title}</h3><div className="mt-1.5 space-y-1 text-xs text-[#6B7280]">{rows.map(([label, value]) => <p key={label}><span className="font-medium text-[#111827]">{label}:</span> {value || fallback}</p>)}</div></div> }

function EmptyState ({ filter }) { return <Card className="py-14 text-center"><i className="ri-notification-3-line text-4xl text-[#FFA726]" /><h2 className="mt-3 font-bold text-[#111827]">No notifications</h2><p className="mt-1 text-sm text-[#6B7280]">{filter === 'All' || filter === 'Emergency' ? 'You’re all caught up.' : `No ${filter.toLowerCase()} notifications are available from the current API.`}</p></Card> }
