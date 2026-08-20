import React, { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import 'remixicon/fonts/remixicon.css'

const AdminLogin = lazy(() => import('./pages/AdminLogin'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const AdminInfoPage = lazy(() => import('./pages/AdminInfoPage'))
const AdminNotifications = lazy(() => import('./pages/AdminNotifications'))
const AdminVehicles = lazy(() => import('./pages/AdminVehicles'))
const AdminProtectWrapper = lazy(() => import('./pages/AdminProtectWrapper'))

/**
 * Web-only admin console. All UI lives under `/admin` (see README / deploy docs).
 */
const App = () => {
  return (
    <div className="min-h-dvh min-h-screen bg-white text-black">
      <Suspense fallback={<div className="h-screen flex items-center justify-center text-neutral-600 text-sm bg-white">Loading admin…</div>}>
        <Routes>
          <Route path="/" element={<Navigate to="/admin" replace />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={(
              <AdminProtectWrapper>
                <AdminDashboard />
              </AdminProtectWrapper>
            )}
          />
          <Route
            path="/admin/services"
            element={(
              <AdminProtectWrapper>
                <AdminDashboard initialTab="services" />
              </AdminProtectWrapper>
            )}
          />
          <Route
            path="/admin/safety"
            element={(
              <AdminProtectWrapper>
                <AdminDashboard initialTab="safety" />
              </AdminProtectWrapper>
            )}
          />

          <Route
            path="/admin/settings"
            element={(
              <AdminProtectWrapper>
                <AdminDashboard initialTab="settings" />
              </AdminProtectWrapper>
            )}
          />
          <Route
            path="/admin/vehicles"
            element={(
              <AdminProtectWrapper>
                <AdminVehicles />
              </AdminProtectWrapper>
            )}
          />

          <Route
            path="/admin/notifications"
            element={(
              <AdminProtectWrapper>
                <AdminNotifications />
              </AdminProtectWrapper>
            )}
          />
          <Route path="/admin/help" element={<AdminProtectWrapper><AdminInfoPage section="help" /></AdminProtectWrapper>} />
          <Route path="/admin/terms" element={<AdminProtectWrapper><AdminInfoPage section="terms" /></AdminProtectWrapper>} />
          <Route path="/admin/privacy" element={<AdminProtectWrapper><AdminInfoPage section="privacy" /></AdminProtectWrapper>} />
          <Route path="/admin/about" element={<AdminProtectWrapper><AdminInfoPage section="about" /></AdminProtectWrapper>} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </Suspense>
    </div>
  )
}

export default App
