import React from 'react'
import { SecondaryPageShell } from './SecondaryPageShell'
import { useAdminLanguage } from '../../context/AdminLanguageContext'

const settings = [
  { title: 'Profile Settings', description: 'Update admin profile', icon: 'ri-user-settings-line' },
  { title: 'Change Password', description: 'Update admin password', icon: 'ri-lock-password-line' },
  { title: 'Notification Settings', description: 'Configure notifications', icon: 'ri-notification-3-line', action: 'notifications' },
  { title: 'App Settings', description: 'General app configurations', icon: 'ri-settings-3-line' },
  { title: 'Language', description: 'Select preferred language', icon: 'ri-global-line' },
]

export default function SettingsTab ({ onProfile, onChangePassword, onAppSettings, onNotifications, onLanguage, onLogout }) {
  const { t } = useAdminLanguage()
  return (
    <SecondaryPageShell
      title={t.settings}
      subtitle={t.manageAdminPreferences}
      rows={settings.map((item) => ({
        ...item,
        title:
          item.title === 'Profile Settings'
            ? t.profileSettings
            : item.title === 'Change Password'
              ? t.changePassword
              : item.title === 'Notification Settings'
                ? t.notificationSettings
                : item.title === 'App Settings'
                  ? t.appSettings
                  : item.title === 'Language'
                    ? t.language
                    : item.title,
        description:
          item.title === 'Profile Settings'
            ? t.updateAdminProfile
            : item.title === 'Change Password'
              ? t.updateAdminPassword
              : item.title === 'Notification Settings'
                ? t.configureNotifications
                : item.title === 'App Settings'
                  ? t.generalAppConfigurations
                  : item.title === 'Language'
                    ? t.selectPreferredLanguage
                    : item.description,
        onClick:
          item.title === 'Profile Settings'
            ? onProfile
            : item.title === 'Change Password'
              ? onChangePassword
              : item.title === 'App Settings'
                ? onAppSettings
                : item.action === 'notifications'
                  ? onNotifications
                  : item.title === 'Language'
                    ? onLanguage
                    : undefined,
      }))}
    >
      <button type="button" onClick={onLogout} className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#FECACA] bg-white px-4 py-3 text-sm font-bold text-[#EF4444] transition-colors hover:bg-red-50">
        <i className="ri-logout-box-r-line text-lg" />
        {t.logOut}
      </button>
    </SecondaryPageShell>
  )
}
