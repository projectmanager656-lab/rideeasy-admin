import React from 'react'

const Table = ({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = 'No data available',
  rowKey = '_id',
  onRowClick,
}) => {
  return (
    <div className="admin-theme-card w-full overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="w-full overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-muted)]">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={[
                    'px-4 py-3 text-left text-xs font-bold',
                    'uppercase tracking-wide text-[var(--color-text-secondary)]',
                    column.className || '',
                  ].join(' ')}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length || 1}
                  className="px-4 py-10 text-center"
                >
                  <div className="flex items-center justify-center gap-2 text-sm text-[var(--color-text-secondary)]">
                    <i className="ri-loader-4-line animate-spin text-lg" />
                    Loading...
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length || 1}
                  className="px-4 py-10 text-center text-sm text-[var(--color-text-secondary)]"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr
                  key={row[rowKey] ?? index}
                  onClick={() => onRowClick?.(row)}
                  className={[
                    'border-b border-[var(--color-border)] last:border-b-0',
                    'transition-colors',
                    onRowClick
                      ? 'cursor-pointer hover:bg-[var(--color-surface-muted)]'
                      : '',
                  ].join(' ')}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={[
                        'px-4 py-3 text-sm text-[var(--color-text-primary)]',
                        column.cellClassName || '',
                      ].join(' ')}
                    >
                      {typeof column.render === 'function'
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
    </div>
  )
}

export default Table
