import React, { Suspense, lazy } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import 'remixicon/fonts/remixicon.css'

const AdminLogin = lazy(() => import('./pages/AdminLogin'))
const AdminOtp = lazy(() => import('./pages/AdminOtp'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const AdminInfoPage = lazy(() => import('./pages/AdminInfoPage'))
const AdminNotifications = lazy(() => import('./pages/AdminNotifications'))
const AdminVehicles = lazy(() => import('./pages/AdminVehicles'))
const AdminVerification = lazy(() => import('./pages/AdminVerification'))
const AdminProtectWrapper = lazy(() => import('./pages/AdminProtectWrapper'))
const AdminProfile = lazy(() => import('./pages/AdminProfile'))

const AdminFinance = lazy(() => import('./pages/AdminFinance'))
const AdminLiveOperations = lazy(() => import('./pages/AdminLiveOperations'))
const AdminRoles = lazy(() => import('./pages/AdminRoles'))

import AdminLayout from './components/AdminLayout'

const ProtectedDashboard = ({ tab }) => (
  <AdminProtectWrapper>
    <AdminDashboard initialTab={tab} />
  </AdminProtectWrapper>
)

/*
 * Standalone admin pages must also have AdminLayout.
 * Otherwise the page opens without sidebar/bottom navigation.
 */
const StandaloneAdminPage = ({ tab, children }) => {
  const navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem('adminToken')
    navigate('/admin', { replace: true })
  }

  return (
    <AdminProtectWrapper>
      <AdminLayout
        tab={tab}
        setTab={() => {}}
        onRefresh={() => window.location.reload()}
        onLogout={logout}
        emergencyAlerts={[]}
      >
        {children}
      </AdminLayout>
    </AdminProtectWrapper>
  )
}

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

          {/* =====================================================
              LOGIN
          ====================================================== */}

          <Route
            path="/"
            element={<Navigate to="/admin" replace />}
          />

          <Route
            path="/login"
            element={<Navigate to="/admin" replace />}
          />

          <Route
            path="/admin"
            element={<AdminLogin />}
          />

          <Route
            path="/admin/otp"
            element={<AdminOtp />}
          />

          {/* =====================================================
              DASHBOARD
          ====================================================== */}

          <Route
            path="/admin/dashboard"
            element={<ProtectedDashboard tab="analytics" />}
          />

          <Route
            path="/dashboard"
            element={<ProtectedDashboard tab="analytics" />}
          />

          {/* =====================================================
              USERS
          ====================================================== */}

          <Route
            path="/admin/users"
            element={<ProtectedDashboard tab="users" />}
          />

          <Route
            path="/users"
            element={<ProtectedDashboard tab="users" />}
          />

          {/* =====================================================
              DRIVERS
          ====================================================== */}

          <Route
            path="/admin/drivers"
            element={<ProtectedDashboard tab="drivers" />}
          />

          <Route
            path="/drivers"
            element={<ProtectedDashboard tab="drivers" />}
          />

          {/* =====================================================
              RIDES
          ====================================================== */}

          <Route
            path="/admin/rides"
            element={<ProtectedDashboard tab="rides" />}
          />

          <Route
            path="/rides"
            element={<ProtectedDashboard tab="rides" />}
          />

          {/* =====================================================
              VEHICLES
          ====================================================== */}

          <Route
            path="/admin/vehicles"
            element={
              <StandaloneAdminPage tab="vehicles">
                <AdminVehicles />
              </StandaloneAdminPage>
            }
          />

          <Route
            path="/vehicles"
            element={
              <StandaloneAdminPage tab="vehicles">
                <AdminVehicles />
              </StandaloneAdminPage>
            }
          />

          {/* =====================================================
              VERIFICATION
          ====================================================== */}

          <Route
            path="/admin/verification"
            element={
              <StandaloneAdminPage tab="verification">
                <AdminVerification />
              </StandaloneAdminPage>
            }
          />

          <Route
            path="/verification"
            element={
              <StandaloneAdminPage tab="verification">
                <AdminVerification />
              </StandaloneAdminPage>
            }
          />

          {/* =====================================================
              LIVE OPERATIONS
          ====================================================== */}

          <Route
            path="/admin/live-operations"
            element={
              <StandaloneAdminPage tab="live-operations">
                <AdminLiveOperations />
              </StandaloneAdminPage>
            }
          />

          <Route
            path="/live-operations"
            element={
              <StandaloneAdminPage tab="live-operations">
                <AdminLiveOperations />
              </StandaloneAdminPage>
            }
          />

          {/* =====================================================
              FINANCE
          ====================================================== */}

          <Route
            path="/admin/finance"
            element={
              <StandaloneAdminPage tab="finance">
                <AdminFinance />
              </StandaloneAdminPage>
            }
          />

          <Route
            path="/finance"
            element={
              <StandaloneAdminPage tab="finance">
                <AdminFinance />
              </StandaloneAdminPage>
            }
          />

          {/* =====================================================
              PAYMENTS
          ====================================================== */}

          <Route
            path="/admin/payments"
            element={<ProtectedDashboard tab="payments" />}
          />

          <Route
            path="/payments"
            element={<ProtectedDashboard tab="payments" />}
          />

          {/* =====================================================
              SOS
          ====================================================== */}

          <Route
  path="/admin/sos"
  element={<ProtectedDashboard tab="sos" />}
/>

<Route
  path="/sos"
  element={<ProtectedDashboard tab="sos" />}
/>

          {/* =====================================================
              SUPPORT
          ====================================================== */}

          <Route
  path="/admin/support"
  element={<ProtectedDashboard tab="support" />}
/>

<Route
  path="/support"
  element={<ProtectedDashboard tab="support" />}
/>
          {/* =====================================================
              REPORTS
          ====================================================== */}

          <Route
            path="/admin/reports"
            element={<ProtectedDashboard tab="reports" />}
          />

          <Route
            path="/reports"
            element={<ProtectedDashboard tab="reports" />}
          />

          {/* =====================================================
              NOTIFICATIONS
          ====================================================== */}

<Route
  path="/admin/notifications"
  element={
    <StandaloneAdminPage tab="notifications">
      <AdminNotifications />
    </StandaloneAdminPage>
  }
/>
<Route
  path="/notifications"
  element={
    <StandaloneAdminPage tab="notifications">
      <AdminNotifications />
    </StandaloneAdminPage>
  }
/>
          {/* =====================================================
              ROLES
          ====================================================== */}

          <Route
            path="/admin/roles"
            element={
              <StandaloneAdminPage tab="roles">
                <AdminRoles />
              </StandaloneAdminPage>
            }
          />

          <Route
            path="/roles"
            element={
              <StandaloneAdminPage tab="roles">
                <AdminRoles />
              </StandaloneAdminPage>
            }
          />

          {/* =====================================================
              SERVICES
          ====================================================== */}

          <Route
            path="/admin/services"
            element={<ProtectedDashboard tab="services" />}
          />

          <Route
            path="/services"
            element={<ProtectedDashboard tab="services" />}
          />

          {/* =====================================================
              PRICING
          ====================================================== */}

          <Route
            path="/admin/pricing"
            element={<ProtectedDashboard tab="pricing" />}
          />

          <Route
            path="/pricing"
            element={<ProtectedDashboard tab="pricing" />}
          />

          {/* =====================================================
              SETTINGS
          ====================================================== */}

          <Route
            path="/admin/settings"
            element={<ProtectedDashboard tab="settings" />}
          />

          <Route
            path="/settings"
            element={<ProtectedDashboard tab="settings" />}
          />

          {/* =====================================================
              PROFILE
          ====================================================== */}

          <Route
            path="/admin/profile"
            element={
              <AdminProtectWrapper>
                <AdminProfile />
              </AdminProtectWrapper>
            }
          />

          {/* =====================================================
              FALLBACK
          ====================================================== */}

          <Route
            path="*"
            element={<Navigate to="/admin/dashboard" replace />}
          />

        </Routes>
      </Suspense>
    </div>
  )
}

export default App
