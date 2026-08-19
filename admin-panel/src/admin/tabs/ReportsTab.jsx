import React from 'react'
import { SecondaryPageShell } from './SecondaryPageShell'

const reportRows = [
  { title: 'Earnings Report', description: 'View earnings analytics', icon: 'ri-money-rupee-circle-line' },
  { title: 'Bookings Report', description: 'View bookings analytics', icon: 'ri-calendar-check-line' },
  { title: 'Drivers Report', description: 'View driver performance', icon: 'ri-steering-2-line' },
  { title: 'Users Report', description: 'View users analytics', icon: 'ri-user-3-line' },
  { title: 'Download Reports', description: 'Download data in CSV/PDF', icon: 'ri-download-2-line' },
]

export default function ReportsTab () {
  return <SecondaryPageShell title="Reports" subtitle="View platform analytics & reports" rows={reportRows} />
}
