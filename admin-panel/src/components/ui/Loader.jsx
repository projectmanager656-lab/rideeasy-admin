import React from 'react'

const Loader = ({
  size = 'md',
  text = 'Loading...',
  fullScreen = false,
  className = '',
}) => {
  const sizes = {
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-2',
    lg: 'h-8 w-8 border-[3px]',
    xl: 'h-10 w-10 border-[3px]',
  }

  const content = (
    <div
      className={[
        'flex items-center justify-center gap-3',
        className,
      ].join(' ')}
      role="status"
      aria-label={text}
    >
      <span
        className={[
          'animate-spin rounded-full',
          'border-[#E5E7EB] border-t-[#FFB21C]',
          sizes[size] || sizes.md,
        ].join(' ')}
      />

      {text && (
        <span className="text-sm font-medium text-[#718096]">
          {text}
        </span>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-[1500] grid place-items-center bg-[#F7F9FC]/90 backdrop-blur-sm">
        {content}
      </div>
    )
  }

  return content
}

export default Loader
