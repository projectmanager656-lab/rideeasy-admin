import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { apiClient } from '../services/http'
import { formatApiError } from '../utils/apiError'
import { isAdminRoleToken } from '../utils/jwtPayload'
import rideEasyAdminLogo from '../assets/rideeasy-admin-logo-reference.png'

const AdminLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [logoutSuccess, setLogoutSuccess] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (location.state?.logoutSuccess) {
      setLogoutSuccess(true)

      navigate('/admin', {
        replace: true,
        state: {},
      })

      const timer = setTimeout(() => {
        setLogoutSuccess(false)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [location, navigate])
  {logoutSuccess && (
  <div
    className="
      mt-6
      flex
      items-center
      gap-3
      rounded-xl
      border
      border-green-500/30
      bg-green-500/10
      px-4
      py-3
      text-sm
      font-medium
      text-green-300
    "
  >
    <i className="ri-checkbox-circle-fill text-lg" />

    <span>
      Successfully logged out.
    </span>
  </div>
)}

  const submitHandler = async (e) => {
    e.preventDefault()

    setError('')
    setLogoutSuccess(false)

    try {
      setLoading(true)

      const payload = {
        email: String(email || '').trim().toLowerCase(),
        password: String(password || '').trim(),
      }

      const { data } = await apiClient.post('/admin/login', payload)

      const token = data?.token

      if (!token) {
        setError('Invalid response from server')
        return
      }

      if (!isAdminRoleToken(token)) {
        setError('Access denied — admin role required')
        return
      }

      localStorage.setItem('adminToken', token)

      navigate('/admin/dashboard')
    } catch (err) {
      setError(formatApiError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-dvh min-h-screen items-center justify-center bg-[#020914] px-6 py-8 text-white sm:px-8">
      <main className="w-full max-w-[420px] rounded-[24px] border border-[#1D3042] bg-[#06111D] px-6 py-8 shadow-[0_24px_70px_rgba(0,0,0,0.42)] sm:px-9 sm:py-10">

        {/* LOGO */}
        <div className="flex flex-col items-center text-center">
          <Link
            to="/"
            aria-label="RideEasy home"
            className="
              grid
              h-16
              w-16
              place-items-center
              rounded-[18px]
              border-2
              border-[#FFA726]
              bg-[#0B1B2B]
              shadow-[0_0_0_5px_rgba(255,167,38,0.08)]
            "
          >
            <img
              src={rideEasyAdminLogo}
              alt="RideEasy"
              className="h-12 w-12 rounded-xl object-contain"
            />
          </Link>

          <h1 className="mt-5 text-2xl font-bold tracking-tight text-white">
            RideEasy Admin
          </h1>
        </div>

        {/* SUCCESSFUL LOGOUT */}
        {logoutSuccess && (
          <div
            className="
              mt-6
              flex
              items-center
              gap-3
              rounded-xl
              border
              border-[#22C55E]/30
              bg-[#22C55E]/10
              px-4
              py-3
              text-sm
              font-medium
              text-[#86EFAC]
            "
          >
            <i className="ri-checkbox-circle-fill text-lg" />

            <span>
              Successfully logged out.
            </span>
          </div>
        )}

        {/* LOGIN FORM */}
        <form
          onSubmit={submitHandler}
          className="mt-8 space-y-5"
          autoComplete="off"
        >
          {/* EMAIL */}
          <div>
            <label
              htmlFor="rideeasy-admin-email"
              className="mb-2 block text-sm font-medium text-[#CBD5E1]"
            >
              Email address
            </label>

            <input
              id="rideeasy-admin-email"
              type="email"
              name="rideeasy-admin-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@rideeasyride.com"
              autoComplete="off"
              className="
                h-12
                w-full
                rounded-xl
                border
                border-[#294057]
                bg-[#102235]
                px-4
                text-base
                text-white
                outline-none
                placeholder:text-[#94A3B8]
                transition
                focus:border-[#FFA726]
                focus:ring-2
                focus:ring-[#FFA726]/20
              "
              required
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label
              htmlFor="rideeasy-admin-password"
              className="mb-2 block text-sm font-medium text-[#CBD5E1]"
            >
              Password
            </label>

            <input
              id="rideeasy-admin-password"
              type="password"
              name="rideeasy-admin-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="off"
              className="
                h-12
                w-full
                rounded-xl
                border
                border-[#294057]
                bg-[#102235]
                px-4
                text-base
                text-white
                outline-none
                placeholder:text-[#94A3B8]
                transition
                focus:border-[#FFA726]
                focus:ring-2
                focus:ring-[#FFA726]/20
              "
              required
            />
          </div>

          {/* ERROR */}
          {error && (
            <p
              className="
                rounded-xl
                border
                border-[#EF4444]/40
                bg-[#EF4444]/10
                px-3
                py-2.5
                text-sm
                leading-5
                text-[#FCA5A5]
              "
            >
              {error}
            </p>
          )}

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="
              flex
              h-12
              w-full
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-[#FFA726]
              px-4
              text-base
              font-bold
              text-[#06111D]
              shadow-[0_8px_18px_rgba(255,167,38,0.18)]
              transition
              hover:bg-[#FFB74D]
              active:translate-y-px
              active:bg-[#F59E0B]
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {loading && (
              <i className="ri-loader-4-line animate-spin text-lg" />
            )}

            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* SECURITY */}
        <div className="mt-7 flex items-center justify-center gap-2 text-sm text-[#94A3B8]">
          <i className="ri-shield-check-line text-base text-[#FFA726]" />

          <span>
            Secure admin access
          </span>
        </div>

        {/* BACK */}
        <Link
          to="/"
          className="mt-6 block text-center text-xs text-[#64748B] hover:text-[#CBD5E1]"
        >
          Back to home
        </Link>
      </main>
    </div>
  )
}

export default AdminLogin