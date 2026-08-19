import React from 'react'
import { SecondaryPageShell } from './SecondaryPageShell'

const settings = [
  { title: 'Profile Settings', description: 'Update admin profile', icon: 'ri-user-settings-line' },
  { title: 'Change Password', description: 'Update admin password', icon: 'ri-lock-password-line' },
  { title: 'Notification Settings', description: 'Configure notifications', icon: 'ri-notification-3-line', action: 'notifications' },
  { title: 'App Settings', description: 'General app configurations', icon: 'ri-settings-3-line' },
  { title: 'Language', description: 'Select preferred language', icon: 'ri-global-line' },
]

export default function SettingsTab ({ onNotifications, onLogout }) {
  return (
    <SecondaryPageShell
      title="Settings"
      subtitle="Manage admin preferences"
      rows={settings.map((item) => ({
        ...item,
        onClick: item.action === 'notifications' ? onNotifications : undefined,
      }))}
    >
      <button type="button" onClick={onLogout} className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#FECACA] bg-white px-4 py-3 text-sm font-bold text-[#EF4444] transition-colors hover:bg-red-50">
        <i className="ri-logout-box-r-line text-lg" />
        Log Out
      </button>
    </SecondaryPageShell>
  )
}
