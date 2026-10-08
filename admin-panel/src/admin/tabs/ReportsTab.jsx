import React from 'react'
import { SecondaryPageShell } from './SecondaryPageShell'
import { downloadReportCsv } from '../../utils/downloadReportCsv'
import { useAdminLanguage } from '../../context/AdminLanguageContext'

export default function ReportsTab ({
  onReportSelect,
  rides = [],
  payments = [],
  drivers = [],
  users = [],
}) {
  const { t } = useAdminLanguage()

  const reportRows = [
    {
      title: t.earningsReport,
      description: t.earningsReportDescription,
      icon: 'ri-money-rupee-circle-line',
      tone: 'blue',
      onClick: () => onReportSelect?.('earnings'),
    },
    {
      title: t.bookingsReport,
      description: t.bookingsReportDescription,
      icon: 'ri-calendar-check-line',
      tone: 'green',
      onClick: () => onReportSelect?.('bookings'),
    },
    {
      title: t.driversReport,
      description: t.driversReportDescription,
      icon: 'ri-steering-2-line',
      tone: 'orange',
      onClick: () => onReportSelect?.('drivers'),
    },
    {
      title: t.usersReport,
      description: t.usersReportDescription,
      icon: 'ri-user-3-line',
      tone: 'purple',
      onClick: () => onReportSelect?.('users'),
    },
    {
      title: t.downloadReports,
      description: t.downloadReportsDescription,
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
      title={t.reportsPageTitle}
      subtitle={t.reportsPageSubtitle}
      rows={reportRows}
    />
  )
}
