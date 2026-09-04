import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { CaptainDataContext } from '../context/CaptainContext';
import { apiClient } from '../services/http';
import { stripApiEnvelope } from '../utils/apiBody';
import { formatApiError } from '../utils/apiError';

const Captainlogin = () => {
  const navigate = useNavigate();
  const { setCaptain } = useContext(CaptainDataContext);

  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');

  // Show / Hide password
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isValidEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  /*
   * LOGIN
   */
  const handleLogin = async () => {
    const value = emailOrPhone.trim();

    /*
     * Validate email / phone
     */
    if (!value) {
      setError('Please enter your email or phone number');
      return;
    }

    if (!isValidEmail(value)) {
      setError('Please enter a valid email address');
      return;
    }

    /*
     * Validate password
     */
    if (!password) {
      setError('Please enter your password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const body = {};

      /*
       * Email login
       */
      body.email = value.toLowerCase();
      body.password = password;

      const response = await apiClient.post('/captains/login', body);
      const data = stripApiEnvelope(response.data);
      const captain = data?.captain;
      const token = data?.token;
      if (!captain || !token) {
        setError('Login response missing account or token.');
        return;
      }
      setCaptain(captain);
      localStorage.setItem('captainToken', token);
      navigate('/captain-home', {
        replace: true,
      });

    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 w-full h-[100dvh] overflow-hidden bg-black">

      <main className="relative mx-auto h-full w-full max-w-[430px] overflow-hidden">

        {/* Background */}
        <img
          src="/WelcomeBg.jpeg"
          alt="Night City Background"
          className="absolute inset-0 z-0 h-full w-full object-cover brightness-125 contrast-105"
        />

        {/* Overlay */}
        <div className="absolute inset-0 z-10 bg-black/75" />

        {/* Content */}
        <div className="relative z-20 flex h-full flex-col px-6 pb-6 pt-10">

          {/* Header */}
          <div className="flex items-start justify-between pb-10">

            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">
                Ride
                <span className="text-[#FFB800]">
                  Easy
                </span>
              </h1>

              <p className="mt-1 text-sm text-gray-400">
                Drive, earn, and stay in control
              </p>
            </div>

            {/* Static Language Button */}
            <div className="relative">

              <button
                type="button"
                className="flex items-center gap-1.5 rounded-full border border-gray-700/80 bg-[#16181e]/80 px-3.5 py-1.5 text-xs font-medium text-gray-300 backdrop-blur-md"
              >
                <span>🌐</span>

                <span>
                  English
                </span>
              </button>

            </div>

          </div>

          {/* Login Section */}
          <div className="mb-2 flex w-full flex-col items-center gap-6 pt-10">

            {/* Tagline */}
            <p className="text-center text-base font-normal tracking-wide text-gray-200">
              Turn Miles Into Money
            </p>

            {/* Login Card */}
            <div className="w-full rounded-[24px] border border-gray-800/80 bg-[#0c0f14]/20 p-5 ">

              {/* Title */}
              <h2 className="text-2xl font-bold text-white">
                Welcome back
              </h2>

              <p className="mt-0.5 text-xs text-gray-400">
                Sign in to continue
              </p>

              {/* Email / Phone */}
              <div className="mt-5">

                <label className="mb-2 block text-xs font-medium text-gray-300">
                  Email address
                </label>

                <input
                  type="text"
                  value={emailOrPhone}
                  onChange={(e) => {
                    setEmailOrPhone(
                      e.target.value
                    );

                    setError('');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleLogin();
                    }
                  }}
                  placeholder="Enter your email address"
                  autoComplete="username"
                  className="h-12 w-full rounded-xl border border-gray-800 bg-[#12161f] px-4 text-sm text-white placeholder-gray-500 outline-none focus:border-[#FFB800]"
                />

              </div>

              {/* Password */}
              <div className="mt-4">

                <label className="mb-2 block text-xs font-medium text-gray-300">
                  Password
                </label>

                {/* Password Input Wrapper */}
                <div className="relative">

                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(
                        e.target.value
                      );

                      setError('');
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleLogin();
                      }
                    }}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="h-12 w-full rounded-xl border border-gray-800 bg-[#12161f] px-4 pr-12 text-sm text-white placeholder-gray-500 outline-none focus:border-[#FFB800]"
                  />

                  {/* Show / Hide Password */}
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    className="absolute right-0 top-0 flex h-12 w-12 items-center justify-center text-gray-400 transition hover:text-white"
                    aria-label={
                      showPassword
                        ? 'Hide password'
                        : 'Show password'
                    }
                  >
                    {showPassword ? (
                      <EyeOff
                        size={19}
                        strokeWidth={1.8}
                      />
                    ) : (
                      <Eye
                        size={19}
                        strokeWidth={1.8}
                      />
                    )}
                  </button>

                </div>

              </div>

              {/* Error */}
              {error && (
                <p className="mt-3 text-xs text-red-400">
                  {error}
                </p>
              )}

              {/* Login Button */}
              <button
                type="button"
                onClick={handleLogin}
                disabled={loading}
                className="mt-4 h-12 w-full rounded-xl bg-[#FFB800] text-sm font-bold text-black transition hover:bg-[#ffa800] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? 'Signing in...'
                  : 'Sign In'}
              </button>

              {/* Forgot Password */}
              <button
                type="button"
                onClick={() =>
                  navigate('/captain-forgot-password')
                }
                className="mt-4 w-full text-center text-xs font-medium text-[#FFB800] hover:text-[#ffa800]"
              >
                Forgot password?
              </button>

              {/* Don't Have An Account */}
              <div className="mt-4 text-center">

                <span className="text-xs text-gray-500">
                  Don&apos;t have an account?{' '}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    navigate('/captain-signup')
                  }
                  className="text-xs font-semibold text-[#FFB800] hover:text-[#ffa800]"
                >
                  Sign up
                </button>

              </div>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
};

export default Captainlogin;