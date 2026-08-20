import React from 'react'

export const Card = ({ children, className = '', shadow = true, hover = false }) => (
  <div
    className={`
      rounded-2xl border border-slate-200 bg-white p-5
      ${shadow ? 'shadow-[0_10px_30px_rgba(17,24,39,0.04)]' : ''}
      ${hover ? 'transition-shadow duration-200 hover:shadow-[0_12px_32px_rgba(17,24,39,0.08)]' : ''}
      ${className}
    `}
  >
    {children}
  </div>
)

export const CardHeader = ({ title, subtitle, icon, action, className = '' }) => (
  <div className={`mb-5 flex items-start justify-between gap-3 ${className}`}>
    <div className="flex items-start gap-3">
      {icon && <div className="mt-0.5 text-2xl text-[#FFA726]">{icon}</div>}
      <div>
        <h3 className="text-lg font-bold text-[#111827]">{title}</h3>
        {subtitle && <p className="mt-1 text-sm text-[#6B7280]">{subtitle}</p>}
      </div>
    </div>
    {action && <div>{action}</div>}
  </div>
)

export const StatCard = ({ label, value, icon, trend, trendLabel, loading = false, accent = 'amber' }) => {
  const accentStyles = {
    amber: 'bg-[#FFF3E0] text-[#FFA726]',
    slate: 'bg-slate-100 text-[#111827]',
    green: 'bg-[#EAFBF2] text-[#1FAA59]',
    red: 'bg-[#FEECEC] text-[#E5484D]',
  }

  return (
    <Card className="h-full border-slate-200 bg-white p-5 shadow-[0_10px_26px_rgba(17,24,39,0.04)]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-[#6B7280]">{label}</p>
          {loading ? (
            <div className="mt-3 h-8 w-20 animate-pulse rounded-lg bg-slate-200"></div>
          ) : (
            <p className="mt-3 text-3xl font-bold tracking-tight text-[#111827]">{value}</p>
          )}
          {trend != null && (
            <div
              className={`mt-3 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
                trend > 0 ? 'bg-[#EAFBF2] text-[#1FAA59]' : trend < 0 ? 'bg-[#FEECEC] text-[#E5484D]' : 'bg-slate-100 text-[#6B7280]'
              }`}
            >
              <i className={`ri-arrow-${trend > 0 ? 'up' : trend < 0 ? 'down' : 'right'}-line`}></i>
              {trendLabel}
            </div>
          )}
        </div>
        <div className={`grid h-12 w-12 place-items-center rounded-2xl ${accentStyles[accent] || accentStyles.amber}`}>
          <i className={icon}></i>
        </div>
      </div>
    </Card>
  )
}

export const AlertCard = ({ title, message, type = 'info', action, onClose }) => {
  const bgColors = {
    info: 'bg-slate-50 border-slate-200',
    success: 'bg-[#edf9f1] border-[#b9e5ca]',
    warning: 'bg-[#FFF3E0] border-[#FFE0B2]',
    error: 'bg-[#FEE2E2] border-[#FECACA]',
  }

  const textColors = {
    info: 'text-[#111827]',
    success: 'text-[#1FAA59]',
    warning: 'text-[#B8860B]',
    error: 'text-[#E5484D]',
  }

  const iconColors = {
    info: 'text-[#6B7280]',
    success: 'text-[#1FAA59]',
    warning: 'text-[#FFA726]',
    error: 'text-[#E5484D]',
  }

  const iconNames = {
    info: 'ri-information-line',
    success: 'ri-check-circle-line',
    warning: 'ri-alert-line',
    error: 'ri-close-circle-line',
  }

  return (
    <div className={`rounded-2xl border p-4 sm:p-5 ${bgColors[type]} ${textColors[type]}`}>
      <div className="flex items-start gap-4">
        <i className={`${iconNames[type]} ${iconColors[type]} mt-0.5 flex-shrink-0 text-2xl`}></i>
        <div className="flex-1">
          {title && <p className="text-sm font-bold sm:text-base">{title}</p>}
          <p className="mt-1 text-sm">{message}</p>
          {action && <div className="mt-3">{action}</div>}
        </div>
        {onClose && (
          <button onClick={onClose} className="flex-shrink-0 text-xl opacity-60 transition-opacity hover:opacity-100">
            <i className="ri-close-line"></i>
          </button>
        )}
      </div>
    </div>
  )
}

export const TabButton = ({ active, onClick, children, icon }) => (
  <button
    onClick={onClick}
    className={`
      flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium transition-all
      ${active ? 'bg-[#FFA726] text-[#111827] shadow-md' : 'border border-slate-300 bg-white text-[#111827] hover:border-[#FFA726] hover:text-[#111827]'}
    `}
  >
    {icon && <i className={`${icon} text-base`}></i>}
    {children}
  </button>
)

