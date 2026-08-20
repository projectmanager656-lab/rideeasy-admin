import React from 'react'

const Select = ({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select...',
  name,
  id,
  disabled = false,
  required = false,
  error = '',
  className = '',
  ...props
}) => {
  const selectId = id || name

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="mb-1.5 block text-sm font-semibold text-[#152238]"
        >
          {label}

          {required && (
            <span className="ml-1 text-[#EF4444]">*</span>
          )}
        </label>
      )}

      <div className="relative">
        <select
          id={selectId}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={[
            'h-11 w-full appearance-none rounded-xl border bg-white',
            'px-4 pr-10 text-sm text-[#152238]',
            'outline-none transition-all',
            'focus:border-[#FFB21C]',
            'focus:ring-2 focus:ring-[#FFB21C]/20',
            'disabled:cursor-not-allowed',
            'disabled:bg-[#F7F9FC]',
            'disabled:text-[#9CA3AF]',
            error
              ? 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/20'
              : 'border-[#E5E7EB]',
            className,
          ].join(' ')}
          {...props}
        >
          <option value="" disabled>
            {placeholder}
          </option>

          {options.map((option) => {
            const optionValue =
              typeof option === 'object'
                ? option.value
                : option

            const optionLabel =
              typeof option === 'object'
                ? option.label
                : option

            return (
              <option
                key={optionValue}
                value={optionValue}
              >
                {optionLabel}
              </option>
            )
          })}
        </select>

        <i className="ri-arrow-down-s-line pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-lg text-[#718096]" />
      </div>

      {error && (
        <p className="mt-1.5 text-xs font-medium text-[#EF4444]">
          {error}
        </p>
      )}
    </div>
  )
}

export default Select
