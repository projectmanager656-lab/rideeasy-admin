import React from 'react'
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'
import BottomNav from './BottomNav'

const AdminLayout = ({
  tab,
  setTab,
  onRefresh,
  onLogout,
  emergencyAlerts,
  children,
}) => {
  return (
    <div className="admin-shell flex min-h-dvh min-h-screen w-full bg-[#F7F9FC] text-[#152238]">
      {/* Desktop Sidebar */}
      <AdminSidebar
        tab={tab}
        setTab={setTab}
      />

      {/* Main Area */}
      <div className="admin-main-panel flex min-h-screen min-w-0 flex-1 flex-col">
        <AdminHeader
          onRefresh={onRefresh}
          onLogout={onLogout}
          tab={tab}
          emergencyAlerts={emergencyAlerts}
        />

        <main
          id="admin-main-content"
          className="admin-main-content min-w-0 flex-1 overflow-y-auto bg-[#F7F9FC] pb-[96px] md:pb-0"
        >
          <div className="mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7">
            {children}
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <BottomNav
          tab={tab}
          setTab={setTab}
          onLogout={onLogout}
        />
      </div>
    </div>
  )
}

export default AdminLayout
