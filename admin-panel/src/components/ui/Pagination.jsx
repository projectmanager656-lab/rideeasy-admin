import React from 'react'

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className = '',
}) => {
  if (totalPages <= 1) {
    return null
  }

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return
    onPageChange?.(page)
  }

  const pages = []

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i += 1) {
      pages.push(i)
    }
  } else {
    pages.push(1)

    if (currentPage > 4) {
      pages.push('...')
    }

    const start = Math.max(2, currentPage - 1)
    const end = Math.min(totalPages - 1, currentPage + 1)

    for (let i = start; i <= end; i += 1) {
      pages.push(i)
    }

    if (currentPage < totalPages - 3) {
      pages.push('...')
    }

    pages.push(totalPages)
  }

  return (
    <div
      className={[
        'flex flex-wrap items-center justify-between gap-3',
        'border-t border-[#E5E7EB] bg-white px-4 py-3',
        className,
      ].join(' ')}
    >
      <p className="text-sm text-[#718096]">
        Page{' '}
        <span className="font-semibold text-[#152238]">
          {currentPage}
        </span>{' '}
        of{' '}
        <span className="font-semibold text-[#152238]">
          {totalPages}
        </span>
      </p>

      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => goToPage(currentPage - 1)}
          className={[
            'grid h-9 w-9 place-items-center rounded-lg',
            'border border-[#E5E7EB] bg-white',
            'text-[#152238] transition-colors',
            'hover:bg-[#F7F9FC]',
            'disabled:cursor-not-allowed disabled:opacity-40',
          ].join(' ')}
          aria-label="Previous page"
        >
          <i className="ri-arrow-left-s-line" />
        </button>

        {pages.map((page, index) =>
          page === '...' ? (
            <span
              key={`ellipsis-${index}`}
              className="grid h-9 w-9 place-items-center text-sm text-[#718096]"
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              type="button"
              onClick={() => goToPage(page)}
              className={[
                'grid h-9 min-w-9 place-items-center rounded-lg px-2',
                'text-sm font-semibold transition-colors',
                page === currentPage
                  ? 'bg-[#FFB21C] text-[#0B1B2B]'
                  : 'border border-[#E5E7EB] bg-white text-[#152238] hover:bg-[#F7F9FC]',
              ].join(' ')}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          )
        )}

        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => goToPage(currentPage + 1)}
          className={[
            'grid h-9 w-9 place-items-center rounded-lg',
            'border border-[#E5E7EB] bg-white',
            'text-[#152238] transition-colors',
            'hover:bg-[#F7F9FC]',
            'disabled:cursor-not-allowed disabled:opacity-40',
          ].join(' ')}
          aria-label="Next page"
        >
          <i className="ri-arrow-right-s-line" />
        </button>
      </div>
    </div>
  )
}

export default Pagination
