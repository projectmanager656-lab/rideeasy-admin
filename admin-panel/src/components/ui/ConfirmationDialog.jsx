import React from 'react'
import Modal from './Modal'

const ConfirmationDialog = ({
  open = false,
  onClose,
  onConfirm,
  title = 'Confirm action',
  message = 'Are you sure you want to continue?',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  loading = false,
}) => {
  const confirmStyles = {
    danger: 'bg-[#EF4444] hover:bg-[#DC2626]',
    primary: 'bg-[#FFB21C] text-[#0B1B2B] hover:bg-[#F5A900]',
    warning: 'bg-[#F59E0B] hover:bg-[#D97706]',
  }

  return (
    <Modal
      open={open}
      onClose={loading ? undefined : onClose}
      title={title}
      size="sm"
    >
      <div className="text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-red-50 text-[#EF4444]">
          <i className="ri-question-line text-2xl" />
        </div>

        <p className="mt-4 text-sm leading-6 text-[#718096]">
          {message}
        </p>
      </div>

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          disabled={loading}
          onClick={onClose}
          className="h-11 rounded-xl border border-[#E5E7EB] bg-white px-5 text-sm font-semibold text-[#152238] transition-colors hover:bg-[#F7F9FC] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {cancelLabel}
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={onConfirm}
          className={[
            'inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5',
            'text-sm font-semibold text-white transition-colors',
            'disabled:cursor-not-allowed disabled:opacity-50',
            confirmStyles[variant] || confirmStyles.danger,
          ].join(' ')}
        >
          {loading && (
            <i className="ri-loader-4-line animate-spin" />
          )}

          {confirmLabel}
        </button>
      </div>
    </Modal>
  )
}

export default ConfirmationDialog
