import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import rideEasyAdminLogo from '../assets/rideeasy-admin-logo-reference.png'

const OTP_LENGTH = 6
const RESEND_SECONDS = 60

const AdminOtp = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const firstInputRef = useRef(null)

  const email =
    location.state?.email ||
    sessionStorage.getItem('adminOtpEmail') ||
    ''

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''))
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [expired, setExpired] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS)

  useEffect(() => {
    firstInputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (secondsLeft <= 0) {
      setExpired(true)
      return
    }

    const timer = window.setInterval(() => {
      setSecondsLeft((current) => current - 1)
    }, 1000)

    return () => window.clearInterval(timer)
  }, [secondsLeft])

  const handleOtpChange = (index, value) => {
    const cleanValue = value.replace(/\D/g, '')

    if (!cleanValue) {
      setOtp((current) => {
        const next = [...current]
        next[index] = ''
        return next
      })
      return
    }

    // Handle pasted/multiple digits.
    const digits = cleanValue.slice(0, OTP_LENGTH)

    if (digits.length > 1) {
      setOtp((current) => {
        const next = [...current]

        digits.split('').forEach((digit, offset) => {
          const targetIndex = index + offset

          if (targetIndex < OTP_LENGTH) {
            next[targetIndex] = digit
          }
        })

        return next
      })

      const focusIndex = Math.min(
        index + digits.length,
        OTP_LENGTH - 1
      )

      document
        .getElementById(`admin-otp-${focusIndex}`)
        ?.focus()

      return
    }

    setOtp((current) => {
      const next = [...current]
      next[index] = digits
      return next
    })

    if (index < OTP_LENGTH - 1) {
      document
        .getElementById(`admin-otp-${index + 1}`)
        ?.focus()
    }

    setError('')
  }

  const handleKeyDown = (index, event) => {
    if (
      event.key === 'Backspace' &&
      !otp[index] &&
      index > 0
    ) {
      document
        .getElementById(`admin-otp-${index - 1}`)
        ?.focus()
    }

    if (
      event.key === 'ArrowLeft' &&
      index > 0
    ) {
      document
        .getElementById(`admin-otp-${index - 1}`)
        ?.focus()
    }

    if (
      event.key === 'ArrowRight' &&
      index < OTP_LENGTH - 1
    ) {
      document
        .getElementById(`admin-otp-${index + 1}`)
        ?.focus()
    }
  }

  const handleVerify = async (event) => {
    event.preventDefault()

    if (loading) {
      return
    }

    setError('')
    setMessage('')

    const enteredOtp = otp.join('')

    if (enteredOtp.length !== OTP_LENGTH) {
      setError('Please enter the complete 6-digit OTP.')
      return
    }

    if (expired) {
      setError('This OTP has expired. Please request a new OTP.')
      return
    }

    /*
     * FRONTEND-ONLY PLACEHOLDER
     *
     * Real implementation will call:
     *
     * POST /admin/phone/verify-otp
     *
     * once the backend Admin OTP API exists.
     *
     * Do NOT create fake authentication here.
     */

    setLoading(true)

    try {
      // Backend integration intentionally disabled.
      await new Promise((resolve) => {
        window.setTimeout(resolve, 700)
      })

      setError(
        'Admin OTP verification is not available yet. The Admin OTP backend API is required.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (resendLoading || secondsLeft > 0) {
      return
    }

    setError('')
    setMessage('')
    setResendLoading(true)

    try {
      /*
       * FRONTEND-ONLY PLACEHOLDER
       *
       * Real implementation will call:
       *
       * POST /admin/phone/send-otp
       *
       * once the backend Admin OTP API exists.
       */

      await new Promise((resolve) => {
        window.setTimeout(resolve, 700)
      })

      setOtp(Array(OTP_LENGTH).fill(''))
      setSecondsLeft(RESEND_SECONDS)
      setExpired(false)

      setMessage(
        'Admin OTP sending is not available yet. The Admin OTP backend API is required.'
      )

      firstInputRef.current?.focus()
    } finally {
      setResendLoading(false)
    }
  }

  const handleChangeAccount = () => {
    sessionStorage.removeItem('adminOtpEmail')
    navigate('/admin')
  }

  const formattedTime = `00:${String(secondsLeft).padStart(2, '0')}`

  return (
    <div className="flex min-h-dvh min-h-screen items-center justify-center bg-[#020914] px-6 py-8 text-white sm:px-8">
      <main className="w-full max-w-[420px] rounded-[24px] border border-[#1D3042] bg-[#06111D] px-6 py-8 shadow-[0_24px_70px_rgba(0,0,0,0.42)] sm:px-9 sm:py-10">

        {/* LOGO */}
        <div className="flex flex-col items-center text-center">
          <Link
            to="/admin"
            aria-label="RideEasy Admin login"
            className="grid h-16 w-16 place-items-center rounded-[18px] border-2 border-[#FFA726] bg-[#0B1B2B] shadow-[0_0_0_5px_rgba(255,167,38,0.08)]"
          >
            <img
              src={rideEasyAdminLogo}
              alt="RideEasy"
              className="h-12 w-12 rounded-xl object-contain"
            />
          </Link>

          <h1 className="mt-5 text-2xl font-bold tracking-tight text-white">
            Verify Admin Access
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#94A3B8]">
            Enter the 6-digit OTP sent to
          </p>

          <p className="mt-1 max-w-full truncate text-sm font-semibold text-[#FFA726]">
            {email || 'your registered contact'}
          </p>
        </div>

        {/* OTP FORM */}
        <form
          onSubmit={handleVerify}
          className="mt-8 space-y-6"
          autoComplete="off"
        >
          <div>
            <label
              htmlFor="admin-otp-0"
              className="mb-3 block text-center text-sm font-medium text-[#CBD5E1]"
            >
              Enter OTP
            </label>

            <div className="flex justify-center gap-2 sm:gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={index === 0 ? firstInputRef : undefined}
                  id={`admin-otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  autoComplete={index === 0 ? 'one-time-code' : 'off'}
                  maxLength={OTP_LENGTH}
                  value={digit}
                  onChange={(event) =>
                    handleOtpChange(index, event.target.value)
                  }
                  onKeyDown={(event) =>
                    handleKeyDown(index, event)
                  }
                  aria-label={`OTP digit ${index + 1}`}
                  className="
                    h-12
                    w-11
                    rounded-xl
                    border
                    border-[#294057]
                    bg-[#102235]
                    text-center
                    text-lg
                    font-bold
                    text-white
                    outline-none
                    transition
                    focus:border-[#FFA726]
                    focus:ring-2
                    focus:ring-[#FFA726]/20
                    sm:h-14
                    sm:w-12
                  "
                />
              ))}
            </div>
          </div>

          {/* ERROR */}
          {error && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-xl border border-[#EF4444]/40 bg-[#EF4444]/10 px-3 py-2.5 text-sm leading-5 text-[#FCA5A5]"
            >
              <i className="ri-error-warning-line mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* MESSAGE */}
          {message && (
            <div
              role="status"
              className="flex items-start gap-2 rounded-xl border border-[#FFA726]/30 bg-[#FFA726]/10 px-3 py-2.5 text-sm leading-5 text-[#FFD28A]"
            >
              <i className="ri-information-line mt-0.5 shrink-0" />
              <span>{message}</span>
            </div>
          )}

          {/* VERIFY */}
          <button
            type="submit"
            disabled={loading || otp.join('').length !== OTP_LENGTH}
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

            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>

          {/* RESEND */}
          <div className="text-center">
            {secondsLeft > 0 ? (
              <p className="text-sm text-[#64748B]">
                Resend OTP in{' '}
                <span className="font-semibold text-[#CBD5E1]">
                  {formattedTime}
                </span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={resendLoading}
                className="text-sm font-semibold text-[#FFA726] transition hover:text-[#FFB74D] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {resendLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <i className="ri-loader-4-line animate-spin" />
                    Resending...
                  </span>
                ) : (
                  'Resend OTP'
                )}
              </button>
            )}
          </div>

          {/* CHANGE ACCOUNT */}
          <button
            type="button"
            onClick={handleChangeAccount}
            className="mx-auto flex items-center gap-2 text-sm text-[#94A3B8] transition hover:text-white"
          >
            <i className="ri-arrow-left-line" />
            <span>Use a different account</span>
          </button>
        </form>

        {/* SECURITY MESSAGE */}
        <div className="mt-7 flex items-center justify-center gap-2 text-sm text-[#94A3B8]">
          <i className="ri-shield-check-line text-base text-[#FFA726]" />
          <span>Secure admin access</span>
        </div>

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

export default AdminOtp