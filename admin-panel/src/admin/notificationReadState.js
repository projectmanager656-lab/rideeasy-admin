const STORAGE_KEY = 'rideeasyAdminReadEmergencyAlerts'
const CHANGE_EVENT = 'rideeasy:notifications-read'

export function getReadAlertIds () {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    return new Set(Array.isArray(value) ? value.map(String) : [])
  } catch {
    return new Set()
  }
}

function persist (ids) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]))
  window.dispatchEvent(new Event(CHANGE_EVENT))
}

export function markAlertRead (id) {
  const ids = getReadAlertIds()
  ids.add(String(id))
  persist(ids)
}

export function markAlertsRead (alerts) {
  const ids = getReadAlertIds()
  alerts.forEach((alert) => ids.add(String(alert._id)))
  persist(ids)
}

export function isAlertUnread (alert, readIds = getReadAlertIds()) {
  return alert?._id != null && !readIds.has(String(alert._id))
}

export { CHANGE_EVENT }
