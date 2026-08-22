import React, { useState } from 'react'

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
      'Notifications',
      'Roles',
      'Settings',
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
  'Notifications',
  'Roles',
  'Settings',
]

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${
        status === 'Active'
          ? 'border-green-200 bg-green-50 text-green-700'
          : 'border-gray-200 bg-gray-50 text-gray-600'
      }`}
    >
      {status}
    </span>
  )
}

export default function AdminRoles() {
  const [roles, setRoles] = useState(INITIAL_ROLES)
  const [showModal, setShowModal] = useState(false)
  const [editingRole, setEditingRole] = useState(null)

  const [form, setForm] = useState({
    name: '',
    description: '',
    permissions: [],
  })

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

  const saveRole = (event) => {
    event.preventDefault()

    if (!form.name.trim()) return

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
    setRoles((current) => current.filter((role) => role.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-[#718096]">
            Administration
          </p>

          <h1 className="mt-1 text-2xl font-bold text-[#152238] sm:text-3xl">
            Roles & Permissions
          </h1>

          <p className="mt-2 text-sm text-[#718096]">
            Manage admin roles and access permissions.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#152238] px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
        >
          <i className="ri-add-line" />
          Add Role
        </button>
      </div>

      {/* Role cards/table */}
      <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
        {/* Desktop */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-left">
            <thead className="border-b border-[#E5E7EB] bg-[#F8FAFC]">
              <tr>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#718096]">
                  Role
                </th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#718096]">
                  Description
                </th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#718096]">
                  Users
                </th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wide text-[#718096]">
                  Status
                </th>
                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-[#718096]">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#E5E7EB]">
              {roles.map((role) => (
                <tr key={role.id} className="hover:bg-[#FAFBFC]">
                  <td className="px-5 py-4">
                    <div className="font-semibold text-[#152238]">
                      {role.name}
                    </div>
                  </td>

                  <td className="max-w-md px-5 py-4 text-sm text-[#718096]">
                    {role.description}
                  </td>

                  <td className="px-5 py-4 text-sm font-medium text-[#152238]">
                    {role.users}
                  </td>

                  <td className="px-5 py-4">
                    <StatusBadge status={role.status} />
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(role)}
                        className="rounded-lg border border-[#E5E7EB] px-3 py-2 text-xs font-semibold text-[#152238] hover:bg-[#F8FAFC]"
                      >
                        <i className="ri-edit-line mr-1" />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteRole(role.id)}
                        className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                      >
                        <i className="ri-delete-bin-line mr-1" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile */}
        <div className="divide-y divide-[#E5E7EB] md:hidden">
          {roles.map((role) => (
            <div key={role.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-[#152238]">
                    {role.name}
                  </h3>

                  <p className="mt-1 text-sm text-[#718096]">
                    {role.description}
                  </p>
                </div>

                <StatusBadge status={role.status} />
              </div>

              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-[#718096]">
                  {role.users} users
                </span>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => openEdit(role)}
                    className="rounded-lg border border-[#E5E7EB] px-3 py-2 text-xs font-semibold"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteRole(role.id)}
                    className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
            <form onSubmit={saveRole}>
              <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-4">
                <div>
                  <h2 className="text-lg font-bold text-[#152238]">
                    {editingRole ? 'Edit Role' : 'Create Role'}
                  </h2>

                  <p className="mt-1 text-xs text-[#718096]">
                    UI demo data — backend integration pending.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="grid h-9 w-9 place-items-center rounded-lg hover:bg-[#F8FAFC]"
                >
                  <i className="ri-close-line text-lg" />
                </button>
              </div>

              <div className="space-y-5 p-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#152238]">
                    Role Name
                  </label>

                  <input
                    value={form.name}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        name: event.target.value,
                      }))
                    }
                    placeholder="e.g. Operations"
                    className="w-full rounded-xl border border-[#D9DEE7] px-3 py-2.5 text-sm outline-none focus:border-[#152238]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#152238]">
                    Description
                  </label>

                  <textarea
                    value={form.description}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        description: event.target.value,
                      }))
                    }
                    placeholder="Describe what this role can manage"
                    rows={3}
                    className="w-full resize-none rounded-xl border border-[#D9DEE7] px-3 py-2.5 text-sm outline-none focus:border-[#152238]"
                  />
                </div>

                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <label className="text-sm font-semibold text-[#152238]">
                      Permissions
                    </label>

                    <span className="text-xs text-[#718096]">
                      {form.permissions.length} selected
                    </span>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-2">
                    {PERMISSIONS.map((permission) => {
                      const checked = form.permissions.includes(permission)

                      return (
                        <label
                          key={permission}
                          className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#E5E7EB] px-3 py-2.5 hover:bg-[#F8FAFC]"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => togglePermission(permission)}
                            className="h-4 w-4"
                          />

                          <span className="text-sm text-[#152238]">
                            {permission}
                          </span>
                        </label>
                      )
                    })}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-[#E5E7EB] px-5 py-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-[#D9DEE7] px-4 py-2.5 text-sm font-semibold text-[#152238]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-[#152238] px-4 py-2.5 text-sm font-semibold text-white"
                >
                  {editingRole ? 'Save Changes' : 'Create Role'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
