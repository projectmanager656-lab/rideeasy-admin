import React, { useEffect } from 'react'

const Modal = ({
  open = false,
  onClose,
  title,
  description,
  children,
  size = 'md',
  showClose = true,
  className = '',
}) => {
  useEffect(() => {
    if (!open) return

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose?.()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [open, onClose])

  if (!open) {
    return null
  }

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'admin-modal-title' : undefined}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose?.()
        }
      }}
    >
      <div className="absolute inset-0 bg-[#0B1B2B]/60 backdrop-blur-sm" />

      <div
        className={[
          'relative z-10 w-full overflow-hidden rounded-2xl',
          'border border-[#E5E7EB] bg-white shadow-2xl',
          sizes[size] || sizes.md,
          className,
        ].join(' ')}
      >
        {(title || showClose) && (
          <div className="flex items-start justify-between gap-4 border-b border-[#E5E7EB] px-5 py-4 sm:px-6">
            <div className="min-w-0">
              {title && (
                <h2
                  id="admin-modal-title"
                  className="text-lg font-bold text-[#152238]"
                >
                  {title}
                </h2>
              )}

              {description && (
                <p className="mt-1 text-sm text-[#718096]">
                  {description}
                </p>
              )}
            </div>

            {showClose && (
              <button
                type="button"
                onClick={onClose}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-[#718096] transition-colors hover:bg-[#F7F9FC] hover:text-[#152238]"
                aria-label="Close modal"
              >
                <i className="ri-close-line text-xl" />
              </button>
            )}
          </div>
        )}

        <div className="max-h-[calc(100vh-180px)] overflow-y-auto px-5 py-5 sm:px-6">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal
