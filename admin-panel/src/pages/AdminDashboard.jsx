import React, { useState, useEffect, useCallback, useMemo, useRef, useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { adminApi } from '../services/adminApi'
import { formatApiError } from '../utils/apiError'
import { displayName } from '../admin/adminUtils'
import { SocketContext } from '../context/SocketContext'
import { RIDE_STARTED, RIDE_OTP_VERIFIED } from '../constants/rideSocketEvents'
import AdminLayout from '../components/AdminLayout'
import { AlertCard } from '../components/AdminUIComponents'
import {
  OverviewTab,
  UsersTab,
  DriversTab,
  RidesTab,
  PaymentsTab,
  PricingTab,
  ServicesTab,
  SafetyTab,
  SettingsTab,
  ComplaintsTab,
  ReportsTab,
  EarningsReport,
  BookingsReport,
  DriversReport,
  UsersReport,
  AuditLogsTab,
} from '../admin/tabs'
import AdminLiveOperations from './AdminLiveOperations'
import AdminRoles from './AdminRoles'
import AdminFinance from './AdminFinance'

const AdminDashboard = ({ initialTab = null }) => {
  const { socket } = useContext(SocketContext)
  const navigate = useNavigate()
  const location = useLocation()

  const navigateToTab = useCallback((nextTab) => {
    const tabPathMap = {
      analytics: '/admin/dashboard',
      users: '/admin/users',
      drivers: '/admin/drivers',
      rides: '/admin/rides',
      payments: '/admin/payments',
      sos: '/admin/sos',
      support: '/admin/support',
      reports: '/admin/reports',
      services: '/admin/services',
      pricing: '/admin/pricing',
      settings: '/admin/settings',
      vehicles: '/admin/vehicles',
      verification: '/admin/verification',
      'live-operations': '/admin/live-operations',
      finance: '/admin/finance',
      notifications: '/admin/notifications',
      roles: '/admin/roles',
      'audit-logs': '/admin/audit-logs',
    }

    setTab(nextTab)

    const path = tabPathMap[nextTab]
    if (path && location.pathname !== path) {
      navigate(path)
    }
  }, [location.pathname, navigate])

  const dataLoadedRef = useRef(new Set())
  const [statsNonce, setStatsNonce] = useState(0)

  const [analytics, setAnalytics] = useState(null)
  const [analyticsError, setAnalyticsError] = useState('')
  const [analyticsLoading, setAnalyticsLoading] = useState(true)
  const [users, setUsers] = useState([])
  const [drivers, setDrivers] = useState([])
  const [rides, setRides] = useState([])
  const [selectedRide, setSelectedRide] = useState(null)
  const [rideAudit, setRideAudit] = useState([])
  const [rideAuditLoading, setRideAuditLoading] = useState(false)
  const [rideAuditError, setRideAuditError] = useState('')
  const [payments, setPayments] = useState([])
  const [selectedPayment, setSelectedPayment] = useState(null)
  const [paymentDetailLoading, setPaymentDetailLoading] = useState(false)
  const [services, setServices] = useState([])
  const [fareConfigurations, setFareConfigurations] = useState([])
const [fareLoading, setFareLoading] = useState(false)
const [fareError, setFareError] = useState('')
  const [pricingJson, setPricingJson] = useState('')
  const [emergencyAlerts, setEmergencyAlerts] = useState([])
  const [policeStations, setPoliceStations] = useState([])
  const [tab, setTab] = useState(() => {
    const pathTabMap = {
      '/admin/dashboard': 'analytics',
      '/admin/users': 'users',
      '/admin/drivers': 'drivers',
      '/admin/rides': 'rides',
      '/admin/payments': 'payments',
      '/admin/sos': 'sos',
      '/admin/support': 'support',
      '/admin/reports': 'reports',
      '/admin/services': 'services',
      '/admin/pricing': 'pricing',
      '/admin/settings': 'settings',
      '/admin/vehicles': 'vehicles',
      '/admin/verification': 'verification',
      '/admin/live-operations': 'live-operations',
      '/admin/finance': 'finance',
      '/admin/notifications': 'notifications',
      '/admin/roles': 'roles',
    }

    return (
      location.state?.tab ||
      initialTab ||
      pathTabMap[location.pathname] ||
      'analytics'
    )
  })
  const [reportView, setReportView] = useState(null)
  useEffect(() => {
  if (initialTab) {
    setTab(initialTab)
  }
}, [initialTab])
  const [highlightedEmergencyAlertId] = useState(() => location.state?.alertId || '')
  const [tabError, setTabError] = useState('')
  const [rideStatusFilter, setRideStatusFilter] = useState('all')
  const [rideDateFilter, setRideDateFilter] = useState('')
  const [rideDriverFilter, setRideDriverFilter] = useState('all')
  const [rideUserFilter, setRideUserFilter] = useState('all')
  const [driverStatusFilter, setDriverStatusFilter] = useState('all')
  const [tableSearch, setTableSearch] = useState('')
  const [selectedIds, setSelectedIds] = useState([])
  const [usersLoading, setUsersLoading] = useState(false)
  const [driversLoading, setDriversLoading] = useState(false)
  const [ridesLoading, setRidesLoading] = useState(false)
  const [paymentsLoading, setPaymentsLoading] = useState(false)
  const [servicesLoading, setServicesLoading] = useState(false)
  const [pricingLoading, setPricingLoading] = useState(false)
  const tableHeaderSelectRef = useRef(null)

  const silentRefreshAnalytics = useCallback(async () => {
    try {
      const d = await adminApi.getAnalytics()
      setAnalytics(d)
      dataLoadedRef.current.add('analytics')
    } catch {
      /* keep previous overview */
    }
  }, [])

  const refreshStats = useCallback(() => {
    window.location.reload()
  }, [])

  useEffect(() => {
    const rideId = selectedRide?._id
    if (!rideId) {
      setRideAudit([])
      setRideAuditError('')
      return undefined
    }

    const controller = new AbortController()

    const loadRideAudit = async () => {
      setRideAuditLoading(true)
      setRideAuditError('')

      try {
        const audit = await adminApi.getRideAudit(rideId, controller.signal)
        setRideAudit(Array.isArray(audit) ? audit : [])
      } catch (err) {
        if (err?.name !== 'CanceledError' && err?.name !== 'AbortError') {
          setRideAuditError(err?.message || 'Failed to load ride audit')
          setRideAudit([])
        }
      } finally {
        if (!controller.signal.aborted) {
          setRideAuditLoading(false)
        }
      }
    }

    loadRideAudit()

    return () => controller.abort()
  }, [selectedRide?._id])

  const refreshRides = useCallback(async () => {
    setRidesLoading(true)
    setTabError('')
    try {
      const list = await adminApi.getRides(rideStatusFilter)
      setRides(list)
      setSelectedRide((current) => {
        if (!current?._id) return current
        return list.find((ride) => String(ride._id) === String(current._id)) || current
      })
    } catch (e) {
      setTabError(fmtErr(e))
    } finally {
      setRidesLoading(false)
    }
  }, [rideStatusFilter])

  useEffect(() => {
    if (!socket) return

    const handleOtpVerified = (payload) => {
      const rideId = payload?.rideId

      if (!rideId) return

      setRides((current) =>
        current.map((ride) =>
          String(ride._id) === String(rideId)
            ? {
                ...ride,
                otpVerificationStatus: payload.verificationStatus || 'success',
                otpVerifiedAt: payload.verifiedAt || new Date().toISOString(),
              }
            : ride
        )
      )

      setSelectedRide((current) =>
        current && String(current._id) === String(rideId)
          ? {
              ...current,
              otpVerificationStatus: payload.verificationStatus || 'success',
              otpVerifiedAt: payload.verifiedAt || new Date().toISOString(),
            }
          : current
      )
    }

    socket.on(RIDE_OTP_VERIFIED, handleOtpVerified)

    return () => {
      socket.off(RIDE_OTP_VERIFIED, handleOtpVerified)
    }
  }, [socket])

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

    const handleRideStarted = (payload) => {
      const rideId = payload?.rideId || payload?.ride?._id

      if (!rideId) return

      const incomingStartedAt = payload?.startedAt || payload?.ride?.startedAt

      setRides((current) =>
        current.map((ride) => {
          if (String(ride._id) !== String(rideId)) return ride

          const existingStartedAt = ride.startedAt
          const currentStatus = String(ride.status || '').toLowerCase()

          if (['completed', 'cancelled'].includes(currentStatus)) {
            return ride
          }

          if (
            existingStartedAt &&
            incomingStartedAt &&
            new Date(incomingStartedAt).getTime() < new Date(existingStartedAt).getTime()
          ) {
            return ride
          }

          return {
            ...ride,
            ...(payload?.ride || {}),
            status: 'started',
            ...(incomingStartedAt ? { startedAt: incomingStartedAt } : {}),
          }
        })
      )

      setSelectedRide((current) => {
        if (!current || String(current._id) !== String(rideId)) return current

        const existingStartedAt = current.startedAt
        const currentStatus = String(current.status || '').toLowerCase()

        if (['completed', 'cancelled'].includes(currentStatus)) {
          return current
        }

        if (
          existingStartedAt &&
          incomingStartedAt &&
          new Date(incomingStartedAt).getTime() < new Date(existingStartedAt).getTime()
        ) {
          return current
        }

        return {
          ...current,
          ...(payload?.ride || {}),
          status: 'started',
          ...(incomingStartedAt ? { startedAt: incomingStartedAt } : {}),
        }
      })
    }

    socket.on(RIDE_STARTED, handleRideStarted)

    return () => {
      socket.off(RIDE_STARTED, handleRideStarted)
    }
  }, [socket, refreshRides])

  useEffect(() => {
    if (!socket) return

    const handleAdminNewRide = (payload) => {
      const ride = payload?.ride || payload
      const rideId = ride?._id || payload?.rideId

      if (!rideId) return

      window.dispatchEvent(
        new CustomEvent('rideeasy:admin-notification', {
          detail: {
            id: `ride-${rideId}-${payload?.offeredAt || Date.now()}`,
            type: 'ride',
            title: 'New Ride Arrived',
            message: `A new ride request has arrived${ride?.user?.name ? ` from ${ride.user.name}` : ''}.`,
            data: payload,
            createdAt: new Date().toISOString(),
          },
        })
      )
    }

    socket.on('admin:ride:new', handleAdminNewRide)

    return () => {
      socket.off('admin:ride:new', handleAdminNewRide)
    }
  }, [socket])

  useEffect(() => {
    if (!socket) return

    const handleDriverStatusUpdate = (payload) => {
      const driverId = payload?.driverId
      const status = String(payload?.liveStatus || '').toUpperCase()

      if (!driverId || !['ONLINE', 'OFFLINE'].includes(status)) return

      setDrivers((currentDrivers) =>
        currentDrivers.map((driver) =>
          String(driver?._id) === String(driverId)
            ? {
                ...driver,
                liveStatus: status,
                isOnline: status === 'ONLINE',
              }
            : driver
        )
      )

      window.dispatchEvent(
        new CustomEvent('rideeasy:admin-notification', {
          detail: {
            id: `driver-${driverId}-${status}-${Date.now()}`,
            type: 'driver',
            title: status === 'ONLINE' ? 'Driver Online' : 'Driver Offline',
            message: `A driver is now ${status.toLowerCase()}.`,
            data: payload,
            createdAt: new Date().toISOString(),
          },
        })
      )
    }

    socket.on('driver:status-update', handleDriverStatusUpdate)

    return () => {
      socket.off('driver:status-update', handleDriverStatusUpdate)
    }
  }, [socket])

  useEffect(() => {
    if (!socket) return

    const handleAdminRideAccepted = (payload) => {
      const ride = payload?.ride || payload
      const rideId = ride?._id || payload?.rideId

      if (!rideId) return

      setRides((current) =>
        current.map((item) => {
          if (String(item._id) !== String(rideId)) return item

          const currentStatus = String(item.status || '').toLowerCase()

          if (['started', 'completed', 'cancelled'].includes(currentStatus)) {
            return item
          }

          return {
            ...item,
            ...ride,
            status: 'accepted',
            acceptedAt:
              ride?.acceptedAt ||
              item.acceptedAt ||
              new Date().toISOString(),
            captain: ride?.captain || item.captain,
          }
        })
      )

      setSelectedRide((current) => {
        if (!current || String(current._id) !== String(rideId)) {
          return current
        }

        const currentStatus = String(current.status || '').toLowerCase()

        if (['started', 'completed', 'cancelled'].includes(currentStatus)) {
          return current
        }

        return {
          ...current,
          ...ride,
          status: 'accepted',
          acceptedAt:
            ride?.acceptedAt ||
            current.acceptedAt ||
            new Date().toISOString(),
          captain: ride?.captain || current.captain,
        }
      })

      window.dispatchEvent(
        new CustomEvent('rideeasy:admin-notification', {
          detail: {
            id: `ride-${rideId}-accepted-${payload?.at || Date.now()}`,
            type: 'ride',
            title: 'Ride Accepted',
            message: 'A driver has accepted a ride request.',
            data: payload,
            createdAt: new Date().toISOString(),
          },
        })
      )
    }
    socket.on('admin:ride:accepted', handleAdminRideAccepted)

    return () => {
      socket.off('admin:ride:accepted', handleAdminRideAccepted)
    }
  }, [socket])

  useEffect(() => {
    if (!socket) return

    const handleAdminRideStarted = (payload) => {
      const ride = payload?.ride || payload
      const rideId = payload?.rideId || ride?._id

      if (!rideId) return

      window.dispatchEvent(
        new CustomEvent('rideeasy:admin-notification', {
          detail: {
            id: `ride-${rideId}-started-${payload?.startedAt || Date.now()}`,
            type: 'ride',
            title: 'Ride Started',
            message: 'A ride has started successfully.',
            data: payload,
            createdAt: new Date().toISOString(),
          },
        })
      )
    }
    socket.on(RIDE_STARTED, handleAdminRideStarted)

    return () => {
      socket.off(RIDE_STARTED, handleAdminRideStarted)
    }
  }, [socket])

  useEffect(() => {
    if (!socket) return

    const handleAdminRideCompleted = (payload) => {
      console.log('[AdminDashboard] admin:ride:completed received', payload)
      const ride = payload?.ride || payload
      const rideId = payload?.rideId || ride?._id
      console.log('[AdminDashboard] completed rideId:', rideId, 'open rideId:', selectedRide?._id)

      if (!rideId) return

      const completedAt =
        payload?.completedAt ||
        ride?.completedAt ||
        new Date().toISOString()

      setRides((current) =>
        current.map((item) =>
          String(item._id) === String(rideId)
            ? {
                ...item,
                ...ride,
                status: 'completed',
                completedAt,
                captain: ride?.captain || item.captain,
              }
            : item
        )
      )

      setSelectedRide((current) =>
        current && String(current._id) === String(rideId)
          ? {
              ...current,
              ...ride,
              status: 'completed',
              completedAt,
              captain: ride?.captain || current.captain,
            }
          : current
      )

      window.dispatchEvent(
        new CustomEvent('rideeasy:admin-notification', {
          detail: {
            id: `ride-${rideId}-completed-${completedAt}`,
            type: 'ride',
            title: 'Ride Completed',
            message: 'A ride has been completed successfully.',
            data: payload,
            createdAt: new Date().toISOString(),
          },
        })
      )
    }
    socket.on('admin:ride:completed', handleAdminRideCompleted)

    return () => {
      socket.off('admin:ride:completed', handleAdminRideCompleted)
    }
  }, [socket])

  useEffect(() => {
    if (location.state?.tab) {
      setTab(location.state.tab)
    } else if (initialTab) {
      setTab(initialTab)
    }
  }, [initialTab, location.state?.tab])

  useEffect(() => {
    setSelectedIds([])
    setTableSearch('')
  }, [tab])

  // Refresh rides immediately when Socket.IO reconnects
  useEffect(() => {
    if (!socket) return

    const handleSocketReconnect = () => {
      refreshRides()
    }

    socket.on('connect', handleSocketReconnect)

    return () => {
      socket.off('connect', handleSocketReconnect)
    }
  }, [socket, refreshRides])

  // Refresh driver data immediately when network reconnects
  useEffect(() => {
    if (tab !== 'drivers') return

    const handleOnline = async () => {
      try {
        const list = await adminApi.getDrivers()
        setDrivers(Array.isArray(list) ? list : [])
        setTabError('')
      } catch (e) {
        setTabError(fmtErr(e))
      }
    }

    window.addEventListener('online', handleOnline)

    return () => {
      window.removeEventListener('online', handleOnline)
    }
  }, [tab])
  const fmtErr = (e) => formatApiError(e)
  const loadPaymentDetail = async (paymentOrId) => {
    const paymentId =
      typeof paymentOrId === 'object'
        ? paymentOrId?._id
        : paymentOrId

    if (!paymentId) return

    if (typeof paymentOrId === 'object') {
      setSelectedPayment(paymentOrId)
    }

    requestAnimationFrame(() => {
      document.getElementById('payment-details')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    })

    const ac = new AbortController()
    const { signal } = ac

    setPaymentDetailLoading(true)
    setTabError('')

    try {
      const result = await adminApi.getPayment(paymentId, signal)
      if (signal.aborted) return

      setSelectedPayment(result?.transaction || result || paymentOrId || null)
    } catch (e) {
      if (signal.aborted) return
      setTabError(fmtErr(e))
    } finally {
      if (!signal.aborted) setPaymentDetailLoading(false)
    }
  }

  /** Overview only — `statsNonce` bumps on "Refresh stats" without re-fetching rides/users/etc. */
  useEffect(() => {
    if (tab !== 'analytics') return
    if (dataLoadedRef.current.has('analytics')) {
      setAnalyticsLoading(false)
      return
    }
    const ac = new AbortController()
    const { signal } = ac
    ;(async () => {
      setAnalyticsError('')
      setAnalyticsLoading(true)
      try {
const [d, usersResult, driversResult, ridesResult, paymentsResult, alertsResult] = await Promise.all([
          adminApi.getAnalytics(signal),
          adminApi.getUsers(signal),
          adminApi.getDrivers(signal),
          adminApi.getRides('all', signal),
          adminApi.getPayments(signal),
          adminApi.getEmergencyAlerts(signal),
        ])
        if (signal.aborted) return
        setAnalytics(d)
        setUsers(usersResult)
        setDrivers(driversResult)
        setRides(ridesResult)
        setPayments(paymentsResult)
        setEmergencyAlerts(alertsResult.alerts || [])
        dataLoadedRef.current.add('users')
        dataLoadedRef.current.add('drivers')
        dataLoadedRef.current.add('rides')
        dataLoadedRef.current.add('payments')
        dataLoadedRef.current.add('analytics')
      } catch (e) {
        if (signal.aborted) return
        setAnalytics(null)
        setAnalyticsError(fmtErr(e))
      } finally {
        if (!signal.aborted) setAnalyticsLoading(false)
      }
    })()
    return () => ac.abort()
  }, [tab, statsNonce])

  useEffect(() => {
    if (tab === 'analytics') return
    const ac = new AbortController()
    const { signal } = ac

    const run = async () => {
      if (tab === 'users') {
        if (dataLoadedRef.current.has('users')) return
        setUsersLoading(true)
        setTabError('')
        try {
          const list = await adminApi.getUsers(signal)
          if (signal.aborted) return
          setUsers(list)
          dataLoadedRef.current.add('users')
        } catch (e) {
          if (signal.aborted) return
          setTabError(fmtErr(e))
        } finally {
          if (!signal.aborted) setUsersLoading(false)
        }
        return
      }

      if (tab === 'drivers') {
        if (dataLoadedRef.current.has('drivers')) return
        setDriversLoading(true)
        setTabError('')
        try {
          const list = await adminApi.getDrivers(signal)
          if (signal.aborted) return
          setDrivers(list)
          dataLoadedRef.current.add('drivers')
        } catch (e) {
          if (signal.aborted) return
          setTabError(fmtErr(e))
        } finally {
          if (!signal.aborted) setDriversLoading(false)
        }
        return
      }

     if (tab === 'rides') {
  setRidesLoading(true)
  setTabError('')

  try {
    const [list, driverList] = await Promise.all([
      adminApi.getRides(rideStatusFilter, signal),
      adminApi.getDrivers(signal),
    ])

    if (signal.aborted) return

    setRides(Array.isArray(list) ? list : [])
    setDrivers(Array.isArray(driverList) ? driverList : [])
    dataLoadedRef.current.add('drivers')
  } catch (e) {
    if (signal.aborted) return
    setTabError(fmtErr(e))
  } finally {
    if (!signal.aborted) setRidesLoading(false)
  }

  return
}
      if (tab === 'reports') {
        setTabError('')

        try {
          const requests = []

          if (!dataLoadedRef.current.has('rides')) {
            requests.push(
              adminApi.getRides('all', signal).then((list) => {
                if (!signal.aborted) {
                  setRides(Array.isArray(list) ? list : [])
                  dataLoadedRef.current.add('rides')
                }
              })
            )
          }

          if (!dataLoadedRef.current.has('drivers')) {
            requests.push(
              adminApi.getDrivers(signal).then((list) => {
                if (!signal.aborted) {
                  setDrivers(Array.isArray(list) ? list : [])
                  dataLoadedRef.current.add('drivers')
                }
              })
            )
          }

          if (!dataLoadedRef.current.has('users')) {
            requests.push(
              adminApi.getUsers(signal).then((list) => {
                if (!signal.aborted) {
                  setUsers(Array.isArray(list) ? list : [])
                  dataLoadedRef.current.add('users')
                }
              })
            )
          }

          if (!dataLoadedRef.current.has('payments')) {
            setPaymentsLoading(true)

            requests.push(
              adminApi.getPayments(signal).then((list) => {
                if (!signal.aborted) {
                  setPayments(Array.isArray(list) ? list : [])
                  dataLoadedRef.current.add('payments')
                }
              }).finally(() => {
                if (!signal.aborted) setPaymentsLoading(false)
              })
            )
          }

          await Promise.all(requests)
        } catch (e) {
          if (signal.aborted) return
          setTabError(fmtErr(e))
        }

        return
      }

      if (tab === 'payments') {
        if (dataLoadedRef.current.has('payments')) return
        setPaymentsLoading(true)
        setTabError('')
        try {
          const list = await adminApi.getPayments(signal)
          if (signal.aborted) return
          setPayments(list)
          dataLoadedRef.current.add('payments')
        } catch (e) {
          if (signal.aborted) return
          setTabError(fmtErr(e))
        } finally {
          if (!signal.aborted) setPaymentsLoading(false)
        }
        return
      }

      if (tab === 'services') {
        setServicesLoading(true)
        setTabError('')
        try {
          const list = await adminApi.getServices(signal)
          if (signal.aborted) return
          setServices(list)
        } catch (e) {
          if (signal.aborted) return
          setTabError(fmtErr(e))
        } finally {
          if (!signal.aborted) setServicesLoading(false)
        }
        return
      }

      if (tab === 'pricing') {
        if (dataLoadedRef.current.has('pricing')) return
        setPricingLoading(true)
        setTabError('')
        try {
          const pricing = await adminApi.getPricing(signal)
          if (signal.aborted) return
          setPricingJson(JSON.stringify({
            rates: pricing.rates || {},
            driverPlans: pricing.driverPlans || {},
          }, null, 2))
          dataLoadedRef.current.add('pricing')
        } catch (e) {
          if (signal.aborted) return
          setPricingJson(JSON.stringify({ rates: {}, driverPlans: {} }, null, 2))
          setTabError(fmtErr(e))
        } finally {
          if (!signal.aborted) setPricingLoading(false)
        }
        return
      }

      if (tab === 'safety' || tab === 'sos') {
        setTabError('')
        try {
          const [alertsRes, policeRes] = await Promise.all([
            adminApi.getEmergencyAlerts(signal),
            adminApi.getPoliceStations('Kolhapur', signal),
          ])
          if (signal.aborted) return
          setEmergencyAlerts(alertsRes.alerts || [])
          setPoliceStations(policeRes.stations || [])
        } catch (e) {
          if (signal.aborted) return
          setTabError(fmtErr(e))
        }
      }
    }

    run()
    return () => ac.abort()
  }, [tab, rideStatusFilter, statsNonce])

  const mergeDriver = (doc) => {
    if (!doc?._id) return
    const id = String(doc._id)
    setDrivers((list) => list.map((x) => (String(x._id) === id ? { ...x, ...doc } : x)))
  }

  const approveDriver = (driverId) => {
    adminApi.approveDriver(driverId)
      .then((data) => {
        const d = data?.driver
        if (d) mergeDriver(d)
      })
      .catch((e) => alert(e.response?.data?.message || 'Failed'))
  }

  const rejectDriver = (driverId) => {
    if (!window.confirm('Remove driver approval? They will need approval again before going online.')) return
    adminApi.rejectDriver(driverId)
      .then((data) => {
        const d = data?.driver
        if (d) mergeDriver(d)
      })
      .catch((e) => alert(e.response?.data?.message || 'Failed'))
  }

  const toggleUserBlock = (userId, blocked) => {
    adminApi.patchUserBlock(userId, blocked)
      .then((data) => {
        const u = data?.user
        if (u?._id) {
          setUsers((list) => list.map((x) => (String(x._id) === String(u._id) ? { ...x, ...u } : x)))
        }
      })
      .catch((e) => alert(e.response?.data?.message || 'Failed'))
  }

  const toggleDriverBlock = (driverId, blocked) => {
    adminApi.patchDriverBlock(driverId, blocked)
      .then((data) => {
        const d = data?.driver
        if (d) mergeDriver(d)
      })
      .catch((e) => alert(e.response?.data?.message || 'Failed'))
  }

  const deleteUser = (userId) => {
    if (!window.confirm('Permanently delete this user from the database? This cannot be undone.')) return
    adminApi.deleteUser(userId)
      .then(() => {
        setUsers((list) => list.filter((x) => String(x._id) !== String(userId)))
        silentRefreshAnalytics()
      })
      .catch((e) => alert(e.response?.data?.message || e.message || 'Delete failed'))
  }

  const deleteDriver = (driverId) => {
    if (!window.confirm('Permanently delete this driver from the database? This cannot be undone.')) return
    adminApi.deleteDriver(driverId)
      .then(() => {
        setDrivers((list) => list.filter((x) => String(x._id) !== String(driverId)))
        silentRefreshAnalytics()
      })
      .catch((e) => alert(e.response?.data?.message || e.message || 'Delete failed'))
  }

  const deleteRide = (rideId) => {
    if (!window.confirm('Permanently delete this ride record? This cannot be undone.')) return
    adminApi.deleteRide(rideId)
      .then(() => {
        setRides((list) => list.filter((x) => String(x._id) !== String(rideId)))
        setPayments((list) => list.filter((x) => String(x._id) !== String(rideId)))
        setSelectedIds((prev) => prev.filter((x) => x !== String(rideId)))
        silentRefreshAnalytics()
      })
      .catch((e) => alert(e.response?.data?.message || e.message || 'Delete failed'))
  }

  const filteredUsers = useMemo(() => {
    const q = tableSearch.trim().toLowerCase()
    const base = users.filter((u) => u && u._id)

    if (location.state?.blockedUsersOnly) {
      const blocked = base.filter((u) => Boolean(u.blocked))
      if (!q) return blocked
      return blocked.filter((u) => {
        const blob = [displayName(u.name), u.email, u.phone, u.city, String(u._id)]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
        return blob.includes(q)
      })
    }

    if (!q) return base

    return base.filter((u) => {
      const blob = [displayName(u.name), u.email, u.phone, u.city, String(u._id)]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return blob.includes(q)
    })
  }, [users, tableSearch, location.state?.blockedUsersOnly])

  const filteredDrivers = useMemo(() => {
    const q = tableSearch.trim().toLowerCase()
    const base = drivers.filter((d) => d && d._id)

    const statusFiltered = base.filter((driver) => {
      const liveStatus = String(driver.liveStatus || '').toLowerCase()

      if (driverStatusFilter === 'all') return true
      if (driverStatusFilter === 'online') return liveStatus === 'online'
      if (driverStatusFilter === 'busy') return liveStatus === 'busy'
      if (driverStatusFilter === 'offline') return liveStatus === 'offline'

      return true
    })

    if (!q) return statusFiltered

    return statusFiltered.filter((d) => {
      const blob = [
        displayName(d.name),
        d.email,
        d.phone,
        d.city,
        d.vehicleType,
        d.vehicleNumber,
        String(d._id),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return blob.includes(q)
    })
  }, [drivers, tableSearch, driverStatusFilter])

  const filteredRides = useMemo(() => {
    const q = tableSearch.trim().toLowerCase()

    return rides.filter((r) => {
      if (!r || !r._id) return false

      const rideDate = r.createdAt || r.bookedAt || r.updatedAt
      const matchesDate =
        !rideDateFilter ||
        (rideDate &&
          new Date(rideDate).toISOString().slice(0, 10) === rideDateFilter)

      const normalizedStatus = String(r.status || '').toLowerCase()
      const matchesStatus =
        rideStatusFilter === 'all' ||
        normalizedStatus === String(rideStatusFilter).toLowerCase()

      const driverId = String(r.captain?._id || r.captain?.id || '')
      const userId = String(r.user?._id || r.user?.id || '')

      const matchesDriver =
        rideDriverFilter === 'all' ||
        driverId === String(rideDriverFilter)

      const matchesUser =
        rideUserFilter === 'all' ||
        userId === String(rideUserFilter)

      const blob = [
        r.city,
        r.status,
        r.pickupLocation,
        r.dropLocation,
        displayName(r.user?.name),
        r.user?.phone,
        displayName(r.captain?.name),
        r.captain?.phone,
        r.captain?.vehicleNumber,
        String(r._id),
        String(r.price),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return (
        matchesDate &&
        matchesStatus &&
        matchesDriver &&
        matchesUser &&
        (!q || blob.includes(q))
      )
    })
  }, [
    rides,
    tableSearch,
    rideDateFilter,
    rideStatusFilter,
    rideDriverFilter,
    rideUserFilter,
  ])

  const filteredPayments = useMemo(() => {
    const q = tableSearch.trim().toLowerCase()
    const base = payments.filter((p) => p && p._id)
    if (!q) return base
    return base.filter((p) => {
      const blob = [p.summary, p.city, p.paymentMode, p.paymentStatus, String(p._id), String(p.amount)]
        .filter(Boolean).join(' ').toLowerCase()
      return blob.includes(q)
    })
  }, [payments, tableSearch])

  const toggleSelect = (id) => {
    const s = String(id)
    setSelectedIds((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]))
  }

  const selectAllVisible = (rows) => {
    setSelectedIds(rows.map((row) => String(row._id)))
  }

  const clearSelection = () => setSelectedIds([])

  useEffect(() => {
    const el = tableHeaderSelectRef.current
    if (!el) return
    let visibleIds = []
    if (tab === 'users') visibleIds = filteredUsers.map((u) => String(u._id))
    else if (tab === 'drivers') visibleIds = filteredDrivers.map((d) => String(d._id))
    else if (tab === 'rides') visibleIds = filteredRides.map((r) => String(r._id))
    else if (tab === 'payments') visibleIds = filteredPayments.map((p) => String(p._id))
    const all = visibleIds.length > 0 && visibleIds.every((id) => selectedIds.includes(id))
    const some = visibleIds.some((id) => selectedIds.includes(id))
    el.indeterminate = some && !all
  }, [tab, filteredUsers, filteredDrivers, filteredRides, filteredPayments, selectedIds])

  const bulkDeleteUsers = () => {
    const ids = selectedIds.filter((id) => users.some((u) => String(u._id) === id))
    if (ids.length === 0) return
    if (!window.confirm(`Delete ${ids.length} user(s) permanently?`)) return
    Promise.all(ids.map((id) => adminApi.deleteUser(id)))
      .then(() => {
        setUsers((list) => list.filter((u) => !ids.includes(String(u._id))))
        clearSelection()
        silentRefreshAnalytics()
      })
      .catch((e) => alert(e.response?.data?.message || e.message || 'Bulk delete failed'))
  }

  const bulkDeleteDrivers = () => {
    const ids = selectedIds.filter((id) => drivers.some((d) => String(d._id) === id))
    if (ids.length === 0) return
    if (!window.confirm(`Delete ${ids.length} driver(s) permanently?`)) return
    Promise.all(ids.map((id) => adminApi.deleteDriver(id)))
      .then(() => {
        setDrivers((list) => list.filter((d) => !ids.includes(String(d._id))))
        clearSelection()
        silentRefreshAnalytics()
      })
      .catch((e) => alert(e.response?.data?.message || e.message || 'Bulk delete failed'))
  }

  const bulkDeleteRides = () => {
    const ids = selectedIds.filter((id) => rides.some((r) => String(r._id) === id))
    if (ids.length === 0) return
    if (!window.confirm(`Delete ${ids.length} ride record(s) permanently?`)) return
    Promise.all(ids.map((id) => adminApi.deleteRide(id)))
      .then(() => {
        setRides((list) => list.filter((r) => !ids.includes(String(r._id))))
        setPayments((list) => list.filter((p) => !ids.includes(String(p._id))))
        clearSelection()
        silentRefreshAnalytics()
      })
      .catch((e) => alert(e.response?.data?.message || e.message || 'Bulk delete failed'))
  }

  const bulkDeletePayments = () => {
    bulkDeleteRides()
  }

  const acknowledgeEmergencyAlert = (id) => {
    adminApi.acknowledgeEmergencyAlert(id)
      .then((res) => {
        const next = res.alert
        setEmergencyAlerts((list) => list.map((alert) => String(alert._id) === String(next._id) ? { ...alert, ...next } : alert))
      })
      .catch((e) => alert(e.response?.data?.message || 'Unable to acknowledge emergency'))
  }

  const resolveEmergencyAlert = (id) => {
    adminApi.resolveEmergencyAlert(id)
      .then((res) => {
        const next = res.alert
        setEmergencyAlerts((list) => list.map((alert) => String(alert._id) === String(next._id) ? { ...alert, ...next } : alert))

        const phone = res.nearestPolice?.phone?.replace(/[^\d+]/g, '')
        if (!phone) {
          alert('Emergency resolved, but no phone number is available for the nearest police station.')
          return
        }

        window.location.href = `tel:${phone}`
      })
      .catch((e) => alert(e.response?.data?.message || 'Unable to resolve emergency'))
  }

  const refreshServices = async () => {
    const list = await adminApi.getServices()
    setServices(list)
  }

  const saveService = async (id, payload) => {
    if (id) await adminApi.updateService(id, payload)
    else await adminApi.createService(payload)
    await refreshServices()
  }

  const deleteService = async (id) => {
    await adminApi.deleteService(id)
    await refreshServices()
  }

  const refreshFareConfigurations = async () => {
    const result = await adminApi.getFareConfigurations()
    setFareConfigurations(result?.configurations || [])
    dataLoadedRef.current.add('fare-configurations')
  }

  const createFareConfiguration = async (payload) => {
    await adminApi.createFareConfiguration(payload)
    await refreshFareConfigurations()
  }

  const updateFareConfiguration = async (id, payload) => {
    await adminApi.updateFareConfiguration(id, payload)
    await refreshFareConfigurations()
  }

  const updateFareConfigurationStatus = async (id, status) => {
    await adminApi.updateFareConfigurationStatus(id, status)
    await refreshFareConfigurations()
  }

  const loadFareConfigurationHistory = async (id) => {
    return adminApi.getFareConfigurationHistory(id)
  }

  const previewFareConfiguration = async (payload) => {
    return adminApi.previewFareConfiguration(payload)
  }

  const logout = () => {
    dataLoadedRef.current.clear()
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminRole')
    navigate('/admin', {
      replace: true,
      state: {
        logoutSuccess: true,
      },
    })
  }

  return (
    <AdminLayout
      tab={tab}
      setTab={navigateToTab}
      onRefresh={refreshStats}
      onLogout={logout}
      emergencyAlerts={emergencyAlerts}
    >
      {/* Error Alert */}
      {tabError && (
        <div className="mb-6">
          <AlertCard
            type="error"
            title="Error"
            message={tabError}
            onClose={() => {}}
          />
        </div>
      )}

      {/* Tab Content */}
      <div className="space-y-6">

        {/* MORE */}
        {tab === 'more' && (
          <div className="mx-auto max-w-md space-y-5">
            <h2 className="text-[28px] font-bold tracking-[-0.04em] text-[#152238]">
              More
            </h2>

            {[
              {
                title: 'ACCOUNT & PREFERENCES',
                items: [
                  {
                    label: 'Settings',
                    description: 'Admin preferences',
                    icon: 'ri-settings-3-line',
                    path: '/admin/settings',
                  },
                  {
                    label: 'Safety',
                    description: 'Emergency controls',
                    icon: 'ri-shield-check-line',
                    tab: 'safety',
                  },
                ],
              },

              {
                title: 'MANAGEMENT',
                items: [
                  {
                    label: 'Vehicles',
                    description: 'Manage vehicles',
                    icon: 'ri-car-line',
                    path: '/admin/vehicles',
                  },
                  {
                    label: 'Verification',
                    description: 'Driver verification',
                    icon: 'ri-checkbox-circle-line',
                    tab: 'drivers',
                  },
                  {
                    label: 'Live Operations',
                    description: 'Monitor active rides',
                    icon: 'ri-radar-line',
                    tab: 'live-operations',
                  },
                  {
                    label: 'Finance',
                    description: 'Financial overview',
                    icon: 'ri-money-rupee-circle-line',
                    tab: 'finance',                  },
                  {
                    label: 'Payments',
                    description: 'Review payment history',
                    icon: 'ri-bank-card-line',
                    tab: 'payments',
                  },
                                    {
                    label: 'Services',
                    description: 'Manage service offerings',
                    icon: 'ri-tools-line',
                    path: '/admin/services',
                  },
                  {
                    label: 'Pricing',
                    description: 'Configure fare rules',
                    icon: 'ri-money-rupee-circle-line',
                    tab: 'pricing',
                  },
                ],
              },

              {
                title: 'ADMINISTRATION',
                items: [
                  {
                    label: 'Support',
                    description: 'Customer support',
                    icon: 'ri-customer-service-2-line',
                    tab: 'complaints',
                  },
                  {
                    label: 'Reports',
                    description: 'View reports',
                    icon: 'ri-bar-chart-line',
                    tab: 'reports',
                  },
                  {
                    label: 'Roles & Permissions',
                    description: 'Admin access control',
                    icon: 'ri-shield-user-line',
                    tab: 'roles',
                  },
                  {
                    label: 'Notifications',
                    description: 'View notifications',
                    icon: 'ri-notification-3-line',
                    path: '/admin/notifications',
                  },
                ],
              },

              {
                title: 'OTHER',
                items: [
                  {
                    label: 'Terms & Conditions',
                    description: 'Review platform terms',
                    icon: 'ri-file-text-line',
                    path: '/admin/terms',
                  },
                  {
                    label: 'Privacy Policy',
                    description: 'Review privacy policy',
                    icon: 'ri-shield-line',
                    path: '/admin/privacy',
                  },
                  {
                    label: 'About App',
                    description: 'RideEasy administrator console',
                    icon: 'ri-information-line',
                    path: '/admin/about',
                  },
                ],
              },
            ].map((group) => (
              <section key={group.title}>
                <h3 className="mb-2 px-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#718096]">
                  {group.title}
                </h3>

                <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
                  {group.items.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => {
                        if (item.tab) {
                          setTab(item.tab)
                          return
                        }

                        if (item.path) {
                          navigate(item.path)
                        }
                      }}
                      className="flex w-full items-center gap-4 border-b border-[var(--color-border)] px-5 py-4 text-left last:border-b-0 hover:bg-[var(--color-surface-muted)]"
                    >
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[var(--color-surface-muted)] text-lg text-[var(--color-text-primary)]">
                        <i className={item.icon} />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block font-semibold text-[#152238]">
                          {item.label}
                        </span>

                        <span className="mt-0.5 block text-xs text-[#718096]">
                          {item.description}
                        </span>
                      </span>

                      <i className="ri-arrow-right-s-line text-xl text-[#718096]" />
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* DASHBOARD */}
        {tab === 'analytics' && (
          <OverviewTab
            analytics={analytics}
            analyticsLoading={analyticsLoading}
            analyticsError={analyticsError}
            users={users}
            drivers={drivers}
            rides={rides}
            payments={payments}
            onNavigate={navigateToTab}
            emergencyAlerts={emergencyAlerts}
          />
        )}

        {/* USERS */}
        {tab === 'users' && (
          <UsersTab
            usersLoading={usersLoading}
            filteredUsers={filteredUsers}
            users={users}
            tableSearch={tableSearch}
            setTableSearch={setTableSearch}
            driverStatusFilter={driverStatusFilter}
            setDriverStatusFilter={setDriverStatusFilter}
            selectedIds={selectedIds}
            toggleSelect={toggleSelect}
            selectAllVisible={selectAllVisible}
            clearSelection={clearSelection}
            tableHeaderSelectRef={tableHeaderSelectRef}
            toggleUserBlock={toggleUserBlock}
            deleteUser={deleteUser}
            bulkDeleteUsers={bulkDeleteUsers}
          />
        )}

        {/* DRIVERS / VERIFICATION */}
        {tab === 'drivers' && (
          <DriversTab
            driversLoading={driversLoading}
            error={tabError}
            filteredDrivers={filteredDrivers}
            drivers={drivers}
            tableSearch={tableSearch}
            setTableSearch={setTableSearch}
            driverStatusFilter={driverStatusFilter}
            setDriverStatusFilter={setDriverStatusFilter}
            selectedIds={selectedIds}
            toggleSelect={toggleSelect}
            selectAllVisible={selectAllVisible}
            clearSelection={clearSelection}
            tableHeaderSelectRef={tableHeaderSelectRef}
            approveDriver={approveDriver}
            rejectDriver={rejectDriver}
            toggleDriverBlock={toggleDriverBlock}
            deleteDriver={deleteDriver}
            bulkDeleteDrivers={bulkDeleteDrivers}
          />
        )}

        {/* RIDES */}
        {tab === 'rides' && (
          <RidesTab
            ridesLoading={ridesLoading}
            filteredRides={filteredRides}
            selectedRide={selectedRide}
            rideAudit={rideAudit}
            rideAuditLoading={rideAuditLoading}
            rideAuditError={rideAuditError}
            onViewRide={setSelectedRide}
            rides={rides}
            users={users}
            drivers={drivers}
            rideStatusFilter={rideStatusFilter}
            setRideStatusFilter={setRideStatusFilter}
            rideDateFilter={rideDateFilter}
            setRideDateFilter={setRideDateFilter}
            rideDriverFilter={rideDriverFilter}
            setRideDriverFilter={setRideDriverFilter}
            rideUserFilter={rideUserFilter}
            setRideUserFilter={setRideUserFilter}
            tableSearch={tableSearch}
            setTableSearch={setTableSearch}
            selectedIds={selectedIds}
            toggleSelect={toggleSelect}
            selectAllVisible={selectAllVisible}
            clearSelection={clearSelection}
            tableHeaderSelectRef={tableHeaderSelectRef}
            deleteRide={deleteRide}
            bulkDeleteRides={bulkDeleteRides}
            refreshRides={refreshRides}
          />
        )}

        {/* LIVE OPERATIONS */}
        {tab === 'live-operations' && (
          <AdminLiveOperations />
        )}

        {/* FINANCE */}
        {tab === 'finance' && (
          <AdminFinance
            payments={payments}
            paymentsLoading={paymentsLoading}
            error={tabError}
          />
        )}

        {/* PAYMENTS */}
        {tab === 'payments' && (
          <PaymentsTab
            paymentsLoading={paymentsLoading}
            filteredPayments={filteredPayments}
            payments={payments}
            tableSearch={tableSearch}
            setTableSearch={setTableSearch}
            selectedIds={selectedIds}
            toggleSelect={toggleSelect}
            selectAllVisible={selectAllVisible}
            clearSelection={clearSelection}
            tableHeaderSelectRef={tableHeaderSelectRef}
            deleteRide={deleteRide}
            bulkDeletePayments={bulkDeletePayments}
            onViewPayment={loadPaymentDetail}
            selectedPayment={selectedPayment}
            paymentDetailLoading={paymentDetailLoading}
            onClosePayment={() => setSelectedPayment(null)}
          />
        )}

        {/* SERVICES */}
        {tab === 'services' && (
          <ServicesTab
            services={services}
            loading={servicesLoading}
            error={tabError}
            onSave={saveService}
            onDelete={deleteService}
          />
        )}

        {/* PRICING */}
        {tab === 'pricing' && (
          <PricingTab
            fareConfigurations={fareConfigurations}
            fareLoading={fareLoading}
            fareError={fareError}
            onCreateFare={createFareConfiguration}
            onUpdateFare={updateFareConfiguration}
            onUpdateFareStatus={updateFareConfigurationStatus}
            onLoadHistory={loadFareConfigurationHistory}
            onPreviewFare={previewFareConfiguration}
          />
        )}

        {/* SETTINGS */}
        {tab === 'settings' && (
          <SettingsTab
            setTab={navigateToTab}
            onProfile={() => navigate('/admin/profile')}
            onChangePassword={() => navigate('/admin/change-password')}
            onAppSettings={() => navigate('/admin/app-settings')}
            onLanguage={() => navigate('/admin/language')}
            onNotifications={() => navigate('/admin/notifications')}
            onLogout={logout}
          />
        )}

        {/* SUPPORT */}
{(tab === 'support' || tab === 'complaints') && (
  <ComplaintsTab />
)}
        {/* AUDIT LOGS */}
        {tab === 'audit-logs' && (
          <AuditLogsTab />
        )}

        {/* REPORTS */}
        {tab === 'reports' && !reportView && (
          <ReportsTab
            onReportSelect={setReportView}
            rides={rides}
            payments={payments}
            drivers={drivers}
            users={users}
          />
        )}

        {tab === 'reports' && reportView === 'earnings' && (
          <EarningsReport
            rides={rides}
            payments={payments}
            ridesLoading={ridesLoading}
            paymentsLoading={paymentsLoading}
            onBack={() => setReportView(null)}
          />
        )}

        {tab === 'reports' && reportView === 'bookings' && (
          <BookingsReport
            rides={rides}
            ridesLoading={ridesLoading}
            onBack={() => setReportView(null)}
          />
        )}

        {tab === 'reports' && reportView === 'drivers' && (
          <DriversReport
            drivers={drivers}
            rides={rides}
            driversLoading={driversLoading}
            ridesLoading={ridesLoading}
            onBack={() => setReportView(null)}
          />
        )}

        
        {tab === 'reports' && reportView === 'users' && (
          <UsersReport
            users={users}
            rides={rides}
            usersLoading={usersLoading}
            ridesLoading={ridesLoading}
            onBack={() => setReportView(null)}
          />
        )}

            {/* SOS / SAFETY */}
 {(tab === 'safety' || tab === 'sos') && (
  <SafetyTab      
            alerts={emergencyAlerts}
            stations={policeStations}
            onAcknowledge={acknowledgeEmergencyAlert}
            onResolve={resolveEmergencyAlert}
            highlightedAlertId={highlightedEmergencyAlertId}
          />
        )}

        {/* ROLES & PERMISSIONS */}
        {tab === 'roles' && (
          <AdminRoles />
        )}

      </div>
    </AdminLayout>
  )
}

export default AdminDashboard
