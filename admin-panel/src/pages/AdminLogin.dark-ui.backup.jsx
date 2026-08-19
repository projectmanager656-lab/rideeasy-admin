import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiClient } from '../services/http'
import { formatApiError } from '../utils/apiError'
import { isAdminRoleToken } from '../utils/jwtPayload'

const AdminLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const submitHandler = async (e) => {
    e.preventDefault()
    setError('')
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
    <div className="min-h-dvh min-h-screen bg-[#FAFAFA] p-4 text-[#111827] sm:p-6 lg:grid lg:place-items-center">
      <div className="mx-auto grid w-full max-w-5xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden bg-[#111827] p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="grid h-12 w-12 place-items-center overflow-hidden rounded-xl bg-white shadow-sm"><img src="/icons/logo.jpg" alt="RideEasy" className="h-full w-full object-cover" /></div>
            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">RideEasy</p>
            <h1 className="mt-3 text-4xl font-bold leading-tight">Manage every route with clarity.</h1>
            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-300">A focused operations workspace for riders, drivers, fares, and the day-to-day movement of your city.</p>
          </div>
          <p className="text-xs text-slate-400">Secure administrator access</p>
        </section>
        <section className="w-full p-6 sm:p-8 lg:p-10">
        <Link to="/" className="inline-flex items-center gap-2 text-lg font-bold text-[#111827] lg:hidden"><span className="grid h-8 w-8 place-items-center overflow-hidden rounded-lg bg-white shadow-sm"><img src="/icons/logo.jpg" alt="RideEasy" className="h-full w-full object-cover" /></span>RideEasy</Link>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-[#6B7280]">Administrator access</p>
        <h1 className="mb-2 mt-2 text-2xl font-bold text-[#111827]">Welcome back</h1>
        <p className="mb-7 text-sm text-[#6B7280]">Sign in with your administrator credentials.</p>
        <form onSubmit={submitHandler} className="space-y-4" autoComplete="off">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#111827]">Email</label>
            <input
              type="email"
              name="rideeasy-admin-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="off"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-[#111827] outline-none placeholder:text-slate-400 focus:border-[#FFA726] focus:ring-2 focus:ring-[#FFA726]/20"
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#111827]">Password</label>
            <input
              type="password"
              name="rideeasy-admin-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="off"
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-[#111827] outline-none placeholder:text-slate-500 focus:border-[#FFA726] focus:ring-2 focus:ring-[#FFA726]/20"
              required
            />
          </div>
          {error && <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-[#E5484D]">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#FFA726] py-2.5 font-semibold text-[#111827] shadow-sm transition hover:bg-[#ffb74d] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <Link to="/" className="mt-5 block text-center text-sm font-medium text-[#6B7280] transition-colors hover:text-[#111827]">Back to home</Link>
        </section>
      </div>
    </div>
  )
}

export default AdminLogin
