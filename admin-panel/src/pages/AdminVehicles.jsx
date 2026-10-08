import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useAdminLanguage } from '../context/AdminLanguageContext'
import { useNavigate } from 'react-router-dom'
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
import { Modal } from '../components/ui'

import Table from '../components/ui/Table'
const vehicleStatus = (driver, t) => {
  if (driver.blocked) {
    return {
      label: t.blocked,
      variant: 'danger',
      key: 'blocked',
    }
  }

  if (!driver.approved) {
    return {
      label: t.pendingVerification,
      variant: 'warning',
      key: 'pending',
    }
  }

  if (
    String(driver.status).toLowerCase() === 'active' ||
    driver.isOnline
  ) {
    return {
      label: t.active,
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

const valueOrUnavailable = (value, t) => {
  return value || t.notAvailable
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
  const { t } = useAdminLanguage()
  const navigate = useNavigate()

  const [drivers, setDrivers] = useState([])
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedVehicle, setSelectedVehicle] = useState(null)

  const loadVehicles = useCallback(async (signal) => {
  setLoading(true)
  setError('')

  try {
    const driverList = await adminApi.getDrivers(signal)

    if (signal?.aborted) return

    setDrivers(Array.isArray(driverList) ? driverList : [])
    setAlerts([])
  } catch (loadError) {
    if (signal?.aborted) return

    setError(
      loadError?.response?.data?.message ||
      loadError?.message ||
      t.unableLoadVehicles
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
      const status = vehicleStatus(driver, t).key

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
          vehicleStatus(driver, t).key === 'active'
      ).length,

      pending: drivers.filter(
        (driver) =>
          vehicleStatus(driver, t).key === 'pending'
      ).length,

      blocked: drivers.filter(
        (driver) =>
          vehicleStatus(driver, t).key === 'blocked'
      ).length,

      inactive: drivers.filter(
        (driver) =>
          vehicleStatus(driver, t).key === 'inactive'
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
      label: `${t.active} (${counts.active})`,
    },
    {
      value: 'pending',
      label: `${t.pending} (${counts.pending})`,
    },
    {
      value: 'blocked',
      label: `${t.blocked} (${counts.blocked})`,
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
            {valueOrUnavailable(driver.vehicleNumber, t)}
          </p>

          <p className="mt-0.5 text-xs text-[#718096]">
            {valueOrUnavailable(driver.vehicleType, t)}
          </p>
        </div>
      ),
    },

    {
      key: 'model',
      label: 'Model',
      render: (driver) =>
        valueOrUnavailable(
          driver.vehicleModel || driver.model,
          t
        ),
    },

    {
      key: 'driver',
      label: 'Driver',
      render: (driver) => (
        <div>
          <p className="font-semibold text-[#152238]">
            {displayName(driver.name) || t.unnamedDriver}
          </p>

          <p className="mt-0.5 text-xs text-[#718096]">
            {driver.email || t.notAvailable}
          </p>
        </div>
      ),
    },

    {
      key: 'rcStatus',
      label: t.rcStatus,
      render: (driver) =>
        valueOrUnavailable(
          driver.rcStatus || driver.rc?.status,
          t
        ),
    },

    {
      key: 'insuranceStatus',
      label: t.insuranceStatus,
      render: (driver) =>
        valueOrUnavailable(
          driver.insuranceStatus ||
          driver.insurance?.status,
          t
        ),
    },

    {
      key: 'registrationDate',
      label: t.registrationDate,
      render: (driver) =>
        formatDate(
          driver.registrationDate ||
          driver.createdAt
        ),
    },

    {
      key: 'status',
      label: t.vehicleStatus,
      render: (driver) => {
        const status = vehicleStatus(driver, t)

        return (
          <Badge variant={status.variant}>
            {status.label}
          </Badge>
        )
      },
    },

    {
      key: 'actions',
      label: 'Action',
      render: (driver) => (
        <button
          type="button"
          onClick={() => setSelectedVehicle(driver)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-3 py-2 text-xs font-semibold text-[#334155] transition hover:bg-slate-100"
        >
          <i className="ri-eye-line" />
          View
        </button>
      ),
    },
  ]

  return (
    <div className="space-y-5 pb-5 sm:space-y-6">

        {/* Page Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-[28px] font-bold tracking-[-0.04em] text-[#152238] sm:text-[32px]">
              {t.vehicles}
            </h1>

            <p className="mt-1 text-sm text-[#718096]">
              {t.manageRegisteredVehicles}
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
            aria-label={t.backToDrivers}
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
              {t.allVehicles}
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
              {t.active}
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
              {t.pending}
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
              {t.blocked}
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
              placeholder={t.searchVehicles}
              className="flex-1"
            />

            <Filter
              label={t.vehicleStatusLabel}
              value={statusFilter}
              onChange={setStatusFilter}
              options={statusOptions}
            />

          </div>
        </Card>

        {/* Error */}
        {error && (
          <ErrorState
            title={t.unableLoadVehicles}
            message={error}
            onRetry={() => loadVehicles()}
          />
        )}

        {/* Desktop Table */}
        {!error && (
          <div className="hidden md:block">

            {loading ? (
              <Card>
                <Loader label={t.loadingVehicles} />
              </Card>
            ) : filteredVehicles.length === 0 ? (
              <EmptyState
                title={t.noVehiclesFound}
                message={
                  search || statusFilter !== 'all'
                    ? t.noVehiclesMatch
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
                <Loader label={t.loadingVehicles} />
              </Card>
            ) : filteredVehicles.length === 0 ? (
              <EmptyState
                title={t.noVehiclesFound}
                message={
                  search || statusFilter !== 'all'
                    ? t.noVehiclesMatch
                    : 'Vehicle records are sourced from registered drivers.'
                }
                icon="ri-car-line"
              />
            ) : (
              filteredVehicles.map((driver) => {
                const status = vehicleStatus(driver, t)

                return (
                  <MobileRecordCard
                    key={driver._id}
                    title={valueOrUnavailable(
                      driver.vehicleNumber,
                      t
                    )}
                    subtitle={
                      displayName(driver.name) ||
                      t.unnamedDriver
                    }
                    badge={
                      <Badge variant={status.variant}>
                        {status.label}
                      </Badge>
                    }
                  >
                    <MobileField
                      label={t.vehicleType}
                      value={driver.vehicleType}
                    />

                    <MobileField
                      label={t.vehicleModel}
                      value={
                        driver.vehicleModel ||
                        driver.model
                      }
                    />

                    <MobileField
                      label={t.rcStatus}
                      value={
                        driver.rcStatus ||
                        driver.rc?.status
                      }
                    />

                    <MobileField
                      label={t.insuranceStatus}
                      value={
                        driver.insuranceStatus ||
                        driver.insurance?.status
                      }
                    />

                    <MobileField
                      label={t.registrationDate}
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

      {/* Vehicle Details Modal */}
      {selectedVehicle && (
        <Modal
          open={Boolean(selectedVehicle)}
          onClose={() => setSelectedVehicle(null)}
          title={t.vehicleDetails}
        >
          <div className="space-y-5">
            <div className="flex items-center gap-4 rounded-xl bg-[#F7F9FC] p-4">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[#0B1B2B] text-white">
                <i className="ri-car-line text-2xl" />
              </div>

              <div className="min-w-0">
                <h3 className="truncate text-lg font-bold text-[#152238]">
                  {valueOrUnavailable(selectedVehicle.vehicleNumber, t)}
                </h3>
                <p className="text-sm text-[#718096]">
                  {displayName(selectedVehicle.name) || t.unnamedDriver}
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <VehicleDetail
                label={t.vehicleNumber}
                value={selectedVehicle.vehicleNumber}
                t={t}
              />
              <VehicleDetail
                label={t.vehicleType}
                value={selectedVehicle.vehicleType}
                t={t}
              />
              <VehicleDetail
                label={t.vehicleModel}
                value={
                  selectedVehicle.vehicleModel ||
                  selectedVehicle.model
                }
                t={t}
              />
              <VehicleDetail
                label={t.driver}
                value={displayName(selectedVehicle.name)}
                t={t}
              />
              <VehicleDetail
                label={t.driverEmail}
                value={selectedVehicle.email}
                t={t}
              />
              <VehicleDetail
                label={t.driverPhone}
                value={selectedVehicle.phone}
                t={t}
              />
              <VehicleDetail
                label={t.rcStatus}
                value={
                  selectedVehicle.rcStatus ||
                  selectedVehicle.rc?.status
                }
                t={t}
              />
              <VehicleDetail
                label={t.insuranceStatus}
                value={
                  selectedVehicle.insuranceStatus ||
                  selectedVehicle.insurance?.status
                }
                t={t}
              />
              <VehicleDetail
                label={t.registrationDate}
                value={formatDate(
                  selectedVehicle.registrationDate ||
                  selectedVehicle.createdAt
                )}
                t={t}
              />
              <VehicleDetail
                label={t.vehicleStatus}
                value={vehicleStatus(selectedVehicle, t).label}
                t={t}
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedVehicle(null)}
                className="rounded-lg bg-[#0B1B2B] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#152238]"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  )
}

function VehicleDetail({ label, value, t }) {
  return (
    <div className="rounded-xl border border-[#E6EBF2] bg-white p-3">
      <p className="text-xs font-medium text-[#718096]">
        {label}
      </p>
      <p className="mt-1 break-words text-sm font-semibold text-[#152238]">
        {value || t.notAvailable}
      </p>
    </div>
  )
}
