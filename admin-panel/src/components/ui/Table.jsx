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
    <div className="w-full overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white">
      <div className="w-full overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="border-b border-[#E5E7EB] bg-[#F7F9FC]">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={[
                    'px-4 py-3 text-left text-xs font-bold',
                    'uppercase tracking-wide text-[#718096]',
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
                  <div className="flex items-center justify-center gap-2 text-sm text-[#718096]">
                    <i className="ri-loader-4-line animate-spin text-lg" />
                    Loading...
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length || 1}
                  className="px-4 py-10 text-center text-sm text-[#718096]"
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
                    'border-b border-[#E5E7EB] last:border-b-0',
                    'transition-colors hover:bg-[#FFF9ED]',
                    onRowClick ? 'cursor-pointer' : '',
                  ].join(' ')}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={[
                        'px-4 py-3 text-sm text-[#152238]',
                        column.cellClassName || '',
                      ].join(' ')}
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
    </div>
  )
}

export default Table
