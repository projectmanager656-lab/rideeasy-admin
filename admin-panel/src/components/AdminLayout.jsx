import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'
import ConfirmationDialog from './ui/ConfirmationDialog'

const AdminLayout = ({
  tab,
  setTab,
  onRefresh,
  onLogout,
  emergencyAlerts,
  children,
}) => {
  const navigate = useNavigate()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const requestLogout = () => {
    console.log('LOGOUT CONFIRMATION OPEN')

    setShowLogoutConfirm(true)
  }

  const confirmLogout = () => {
    console.log('LOGOUT CONFIRMED')

    setShowLogoutConfirm(false)

    // Clear admin session
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminRole')

    // Clear parent state if supplied
    if (typeof onLogout === 'function') {
      onLogout()
    }

    // Go to login page
    navigate('/admin', {
      replace: true,
      state: {
        logoutSuccess: true,
      },
    })
  }

  return (
    <>
      <div className="admin-shell min-h-dvh min-h-screen w-full bg-[#F7F9FC] text-[#111827]">

        {/* SIDEBAR */}
        <AdminSidebar
          tab={tab}
          setTab={setTab}
          onLogout={requestLogout}
        />

        {/* MAIN PANEL */}
        <div className="admin-main-panel flex min-h-dvh min-h-screen flex-1 flex-col md:ml-[260px]">

          {/* HEADER */}
          <AdminHeader
            onRefresh={onRefresh}
            onLogout={requestLogout}
            emergencyAlerts={emergencyAlerts}
          />

          {/* PAGE CONTENT */}
          <main
            id="admin-main-content"
            className="
              flex-1
              overflow-y-auto
              bg-[#F7F9FC]
            "
          >
            <div className="mx-auto w-full max-w-[1600px] px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* ONE LOGOUT CONFIRMATION */}
      <ConfirmationDialog
        open={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={confirmLogout}
        title="Confirm Logout"
        message="Are you sure you want to logout from the RideEasy Admin Panel?"
        confirmLabel="Logout"
        cancelLabel="Cancel"
        variant="danger"
      />
    </>
  )
}

export default AdminLayout