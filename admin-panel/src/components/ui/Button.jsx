import React from 'react'

const variants = {
  primary:
    'bg-[#FFB21C] text-[#0B1B2B] hover:bg-[#F5A900]',
  secondary:
    'border border-[#E5E7EB] bg-white text-[#152238] hover:bg-[#F7F9FC]',
  danger:
    'bg-[#EF4444] text-white hover:bg-[#DC2626]',
  ghost:
    'bg-transparent text-[#152238] hover:bg-[#F7F9FC]',
}

const sizes = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-11 px-5 text-base',
}

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  loading = false,
  icon,
  className = '',
  onClick,
}) => {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={[
        'inline-flex items-center justify-center gap-2',
        'rounded-xl font-semibold',
        'transition-colors duration-200',
        'focus:outline-none focus:ring-2 focus:ring-[#FFB21C]/30',
        'disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant] || variants.primary,
        sizes[size] || sizes.md,
        className,
      ].join(' ')}
    >
      {loading ? (
        <i className="ri-loader-4-line animate-spin" />
      ) : (
        icon && <i className={icon} />
      )}

      <span>{children}</span>
    </button>
  )
}

export default Button
