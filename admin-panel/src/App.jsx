import React, { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
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

const ProtectedDashboard = ({ tab }) => (
  <AdminProtectWrapper tab={tab}>
    <AdminDashboard initialTab={tab} />
  </AdminProtectWrapper>
)
const ProtectedInfoPage = ({ tab, title }) => (
  <AdminProtectWrapper>
    <AdminInfoPage tab={tab} title={title} />
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
            element={<AdminVehicles />}
          />

          <Route
            path="/vehicles"
            element={<AdminVehicles />}
          />

          {/* =====================================================
              VERIFICATION
          ====================================================== */}
          <Route
            path="/admin/verification"
            element={<AdminVerification />}
          />

          <Route
            path="/verification"
            element={<AdminVerification />}
          />

          {/* =====================================================
              LIVE OPERATIONS
          ====================================================== */}
         <Route
  path="/admin/live-operations"
  element={<ProtectedDashboard tab="live-operations" />}
/>

<Route
  path="/live-operations"
  element={<ProtectedDashboard tab="live-operations" />}
/>          

          {/* =====================================================
              FINANCE
          ====================================================== */}
         <Route
  path="/admin/finance"
  element={<ProtectedDashboard tab="finance" />}
/>

<Route
  path="/finance"
  element={<ProtectedDashboard tab="finance" />}
/>

          {/* =====================================================
              PAYMENTS
          ====================================================== */}
          <Route
            path="/admin/payments"
            element={
              <ProtectedDashboard tab="payments" />
            }
          />

          <Route
            path="/payments"
            element={
              <ProtectedDashboard tab="payments" />
            }
          />

          {/* =====================================================
              SOS
          ====================================================== */}
          <Route
            path="/admin/sos"
            element={
              <ProtectedDashboard tab="sos" />
            }
          />

          <Route
            path="/sos"
            element={
              <ProtectedDashboard tab="sos" />
            }
          />

          {/* =====================================================
              SUPPORT
          ====================================================== */}
          <Route
            path="/admin/support"
            element={
              <ProtectedDashboard tab="support" />
            }
          />

          <Route
            path="/support"
            element={
              <ProtectedDashboard tab="support" />
            }
          />

          {/* =====================================================
              REPORTS
          ====================================================== */}
          <Route
            path="/admin/reports"
            element={
              <ProtectedDashboard tab="reports" />
            }
          />

          <Route
            path="/reports"
            element={
              <ProtectedDashboard tab="reports" />
            }
          />

          {/* =====================================================
              ROLES & PERMISSIONS
          ====================================================== */}
          <Route
            path="/admin/roles"
            element={<AdminRoles />}
          />

          <Route
            path="/roles"
            element={<AdminRoles />}
          />

          {/* =====================================================
              SERVICES
          ====================================================== */}
          <Route
            path="/admin/services"
            element={
              <ProtectedDashboard tab="services" />
            }
          />

          {/* =====================================================
              PRICING
          ====================================================== */}
          <Route
            path="/admin/pricing"
            element={
              <ProtectedDashboard tab="pricing" />
            }
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

          <Route
            path="/profile"
            element={
              <AdminProtectWrapper>
                <AdminProfile />
              </AdminProtectWrapper>
            }
          />

          {/* =====================================================
              SETTINGS
          ====================================================== */}
          <Route
            path="/admin/settings"
            element={
              <ProtectedDashboard tab="settings" />
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedDashboard tab="settings" />
            }
          />

          {/* =====================================================
              NOTIFICATIONS
          ====================================================== */}
          <Route
            path="/admin/notifications"
            element={<AdminNotifications />}
          />

          {/* =====================================================
              SAFETY
          ====================================================== */}
          <Route
            path="/admin/safety"
            element={
              <ProtectedDashboard tab="safety" />
            }
          />

          {/* =====================================================
              HELP
          ====================================================== */}
          <Route
            path="/admin/help"
            element={
              <ProtectedInfoPage
                tab="help"
                title="Help & Support"
              />
            }
          />

          {/* =====================================================
              TERMS
          ====================================================== */}
          <Route
            path="/admin/terms"
            element={
              <ProtectedInfoPage
                tab="terms"
                title="Terms & Conditions"
              />
            }
          />

          {/* =====================================================
              PRIVACY
          ====================================================== */}
          <Route
            path="/admin/privacy"
            element={
              <ProtectedInfoPage
                tab="privacy"
                title="Privacy Policy"
              />
            }
          />

          {/* =====================================================
              ABOUT
          ====================================================== */}
          <Route
            path="/admin/about"
            element={
              <ProtectedInfoPage
                tab="about"
                title="About RideEasy"
              />
            }
          />

          {/* =====================================================
              FALLBACK
          ====================================================== */}
          <Route
            path="*"
            element={<Navigate to="/admin" replace />}
          />

        </Routes>
      </Suspense>
    </div>
  )
}

export default App