export const SectionDivider = ({ label, className = '' }) => (
  <div className={`py-6 ${className}`}>
    {label && <h2 className="text-lg font-bold text-[#111827]">{label}</h2>}
  </div>
)

export const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  className = '',
  onClick,
  ...props
}) => {
  const variants = {
    primary: 'bg-[#FFA726] text-[#111827] hover:bg-[#FF9800]',
    secondary: 'border border-slate-300 bg-white text-[#111827] hover:bg-slate-50',
    danger: 'bg-[#E5484D] text-white hover:bg-[#D63B40]',
    success: 'bg-[#1FAA59] text-white hover:bg-[#188B49]',
    ghost: 'bg-transparent text-[#111827] hover:bg-slate-100',
  }

  const sizes = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4 text-sm',
    lg: 'h-11 px-5 text-base',
  }

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && <i className="ri-loader-4-line animate-spin" />}
      {!loading && icon && <i className={icon} />}
      <span>{children}</span>
    </button>
  )
}
export const Input = ({
  label,
  error,
  helperText,
  className = '',
  id,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="mb-1.5 block text-sm font-semibold text-[#111827]"
        >
          {label}
        </label>
      )}

      <input
        id={id}
        className={`h-10 w-full rounded-xl border bg-white px-3 text-sm text-[#111827] outline-none transition-colors placeholder:text-slate-400 focus:border-[#FFA726] focus:ring-2 focus:ring-[#FFA726]/20 ${
          error ? 'border-[#E5484D]' : 'border-slate-300'
        } ${className}`}
        {...props}
      />

      {error ? (
        <p className="mt-1.5 text-xs font-medium text-[#E5484D]">
          {error}
        </p>
      ) : helperText ? (
        <p className="mt-1.5 text-xs text-[#6B7280]">
          {helperText}
        </p>
      ) : null}
    </div>
  )
}

export const Select = ({
  label,
  error,
  helperText,
  options = [],
  placeholder = 'Select an option',
  className = '',
  id,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="mb-1.5 block text-sm font-semibold text-[#111827]"
        >
          {label}
        </label>
      )}

      <select
        id={id}
        className={`h-10 w-full rounded-xl border bg-white px-3 text-sm text-[#111827] outline-none transition-colors focus:border-[#FFA726] focus:ring-2 focus:ring-[#FFA726]/20 ${
          error ? 'border-[#E5484D]' : 'border-slate-300'
        } ${className}`}
        {...props}
      >
        <option value="">{placeholder}</option>

        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>

      {error ? (
        <p className="mt-1.5 text-xs font-medium text-[#E5484D]">
          {error}
        </p>
      ) : helperText ? (
        <p className="mt-1.5 text-xs text-[#6B7280]">
          {helperText}
        </p>
      ) : null}
    </div>
  )
}
export const Table = ({
  columns = [],
  data = [],
  rowKey = '_id',
  emptyMessage = 'No records found.',
  loading = false,
  className = '',
}) => {
  if (loading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="space-y-3 p-5">
          {[1, 2, 3, 4].map((row) => (
            <div
              key={row}
              className="h-10 animate-pulse rounded-lg bg-slate-100"
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={`overflow-x-auto rounded-2xl border border-slate-200 bg-white ${className}`}>
      <table className="min-w-full text-left text-sm">
        <thead className="bg-slate-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="whitespace-nowrap px-4 py-3 font-semibold text-[#111827]"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length || 1}
                className="px-4 py-10 text-center text-sm text-slate-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr
                key={row[rowKey] ?? index}
                className="transition-colors hover:bg-slate-50"
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="whitespace-nowrap px-4 py-3 text-[#374151]"
                  >
                    {column.render
                      ? column.render(row, index)
                      : row[column.key] ?? '—'}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export const Search = ({
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
}) => (
  <div className={`relative w-full ${className}`}>
    <i className="ri-search-line pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />

    <input
      type="search"
      value={value}
      onChange={(event) => onChange?.(event.target.value)}
      placeholder={placeholder}
      className="h-10 w-full rounded-xl border border-slate-300 bg-white pl-10 pr-3 text-sm text-[#111827] outline-none transition-colors placeholder:text-slate-400 focus:border-[#FFA726] focus:ring-2 focus:ring-[#FFA726]/20"
    />
  </div>
)

export const Filter = ({
  label = 'Filter',
  value,
  onChange,
  options = [],
  className = '',
}) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <label className="text-sm font-medium text-[#6B7280]">
      {label}
    </label>

    <select
      value={value}
      onChange={(event) => onChange?.(event.target.value)}
      className="h-10 rounded-xl border border-slate-300 bg-white px-3 text-sm text-[#111827] outline-none focus:border-[#FFA726] focus:ring-2 focus:ring-[#FFA726]/20"
    >
      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
        >
          {option.label}
        </option>
      ))}
    </select>
  </div>
)
export const Pagination = ({
  page,
  totalPages,
  onPageChange,
  className = '',
}) => {
  if (!totalPages || totalPages <= 1) return null

  return (
    <div className={`flex items-center justify-between gap-3 ${className}`}>
      <p className="text-sm text-[#6B7280]">
        Page {page} of {totalPages}
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange?.(page - 1)}
          className="grid h-9 w-9 place-items-center rounded-lg border border-slate-300 bg-white text-[#111827] disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Previous page"
        >
          <i className="ri-arrow-left-s-line" />
        </button>

        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange?.(page + 1)}
          className="grid h-9 w-9 place-items-center rounded-lg border border-slate-300 bg-white text-[#111827] disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Next page"
        >
          <i className="ri-arrow-right-s-line" />
        </button>
      </div>
    </div>
  )
}

