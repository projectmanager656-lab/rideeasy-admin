import React from 'react'

const EmptyState = ({
  title = 'No data found',
  message = 'There is nothing to display here yet.',
  icon = 'ri-inbox-line',
  action,
  className = '',
}) => {
  return (
    <div
      className={[
        'flex min-h-[220px] w-full flex-col items-center justify-center',
        'rounded-2xl border border-dashed border-[#D8DEE8]',
        'bg-white px-6 py-10 text-center',
        className,
      ].join(' ')}
    >
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#F7F9FC] text-[#718096]">
        <i className={`${icon} text-2xl`} />
      </div>

      <h3 className="mt-4 text-base font-bold text-[#152238]">
        {title}
      </h3>

      <p className="mt-1.5 max-w-md text-sm leading-6 text-[#718096]">
        {message}
      </p>

      {action && (
        <div className="mt-5">
          {action}
        </div>
      )}
    </div>
  )
}

export default EmptyState
