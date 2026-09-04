import React, { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
// import InstallPWAButton from './components/InstallPWAButton'
// import BottomNav from './components/BottomNav'
// import NativeAndroidFlavorRedirect from './components/NativeAndroidFlavorRedirect'
// import { getCaptainToken } from './utils/authTokens'
import 'remixicon/fonts/remixicon.css'
// import DriverHome from './pages/CaptainHome'

const Captainlogin = lazy(() => import('./pages/Captainlogin'))
const CaptainSignup = lazy(() => import('./pages/CaptainSignup'))

const CaptainWelcome = lazy(() => import('./pages/DriverWelcome'))
const DriverOnboarding = lazy(() => import('./pages/DriverOnboarding'))
const DriverDocuments = lazy(() => import('./pages/DriverDocuments'))

// Driving Licence
const DriverLicense = lazy(() => import('./pages/DriverLicense'))

const VehicleInformation = lazy(() => import('./pages/VehicleInformation'))
// vehicle Insurance
const Insurance = lazy(() => import('./pages/VehicleInsurance'))

const DriverApproval = lazy(() => import('./pages/DriverApproval'))

const CaptainHome = lazy(() => import('./pages/CaptainHome'))
const CaptainProtectWrapper = lazy(() => import('./pages/CaptainProtectWrapper'))
const CaptainLogout = lazy(() => import('./pages/CaptainLogout'))
const CaptainRiding = lazy(() => import('./pages/CaptainRiding'))
const CaptainRideComplete = lazy(() => import('./pages/CaptainRideComplete'))
const CaptainRideHistory = lazy(() => import('./pages/CaptainRideHistory'))
const CaptainEarnings = lazy(() => import('./pages/DriverEarnings'))
const CaptainProfile = lazy(() => import('./pages/DriverProfile'))
const DriverPlans = lazy(() => import('./pages/DriverPlans'))


const DriverAppRoot = () => {
  return <Navigate to="/captain-home" replace />
}

const App = () => {
  return (
    <div className="driver-page min-h-screen w-full pb-[calc(3.5rem+env(safe-area-inset-bottom,0px))] sm:pb-20">
      {/* <NativeAndroidFlavorRedirect /> */}
      <Suspense fallback={<div className="h-screen flex items-center justify-center text-zinc-400 text-sm bg-black">Loading RideEasy Driver…</div>}>
        <Routes>
          <Route path="/" element={<DriverAppRoot />} />
          <Route path="/captain-welcome" element={<CaptainWelcome />} />
          <Route path="/captain-onboarding" element={<DriverOnboarding />} />
          <Route path="/captain-documents" element={<DriverDocuments />} />
          <Route path="/captain-license" element={<DriverLicense />} />
          <Route path="/vehicle-information" element={<VehicleInformation />} />
          <Route path="/insurance" element={<Insurance />}/>
          <Route path="/captain-approval" element={<DriverApproval />}/>
          <Route path="/captain-login" element={<Captainlogin />} />
          <Route path="/captain-signup" element={<CaptainSignup />} />
          <Route path="/captain-home" element={<CaptainHome />} />
          <Route path="/captain-riding" element={<CaptainRiding />} />
          <Route path="/captain-ride-complete" element={<CaptainRideComplete />} />
          <Route path="/captain-history" element={<CaptainRideHistory />} />
          <Route path="/history" element={<CaptainRideHistory />} />
          <Route path="/captain-earning" element={<CaptainEarnings />} />
          <Route path="/captain-profile" element={<CaptainProfile />} />
          <Route path="/captain-plan" element={<DriverPlans />} />
          <Route path="/captain/logout" element={<CaptainProtectWrapper><CaptainLogout /></CaptainProtectWrapper>} />
        </Routes>
      </Suspense>
      {/* <InstallPWAButton /> */}

    </div>
  )
}

export default App
