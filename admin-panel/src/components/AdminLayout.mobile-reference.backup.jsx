import React, { useState } from 'react'
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'
import AdminMobileNav from './AdminMobileNav'

const AdminLayout = ({ tab, setTab, onRefresh, onLogout, emergencyAlerts, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="admin-shell min-h-dvh min-h-screen bg-[#FAFAFA] text-[#111827]">
      <AdminSidebar tab={tab} setTab={setTab} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      <div className="admin-main-panel flex min-h-screen flex-1 flex-col lg:ml-[280px]">
        <AdminHeader
          onRefresh={onRefresh}
          onLogout={onLogout}
          emergencyAlerts={emergencyAlerts}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />

        <main className="admin-main-content flex-1 overflow-y-auto bg-[#F7F9FC] pb-[78px] lg:pb-0">
          <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
        <AdminMobileNav tab={tab} setTab={setTab} />
      </div>
    </div>
  )
}

export default AdminLayout
