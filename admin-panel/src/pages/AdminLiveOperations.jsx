import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { adminApi } from '../services/adminApi'
import RideMap from '../components/RideMap'
import { SocketContext } from '../context/SocketContext'
const STATUS_CONFIG = {
  ONLINE: {
    label: 'Online',
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  BUSY: {
    label: 'Busy',
    dot: 'bg-orange-500',
    badge: 'bg-orange-50 text-orange-700 border-orange-200',
  },
  OFFLINE: {
    label: 'Offline',
    dot: 'bg-gray-400',
    badge: 'bg-gray-50 text-gray-600 border-gray-200',
  },
}

function getLiveStatus(driver) {
  if (driver?.liveStatus) return driver.liveStatus

  if (driver?.isBusy) return 'BUSY'
  if (driver?.isOnline === true) return 'ONLINE'

  return 'OFFLINE'
}

function getVehicle(driver) {
  return (
    driver?.vehicleType ||
    driver?.vehicle?.type ||
    'Vehicle not specified'
  )
}
function getDriverCoords(driver) {
  const coordinates = driver?.location?.coordinates

  if (!Array.isArray(coordinates) || coordinates.length < 2) {
    return null
  }

  const lng = Number(coordinates[0])
  const lat = Number(coordinates[1])

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null
  }

  if (lat === 0 && lng === 0) {
    return null
  }

  return { lat, lng }
}

function isLocationFresh(driver) {
  const updatedAt = driver?.lastLocationUpdatedAt

  if (!updatedAt) return false

  const timestamp = new Date(updatedAt).getTime()

  if (!Number.isFinite(timestamp)) return false

  return Date.now() - timestamp <= 5 * 60 * 1000
}

