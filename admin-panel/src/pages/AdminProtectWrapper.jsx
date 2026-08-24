import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAdminToken } from '../utils/authTokens'
import { isAdminRoleToken } from '../utils/jwtPayload'
import {
  ADMIN_PERMISSIONS,
  ADMIN_ROLES,
  getRolePermissions,
} from '../utils/adminPermissions'

const TAB_PERMISSION_MAP = {
  analytics: ADMIN_PERMISSIONS.DASHBOARD,
  users: ADMIN_PERMISSIONS.USERS,
  drivers: ADMIN_PERMISSIONS.DRIVERS,
  vehicles: ADMIN_PERMISSIONS.VEHICLES,
  verification: ADMIN_PERMISSIONS.VERIFICATION,
  rides: ADMIN_PERMISSIONS.RIDES,
  'live-operations': ADMIN_PERMISSIONS.LIVE_OPERATIONS,
  finance: ADMIN_PERMISSIONS.FINANCE,
  payments: ADMIN_PERMISSIONS.PAYMENTS,
  sos: ADMIN_PERMISSIONS.SOS,
  safety: ADMIN_PERMISSIONS.SOS,
  support: ADMIN_PERMISSIONS.SUPPORT,
  complaints: ADMIN_PERMISSIONS.SUPPORT,
  reports: ADMIN_PERMISSIONS.REPORTS,
  notifications: ADMIN_PERMISSIONS.NOTIFICATIONS,
  roles: ADMIN_PERMISSIONS.ROLES,
  settings: ADMIN_PERMISSIONS.SETTINGS,
}

function getFrontendAdminRole() {
  const storedRole = localStorage.getItem('adminRole')

  if (
    storedRole === ADMIN_ROLES.SUPER_ADMIN ||
    storedRole === ADMIN_ROLES.OPERATIONS ||
    storedRole === ADMIN_ROLES.SUPPORT
  ) {
    return storedRole
  }

  // Current backend provides the generic admin role only.
  // Until backend role data is available, existing admins remain
  // fully visible in the frontend.
  return ADMIN_ROLES.SUPER_ADMIN
}

const AccessDenied = ({ role, permission }) => {
  const navigate = useNavigate()

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-[#F7F9FC] p-6">
      <div className="w-full max-w-md rounded-2xl border border-[#E5E7EB] bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
          <i className="ri-shield-cross-line text-2xl" />
        </div>

        <h1 className="mt-5 text-xl font-bold text-[#152238]">
          Access Denied
        </h1>

        <p className="mt-2 text-sm leading-6 text-[#718096]">
          Your current admin role does not have permission to access this
          section.
        </p>

        <div className="mt-5 rounded-xl bg-[#F7F9FC] px-4 py-3 text-left text-sm">
          <p className="text-[#718096]">
            Current role
          </p>

          <p className="mt-1 font-semibold text-[#152238]">
            {role}
          </p>

          {permission && (
            <>
              <p className="mt-3 text-[#718096]">
                Required permission
              </p>

              <p className="mt-1 font-semibold text-[#152238]">
                {permission}
              </p>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => navigate('/dashboard', { replace: true })}
          className="mt-6 h-11 w-full rounded-xl bg-[#FFB21C] px-5 text-sm font-semibold text-[#0B1B2B] transition-colors hover:bg-[#F5A900]"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  )
}

const AdminProtectWrapper = ({ children, permission, tab }) => {
  const navigate = useNavigate()
  const token = getAdminToken()
  const role = getFrontendAdminRole()

  const requiredPermission =
    permission || TAB_PERMISSION_MAP[tab] || null

  const rolePermissions = getRolePermissions(role)

  const hasPermission =
    !requiredPermission ||
    rolePermissions.includes(requiredPermission)

  useEffect(() => {
    if (!token || !isAdminRoleToken(token)) {
      localStorage.removeItem('adminToken')
      navigate('/admin', { replace: true })
      return
    }

    if (!hasPermission) {
      return
    }
  }, [token, navigate, hasPermission])

  if (!token || !isAdminRoleToken(token)) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center p-8 text-neutral-600 text-sm bg-white">
        Redirecting…
      </div>
    )
  }

  if (!hasPermission) {
    return (
      <AccessDenied
        role={role}
        permission={requiredPermission}
      />
    )
  }

  return <>{children}</>
}

export default AdminProtectWrapper