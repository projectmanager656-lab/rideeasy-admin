import React from 'react'

const Filter = ({
  label = 'Filter',
  value = '',
  onChange,
  options = [],
  placeholder = 'All',
  disabled = false,
  className = '',
}) => {
  return (
    <div className={['w-full sm:w-auto', className].join(' ')}>
      {label && (
        <label className="mb-1.5 block text-xs font-semibold text-[#718096]">
          {label}
        </label>
      )}

      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={[
            'h-11 min-w-[160px] w-full appearance-none',
            'rounded-xl border border-[#E5E7EB]',
            'bg-white px-4 pr-10',
            'text-sm font-medium text-[#152238]',
            'outline-none transition-all',
            'focus:border-[#FFB21C]',
            'focus:ring-2 focus:ring-[#FFB21C]/20',
            'disabled:cursor-not-allowed',
            'disabled:bg-[#F7F9FC]',
            'disabled:text-[#9CA3AF]',
          ].join(' ')}
        >
          <option value="">
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

        <i className="ri-filter-3-line pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-base text-[#718096]" />
      </div>
    </div>
  )
}

export default Filter