export default function AdminLiveOperations() {
  const { socket } = useContext(SocketContext)

  const [drivers, setDrivers] = useState([])
  const [rides, setRides] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadDrivers = useCallback(async () => {
    try {
      setError('')

      const result = await adminApi.getDrivers()
      const rideResult = await adminApi.getRides('all')

      setDrivers(Array.isArray(result) ? result : [])
      setRides(Array.isArray(rideResult) ? rideResult : [])
    } catch (err) {
      console.error('Failed to load drivers:', err)
      setError('Unable to load driver live status.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadDrivers()
  }, [loadDrivers])

  useEffect(() => {
    if (!socket) return

    const joinRoom = () => {
      socket.emit('admin:live-operations:join')
    }

    const handleDriverLocationUpdate = (update) => {
      if (!update?.driverId) return

      setDrivers((currentDrivers) =>
        currentDrivers.map((driver) => {
          if (String(driver?._id) !== String(update.driverId)) {
            return driver
          }

          return {
            ...driver,
            location: {
              ...(driver.location || {}),
              type: 'Point',
              coordinates: [Number(update.lng), Number(update.lat)],
            },
            lastLocationUpdatedAt: update.at || new Date().toISOString(),
          }
        })
      )
    }

    socket.on('connect', joinRoom)
    socket.on('driver:location-update', handleDriverLocationUpdate)

    if (socket.connected) {
      joinRoom()
    }

    return () => {
      socket.off('connect', joinRoom)
      socket.off('driver:location-update', handleDriverLocationUpdate)
    }
  }, [socket])

  const filteredDrivers = useMemo(() => {
    const query = search.trim().toLowerCase()

    return drivers.filter((driver) => {
      const status = getLiveStatus(driver)

      const matchesStatus =
        statusFilter === 'ALL' || status === statusFilter

      const matchesSearch =
        !query ||
        String(driver?.name || '').toLowerCase().includes(query) ||
        String(driver?.phone || '').toLowerCase().includes(query) ||
        String(driver?.email || '').toLowerCase().includes(query) ||
        String(driver?._id || '').toLowerCase().includes(query)

      return matchesStatus && matchesSearch
    })
  }, [drivers, search, statusFilter])

  const counts = useMemo(() => {
    return drivers.reduce(
      (acc, driver) => {
        const status = getLiveStatus(driver)

        if (status === 'ONLINE') acc.online += 1
        if (status === 'BUSY') acc.busy += 1
        if (status === 'OFFLINE') acc.offline += 1

        return acc
      },
      { online: 0, busy: 0, offline: 0 }
    )
  }, [drivers])
const mapDrivers = useMemo(() => {
  const seen = new Set()

  return drivers
    .map((driver) => {
      const driverId = driver?._id || driver?.id || driver?.driverId

      if (!driverId || seen.has(String(driverId))) return null
      seen.add(String(driverId))

      const coords = getDriverCoords(driver)

      if (!coords) return null

      return {
        ...driver,
        coords,
        locationFresh: isLocationFresh(driver),
      }
    })
    .filter(Boolean)
}, [drivers])
  const mapRides = useMemo(() => {
    const seen = new Set()

    return rides
      .filter((ride) =>
        ['accepted', 'arrived', 'started'].includes(
          String(ride?.status || '').toLowerCase()
        )
      )
      .map((ride) => {
        const rideId = ride?._id || ride?.id

        if (!rideId || seen.has(String(rideId))) return null
        seen.add(String(rideId))

        const pickup = ride?.pickup?.coordinates

        if (!Array.isArray(pickup) || pickup.length < 2) return null

        const lng = Number(pickup[0])
        const lat = Number(pickup[1])

        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null
        if (lat === 0 && lng === 0) return null

        return {
          ...ride,
          coords: { lat, lng },
        }
      })
      .filter(Boolean)
  }, [rides])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-medium text-[#718096]">
            Operations
          </p>

          <h1 className="mt-1 text-2xl font-bold text-[#152238] sm:text-3xl">
            Live Operations
          </h1>

          <p className="mt-2 text-sm text-[#718096]">
            Monitor driver availability and active ride status.
          </p>
        </div>

        <button
          type="button"
          onClick={loadDrivers}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm font-semibold text-[#152238] shadow-sm transition hover:bg-[#F8FAFC] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <i className="ri-refresh-line" />
          Refresh
        </button>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <button
          type="button"
          onClick={() => setStatusFilter('ONLINE')}
          className={`rounded-2xl border bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 ${
            statusFilter === 'ONLINE'
              ? 'border-emerald-300 ring-2 ring-emerald-100'
              : 'border-[#E5E7EB]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[#718096]">
              Online
            </span>
            <span className="h-3 w-3 rounded-full bg-emerald-500" />
          </div>

          <p className="mt-2 text-3xl font-bold text-[#152238]">
            {counts.online}
          </p>

          <p className="mt-1 text-xs text-[#718096]">
            Available drivers
          </p>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('BUSY')}
          className={`rounded-2xl border bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 ${
            statusFilter === 'BUSY'
              ? 'border-orange-300 ring-2 ring-orange-100'
              : 'border-[#E5E7EB]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[#718096]">
              Busy
            </span>
            <span className="h-3 w-3 rounded-full bg-orange-500" />
          </div>

          <p className="mt-2 text-3xl font-bold text-[#152238]">
            {counts.busy}
          </p>

          <p className="mt-1 text-xs text-[#718096]">
            Drivers on active rides
          </p>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('OFFLINE')}
          className={`rounded-2xl border bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 ${
            statusFilter === 'OFFLINE'
              ? 'border-gray-300 ring-2 ring-gray-100'
              : 'border-[#E5E7EB]'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-[#718096]">
              Offline
            </span>
            <span className="h-3 w-3 rounded-full bg-gray-400" />
          </div>

          <p className="mt-2 text-3xl font-bold text-[#152238]">
            {counts.offline}
          </p>

          <p className="mt-1 text-xs text-[#718096]">
            Currently unavailable
          </p>
        </button>
      </div>
          
           {/* Admin Map */}
<div className="mb-6 rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
  <div className="border-b border-[#E5E7EB] p-5">
    <h2 className="text-lg font-semibold text-[#152238]">
      Live Map
    </h2>
    <p className="mt-1 text-sm text-[#718096]">
      Driver and active ride locations
    </p>
  </div>

<div className="h-[500px] p-3">
  {loading ? (
    <div className="flex h-full items-center justify-center rounded-xl bg-[#F8FAFC] text-center">
      <div>
        <i className="ri-loader-4-line animate-spin text-3xl text-[#FFB21C]" />
        <p className="mt-3 font-semibold text-[#152238]">
          Loading live map...
        </p>
        <p className="mt-1 text-sm text-[#718096]">
          Fetching driver and active ride locations.
        </p>
      </div>
    </div>
  ) : error ? (
    <div className="flex h-full items-center justify-center rounded-xl bg-[#F8FAFC] text-center">
      <div>
        <i className="ri-error-warning-line text-3xl text-red-400" />
        <p className="mt-3 font-semibold text-[#152238]">
          Unable to load live map
        </p>
        <p className="mt-1 text-sm text-[#718096]">
          Driver and active ride locations could not be loaded.
        </p>
      </div>
    </div>
  ) : mapDrivers.length === 0 && mapRides.length === 0 ? (
    <div className="flex h-full items-center justify-center rounded-xl bg-[#F8FAFC] text-center">
      <div>
        <i className="ri-map-pin-line text-3xl text-[#A0AEC0]" />
        <p className="mt-3 text-sm font-semibold text-[#152238]">
          No live locations available
        </p>
        <p className="mt-1 text-sm text-[#718096]">
          Driver and active ride locations will appear here.
        </p>
      </div>
    </div>
  ) : (
    <RideMap
      driverMarkers={mapDrivers}
      rideMarkers={mapRides}
    />
  )}
</div>
</div>

      {/* Drivers */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
        <div className="border-b border-[#E5E7EB] p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[#152238]">
                Driver Status
              </h2>

              <p className="mt-1 text-sm text-[#718096]">
                {filteredDrivers.length} driver
                {filteredDrivers.length === 1 ? '' : 's'} shown
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-[#A0AEC0]" />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search driver..."
                  className="w-full rounded-xl border border-[#E5E7EB] py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#FFB21C] focus:ring-2 focus:ring-[#FFF4D6] sm:w-64"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm font-medium text-[#152238] outline-none focus:border-[#FFB21C]"
              >
                <option value="ALL">All statuses</option>
                <option value="ONLINE">Online</option>
                <option value="BUSY">Busy</option>
                <option value="OFFLINE">Offline</option>
              </select>
            </div>
          </div>
        </div>

        <div className="p-5">
          {loading ? (
            <div className="flex min-h-[250px] items-center justify-center">
              <div className="text-center">
                <i className="ri-loader-4-line animate-spin text-3xl text-[#FFB21C]" />
                <p className="mt-3 text-sm text-[#718096]">
                  Loading driver status...
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="flex min-h-[250px] items-center justify-center text-center">
              <div>
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-red-50">
                  <i className="ri-error-warning-line text-2xl text-red-500" />
                </div>

                <p className="mt-3 text-sm font-medium text-[#152238]">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={loadDrivers}
                  className="mt-4 rounded-xl bg-[#FFB21C] px-4 py-2 text-sm font-semibold text-[#152238]"
                >
                  Try again
                </button>
              </div>
            </div>
          ) : filteredDrivers.length === 0 ? (
            <div className="flex min-h-[250px] items-center justify-center text-center">
              <div>
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#FFF4D6]">
                  <i className="ri-user-search-line text-2xl text-[#FFB21C]" />
                </div>

                <p className="mt-3 text-sm font-semibold text-[#152238]">
                  No drivers found
                </p>

                <p className="mt-1 text-sm text-[#718096]">
                  Try changing your search or status filter.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredDrivers.map((driver) => {
                const status = getLiveStatus(driver)
                const config =
                  STATUS_CONFIG[status] || STATUS_CONFIG.OFFLINE

                return (
                  <div
                    key={driver?._id}
                    className="rounded-2xl border border-[#E5E7EB] bg-white p-4 transition hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#FFF4D6] text-lg font-bold text-[#152238]">
                          {String(driver?.name || 'D')
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate font-semibold text-[#152238]">
                            {driver?.name || 'Unnamed Driver'}
                          </h3>

                          <p className="truncate text-xs text-[#718096]">
                            {driver?.phone || driver?.email || 'No contact'}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${config.badge}`}
                      >
                        <span
                          className={`h-2 w-2 rounded-full ${config.dot}`}
                        />
                        {config.label}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-[#F8FAFC] p-3">
                        <p className="text-[11px] font-medium uppercase tracking-wide text-[#A0AEC0]">
                          Vehicle
                        </p>

                        <p className="mt-1 truncate text-sm font-semibold text-[#152238]">
                          {getVehicle(driver)}
                        </p>
                      </div>

                      <div className="rounded-xl bg-[#F8FAFC] p-3">
                        <p className="text-[11px] font-medium uppercase tracking-wide text-[#A0AEC0]">
                          Status
                        </p>

                        <p className="mt-1 text-sm font-semibold text-[#152238]">
                          {config.label}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs text-[#718096]">
                      <span>
                        {driver?.servingCity || driver?.city || 'City not specified'}
                      </span>

                      {driver?.vehicleNumber && (
                        <span className="font-medium text-[#152238]">
                          {driver.vehicleNumber}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
