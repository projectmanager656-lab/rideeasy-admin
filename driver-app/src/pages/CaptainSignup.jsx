import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { CaptainDataContext } from '../context/CaptainContext';
import { apiClient } from '../services/http';
import { stripApiEnvelope } from '../utils/apiBody';
import { formatApiError } from '../utils/apiError';

const DriverSignup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setCaptain } = useContext(CaptainDataContext);

  const [name, setName] = useState('');

  const [email, setEmail] = useState(
    location.state?.emailOrPhone?.includes('@')
      ? location.state.emailOrPhone
      : ''
  );

  const [phone, setPhone] = useState(
    location.state?.emailOrPhone &&
    !location.state.emailOrPhone.includes('@')
      ? location.state.emailOrPhone
      : ''
  );

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // OTP
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);

  const [phoneVerificationToken, setPhoneVerificationToken] =
    useState('');

  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const [error, setError] = useState('');
  const [otpError, setOtpError] = useState('');

  /*
   * SEND PHONE OTP
   */
  const handleSendOtp = async () => {
    setError('');
    setOtpError('');

    const cleanPhone = phone.replace(/\D/g, '');

    /*
     * PHONE IS REQUIRED
     */
    if (!cleanPhone) {
      setError('Please enter your phone number.');
      return;
    }

    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setOtpLoading(true);

    try {
      const { data: responseData } = await apiClient.post('/captains/phone/send-otp', { phone: cleanPhone, purpose: 'registration' });
      const data = stripApiEnvelope(responseData);

      /*
       * SHOW OTP ENTER POPUP
       */
      setOtp('');
      setOtpError('');
      setShowOtp(true);

      /*
       * Development OTP
       */
      if (data.debugOtp) {
        alert(`Your OTP is: ${data.debugOtp}`);
      }

    } catch (err) {
      setError(formatApiError(err));
    } finally {
      setOtpLoading(false);
    }
  };

  /*
   * VERIFY PHONE OTP
   */
  const handleVerifyOtp = async () => {
    setOtpError('');

    const cleanPhone = phone.replace(/\D/g, '');

    /*
     * OTP REQUIRED
     */
    if (!otp) {
      setOtpError('Please enter the OTP.');
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setOtpError('Please enter a valid 6-digit OTP.');
      return;
    }

    setOtpLoading(true);

    try {
      const { data: responseData } = await apiClient.post('/captains/phone/verify-otp', { phone: cleanPhone, otp, purpose: 'registration' });
      const data = stripApiEnvelope(responseData);

      if (data.verified && data.phoneVerificationToken) {

        setPhoneVerificationToken(
          data.phoneVerificationToken
        );

        /*
         * CLOSE OTP POPUP
         */
        setShowOtp(false);

        setOtp('');

        setOtpError('');
        setError('');

      } else {
        setOtpError('OTP verification failed.');
      }

    } catch (err) {
      setOtpError(formatApiError(err));
    } finally {
      setOtpLoading(false);
    }
  };

  /*
   * CREATE DRIVER ACCOUNT
   */
  const handleSignup = async (e) => {
    e.preventDefault();

    setError('');

    const cleanPhone = phone.replace(/\D/g, '');

    /*
     * FULL NAME REQUIRED
     */
    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    /*
     * PHONE REQUIRED
     */
    if (!cleanPhone) {
      setError('Please enter your phone number.');
      return;
    }

    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    /*
     * EMAIL
     */
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    /*
     * PASSWORD
     */
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    /*
     * PHONE OTP VERIFICATION REQUIRED
     */
    if (!phoneVerificationToken) {
      setError('Please verify your phone number with OTP.');
      return;
    }

    setLoading(true);

    try {
      const response = await apiClient.post('/captains/register', {
        name: name.trim(), phone: cleanPhone, email: email.trim().toLowerCase(), password, phoneVerificationToken,
      });
      const data = stripApiEnvelope(response.data);

      /*
       * SAVE CAPTAIN TOKEN
       */
      if (data.token) {
        localStorage.setItem('captainToken', data.token);
        setCaptain(data.captain || null);
      }

      /*
       * REGISTRATION SUCCESSFUL
       */
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
  <div className="fixed inset-0 h-[100dvh] w-full overflow-hidden bg-[#0f1219] text-white">

    {/* =====================================================
        CENTERED APP SHELL
        ===================================================== */}

    <div className="mx-auto flex h-full w-full max-w-[430px] flex-col overflow-hidden bg-[#0f1219]">

      {/* ===================================================
          MAIN SCROLL CONTAINER
          =================================================== */}

      <main
        className="
          hide-scrollbar
          min-h-0
          flex-1
          overflow-y-auto
          overflow-x-hidden
          overscroll-contain
        "
      >

        <div className="px-4 pb-24 pt-5 sm:px-5">

          {/* ================= HEADER ================= */}

          <header className="mb-7 flex items-start justify-between gap-4">

            <div className="min-w-0">

              <h1 className="text-[27px] font-bold leading-tight tracking-tight">

                <span className="text-white">
                  Ride
                </span>

                <span className="text-[#FFC107]">
                  Easy
                </span>

              </h1>

              <p className="mt-1 text-xs text-gray-400">
                Book a ride in minutes
              </p>

            </div>


            {/* LANGUAGE */}

            <button
              type="button"
              className="
                flex
                shrink-0
                items-center
                gap-1.5
                rounded-full
                border
                border-white/10
                bg-[#1f232e]
                px-3
                py-1.5
                text-xs
                text-gray-300
                transition
                hover:bg-[#292e3c]
              "
            >

              <span>
                🌐
              </span>

              <span>
                English
              </span>

              <span className="text-[9px] text-gray-500">
                ▼
              </span>

            </button>

          </header>


          {/* ================= BACK ================= */}

          <Link
            to="/captain-login"
            className="
              mb-5
              flex
              w-fit
              items-center
              gap-2
              text-xs
              text-gray-400
              transition-colors
              hover:text-white
            "
          >

            <span className="text-base leading-none">
              ←
            </span>

            Back to login

          </Link>


          {/* ================= TITLE ================= */}

          <div className="mb-5">

            <h2 className="text-[23px] font-bold leading-tight">
              Create your account
            </h2>

            <p className="mt-1.5 text-xs text-gray-400">
              Fill in the details below
            </p>

          </div>


          {/* ================= FORM CARD ================= */}

          <div
            className="
              rounded-2xl
              border
              border-white/[0.06]
              bg-[#1a1f2a]
              p-4
              shadow-[0_12px_35px_rgba(0,0,0,0.18)]
              sm:p-5
            "
          >

            <form
              onSubmit={handleSignup}
              className="space-y-4"
            >

              {/* ================= FULL NAME ================= */}

              <div className="space-y-1.5">

                <label className="block text-xs font-medium text-gray-300">

                  Full name

                  <span className="ml-1 text-red-400">
                    *
                  </span>

                </label>

                <input
                  type="text"
                  value={name}
                  required
                  onChange={(e) => {
                    setName(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter your full name"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-white/10
                    bg-[#131821]
                    px-4
                    py-3
                    text-sm
                    text-white
                    placeholder-gray-500
                    outline-none
                    transition-all
                    focus:border-[#FFC107]
                    focus:ring-1
                    focus:ring-[#FFC107]/40
                  "
                />

              </div>


              {/* ================= PHONE ================= */}

              <div className="space-y-1.5">

                <label className="block text-xs font-medium text-gray-300">

                  Phone number

                  <span className="ml-1 text-red-400">
                    *
                  </span>

                </label>

                <div className="flex w-full">

                  {/* COUNTRY CODE */}

                  <div
                    className="
                      flex
                      shrink-0
                      items-center
                      rounded-l-xl
                      border
                      border-r-0
                      border-white/10
                      bg-[#131821]
                      px-3
                      text-sm
                      font-medium
                      text-white
                    "
                  >
                    +91
                  </div>


                  {/* PHONE */}

                  <input
                    type="tel"
                    value={phone}
                    required
                    inputMode="numeric"
                    maxLength={10}
                    onChange={(e) => {

                      const value =
                        e.target.value
                          .replace(/\D/g, '')
                          .slice(0, 10);

                      setPhone(value);

                      setPhoneVerificationToken('');

                      setError('');
                    }}
                    placeholder="Enter phone number"
                    className="
                      min-w-0
                      flex-1
                      border
                      border-white/10
                      bg-[#131821]
                      px-3
                      py-3
                      text-sm
                      text-white
                      placeholder-gray-500
                      outline-none
                      transition-all
                      focus:border-[#FFC107]
                      focus:ring-1
                      focus:ring-[#FFC107]/40
                    "
                  />


                  {/* SEND OTP */}

                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={
                      otpLoading ||
                      phone.length !== 10
                    }
                    className="
                      shrink-0
                      rounded-r-xl
                      bg-[#FFC107]
                      px-3
                      text-xs
                      font-bold
                      text-black
                      transition
                      hover:bg-[#ffb300]
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  >

                    {otpLoading
                      ? 'Sending...'
                      : phoneVerificationToken
                      ? 'Verified'
                      : 'Send OTP'}

                  </button>

                </div>

                <p className="text-[10px] leading-4 text-gray-500">
                  Verification code will be sent to your phone.
                </p>

                {phoneVerificationToken && (
                  <p className="text-[10px] text-green-400">
                    ✓ Phone number verified successfully.
                  </p>
                )}

              </div>


              {/* ================= EMAIL ================= */}

              <div className="space-y-1.5">

                <label className="block text-xs font-medium text-gray-300">
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter email address"
                  className="
                    w-full
                    rounded-xl
                    border
                    border-white/10
                    bg-[#131821]
                    px-4
                    py-3
                    text-sm
                    text-white
                    placeholder-gray-500
                    outline-none
                    transition-all
                    focus:border-[#FFC107]
                    focus:ring-1
                    focus:ring-[#FFC107]/40
                  "
                />

              </div>


              {/* ================= SECURITY ================= */}

              <div className="border-t border-white/10 pt-4">

                <p className="mb-3 text-[9px] tracking-[0.2em] text-gray-500">
                  SECURITY
                </p>


                {/* PASSWORD */}

                <div className="mb-4 space-y-1.5">

                  <label className="block text-xs font-medium text-gray-300">
                    Password
                  </label>

                  <div className="relative">

                    <input
                      type={
                        showPassword
                          ? 'text'
                          : 'password'
                      }
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError('');
                      }}
                      placeholder="Min 6 characters"
                      className="
                        w-full
                        rounded-xl
                        border
                        border-white/10
                        bg-[#131821]
                        px-4
                        py-3
                        pr-11
                        text-sm
                        text-white
                        placeholder-gray-500
                        outline-none
                        transition-all
                        focus:border-[#FFC107]
                        focus:ring-1
                        focus:ring-[#FFC107]/40
                      "
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      className="
                        absolute
                        right-3.5
                        top-1/2
                        -translate-y-1/2
                        text-gray-400
                        transition
                        hover:text-white
                      "
                    >

                      {showPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}

                    </button>

                  </div>

                </div>


                {/* CONFIRM PASSWORD */}

                <div className="space-y-1.5">

                  <label className="block text-xs font-medium text-gray-300">
                    Confirm password
                  </label>

                  <div className="relative">

                    <input
                      type={
                        showConfirmPassword
                          ? 'text'
                          : 'password'
                      }
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setError('');
                      }}
                      placeholder="Re-enter password"
                      className="
                        w-full
                        rounded-xl
                        border
                        border-white/10
                        bg-[#131821]
                        px-4
                        py-3
                        pr-11
                        text-sm
                        text-white
                        placeholder-gray-500
                        outline-none
                        transition-all
                        focus:border-[#FFC107]
                        focus:ring-1
                        focus:ring-[#FFC107]/40
                      "
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          !showConfirmPassword
                        )
                      }
                      className="
                        absolute
                        right-3.5
                        top-1/2
                        -translate-y-1/2
                        text-gray-400
                        transition
                        hover:text-white
                      "
                    >

                      {showConfirmPassword ? (
                        <EyeOff size={18} />
                      ) : (
                        <Eye size={18} />
                      )}

                    </button>

                  </div>

                </div>

              </div>


              {/* ================= ERROR ================= */}

              {error && (
                <div className="rounded-lg border border-red-500/10 bg-red-500/5 px-3 py-2">

                  <p className="text-xs leading-4 text-red-400">
                    {error}
                  </p>

                </div>
              )}


              {/* ================= SUBMIT ================= */}

              <button
                type="submit"
                disabled={loading}
                className="
                  mt-1
                  flex
                  w-full
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#FFC107]
                  py-3.5
                  text-sm
                  font-bold
                  text-black
                  shadow-[0_0_18px_rgba(255,193,7,0.12)]
                  transition-all
                  hover:bg-[#ffb300]
                  active:scale-[0.99]
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >

                {loading
                  ? 'Creating Account...'
                  : 'Create Driver Account'}

              </button>

            </form>

          </div>


          {/* ================= FOOTER ================= */}

          <div className="mt-6 pb-2 text-center text-xs text-gray-400">

            Already have an account?

            <Link
              to="/captain-login"
              className="ml-1 font-medium text-[#FFC107] hover:underline"
            >
              Login
            </Link>

          </div>

        </div>

      </main>


      {/* =====================================================
          OTP POPUP
          ===================================================== */}

      {showOtp && (

        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/80
            px-4
            backdrop-blur-sm
          "
        >

          <div
            className="
              w-full
              max-w-[390px]
              rounded-2xl
              border
              border-white/10
              bg-[#1a1f2a]
              p-5
              shadow-2xl
            "
          >

            {/* OTP HEADER */}

            <div className="flex items-start justify-between">

              <div>

                <h2 className="text-xl font-bold text-white">
                  Verify Phone
                </h2>

                <p className="mt-1 text-[10px] text-gray-500">
                  Step 1 of 1
                </p>

              </div>

              <button
                type="button"
                onClick={() => {
                  setShowOtp(false);
                  setOtp('');
                  setOtpError('');
                }}
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-full
                  text-xl
                  text-gray-400
                  transition
                  hover:bg-white/5
                  hover:text-white
                "
              >
                ×
              </button>

            </div>


            {/* DESCRIPTION */}

            <p className="mt-4 text-xs leading-5 text-gray-400">
              Enter the 6-digit OTP sent to
            </p>

            <p className="mt-1 text-sm font-medium text-white">
              +91 {phone}
            </p>


            {/* OTP INPUT */}

            <div className="mt-5">

              <label className="mb-2 block text-[11px] font-medium text-gray-300">

                Enter OTP

                <span className="ml-1 text-red-400">
                  *
                </span>

              </label>

              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                autoFocus
                value={otp}
                onChange={(e) => {

                  const value =
                    e.target.value
                      .replace(/\D/g, '')
                      .slice(0, 6);

                  setOtp(value);
                  setOtpError('');

                }}
                onKeyDown={(e) => {
                  if (
                    e.key === 'Enter' &&
                    otp.length === 6
                  ) {
                    handleVerifyOtp();
                  }
                }}
                placeholder="Enter 6-digit OTP"
                className="
                  h-14
                  w-full
                  rounded-xl
                  border
                  border-white/10
                  bg-[#131821]
                  px-4
                  text-center
                  text-xl
                  tracking-[0.35em]
                  text-white
                  outline-none
                  focus:border-[#FFC107]
                  focus:ring-1
                  focus:ring-[#FFC107]/40
                "
              />

            </div>


            {/* OTP ERROR */}

            {otpError && (
              <p className="mt-2 text-xs text-red-400">
                {otpError}
              </p>
            )}


            {/* VERIFY */}

            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={
                otpLoading ||
                otp.length !== 6
              }
              className="
                mt-4
                h-13
                w-full
                rounded-xl
                bg-[#FFC107]
                text-sm
                font-bold
                text-black
                transition
                hover:bg-[#ffb300]
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >

              {otpLoading
                ? 'Verifying...'
                : 'Verify OTP'}

            </button>


            {/* CANCEL */}

            <button
              type="button"
              onClick={() => {
                setShowOtp(false);
                setOtp('');
                setOtpError('');
              }}
              className="
                mt-3
                w-full
                text-center
                text-xs
                text-gray-500
                transition
                hover:text-gray-300
              "
            >
              Cancel
            </button>

          </div>

        </div>

      )}

    </div>
  </div>
)
};

export default DriverSignup;