export const Modal = ({
  open,
  onClose,
  title,
  children,
  footer,
  size = 'md',
}) => {
  if (!open) return null

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose?.()
        }
      }}
    >
      <div className={`w-full ${sizes[size]} overflow-hidden rounded-2xl bg-white shadow-2xl`}>
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-lg font-bold text-[#111827]">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-[#111827]"
            aria-label="Close"
          >
            <i className="ri-close-line text-xl" />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-5">
          {children}
        </div>

        {footer && (
          <div className="border-t border-slate-200 px-5 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

export const Badge = ({
  children,
  variant = 'neutral',
  className = '',
}) => {
  const variants = {
    neutral: 'bg-slate-100 text-slate-700',
    success: 'bg-[#EAFBF2] text-[#1FAA59]',
    warning: 'bg-[#FFF3E0] text-[#B8860B]',
    danger: 'bg-[#FEECEC] text-[#E5484D]',
    info: 'bg-blue-50 text-blue-700',
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${variants[variant] || variants.neutral} ${className}`}
    >
      {children}
    </span>
  )
}
export const Loader = ({
  label = 'Loading...',
  className = '',
}) => (
  <div
    className={`flex items-center justify-center gap-2 py-8 text-sm text-slate-500 ${className}`}
    role="status"
  >
    <i className="ri-loader-4-line animate-spin text-lg" />
    <span>{label}</span>
  </div>
)

export const EmptyState = ({
  title = 'No data found',
  message = 'There are no records to display.',
  icon = 'ri-inbox-line',
  action,
  className = '',
}) => (
  <div
    className={`flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center ${className}`}
  >
    <div className="mb-3 grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-slate-500">
      <i className={`${icon} text-2xl`} />
    </div>

    <h3 className="text-base font-bold text-[#111827]">
      {title}
    </h3>

    <p className="mt-1 max-w-sm text-sm text-slate-500">
      {message}
    </p>

    {action && (
      <div className="mt-4">
        {action}
      </div>
    )}
  </div>
)

export const ErrorState = ({
  title = 'Something went wrong',
  message = 'We could not load this information. Please try again.',
  onRetry,
  className = '',
}) => (
  <div
    className={`flex flex-col items-center justify-center rounded-2xl border border-[#FECACA] bg-[#FFF7F7] px-6 py-10 text-center ${className}`}
  >
    <div className="mb-3 grid h-12 w-12 place-items-center rounded-full bg-[#FEECEC] text-[#E5484D]">
      <i className="ri-error-warning-line text-2xl" />
    </div>

    <h3 className="text-base font-bold text-[#111827]">
      {title}
    </h3>

    <p className="mt-1 max-w-sm text-sm text-slate-500">
      {message}
    </p>

    {onRetry && (
      <button
        type="button"
        onClick={onRetry}
        className="mt-4 h-10 rounded-xl bg-[#FFA726] px-4 text-sm font-semibold text-[#111827] hover:bg-[#FF9800]"
      >
        Try Again
      </button>
    )}
  </div>
)

export const ConfirmationDialog = ({
  open,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  loading = false,
  variant = 'danger',
}) => {
  if (!open) return null

  return (
    <Modal
      open={open}
      onClose={loading ? undefined : onCancel}
      title={title}
      size="sm"
    >
      <p className="text-sm leading-6 text-slate-600">
        {message}
      </p>

      <div className="mt-6 flex justify-end gap-3">
        <Button
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          {cancelLabel}
        </Button>

        <Button
          variant={variant}
          loading={loading}
          onClick={onConfirm}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}
