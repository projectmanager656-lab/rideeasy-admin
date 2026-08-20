import React from 'react'

const ErrorState = ({
  title = 'Something went wrong',
  message = 'We could not load this information. Please try again.',
  icon = 'ri-error-warning-line',
  onRetry,
  retryLabel = 'Try again',
  className = '',
}) => {
  return (
    <div
      className={[
        'flex min-h-[220px] w-full flex-col items-center justify-center',
        'rounded-2xl border border-red-200 bg-red-50',
        'px-6 py-10 text-center',
        className,
      ].join(' ')}
      role="alert"
    >
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white text-[#EF4444] shadow-sm">
        <i className={`${icon} text-2xl`} />
      </div>

      <h3 className="mt-4 text-base font-bold text-[#991B1B]">
        {title}
      </h3>

      <p className="mt-1.5 max-w-md text-sm leading-6 text-[#B91C1C]">
        {message}
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#EF4444] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#DC2626] focus:outline-none focus:ring-2 focus:ring-[#EF4444]/25"
        >
          <i className="ri-refresh-line" />
          {retryLabel}
        </button>
      )}
    </div>
  )
}

export default ErrorState
