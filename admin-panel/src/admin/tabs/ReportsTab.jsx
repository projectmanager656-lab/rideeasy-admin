import React from 'react'
import { SecondaryPageShell } from './SecondaryPageShell'
import { downloadReportCsv } from '../../utils/downloadReportCsv'

export default function ReportsTab ({
  onReportSelect,
  rides = [],
  payments = [],
  drivers = [],
  users = [],
}) {
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
      description: 'Download data in CSV',
      icon: 'ri-download-2-line',
      tone: 'navy',
      onClick: () => {
        const rows = rides.map((ride) => ({
          'Ride ID': ride._id || ride.id || '',
          'Status': ride.status || '',
          'Passenger': ride.user?.name || ride.userName || '',
          'Driver': ride.captain?.name || ride.driverName || '',
          'Pickup': ride.pickupLocation || ride.pickup?.address || '',
          'Destination': ride.dropLocation || ride.destination?.address || '',
          'Fare': ride.chargedAmount ?? ride.price ?? 0,
          'Payment Status': ride.paymentStatus || '',
          'Created At': ride.createdAt || '',
        }))

        downloadReportCsv('rideeasy-rides-report.csv', rows)
      },
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
