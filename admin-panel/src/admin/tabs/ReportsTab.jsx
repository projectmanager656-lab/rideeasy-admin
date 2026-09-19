import React from 'react'
import { SecondaryPageShell } from './SecondaryPageShell'

export default function ReportsTab ({ onReportSelect }) {
  const reportRows = [
    {
      title: 'Earnings Report',
      description: 'View earnings analytics',
      icon: 'ri-money-rupee-circle-line',
      tone: 'blue',
      onClick: () => onReportSelect?.('earnings'),
    },
    {
      title: 'Bookings Report',
      description: 'View bookings analytics',
      icon: 'ri-calendar-check-line',
      tone: 'green',
      onClick: () => onReportSelect?.('bookings'),
    },
    {
      title: 'Drivers Report',
      description: 'View driver performance',
      icon: 'ri-steering-2-line',
      tone: 'orange',
      onClick: () => onReportSelect?.('drivers'),
    },
    {
      title: 'Users Report',
      description: 'View users analytics',
      icon: 'ri-user-3-line',
      tone: 'purple',
      onClick: () => onReportSelect?.('users'),
    },
    {
      title: 'Download Reports',
      description: 'Download data in CSV/PDF',
      icon: 'ri-download-2-line',
      tone: 'navy',
    },
  ]

  return (
    <SecondaryPageShell
      title="Reports"
      subtitle="View platform analytics & reports"
      rows={reportRows}
    />
  )
}
