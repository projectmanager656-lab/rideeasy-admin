import React, { useState } from 'react'
import { useAdminLanguage } from '../context/AdminLanguageContext'
import { useNavigate } from 'react-router-dom'

const INITIAL_ROLES = [
  {
    id: 1,
    name: 'Super Admin',
    description: 'Full access to all admin modules.',
    users: 1,
    status: 'Active',
    permissions: [
      'Dashboard',
      'Users',
      'Drivers',
      'Vehicles',
      'Verification',
      'Rides',
      'Live Operations',
      'Finance',
      'Payments',
      'SOS',
      'Support',
      'Reports',
      'Audit Logs',
      'Notifications',
      'Roles',
      'Settings',
      'Fare Configuration',
    ],
  },
  {
    id: 2,
    name: 'Operations',
    description: 'Manage drivers, rides and live operations.',
    users: 2,
    status: 'Active',
    permissions: [
      'Dashboard',
      'Drivers',
      'Vehicles',
      'Verification',
      'Rides',
      'Live Operations',
    ],
  },
  {
    id: 3,
    name: 'Support',
    description: 'Handle customer and driver support requests.',
    users: 3,
    status: 'Active',
    permissions: [
      'Dashboard',
      'Users',
      'Drivers',
      'Rides',
      'Support',
      'Notifications',
    ],
  },
]

const PERMISSIONS = [
  'Dashboard',
  'Users',
  'Drivers',
  'Vehicles',
  'Verification',
  'Rides',
  'Live Operations',
  'Finance',
  'Payments',
  'SOS',
  'Support',
  'Reports',
  'Audit Logs',
  'Notifications',
  'Roles',
  'Settings',
  'Fare Configuration',
]

