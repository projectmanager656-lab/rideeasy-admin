import React, { useState } from 'react'
import { useAdminLanguage } from '../../context/AdminLanguageContext'
import { displayName, rowStableKey } from '../adminUtils'
import {
  Button,
  Search,
  Card,
  Table,
  Badge,
  Loader,
  EmptyState,
  Modal,
} from '../../components/ui'

export default function DriversTab({
  driversLoading,
  error,
  filteredDrivers,
  drivers,
  tableSearch,
  setTableSearch,
  driverStatusFilter,
  setDriverStatusFilter,
  selectedIds,
  toggleSelect,
  selectAllVisible,
  clearSelection,
  tableHeaderSelectRef,
  approveDriver,
  rejectDriver,
  toggleDriverBlock,
  deleteDriver,
  bulkDeleteDrivers,
}) {
  const { t } = useAdminLanguage()
  const [selectedDriver, setSelectedDriver] = useState(null)

  const approvedCount = drivers.filter(
    (driver) => driver.approved
  ).length

  const pendingCount = drivers.filter(
    (driver) => !driver.approved
  ).length

  const blockedCount = drivers.filter(
    (driver) => driver.blocked
  ).length

  const offlineCount = drivers.filter(
    (driver) =>
      driver.approved &&
      !driver.blocked &&
      String(driver.liveStatus || '').toUpperCase() === 'OFFLINE'
  ).length

  const activeCount = drivers.filter(
    (driver) =>
      driver.approved &&
      !driver.blocked &&
      ['ONLINE', 'BUSY'].includes(
        String(driver.liveStatus || '').toUpperCase()
      )
  ).length

  const allVisibleSelected =
    filteredDrivers.length > 0 &&
    filteredDrivers.every((driver) =>
      selectedIds.includes(String(driver._id))
    )

  const columns = [
    {
      key: 'select',
      label: '',
      className: 'w-12',
      render: (driver) => (
        <input
          type="checkbox"
          className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-[#FFB21C]"
          checked={selectedIds.includes(String(driver._id))}
          onChange={() => toggleSelect(driver._id)}
          aria-label={`${t.selectDriver} ${displayName(driver.name) || t.driver}`}
        />
      ),
    },

    {
      key: 'driver',
      label: t.driver,
      render: (driver) => (
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#0B1B2B] text-sm font-bold text-white">
            {String(displayName(driver.name) || 'D')
              .charAt(0)
              .toUpperCase()}
          </div>

          <div className="min-w-0">
            <p className="truncate font-semibold text-[#111827]">
              {displayName(driver.name) || t.unnamedDriver}
            </p>

            <p className="text-xs text-[#9CA3AF]">
              Driver
            </p>
          </div>
        </div>
      ),
    },

    {
      key: 'email',
      label: t.email,
      render: (driver) => (
        <span className="text-sm text-[#6B7280]">
          {driver.email || '—'}
        </span>
      ),
    },

    {
      key: 'vehicle',
      label: t.vehicle,
      render: (driver) => (
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#FFF4DF] text-[#B86B00]">
            <i className="ri-car-2-line" />
          </div>

          <Badge variant="primary" size="sm">
            {driver.vehicleType || 'N/A'}
          </Badge>
        </div>
      ),
    },

    {
      key: 'city',
      label: t.city,
      render: (driver) => (
        <div className="flex items-center gap-1.5 text-sm text-[#6B7280]">
          <i className="ri-map-pin-line text-[#9CA3AF]" />
          {driver.city || '—'}
        </div>
      ),
    },

    {
      key: 'approval',
      label: t.approved,
      render: (driver) =>
        driver.approved ? (
          <Badge
            variant="success"
            icon="ri-checkbox-circle-line"
          >
            {t.approved}
          </Badge>
        ) : (
          <Badge
            variant="warning"
            icon="ri-time-line"
          >
            {t.pending}
          </Badge>
        ),
    },

    {
      key: 'account',
      label: 'Account',
      render: (driver) =>
        driver.blocked ? (
          <Badge
            variant="danger"
            icon="ri-lock-line"
          >
            {t.blocked}
          </Badge>
        ) : (
          <Badge
            variant="success"
            icon="ri-checkbox-circle-line"
          >
            {t.active}
          </Badge>
        ),
    },

    {
      key: 'actions',
      label: t.actions,
      className: 'text-right',
      cellClassName: 'text-right',
      render: (driver) => {
        const approved = Boolean(driver.approved)
        const blocked = Boolean(driver.blocked)

        return (
          <div className="flex flex-wrap items-center justify-end gap-2">
            {!approved ? (
              <Button
                variant="ghost"
                size="sm"
                icon="ri-check-line"
                onClick={() => approveDriver(driver._id)}
                className="bg-[#EAFBF2] text-[#16A34A] hover:bg-[#DCFCE7]"
              >
                Approve
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                icon="ri-close-line"
                onClick={() => rejectDriver(driver._id)}
                className="bg-[#FFF4DF] text-[#B86B00] hover:bg-[#FFE9B8]"
              >
                Revoke
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              icon={
                blocked
                  ? 'ri-lock-unlock-line'
                  : 'ri-forbid-line'
              }
              onClick={() =>
                toggleDriverBlock(driver._id, !blocked)
              }
              className={
                blocked
                  ? 'bg-[#EAFBF2] text-[#16A34A] hover:bg-[#DCFCE7]'
                  : 'bg-[#FFF4DF] text-[#B86B00] hover:bg-[#FFE9B8]'
              }
            >
              {blocked ? t.unblock : t.block}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              icon="ri-eye-line"
              onClick={() => setSelectedDriver(driver)}
              className="bg-slate-50 text-[#334155] hover:bg-slate-100"
            >
              View
            </Button>

            <Button
              variant="ghost"
              size="sm"
              icon="ri-delete-bin-line"
              onClick={() => deleteDriver(driver._id)}
              className="bg-red-50 text-[#DC2626] hover:bg-red-100"
            >
              Delete
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <div className="space-y-6">

      {/* Header */}
      <Card padding="md">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[#111827]">
              {t.drivers}
            </h2>

            <p className="mt-1 text-sm text-[#6B7280]">
              {t.driversPageSubtitle}
            </p>
          </div>

          {/* Driver Statistics */}
          <div className="grid w-full gap-3 sm:grid-cols-2 xl:grid-cols-4">

            <StatCard
              icon="ri-steering-2-line"
              label={t.active}
              value={activeCount}
              iconClass="bg-[#EAF4FF] text-[#2563EB]"
            />

            <StatCard
              icon="ri-checkbox-circle-line"
              label={t.approved}
              value={approvedCount}
              iconClass="bg-[#EAFBF2] text-[#16A34A]"
            />

            <StatCard
              icon="ri-time-line"
              label={t.pending}
              value={pendingCount}
              iconClass="bg-[#FFF4DF] text-[#B86B00]"
            />

            <StatCard
              icon="ri-user-off-line"
              label={t.offline}
              value={offlineCount}
              iconClass="bg-[#F1F5F9] text-[#64748B]"
            />

          </div>
        </div>

        {/* Search + Bulk Actions */}
        <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-end">

          <div className="flex-1">
            <Search
              value={tableSearch}
              onChange={(event) =>
                setTableSearch(event.target.value)
              }
              placeholder={t.searchDrivers}
            />
          </div>

          <div className="w-full lg:w-48">
            <label className="mb-1.5 block text-xs font-medium text-[#6B7280]">
              Status
            </label>
            <select
              value={driverStatusFilter}
              onChange={(event) =>
                setDriverStatusFilter(event.target.value)
              }
              className="w-full rounded-lg border border-[#D1D5DB] bg-white px-3 py-2 text-sm text-[#152238] outline-none focus:border-[#152238]"
            >
              <option value="all">{t.allStatuses}</option>
              <option value="online">{t.online}</option>
              <option value="busy">{t.busy}</option>
              <option value="offline">{t.offline}</option>
            </select>
          </div>

          {selectedIds.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">

              <Badge
                variant="primary"
                icon="ri-checkbox-multiple-line"
              >
                {selectedIds.length} selected
              </Badge>

              <Button
                variant="secondary"
                size="sm"
                onClick={clearSelection}
              >
                Clear
              </Button>

              <Button
                variant="danger"
                size="sm"
                icon="ri-delete-bin-line"
                onClick={bulkDeleteDrivers}
              >
                {t.delete} ({selectedIds.length})
              </Button>

            </div>
          )}
        </div>
      </Card>

      {/* Drivers Table */}
      <Card padding="none">

        <div className="flex flex-col justify-between gap-2 border-b border-[#E5E7EB] px-5 py-4 sm:flex-row sm:items-center">

          <div>
            <h3 className="font-bold text-[#111827]">
              {t.allDrivers}
            </h3>

            <p className="mt-0.5 text-xs text-[#6B7280]">
              {filteredDrivers.length} {filteredDrivers.length === 1 ? t.driverShown : t.driversShown}
            </p>
          </div>

          {blockedCount > 0 && (
            <Badge
              variant="danger"
              icon="ri-lock-line"
            >
              {blockedCount} {t.blocked}
            </Badge>
          )}

        </div>

        {driversLoading ? (

          <div className="flex min-h-[360px] items-center justify-center">
            <Loader text={t.loadingDrivers} />
          </div>

        ) : error ? (

          <div className="p-6">
            <EmptyState
              icon="ri-error-warning-line"
              title={t.unableToLoadDrivers}
              message={error}
            />
          </div>

        ) : filteredDrivers.length === 0 ? (

          <div className="p-6">
            <EmptyState
              icon="ri-steering-2-line"
              title={t.noDriversFound}
              message={
                tableSearch
                  ? t.noDriversMatchSearch
                  : t.noRegisteredDrivers
              }
            />
          </div>

        ) : (

          <div className="overflow-x-auto">

            <Table
              columns={columns}
              data={filteredDrivers}
              rowKey="_id"
            />

          </div>
        )}

        {/* Header checkbox synchronization */}
        {!driversLoading && filteredDrivers.length > 0 && (
          <div className="hidden">
            <input
              ref={tableHeaderSelectRef}
              type="checkbox"
              checked={allVisibleSelected}
              onChange={(event) =>
                event.target.checked
                  ? selectAllVisible(filteredDrivers)
                  : clearSelection()
              }
              readOnly={false}
            />
          </div>
        )}

      </Card>

      {/* Driver Details Modal */}
      {selectedDriver && (
        <Modal
          open={Boolean(selectedDriver)}
          onClose={() => setSelectedDriver(null)}
          title={t.driverDetails}
        >
          <div className="space-y-5">
            <div className="flex items-center gap-4 rounded-xl bg-[#F7F9FC] p-4">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[#0B1B2B] text-lg font-bold text-white">
                {String(displayName(selectedDriver.name) || 'D')
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div className="min-w-0">
                <h3 className="truncate text-lg font-bold text-[#111827]">
                  {displayName(selectedDriver.name) || 'Unnamed Driver'}
                </h3>
                <p className="text-sm text-[#6B7280]">
                  {t.driverId}: {selectedDriver._id || '—'}
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <DetailItem label={t.email} value={selectedDriver.email} />
              <DetailItem label={t.phone} value={selectedDriver.phone} />
              <DetailItem label={t.city} value={selectedDriver.city} />
              <DetailItem label={t.vehicleType} value={selectedDriver.vehicleType} />
              <DetailItem label={t.vehicleNumber} value={selectedDriver.vehicleNumber} />
              <DetailItem
                label={t.approved}
                value={selectedDriver.approved ? t.approved : t.pending}
              />
              <DetailItem
                label={t.accountStatus}
                value={selectedDriver.blocked ? t.blocked : t.active}
              />
              <DetailItem
                label={t.liveStatus}
                value={
                  selectedDriver.online === true
                    ? 'Online'
                    : selectedDriver.status || t.offline
                }
              />
            </div>

            <div className="flex justify-end">
              <Button
                variant="secondary"
                onClick={() => setSelectedDriver(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}

function DetailItem({ label, value }) {
  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-white p-3">
      <p className="text-xs font-medium text-[#6B7280]">{label}</p>
      <p className="mt-1 break-words text-sm font-semibold text-[#111827]">
        {value || '—'}
      </p>
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  iconClass,
}) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-[#E5E7EB] bg-[#F7F9FC] px-3 py-2">
      <div
        className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${iconClass}`}
      >
        <i className={icon} />
      </div>

      <div>
        <p className="text-[11px] text-[#6B7280]">
          {label}
        </p>

        <p className="font-bold text-[#111827]">
          {value}
        </p>
      </div>
    </div>
  )
}
