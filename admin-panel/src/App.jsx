import React, { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import 'remixicon/fonts/remixicon.css'

const AdminLogin = lazy(() => import('./pages/AdminLogin'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const AdminInfoPage = lazy(() => import('./pages/AdminInfoPage'))
const AdminNotifications = lazy(() => import('./pages/AdminNotifications'))
const AdminVehicles = lazy(() => import('./pages/AdminVehicles'))
const AdminVerification = lazy(() => import('./pages/AdminVerification'))
const AdminProtectWrapper = lazy(() => import('./pages/AdminProtectWrapper'))

const AdminFinance = lazy(() => import('./pages/AdminFinance'))
const AdminLiveOperations = lazy(() => import('./pages/AdminLiveOperations'))
const AdminRoles = lazy(() => import('./pages/AdminRoles'))

const ProtectedDashboard = ({ tab }) => (
  <AdminProtectWrapper>
    <AdminDashboard initialTab={tab} />
  </AdminProtectWrapper>
)

const App = () => {
  return (
    <div className="min-h-dvh min-h-screen bg-white text-black">
      <Suspense
        fallback={
          <div className="flex h-screen items-center justify-center bg-white text-sm text-neutral-600">
            Loading admin…
          </div>
        }
      >
        <Routes>
          {/* LOGIN */}
          <Route path="/" element={<Navigate to="/admin" replace />} />
          <Route path="/login" element={<Navigate to="/admin" replace />} />
          <Route path="/admin" element={<AdminLogin />} />

          {/* DASHBOARD */}
          <Route
            path="/admin/dashboard"
            element={<ProtectedDashboard tab="analytics" />}
          />
          <Route
            path="/dashboard"
            element={<ProtectedDashboard tab="analytics" />}
          />

          {/* USERS */}
          <Route
            path="/admin/users"
            element={<ProtectedDashboard tab="users" />}
          />
          <Route
            path="/users"
            element={<ProtectedDashboard tab="users" />}
          />

          {/* DRIVERS */}
          <Route
            path="/admin/drivers"
            element={<ProtectedDashboard tab="drivers" />}
          />
          <Route
            path="/drivers"
            element={<ProtectedDashboard tab="drivers" />}
          />

             {/* RIDES */}
<Route
  path="/admin/rides"
  element={<ProtectedDashboard tab="rides" />}
/>
<Route
  path="/rides"
  element={<ProtectedDashboard tab="rides" />}
/>
             {/* VEHICLES */}
<Route
  path="/admin/vehicles"
  element={
    <AdminProtectWrapper>
      <AdminVehicles />
    </AdminProtectWrapper>
  }
/>

<Route
  path="/vehicles"
  element={
    <AdminProtectWrapper>
      <AdminVehicles />
    </AdminProtectWrapper>
  }
/>

{/* VERIFICATION */}
<Route
  path="/admin/verification"
  element={
    <AdminProtectWrapper>
      <AdminVerification />
    </AdminProtectWrapper>
  }
/>

<Route
  path="/verification"
  element={
    <AdminProtectWrapper>
      <AdminVerification />
    </AdminProtectWrapper>
  }
/>
          {/* LIVE OPERATIONS */}
          <Route
            path="/admin/live-operations"
            element={<ProtectedDashboard tab="live-operations" />}
          />
          <Route
            path="/live-operations"
            element={<ProtectedDashboard tab="live-operations" />}
          />
          {/* FINANCE */}
<Route
  path="/admin/finance"
  element={<ProtectedDashboard tab="finance" />}
/>

<Route
  path="/finance"
  element={<ProtectedDashboard tab="finance" />}
/>
          {/* PAYMENTS */}
          <Route
            path="/admin/payments"
            element={<ProtectedDashboard tab="payments" />}
          />
          <Route
            path="/payments"
            element={<ProtectedDashboard tab="payments" />}
          />

          {/* SOS */}
          <Route
            path="/admin/sos"
            element={<ProtectedDashboard tab="safety" />}
          />
          <Route
            path="/sos"
            element={<ProtectedDashboard tab="safety" />}
          />

          {/* SUPPORT */}
          <Route
            path="/admin/support"
            element={<ProtectedDashboard tab="complaints" />}
          />
          <Route
            path="/support"
            element={<ProtectedDashboard tab="complaints" />}
          />

          {/* REPORTS */}
          <Route
            path="/admin/reports"
            element={<ProtectedDashboard tab="reports" />}
          />
          <Route
            path="/reports"
            element={<ProtectedDashboard tab="reports" />}
          />

          {/* ROLES & PERMISSIONS */}
          <Route
            path="/admin/roles"
            element={
              <AdminProtectWrapper>
                <AdminRoles />
              </AdminProtectWrapper>
            }
          />
          <Route
            path="/roles"
            element={
              <AdminProtectWrapper>
                <AdminRoles />
              </AdminProtectWrapper>
            }
          />

          {/* SERVICES */}
          <Route
            path="/admin/services"
            element={<ProtectedDashboard tab="services" />}
          />

          {/* PRICING / FINANCE SUPPORT */}
          <Route
            path="/admin/pricing"
            element={<ProtectedDashboard tab="pricing" />}
          />

          {/* SETTINGS */}
          <Route
            path="/admin/settings"
            element={<ProtectedDashboard tab="settings" />}
          />
          <Route
            path="/settings"
            element={<ProtectedDashboard tab="settings" />}
          />

          {/* NOTIFICATIONS */}
          <Route
            path="/admin/notifications"
            element={
              <AdminProtectWrapper>
                <AdminNotifications />
              </AdminProtectWrapper>
            }
          />

          {/* SAFETY */}
          <Route
            path="/admin/safety"
            element={<ProtectedDashboard tab="safety" />}
          />

          {/* INFO PAGES */}
          <Route
            path="/admin/help"
            element={
              <AdminProtectWrapper>
                <AdminInfoPage section="help" />
              </AdminProtectWrapper>
            }
          />

          <Route
            path="/admin/terms"
            element={
              <AdminProtectWrapper>
                <AdminInfoPage section="terms" />
              </AdminProtectWrapper>
            }
          />

          <Route
            path="/admin/privacy"
            element={
              <AdminProtectWrapper>
                <AdminInfoPage section="privacy" />
              </AdminProtectWrapper>
            }
          />

          <Route
            path="/admin/about"
            element={
              <AdminProtectWrapper>
                <AdminInfoPage section="about" />
              </AdminProtectWrapper>
            }
          />

          {/* FALLBACK */}
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </Suspense>
    </div>
  )
}

export default App
