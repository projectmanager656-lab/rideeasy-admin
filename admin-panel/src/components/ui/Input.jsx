import React from 'react'

const Input = ({
  label,
  placeholder = '',
  value,
  onChange,
  type = 'text',
  name,
  id,
  disabled = false,
  required = false,
  error = '',
  icon,
  className = '',
  ...props
}) => {
  const inputId = id || name

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-sm font-semibold text-[#152238]"
        >
          {label}
          {required && (
            <span className="ml-1 text-[#EF4444]">*</span>
          )}
        </label>
      )}

      <div className="relative">
        {icon && (
          <i
            className={`${icon} absolute left-3.5 top-1/2 -translate-y-1/2 text-lg text-[#718096]`}
          />
        )}

        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={[
            'h-11 w-full rounded-xl border bg-white',
            'text-sm text-[#152238]',
            'placeholder:text-[#9CA3AF]',
            'outline-none transition-all',
            'focus:border-[#FFB21C]',
            'focus:ring-2 focus:ring-[#FFB21C]/20',
            'disabled:cursor-not-allowed disabled:bg-[#F7F9FC] disabled:text-[#9CA3AF]',
            error
              ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/20'
              : 'border-[#E5E7EB]',
            icon ? 'pl-10 pr-4' : 'px-4',
            className,
          ].join(' ')}
          {...props}
        />
      </div>

      {error && (
        <p className="mt-1.5 text-xs font-medium text-[#EF4444]">
          {error}
        </p>
      )}
    </div>
  )
}

export default Input
