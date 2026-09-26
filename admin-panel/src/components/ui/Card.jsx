import React from 'react'

const Card = ({
  children,
  title,
  subtitle,
  icon,
  action,
  padding = 'md',
  hover = false,
  className = '',
}) => {
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-7',
  }

  return (
    <section
      className={[
        'admin-theme-card w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]',
        'shadow-sm',
        hover
          ? 'transition-shadow duration-200 hover:shadow-md'
          : '',
        className,
      ].join(' ')}
    >
      {(title || subtitle || icon || action) && (
        <div className="flex items-start justify-between gap-4 border-b border-[var(--color-border)] px-5 py-4 sm:px-6">
          <div className="flex min-w-0 items-start gap-3">
            {icon && (
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#FFF4D6] text-[#9A6700]">
                <i className={`${icon} text-lg`} />
              </div>
            )}

            <div className="min-w-0">
              {title && (
                <h3 className="truncate text-base font-bold text-[var(--color-text-primary)]">
                  {title}
                </h3>
              )}

              {subtitle && (
                <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {action && (
            <div className="shrink-0">
              {action}
            </div>
          )}
        </div>
      )}

      <div className={paddings[padding]}>
        {children}
      </div>
    </section>
  )
}

export default Card