function StatusBadge({ status, t }) {
  const label = status === 'Active' ? t.active : status

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${
        status === 'Active'
          ? 'border-green-200 bg-green-50 text-green-700'
          : 'border-gray-200 bg-gray-50 text-gray-600'
      }`}
    >
      {label}
    </span>
  )
}

const permissionLabels = {
  Dashboard: 'dashboard',
  Users: 'users',
  Drivers: 'drivers',
  Vehicles: 'vehicles',
  Verification: 'verification',
  Rides: 'rides',
  'Live Operations': 'liveOperations',
  Finance: 'finance',
  Payments: 'payments',
  SOS: 'sos',
  Support: 'support',
  Reports: 'reports',
  'Audit Logs': 'auditLogs',
  Notifications: 'notifications',
  Roles: 'roles',
  Settings: 'settings',
  'Fare Configuration': 'fareConfiguration',
}

const roleNameKeys = {
  'Super Admin': 'superAdmin',
  Operations: 'operations',
  Support: 'support',
}

const roleDescriptionKeys = {
  'Full access to all admin modules.': 'fullAccessAllAdminModules',
  'Manage drivers, rides and live operations.': 'manageDriversRidesLiveOperations',
  'Handle customer and driver support requests.': 'handleCustomerDriverSupport',
}

function translatedPermission(permission, t) {
  const key = permissionLabels[permission]
  return key && t[key] ? t[key] : permission
}

function translatedRoleName(name, t) {
  const key = roleNameKeys[name]
  return key && t[key] ? t[key] : name
}

function translatedRoleDescription(description, t) {
  const key = roleDescriptionKeys[description]
  return key && t[key] ? t[key] : description
}

export default function AdminRoles() {
  const { t } = useAdminLanguage()
  const navigate = useNavigate()

  const [roles, setRoles] = useState(INITIAL_ROLES)
  const [showModal, setShowModal] = useState(false)
  const [editingRole, setEditingRole] = useState(null)

  const [form, setForm] = useState({
    name: '',
    description: '',
    permissions: [],
  })

  const [formError, setFormError] = useState('')

  const handleTabChange = (nextTab) => {
    const routes = {
      analytics: '/admin/dashboard',
      users: '/admin/users',
      drivers: '/admin/drivers',
      vehicles: '/admin/vehicles',
      verification: '/admin/verification',
      rides: '/admin/rides',
      'live-operations': '/admin/live-operations',
      finance: '/admin/finance',
      payments: '/admin/payments',
      sos: '/admin/sos',
      support: '/admin/support',
      reports: '/admin/reports',
      notifications: '/admin/notifications',
      roles: '/admin/roles',
      settings: '/admin/settings',
      services: '/admin/services',
      pricing: '/admin/pricing',
      safety: '/admin/safety',
    }

    navigate(routes[nextTab] || '/admin/dashboard')
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminRole')

    navigate('/admin', {
      replace: true,
    })
  }

  const openCreate = () => {
    setEditingRole(null)

    setForm({
      name: '',
      description: '',
      permissions: [],
    })

    setShowModal(true)
  }

  const openEdit = (role) => {
    setEditingRole(role)

    setForm({
      name: role.name,
      description: role.description,
      permissions: role.permissions,
    })

    setShowModal(true)
  }

  const togglePermission = (permission) => {
    setForm((current) => ({
      ...current,
      permissions: current.permissions.includes(permission)
        ? current.permissions.filter((item) => item !== permission)
        : [...current.permissions, permission],
    }))
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingRole(null)
    setFormError('')
    setForm({
      name: '',
      description: '',
      permissions: [],
    })
  }

  const saveRole = (event) => {
    event.preventDefault()

    if (!form.name.trim()) {
      setFormError(t.roleNameRequired)
      return
    }

    setFormError('')

    if (editingRole) {
      setRoles((current) =>
        current.map((role) =>
          role.id === editingRole.id
            ? {
                ...role,
                name: form.name.trim(),
                description: form.description.trim(),
                permissions: form.permissions,
              }
            : role
        )
      )
    } else {
      setRoles((current) => [
        ...current,
        {
          id: Date.now(),
          name: form.name.trim(),
          description: form.description.trim(),
          users: 0,
          status: 'Active',
          permissions: form.permissions,
        },
      ])
    }

    setShowModal(false)
  }

  const deleteRole = (id) => {
    setRoles((current) =>
      current.filter((role) => role.id !== id)
    )
  }

  return (
      <div className="space-y-5 pb-6 sm:space-y-6">

        {/* PAGE HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#718096]">
              {t.roleAdministration}
            </p>

            <h1 className="mt-1 text-[28px] font-bold tracking-[-0.04em] text-[#152238] sm:text-[32px]">
              {t.rolesPermissions}
            </h1>

            <p className="mt-1 text-sm text-[#718096]">
              {t.manageAdminRoles}
            </p>
          </div>

          <button
            type="button"
            onClick={openCreate}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#152238] px-4 text-sm font-semibold text-white transition hover:bg-[#0B1B2B]"
          >
            <i className="ri-add-line text-lg" />
            {t.addRole}
          </button>
        </div>

        {/* ROLE TABLE / CARDS */}
        <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-[0_2px_10px_rgba(15,23,42,0.05)]">

          {/* DESKTOP */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-left">
              <thead className="border-b border-[#E5E7EB] bg-[#F8FAFC]">
                <tr>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#718096]">
                    {t.roleColumn}
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#718096]">
                    {t.descriptionColumn}
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#718096]">
                    {t.usersColumn}
                  </th>

                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#718096]">
                    {t.statusColumn}
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-[#718096]">
                    {t.actionsColumn}
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#E5E7EB]">
                {roles.map((role) => (
                  <tr
                    key={role.id}
                    className="transition hover:bg-[#FAFBFC]"
                  >
                    <td className="px-5 py-4">
                      <div className="font-semibold text-[#152238]">
                        {translatedRoleName(role.name, t)}
                      </div>
                    </td>

                    <td className="max-w-md px-5 py-4 text-sm text-[#718096]">
                      {translatedRoleDescription(role.description, t)}
                    </td>

                    <td className="px-5 py-4 text-sm font-medium text-[#152238]">
                      {role.users}
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={role.status} t={t} />
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">

                        <button
                          type="button"
                          onClick={() => openEdit(role)}
                          className="rounded-lg border border-[#E5E7EB] px-3 py-2 text-xs font-semibold text-[#152238] transition hover:bg-[#F8FAFC]"
                        >
                          <i className="ri-edit-line mr-1" />
                          {t.edit}
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteRole(role.id)}
                          className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                        >
                          <i className="ri-delete-bin-line mr-1" />
                          {t.delete}
                        </button>

                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE */}
          <div className="divide-y divide-[#E5E7EB] md:hidden">
            {roles.map((role) => (
              <div
                key={role.id}
                className="p-4"
              >
                <div className="flex items-start justify-between gap-3">

                  <div className="min-w-0">
                    <h3 className="font-semibold text-[#152238]">
                      {translatedRoleName(role.name, t)}
                    </h3>

                    <p className="mt-1 text-sm leading-5 text-[#718096]">
                      {translatedRoleDescription(role.description, t)}
                    </p>
                  </div>

                  <StatusBadge status={role.status} t={t} />
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">

                  <span className="text-xs text-[#718096]">
                    {role.users} {t.usersCount}
                  </span>

                  <div className="flex gap-2">

                    <button
                      type="button"
                      onClick={() => openEdit(role)}
                      className="rounded-lg border border-[#E5E7EB] px-3 py-2 text-xs font-semibold text-[#152238]"
                    >
                      {t.edit}
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteRole(role.id)}
                      className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600"
                    >
                      {t.delete}
                    </button>

                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CREATE / EDIT MODAL */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

              <form onSubmit={saveRole}>

                {/* MODAL HEADER */}
                <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-4">

                  <div>
                    <h2 className="text-lg font-bold text-[#152238]">
                      {editingRole
                        ? t.editRole
                        : t.createRole}
                    </h2>

                    <p className="mt-1 text-xs text-[#718096]">
                      {t.uiDemoDataBackendPending}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={closeModal}
                    className="grid h-9 w-9 place-items-center rounded-lg transition hover:bg-[#F8FAFC]"
                    aria-label={t.close}
                  >
                    <i className="ri-close-line text-lg" />
                  </button>

                </div>

                {/* MODAL CONTENT */}
                <div className="space-y-5 p-5">

                  {/* ROLE NAME */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#152238]">
                      {t.roleName}
                    </label>

                    <input
                      value={form.name}
                      onChange={(event) => {
                        setForm((current) => ({
                          ...current,
                          name: event.target.value,
                        }))
                        if (formError) setFormError('')
                      }}
                      placeholder={t.roleNamePlaceholder}
                      className="h-11 w-full rounded-xl border border-[#D9DEE7] px-3 py-2.5 text-sm outline-none transition focus:border-[#FFA726] focus:ring-2 focus:ring-[#FFA726]/20"
                    />

                    {formError && (
                      <p className="mt-1.5 text-xs font-medium text-red-600">
                        {formError}
                      </p>
                    )}
                  </div>

                  {/* DESCRIPTION */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#152238]">
                      {t.descriptionColumn}
                    </label>

                    <textarea
                      value={form.description}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          description: event.target.value,
                        }))
                      }
                      placeholder={t.roleDescriptionPlaceholder}
                      rows={3}
                      className="w-full resize-none rounded-xl border border-[#D9DEE7] px-3 py-2.5 text-sm outline-none transition focus:border-[#FFA726] focus:ring-2 focus:ring-[#FFA726]/20"
                    />
                  </div>

                  {/* PERMISSIONS */}
                  <div>
                    <div className="mb-3 flex items-center justify-between">

                      <label className="text-sm font-semibold text-[#152238]">
                        {t.permissions}
                      </label>

                      <span className="rounded-full bg-[#F1F5F9] px-2.5 py-1 text-xs font-semibold text-[#64748B]">
                        {form.permissions.length} {t.selectedCount}
                      </span>

                    </div>

                    <div className="grid gap-2 sm:grid-cols-2">
                      {PERMISSIONS.map((permission) => {
                        const checked =
                          form.permissions.includes(permission)

                        return (
                          <label
                            key={translatedPermission(permission, t)}
                            className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 transition ${
                              checked
                                ? 'border-[#FFA726] bg-[#FFF8E8]'
                                : 'border-[#E5E7EB] hover:bg-[#F8FAFC]'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() =>
                                togglePermission(permission)
                              }
                              className="h-4 w-4 accent-[#FFA726]"
                            />

                            <span className="text-sm text-[#152238]">
                              {translatedPermission(permission, t)}
                            </span>
                          </label>
                        )
                      })}
                    </div>
                  </div>

                </div>

                {/* MODAL ACTIONS */}
                <div className="flex flex-col-reverse gap-2 border-t border-[#E5E7EB] px-5 py-4 sm:flex-row sm:justify-end">

                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-xl border border-[#D9DEE7] px-4 py-2.5 text-sm font-semibold text-[#152238] transition hover:bg-[#F8FAFC]"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="rounded-xl bg-[#152238] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0B1B2B]"
                  >
                    {editingRole
                      ? t.saveChanges
                      : t.createRole}
                  </button>

                </div>

              </form>
            </div>
          </div>
        )}
      </div>

  )
}