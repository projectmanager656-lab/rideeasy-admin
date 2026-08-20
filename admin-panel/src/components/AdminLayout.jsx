import React from 'react'
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'
import BottomNav from './BottomNav'

const AdminLayout = ({ tab, setTab, onRefresh, onLogout, emergencyAlerts, children }) => {
  return (
    <div className="admin-shell min-h-dvh min-h-screen bg-[#FAFAFA] text-[#111827]">
      <AdminSidebar tab={tab} setTab={setTab} />

      <div className="admin-main-panel flex min-h-screen flex-1 flex-col md:ml-[260px]">
        <AdminHeader
          onRefresh={onRefresh}
          onLogout={onLogout}
          tab={tab}
          emergencyAlerts={emergencyAlerts}
        />

        <main id="admin-main-content" className="admin-main-content flex-1 overflow-y-auto bg-[#F7F9FC] pb-[88px] md:pb-0">
          <div className="mx-auto w-full max-w-[1600px] px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
            {children}
          </div>
        </main>

        <BottomNav tab={tab} setTab={setTab} onLogout={onLogout} />
      </div>
    </div>
  )
}

export default AdminLayout
