import React from 'react'

const tones = ['blue', 'green', 'orange', 'purple', 'navy']
const toneClasses = {
  blue: 'bg-[#EAF4FF] text-[#2563EB]',
  green: 'bg-[#EAFBF2] text-[#16A34A]',
  orange: 'bg-[#FFF4DF] text-[#B86B00]',
  purple: 'bg-[#F3EEFF] text-[#7C3AED]',
  navy: 'bg-[#EEF2F7] text-[#0B1B2B]',
}

export function SecondaryPageShell ({ title, subtitle, rows, children }) {
  return (
    <div className="space-y-5 pb-5 sm:space-y-6">
      <div>
        <h1 className="text-[28px] font-bold tracking-[-0.04em] text-[#152238] sm:text-[32px]">{title}</h1>
        <p className="mt-1 text-sm text-[#718096]">{subtitle}</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#E6EBF2] bg-white shadow-[0_2px_10px_rgba(15,23,42,0.05)]">
        <div className="divide-y divide-[#E6EBF2]">
          {rows.map((row, index) => {
            const content = <>
              <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${toneClasses[row.tone || tones[index % tones.length]]}`}>
                <i className={`${row.icon} text-lg`} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-[#152238] sm:text-base">{row.title}</span>
                <span className="mt-0.5 block text-xs text-[#718096]">{row.description}</span>
              </span>
              <i className="ri-arrow-right-s-line shrink-0 text-xl text-[#718096]" />
            </>

            return row.onClick ? (
              <button key={row.title} type="button" onClick={row.onClick} className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-[#FAFBFC] sm:gap-4 sm:px-5 sm:py-4">
                {content}
              </button>
            ) : (
              <div key={row.title} className="flex items-center gap-3 px-4 py-3.5 sm:gap-4 sm:px-5 sm:py-4">
                {content}
              </div>
            )
          })}
        </div>
      </div>

      {children}
    </div>
  )
}

export const SecondarySection = ({ title, subtitle, children }) => (
  <section className="rounded-2xl border border-[#E6EBF2] bg-white shadow-[0_2px_10px_rgba(15,23,42,0.05)]">
    <div className="border-b border-[#E6EBF2] px-4 py-4 sm:px-5">
      <h2 className="text-base font-bold text-[#152238]">{title}</h2>
      {subtitle && <p className="mt-1 text-xs text-[#718096]">{subtitle}</p>}
    </div>
    {children}
  </section>
)
