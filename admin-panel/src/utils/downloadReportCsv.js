export function downloadReportCsv (filename, rows = []) {
  if (!rows.length) {
    return false
  }

  const headers = Object.keys(rows[0])

  const escapeCsv = (value) => {
    const text = value === null || value === undefined
      ? ''
      : String(value)

    return `"${text.replace(/"/g, '""')}"`
  }

  const csv = [
    headers.map(escapeCsv).join(','),
    ...rows.map((row) =>
      headers.map((header) => escapeCsv(row[header])).join(',')
    ),
  ].join('\n')

  const blob = new Blob([csv], {
    type: 'text/csv;charset=utf-8;',
  })

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)

  return true
}
