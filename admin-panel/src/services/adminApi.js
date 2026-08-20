import axios from 'axios'
import { getApiBaseUrl } from '../config/apiBaseUrl'
import { getAdminToken } from '../utils/authTokens'
import { stripApiEnvelope } from '../utils/apiBody'
import { isAdminRoleToken } from '../utils/jwtPayload'
import { normalizeListResponse } from '../admin/adminUtils'

const client = axios.create({
  baseURL: getApiBaseUrl().replace(/\/$/, ''),
  timeout: Number(import.meta.env.VITE_API_TIMEOUT_MS || 30000),
  headers: {
    'Content-Type': 'application/json',
  },
})

client.interceptors.request.use((config) => {
  const url = String(config.url || '')

  // Login does not require an admin token.
  if (url.includes('/admin/login')) {
    return config
  }

  const token = getAdminToken()

  if (!token || !isAdminRoleToken(token)) {
    return Promise.reject(
      new Error('Admin session required — JWT role must be admin')
    )
  }

  config.headers = {
    ...config.headers,
    Authorization: `Bearer ${token}`,
  }

  return config
})

client.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      try {
        localStorage.removeItem('adminToken')
      } catch {
        // Ignore localStorage errors.
      }

      const path = window.location.pathname || '/admin'
      const loginPath =
        path.replace(/\/admin\/.*$/i, '/admin') || '/admin'

      window.location.assign(
        `${window.location.origin}${loginPath}`
      )
    }

    return Promise.reject(err)
  }
)

function unwrap(data) {
  return stripApiEnvelope(data)
}

export const adminApi = {
  // =========================================================
  // DASHBOARD / ANALYTICS
  // =========================================================

  getAnalytics(signal) {
    return client
      .get('/admin/analytics', { signal })
      .then((r) => unwrap(r.data))
  },

  // =========================================================
  // USERS
  // =========================================================

  getUsers(signal) {
    return client
      .get('/admin/users', { signal })
      .then((r) =>
        normalizeListResponse(unwrap(r.data), 'users')
      )
  },

  patchUserBlock(id, blocked) {
    return client
      .patch(`/admin/users/${id}/block`, { blocked })
      .then((r) => unwrap(r.data))
  },

  deleteUser(id) {
    return client
      .delete(`/admin/users/${id}`)
      .then((r) => unwrap(r.data))
  },

  // =========================================================
  // DRIVERS
  // =========================================================

  getDrivers(signal) {
    return client
      .get('/admin/drivers', { signal })
      .then((r) =>
        normalizeListResponse(unwrap(r.data), 'drivers')
      )
  },

  approveDriver(id) {
    return client
      .put(`/admin/drivers/${id}/approve`, {})
      .then((r) => unwrap(r.data))
  },

  rejectDriver(id) {
    return client
      .put(`/admin/drivers/${id}/reject`, {})
      .then((r) => unwrap(r.data))
  },

  patchDriverBlock(id, blocked) {
    return client
      .patch(`/admin/drivers/${id}/block`, { blocked })
      .then((r) => unwrap(r.data))
  },

  deleteDriver(id) {
    return client
      .delete(`/admin/drivers/${id}`)
      .then((r) => unwrap(r.data))
  },

  // =========================================================
  // RIDES
  // =========================================================

  getRides(rideStatusFilter, signal) {
    const query =
      rideStatusFilter && rideStatusFilter !== 'all'
        ? `?status=${encodeURIComponent(rideStatusFilter)}`
        : ''

    return client
      .get(`/admin/rides${query}`, { signal })
      .then((r) =>
        normalizeListResponse(unwrap(r.data), 'rides')
      )
  },

  deleteRide(id) {
    return client
      .delete(`/admin/rides/${id}`)
      .then((r) => unwrap(r.data))
  },

  // =========================================================
  // PAYMENTS
  // =========================================================

  getPayments(signal) {
    return client
      .get('/admin/payments', { signal })
      .then((r) =>
        normalizeListResponse(unwrap(r.data), 'payments')
      )
  },

  // =========================================================
  // SAFETY / SOS
  // =========================================================

  getEmergencyAlerts(signal) {
    return client
      .get('/admin/safety/emergency-alerts', { signal })
      .then((r) => unwrap(r.data))
  },

  acknowledgeEmergencyAlert(id, signal) {
    return client
      .post(
        `/admin/safety/emergency-alerts/${id}/acknowledge`,
        {},
        { signal }
      )
      .then((r) => unwrap(r.data))
  },

  resolveEmergencyAlert(id, signal) {
    return client
      .post(
        `/admin/safety/emergency-alerts/${id}/resolve`,
        {},
        { signal }
      )
      .then((r) => unwrap(r.data))
  },

  getPoliceStations(city, signal) {
    const query = city
      ? `?city=${encodeURIComponent(city)}`
      : ''

    return client
      .get(`/admin/safety/police-stations${query}`, { signal })
      .then((r) => unwrap(r.data))
  },

  // =========================================================
  // SERVICES
  // =========================================================

  getServices(signal) {
    return client
      .get('/admin/services', { signal })
      .then((r) =>
        normalizeListResponse(unwrap(r.data), 'services')
      )
  },

  createService(payload) {
    return client
      .post('/admin/services', payload)
      .then((r) => unwrap(r.data))
  },

  updateService(id, payload) {
    return client
      .put(`/admin/services/${id}`, payload)
      .then((r) => unwrap(r.data))
  },

  deleteService(id) {
    return client
      .delete(`/admin/services/${id}`)
      .then((r) => unwrap(r.data))
  },

  // =========================================================
  // PRICING
  // =========================================================

  getPricing(signal) {
    return client
      .get('/admin/pricing', { signal })
      .then((r) => unwrap(r.data))
  },

  putPricing(payload) {
    return client
      .put('/admin/pricing', payload)
      .then((r) => unwrap(r.data))
  },
}
