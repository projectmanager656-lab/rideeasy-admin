import React from 'react'

const variants = {
  success: 'bg-green-50 text-green-700 border-green-200',
  warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  danger: 'bg-red-50 text-red-700 border-red-200',
  info: 'bg-blue-50 text-blue-700 border-blue-200',
  neutral: 'bg-gray-50 text-gray-700 border-gray-200',
  primary: 'bg-[#FFF4D6] text-[#9A6700] border-[#FFE2A3]',
}

const Badge = ({
  children,
  variant = 'neutral',
  size = 'md',
  icon,
  className = '',
}) => {
  const sizes = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  }

  return (
    <span
      className={[
        'inline-flex items-center justify-center gap-1.5',
        'w-fit rounded-full border font-semibold',
        sizes[size] || sizes.md,
        variants[variant] || variants.neutral,
        className,
      ].join(' ')}
    >
      {icon && <i className={icon} />}

      <span>{children}</span>
    </span>
  )
}

export default Badge
