import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'
import { adminApi } from '../services/adminApi'
import { displayName } from '../admin/adminUtils'
import MobileRecordCard, { MobileField } from '../components/MobileRecordCard'
import {
  Card,
  Search,
  Filter,
  Badge,
  Loader,
  EmptyState,
  ErrorState,
} from '../components/AdminUIComponents'

const vehicleStatus = (driver) => {
  if (driver.blocked) {
    return {
      label: 'Blocked',
      variant: 'danger',
      key: 'blocked',
    }
  }

  if (!driver.approved) {
    return {
      label: 'Pending Verification',
      variant: 'warning',
      key: 'pending',
    }
  }

  if (
    String(driver.status).toLowerCase() === 'active' ||
    driver.isOnline
  ) {
    return {
      label: 'Active',
      variant: 'success',
      key: 'active',
    }
  }

  return {
    label: 'Inactive',
    variant: 'neutral',
    key: 'inactive',
  }
}

const valueOrUnavailable = (value) => {
  return value || 'Not available'
}

const formatDate = (value) => {
  if (!value) return 'Not available'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Not available'
  }

  return date.toLocaleDateString('en-IN')
}

export default function AdminVehicles() {
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

      setDrivers(Array.isArray(driverList) ? driverList : [])
      setAlerts(alertResponse?.alerts || [])
    } catch (loadError) {
      if (signal?.aborted) return

      setError(
        loadError?.response?.data?.message ||
        loadError?.message ||
        'Unable to load vehicles'
      )
    } finally {
      if (!signal?.aborted) {
        setLoading(false)
      }
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

      const matchesStatus =
        statusFilter === 'all' ||
        status === statusFilter

      const searchableText = [
        driver.vehicleNumber,
        driver.vehicleType,
        driver.vehicleModel,
        driver.model,
        displayName(driver.name),
        driver.email,
        driver.city,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      const matchesSearch =
        !query || searchableText.includes(query)

      return matchesStatus && matchesSearch
    })
  }, [drivers, search, statusFilter])

  const counts = useMemo(() => {
    return {
      all: drivers.length,

      active: drivers.filter(
        (driver) =>
          vehicleStatus(driver).key === 'active'
      ).length,

      pending: drivers.filter(
        (driver) =>
          vehicleStatus(driver).key === 'pending'
      ).length,

      blocked: drivers.filter(
        (driver) =>
          vehicleStatus(driver).key === 'blocked'
      ).length,

      inactive: drivers.filter(
        (driver) =>
          vehicleStatus(driver).key === 'inactive'
      ).length,
    }
  }, [drivers])

  const statusOptions = [
    {
      value: 'all',
      label: `All (${counts.all})`,
    },
    {
      value: 'active',
      label: `Active (${counts.active})`,
    },
    {
      value: 'pending',
      label: `Pending (${counts.pending})`,
    },
    {
      value: 'blocked',
      label: `Blocked (${counts.blocked})`,
    },
    {
      value: 'inactive',
      label: `Inactive (${counts.inactive})`,
    },
  ]

  const tableColumns = [
    {
      key: 'vehicle',
      label: 'Vehicle',
      render: (driver) => (
        <div>
          <p className="font-bold text-[#152238]">
            {valueOrUnavailable(driver.vehicleNumber)}
          </p>

          <p className="mt-0.5 text-xs text-[#718096]">
            {valueOrUnavailable(driver.vehicleType)}
          </p>
        </div>
      ),
    },

    {
      key: 'model',
      label: 'Model',
      render: (driver) =>
        valueOrUnavailable(
          driver.vehicleModel || driver.model
        ),
    },

    {
      key: 'driver',
      label: 'Driver',
      render: (driver) => (
        <div>
          <p className="font-semibold text-[#152238]">
            {displayName(driver.name) || 'Unnamed driver'}
          </p>

          <p className="mt-0.5 text-xs text-[#718096]">
            {driver.email || 'Not available'}
          </p>
        </div>
      ),
    },

    {
      key: 'rcStatus',
      label: 'RC Status',
      render: (driver) =>
        valueOrUnavailable(
          driver.rcStatus || driver.rc?.status
        ),
    },

    {
      key: 'insuranceStatus',
      label: 'Insurance',
      render: (driver) =>
        valueOrUnavailable(
          driver.insuranceStatus ||
          driver.insurance?.status
        ),
    },

    {
      key: 'registrationDate',
      label: 'Registration Date',
      render: (driver) =>
        formatDate(
          driver.registrationDate ||
          driver.createdAt
        ),
    },

    {
      key: 'status',
      label: 'Vehicle Status',
      render: (driver) => {
        const status = vehicleStatus(driver)

        return (
          <Badge variant={status.variant}>
            {status.label}
          </Badge>
        )
      },
    },
  ]

  return (
    <AdminLayout
      tab="vehicles"
      setTab={(nextTab) =>
        navigate('/admin/dashboard', {
          state: { tab: nextTab },
        })
      }
      onRefresh={() => loadVehicles()}
      onLogout={() => {
        localStorage.removeItem('adminToken')
        navigate('/admin')
      }}
      emergencyAlerts={alerts}
    >
      <div className="space-y-5 pb-5 sm:space-y-6">

        {/* Page Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-[28px] font-bold tracking-[-0.04em] text-[#152238] sm:text-[32px]">
              Vehicles
            </h1>

            <p className="mt-1 text-sm text-[#718096]">
              Manage registered vehicles and verification status
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              navigate('/admin/dashboard', {
                state: { tab: 'drivers' },
              })
            }
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#E6EBF2] bg-white text-[#152238] shadow-sm transition hover:bg-[#F8FAFC]"
            aria-label="Back to drivers"
          >
            <i className="ri-arrow-left-line text-lg" />
          </button>
        </div>

        {/* Vehicle Statistics */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`rounded-2xl border bg-white p-4 text-left shadow-sm transition ${
              statusFilter === 'all'
                ? 'border-[#FFB21C] ring-2 ring-[#FFB21C]/20'
                : 'border-[#E6EBF2]'
            }`}
          >
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#EAF4FF] text-[#2563EB]">
              <i className="ri-car-line text-lg" />
            </div>

            <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#718096]">
              All Vehicles
            </p>

            <p className="mt-1 text-xl font-bold text-[#152238]">
              {counts.all}
            </p>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('active')}
            className={`rounded-2xl border bg-white p-4 text-left shadow-sm transition ${
              statusFilter === 'active'
                ? 'border-[#FFB21C] ring-2 ring-[#FFB21C]/20'
                : 'border-[#E6EBF2]'
            }`}
          >
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#EAFBF2] text-[#16A34A]">
              <i className="ri-checkbox-circle-line text-lg" />
            </div>

            <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#718096]">
              Active
            </p>

            <p className="mt-1 text-xl font-bold text-[#152238]">
              {counts.active}
            </p>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('pending')}
            className={`rounded-2xl border bg-white p-4 text-left shadow-sm transition ${
              statusFilter === 'pending'
                ? 'border-[#FFB21C] ring-2 ring-[#FFB21C]/20'
                : 'border-[#E6EBF2]'
            }`}
          >
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#FFF4DF] text-[#B86B00]">
              <i className="ri-time-line text-lg" />
            </div>

            <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#718096]">
              Pending
            </p>

            <p className="mt-1 text-xl font-bold text-[#152238]">
              {counts.pending}
            </p>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('blocked')}
            className={`rounded-2xl border bg-white p-4 text-left shadow-sm transition ${
              statusFilter === 'blocked'
                ? 'border-[#FFB21C] ring-2 ring-[#FFB21C]/20'
                : 'border-[#E6EBF2]'
            }`}
          >
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#FEF2F2] text-[#DC2626]">
              <i className="ri-forbid-2-line text-lg" />
            </div>

            <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#718096]">
              Blocked
            </p>

            <p className="mt-1 text-xl font-bold text-[#152238]">
              {counts.blocked}
            </p>
          </button>

        </div>

        {/* Search + Filter */}
        <Card className="p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">

            <Search
              value={search}
              onChange={setSearch}
              placeholder="Search vehicle number, type, model or driver..."
              className="flex-1"
            />

            <Filter
              label="Status"
              value={statusFilter}
              onChange={setStatusFilter}
              options={statusOptions}
            />

          </div>
        </Card>

        {/* Error */}
        {error && (
          <ErrorState
            title="Unable to load vehicles"
            message={error}
            onRetry={() => loadVehicles()}
          />
        )}

        {/* Desktop Table */}
        {!error && (
          <div className="hidden md:block">

            {loading ? (
              <Card>
                <Loader label="Loading vehicles..." />
              </Card>
            ) : filteredVehicles.length === 0 ? (
              <EmptyState
                title="No vehicles found"
                message={
                  search || statusFilter !== 'all'
                    ? 'No vehicles match your current search or filter.'
                    : 'Vehicle records are sourced from registered drivers.'
                }
                icon="ri-car-line"
              />
            ) : (
              <Card className="overflow-hidden p-0">
                <Table
                  columns={tableColumns}
                  data={filteredVehicles}
                  rowKey="_id"
                  className="rounded-none border-0"
                />
              </Card>
            )}

          </div>
        )}

        {/* Mobile Records */}
        {!error && (
          <div className="space-y-3 md:hidden">

            {loading ? (
              <Card>
                <Loader label="Loading vehicles..." />
              </Card>
            ) : filteredVehicles.length === 0 ? (
              <EmptyState
                title="No vehicles found"
                message={
                  search || statusFilter !== 'all'
                    ? 'No vehicles match your current search or filter.'
                    : 'Vehicle records are sourced from registered drivers.'
                }
                icon="ri-car-line"
              />
            ) : (
              filteredVehicles.map((driver) => {
                const status = vehicleStatus(driver)

                return (
                  <MobileRecordCard
                    key={driver._id}
                    title={valueOrUnavailable(
                      driver.vehicleNumber
                    )}
                    subtitle={
                      displayName(driver.name) ||
                      'Unnamed driver'
                    }
                    badge={
                      <Badge variant={status.variant}>
                        {status.label}
                      </Badge>
                    }
                  >
                    <MobileField
                      label="Type"
                      value={driver.vehicleType}
                    />

                    <MobileField
                      label="Model"
                      value={
                        driver.vehicleModel ||
                        driver.model
                      }
                    />

                    <MobileField
                      label="RC"
                      value={
                        driver.rcStatus ||
                        driver.rc?.status
                      }
                    />

                    <MobileField
                      label="Insurance"
                      value={
                        driver.insuranceStatus ||
                        driver.insurance?.status
                      }
                    />

                    <MobileField
                      label="Registered"
                      value={formatDate(
                        driver.registrationDate ||
                        driver.createdAt
                      )}
                    />
                  </MobileRecordCard>
                )
              })
            )}

          </div>
        )}

      </div>
    </AdminLayout>
  )
}
