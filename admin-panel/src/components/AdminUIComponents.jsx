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
