import React from 'react'

const Search = ({
  value = '',
  onChange,
  placeholder = 'Search...',
  disabled = false,
  className = '',
}) => {
  return (
    <div className="relative w-full">
      <i className="ri-search-line pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-lg text-[#718096]" />

      <input
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        aria-label={placeholder}
        className={[
          'h-11 w-full rounded-xl border border-[#E5E7EB] bg-white',
          'pl-10 pr-10 text-sm text-[#152238]',
          'placeholder:text-[#9CA3AF]',
          'outline-none transition-all',
          'focus:border-[#FFB21C]',
          'focus:ring-2 focus:ring-[#FFB21C]/20',
          'disabled:cursor-not-allowed',
          'disabled:bg-[#F7F9FC]',
          'disabled:text-[#9CA3AF]',
          className,
        ].join(' ')}
      />

      {value && (
        <button
          type="button"
          onClick={() =>
            onChange?.({ target: { value: '' } })
          }
          className="absolute right-3 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full text-[#718096] hover:bg-[#F7F9FC] hover:text-[#152238]"
          aria-label="Clear search"
        >
          <i className="ri-close-line text-base" />
        </button>
      )}
    </div>
  )
}

export default Search
