import React from 'react'
import { displayName, rowStableKey } from '../adminUtils'
import {
  Button,
  Search,
  Card,
  Table,
  Badge,
  Loader,
  EmptyState,
} from '../../components/ui'

export default function UsersTab({
  usersLoading,
  filteredUsers,
  users,
  tableSearch,
  setTableSearch,
  selectedIds,
  toggleSelect,
  selectAllVisible,
  clearSelection,
  tableHeaderSelectRef,
  toggleUserBlock,
  deleteUser,
  bulkDeleteUsers,
}) {
  const visibleUsers = filteredUsers || []
  const totalUsers = users?.length || 0

  const allVisibleSelected =
    visibleUsers.length > 0 &&
    visibleUsers.every((user) =>
      selectedIds.includes(String(user._id))
    )

  const columns = [
    {
      key: 'select',
      label: '',
      className: 'w-12',
      cellClassName: 'w-12',
      render: (user) => (
        <input
          type="checkbox"
          className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-[#FFB21C]"
          checked={selectedIds.includes(String(user._id))}
          onChange={() => toggleSelect(user._id)}
          aria-label={`Select ${displayName(user.name) || 'user'}`}
        />
      ),
    },

    {
      key: 'user',
      label: 'User',
      render: (user) => {
        const name = displayName(user.name) || 'Unnamed User'

        return (
          <div className="flex min-w-[180px] items-center gap-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#0B1B2B] text-xs font-bold text-white">
              {String(name).charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0">
              <p className="truncate font-semibold text-[#152238]">
                {name}
              </p>

              <p className="text-xs text-[#9CA3AF]">
                Passenger
              </p>
            </div>
          </div>
        )
      },
    },

    {
      key: 'email',
      label: 'Email',
      render: (user) => (
        <span className="whitespace-nowrap text-sm text-[#718096]">
          {user.email || '—'}
        </span>
      ),
    },

    {
      key: 'phone',
      label: 'Phone',
      render: (user) => (
        <span className="whitespace-nowrap text-sm text-[#718096]">
          {user.phone || '—'}
        </span>
      ),
    },

    {
      key: 'city',
      label: 'City',
      render: (user) => (
        <div className="flex items-center gap-1.5 whitespace-nowrap text-sm text-[#718096]">
          <i className="ri-map-pin-line text-[#9CA3AF]" />
          {user.city || '—'}
        </div>
      ),
    },

    {
      key: 'status',
      label: 'Status',
      render: (user) => {
        const blocked = Boolean(user.blocked)

        return (
          <Badge
            variant={blocked ? 'danger' : 'success'}
            icon={
              blocked
                ? 'ri-forbid-line'
                : 'ri-checkbox-circle-line'
            }
          >
            {blocked ? 'Blocked' : 'Active'}
          </Badge>
        )
      },
    },

    {
      key: 'actions',
      label: 'Actions',
      className: 'text-right',
      cellClassName: 'text-right',
      render: (user) => {
        const blocked = Boolean(user.blocked)

        return (
          <div className="flex min-w-[190px] items-center justify-end gap-2">
            <Button
              size="sm"
              variant={blocked ? 'secondary' : 'primary'}
              icon={
                blocked
                  ? 'ri-lock-unlock-line'
                  : 'ri-forbid-line'
              }
              onClick={() =>
                toggleUserBlock(user._id, !blocked)
              }
            >
              {blocked ? 'Unblock' : 'Block'}
            </Button>

            <Button
              size="sm"
              variant="danger"
              icon="ri-delete-bin-line"
              onClick={() => deleteUser(user._id)}
            >
              Delete
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <div className="space-y-5 sm:space-y-6">

      {/* Page header */}
      <Card padding="md">
        <div className="flex flex-col gap-5">

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight text-[#152238] sm:text-[28px]">
                Users
              </h1>

              <p className="mt-1 text-sm text-[#718096]">
                Manage registered RideEasy passengers.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3 rounded-xl border border-[#E5E7EB] bg-[#F7F9FC] px-4 py-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#FFF4DF] text-[#B86B00]">
                <i className="ri-user-3-line text-lg" />
              </div>

              <div>
                <p className="text-xs text-[#718096]">
                  Total users
                </p>

                <p className="text-lg font-bold text-[#152238]">
                  {totalUsers.toLocaleString('en-IN')}
                </p>
              </div>
            </div>

          </div>

          {/* Search + bulk actions */}
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end">

            <div className="min-w-0 flex-1">
              <Search
                value={tableSearch}
                onChange={(event) =>
                  setTableSearch(event.target.value)
                }
                placeholder="Search by name, email, phone or city..."
              />
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
                  onClick={bulkDeleteUsers}
                >
                  Delete ({selectedIds.length})
                </Button>

              </div>
            )}

          </div>
        </div>
      </Card>

      {/* Users table */}
      <Card
        padding="none"
        className="overflow-hidden"
      >

        {/* Table heading */}
        <div className="flex flex-col justify-between gap-2 border-b border-[#E5E7EB] px-5 py-4 sm:flex-row sm:items-center sm:px-6">

          <div>
            <h2 className="font-bold text-[#152238]">
              All Users
            </h2>

            <p className="mt-0.5 text-xs text-[#718096]">
              {visibleUsers.length} user
              {visibleUsers.length === 1 ? '' : 's'} shown
            </p>
          </div>

          {selectedIds.length === 0 &&
            visibleUsers.length > 0 && (
              <span className="text-xs text-[#9CA3AF]">
                Select users to perform bulk actions
              </span>
            )}

        </div>

        {/* Select all */}
        {visibleUsers.length > 0 && !usersLoading && (
          <div className="flex items-center gap-3 border-b border-[#E5E7EB] bg-[#FAFBFC] px-5 py-3 sm:px-6">
            <input
              ref={tableHeaderSelectRef}
              type="checkbox"
              className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-[#FFB21C]"
              checked={allVisibleSelected}
              onChange={(event) => {
                if (event.target.checked) {
                  selectAllVisible(visibleUsers)
                } else {
                  clearSelection()
                }
              }}
              aria-label="Select all visible users"
            />

            <span className="text-xs font-medium text-[#718096]">
              Select all visible users
            </span>
          </div>
        )}

        {/* Loading */}
        {usersLoading ? (
          <div className="flex min-h-[360px] items-center justify-center p-8">
            <Loader text="Loading users..." />
          </div>
        ) : visibleUsers.length === 0 ? (
          <div className="p-5 sm:p-6">
            <EmptyState
              icon="ri-user-search-line"
              title="No users found"
              message={
                tableSearch
                  ? 'No users match your current search.'
                  : 'There are currently no registered users.'
              }
            />
          </div>
        ) : (
          <Table
            columns={columns}
            data={visibleUsers}
            rowKey="_id"
            emptyMessage="No users found"
          />
        )}

      </Card>
    </div>
  )
}
