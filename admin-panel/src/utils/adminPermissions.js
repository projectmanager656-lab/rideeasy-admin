// Frontend permission definitions for Admin navigation.
// Backend authorization remains the source of truth.

export const ADMIN_ROLES = {
  SUPER_ADMIN: 'Super Admin',
  OPERATIONS: 'Operations',
  SUPPORT: 'Support',
}

export const ADMIN_PERMISSIONS = {
  DASHBOARD: 'Dashboard',
  USERS: 'Users',
  DRIVERS: 'Drivers',
  VEHICLES: 'Vehicles',
  VERIFICATION: 'Verification',
  RIDES: 'Rides',
  LIVE_OPERATIONS: 'Live Operations',
  FINANCE: 'Finance',
  PAYMENTS: 'Payments',
  SOS: 'SOS',
  SUPPORT: 'Support',
  REPORTS: 'Reports',
  NOTIFICATIONS: 'Notifications',
  ROLES: 'Roles',
  SETTINGS: 'Settings',
    FARE_CONFIGURATION: 'Fare Configuration',
}

export const ROLE_PERMISSIONS = {
  [ADMIN_ROLES.SUPER_ADMIN]: [
    ADMIN_PERMISSIONS.DASHBOARD,
    ADMIN_PERMISSIONS.USERS,
    ADMIN_PERMISSIONS.DRIVERS,
    ADMIN_PERMISSIONS.VEHICLES,
    ADMIN_PERMISSIONS.VERIFICATION,
    ADMIN_PERMISSIONS.RIDES,
    ADMIN_PERMISSIONS.LIVE_OPERATIONS,
    ADMIN_PERMISSIONS.FINANCE,
    ADMIN_PERMISSIONS.PAYMENTS,
    ADMIN_PERMISSIONS.SOS,
    ADMIN_PERMISSIONS.SUPPORT,
    ADMIN_PERMISSIONS.REPORTS,
    ADMIN_PERMISSIONS.NOTIFICATIONS,
    ADMIN_PERMISSIONS.ROLES,
    ADMIN_PERMISSIONS.SETTINGS,
    ADMIN_PERMISSIONS.FARE_CONFIGURATION,
  ],

  [ADMIN_ROLES.OPERATIONS]: [
    ADMIN_PERMISSIONS.DASHBOARD,
    ADMIN_PERMISSIONS.DRIVERS,
    ADMIN_PERMISSIONS.VEHICLES,
    ADMIN_PERMISSIONS.VERIFICATION,
    ADMIN_PERMISSIONS.RIDES,
    ADMIN_PERMISSIONS.LIVE_OPERATIONS,
  ],

  [ADMIN_ROLES.SUPPORT]: [
    ADMIN_PERMISSIONS.DASHBOARD,
    ADMIN_PERMISSIONS.USERS,
    ADMIN_PERMISSIONS.DRIVERS,
    ADMIN_PERMISSIONS.RIDES,
    ADMIN_PERMISSIONS.SUPPORT,
    ADMIN_PERMISSIONS.NOTIFICATIONS,
  ],
}

export function getRolePermissions(role) {
  if (!role) return []

  return ROLE_PERMISSIONS[role] || []
}

export function hasAdminPermission(role, permission) {
  return getRolePermissions(role).includes(permission)
}

export function canAccessAdminRoute(role, permission) {
  return hasAdminPermission(role, permission)
}

export function getAllowedAdminNavigation(role, navigationItems) {
  const permissions = getRolePermissions(role)

  return navigationItems.filter((item) =>
    permissions.includes(item.permission)
  )
}
