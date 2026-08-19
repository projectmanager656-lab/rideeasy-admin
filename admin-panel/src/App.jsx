import React, { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import 'remixicon/fonts/remixicon.css'

const AdminLogin = lazy(() => import('./pages/AdminLogin'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
<<<<<<< Updated upstream
=======
const ServicesPage = lazy(() => import('./pages/Services'))
const AdminNotifications = lazy(() => import('./pages/AdminNotifications'))
const AdminVehicles = lazy(() => import('./pages/AdminVehicles'))
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
=======
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
            path="/services"
            element={(
              <AdminProtectWrapper>
                <ServicesPage />
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
>>>>>>> Stashed changes
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </Suspense>
    </div>
  )
}

export default App
