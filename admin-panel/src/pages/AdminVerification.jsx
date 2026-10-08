import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminApi } from '../services/adminApi'
import { useAdminLanguage } from '../context/AdminLanguageContext'

const STATUS_FILTERS = [
  'ALL',
  'PENDING',
  'UNDER_REVIEW',
  'APPROVED',
  'REJECTED',
  'EXPIRED',
  'RE_UPLOAD_REQUIRED',
]
const PAGE_SIZE = 10

const normalizeStatus = (value) => {
  return String(value || '')
    .trim()
    .toUpperCase()
    .replaceAll(' ', '_')
    .replaceAll('-', '_')
}

const getDriverId = (driver) => {
  return driver?._id || driver?.id
}

const getDriverName = (driver, t) => {
  return (
    driver?.name ||
    driver?.fullName ||
    driver?.driverName ||
    driver?.user?.name ||
    t.notAvailable
  )
}
const getDriverIdentifier = (driver, t) => {
  return (
    driver?.identifier ||
    driver?.driverId ||
    driver?.driverCode ||
    driver?.user?.identifier ||
    driver?._id ||
    driver?.id ||
    t.notAvailable
  )
}
const getDriverEmail = (driver, t) => {
  return (
    driver?.email ||
    driver?.user?.email ||
    t.notAvailable
  )
}

const getDriverPhone = (driver, t) => {
  return (
    driver?.phone ||
    driver?.mobile ||
    driver?.phoneNumber ||
    driver?.user?.phone ||
    t.notAvailable
  )
}

const getVehicleNumber = (driver, t) => {
  return (
    driver?.vehicleNumber ||
    driver?.vehicle?.number ||
    driver?.vehicle?.registrationNumber ||
    driver?.registrationNumber ||
    t.notAvailable
  )
}

const getVehicleType = (driver, t) => {
  return (
    driver?.vehicleType ||
    driver?.vehicle?.type ||
    driver?.vehicle ||
    t.notAvailable
  )
}

const getCity = (driver, t) => {
  return (
    driver?.city ||
    driver?.servingCity ||
    driver?.location?.city ||
    driver?.user?.city ||
    t.notAvailable
  )
}

const getSubmittedDate = (driver, t) => {
  const value =
    driver?.submittedAt ||
    driver?.submittedDate ||
    driver?.verificationSubmittedAt ||
    driver?.createdAt ||
    driver?.registrationDate

  if (!value) return t.notAvailable

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return String(value)
  }

  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const getDriverStatus = (driver) => {
  if (!driver) return 'PENDING'

  const rawStatus = normalizeStatus(
    driver?.verificationStatus ||
      driver?.verification?.status ||
      driver?.status
  )

  if (rawStatus === 'EXPIRED') {
    return 'EXPIRED'
  }

  if (
    rawStatus === 'REJECTED' ||
    driver?.rejected === true
  ) {
    return 'REJECTED'
  }

  if (
    rawStatus === 'UNDER_REVIEW'
  ) {
    return 'UNDER_REVIEW'
  }

  if (
    rawStatus === 'RE_UPLOAD_REQUIRED' ||
    rawStatus === 'REUPLOAD_REQUIRED'
  ) {
    return 'RE_UPLOAD_REQUIRED'
  }

  if (driver.approved === true || rawStatus === 'APPROVED') {
    return 'APPROVED'
  }

  return 'PENDING'
}
const getPendingDocumentCount = (driver) => {
  const documents =
    driver?.documents ||
    driver?.verification?.documents ||
    []

  if (Array.isArray(documents)) {
    return documents.filter((document) => {
      const status = normalizeStatus(
        document?.status ||
          document?.verificationStatus ||
          document?.approvalStatus
      )

      return (
        status === 'PENDING' ||
        status === 'UNDER_REVIEW' ||
        status === 'RE_UPLOAD_REQUIRED'
      )
    }).length
  }

  if (documents && typeof documents === 'object') {
    return Object.values(documents).filter((document) => {
      const status = normalizeStatus(
        document?.status ||
          document?.verificationStatus ||
          document?.approvalStatus
      )

      return (
        status === 'PENDING' ||
        status === 'UNDER_REVIEW' ||
        status === 'RE_UPLOAD_REQUIRED'
      )
    }).length
  }

  return 0
}

const formatDocumentStatus = (value, t) => {
  const status = normalizeStatus(value || 'PENDING')

  if (status === 'UNDER_REVIEW') return t.underReview
  if (status === 'RE_UPLOAD_REQUIRED') return t.reUploadRequired
  if (status === 'APPROVED') return t.approved
  if (status === 'REJECTED') return t.rejected
  if (status === 'EXPIRED') return t.expired
  return t.pendingReview
}

const documentStatusClasses = (value) => {
  const status = normalizeStatus(value)

  if (status === 'APPROVED') {
    return 'bg-[#EAFBF2] text-[#16803C]'
  }

  if (status === 'REJECTED') {
    return 'bg-[#FEE2E2] text-[#DC2626]'
  }

  if (status === 'UNDER_REVIEW') {
    return 'bg-[#EFF6FF] text-[#2563EB]'
  }

  if (status === 'RE_UPLOAD_REQUIRED') {
    return 'bg-[#FFF3E0] text-[#B86B00]'
  }

  return 'bg-[#FFF7E6] text-[#B77900]'
}

const getDocumentList = (driver) => {
  const rawDocuments =
    driver?.documents ||
    driver?.verification?.documents ||
    []

  if (Array.isArray(rawDocuments)) {
    return rawDocuments.map((document, index) => ({
      id:
        document?._id ||
        document?.id ||
        document?.documentId ||
        `document-${index}`,
      title:
        document?.title ||
        document?.name ||
        document?.type ||
        `Document ${index + 1}`,
      icon:
        document?.icon ||
        getDocumentIcon(document?.type || document?.name),
      status:
        document?.status ||
        document?.verificationStatus ||
        document?.approvalStatus ||
        'PENDING',
      version:
        document?.version ||
        document?.documentVersion ||
        '1',
      uploadedAt:
        document?.uploadedAt ||
        document?.uploadDate ||
        document?.createdAt ||
        null,
      rejectionReason:
        document?.rejectionReason ||
        document?.rejectedReason ||
        document?.reason ||
        '',
      documentUrl:
        document?.documentUrl ||
        document?.url ||
        document?.fileUrl ||
        document?.file ||
        null,
      fields: document?.fields || [],
      raw: document,
    }))
  }

  if (rawDocuments && typeof rawDocuments === 'object') {
    return Object.entries(rawDocuments).map(
      ([key, document], index) => ({
        id:
          document?._id ||
          document?.id ||
          `document-${index}`,
        title:
          document?.title ||
          document?.name ||
          humanizeDocumentName(key),
        icon:
          document?.icon ||
          getDocumentIcon(key),
        status:
          document?.status ||
          document?.verificationStatus ||
          document?.approvalStatus ||
          'PENDING',
        version:
          document?.version ||
          document?.documentVersion ||
          '1',
        uploadedAt:
          document?.uploadedAt ||
          document?.uploadDate ||
          document?.createdAt ||
          null,
        rejectionReason:
          document?.rejectionReason ||
          document?.rejectedReason ||
          document?.reason ||
          '',
        documentUrl:
          document?.documentUrl ||
          document?.url ||
          document?.fileUrl ||
          document?.file ||
          null,
        fields: document?.fields || [],
        raw: document,
      })
    )
  }

  return []
}

const getDocumentExpiryDate = (document) => {
  if (!document) return null

  return (
    document?.expiryDate ||
    document?.expirationDate ||
    document?.expiresAt ||
    document?.expiry ||
    document?.validUntil ||
    document?.validTill ||
    document?.validityDate ||
    null
  )
}

const getDriverExpiryDate = (driver) => {
  if (!driver) return null

  const directExpiry =
    driver?.expiryDate ||
    driver?.expirationDate ||
    driver?.expiresAt ||
    driver?.validUntil ||
    driver?.validTill ||
    driver?.licenseExpiryDate ||
    driver?.licenceExpiryDate ||
    driver?.drivingLicenseExpiryDate ||
    driver?.drivingLicenceExpiryDate ||
    driver?.license?.expiryDate ||
    driver?.licence?.expiryDate ||
    driver?.verification?.expiryDate

  if (directExpiry) {
    return directExpiry
  }

  const rawDocuments =
    driver?.documents ||
    driver?.verification?.documents ||
    []

  const documents = Array.isArray(rawDocuments)
    ? rawDocuments
    : Object.values(rawDocuments || {})

  // Prefer driving licence documents.
  const licenceDocument = documents.find((document) => {
    const name = String(
      document?.title ||
        document?.name ||
        document?.type ||
        document?.documentType ||
        ''
    ).toLowerCase()

    return (
      name.includes('license') ||
      name.includes('licence') ||
      name.includes('driving')
    )
  })

  if (licenceDocument) {
    const expiry = getDocumentExpiryDate(licenceDocument)

    if (expiry) {
      return expiry
    }
  }

  // Fallback: check every document.
  for (const document of documents) {
    const expiry = getDocumentExpiryDate(document)

    if (expiry) {
      return expiry
    }
  }

  return null
}

const getExpiryState = (value, t) => {
  if (!value) {
    return {
      state: 'MISSING',
      label: t.notAvailable,
    }
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return {
      state: 'MISSING',
      label: t.notAvailable,
    }
  }

  const now = new Date()
  const differenceMs =
    date.getTime() - now.getTime()

  const differenceDays =
    differenceMs / (1000 * 60 * 60 * 24)

  if (differenceMs < 0) {
    return {
      state: 'EXPIRED',
      label: t.expired,
    }
  }

  if (differenceDays <= 30) {
    return {
      state: 'EXPIRING_SOON',
      label: t.expiringSoon,
    }
  }

  return {
    state: 'VALID',
    label: t.valid,
  }
}

const formatExpiryDate = (value, t) => {
  if (!value) return t.notAvailable

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return t.notAvailable
  }

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const expiryClasses = (value, t) => {
  const state = getExpiryState(value, {
    notAvailable: t.notAvailable,
    expired: t.expired,
    expiringSoon: t.expiringSoon,
    valid: t.valid,
  }).state

  if (state === 'EXPIRED') {
    return 'bg-[#FEE2E2] text-[#DC2626]'
  }

  if (state === 'EXPIRING_SOON') {
    return 'bg-[#FFF7E6] text-[#B77900]'
  }

  if (state === 'VALID') {
    return 'bg-[#EAFBF2] text-[#16803C]'
  }

  return 'bg-[#F1F5F9] text-[#64748B]'
}
const humanizeDocumentName = (value) => {
  return String(value || 'Document')
    .replaceAll('_', ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

const getDocumentIcon = (value) => {
  const name = String(value || '').toLowerCase()

  if (
    name.includes('license') ||
    name.includes('licence') ||
    name.includes('dl')
  ) {
    return 'ri-id-card-line'
  }

  if (
    name.includes('vehicle') ||
    name.includes('registration') ||
    name.includes('rc')
  ) {
    return 'ri-car-line'
  }

  if (
    name.includes('identity') ||
    name.includes('aadhaar') ||
    name.includes('aadhar') ||
    name.includes('pan')
  ) {
    return 'ri-shield-user-line'
  }

  return 'ri-file-text-line'
}

const formatDate = (value) => {
  if (!value) return t.notAvailable

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return String(value)
  }

  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const AdminVerification = () => {
  const { t } = useAdminLanguage()
  const navigate = useNavigate()

  const [drivers, setDrivers] = useState([])
  const [selectedDriver, setSelectedDriver] = useState(null)
  const [selectedDocument, setSelectedDocument] = useState(null)

  const [statusFilter, setStatusFilter] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [actionLoading, setActionLoading] = useState(false)
  const [actionType, setActionType] = useState('')

  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [rejectCategory, setRejectCategory] = useState('')

  const [page, setPage] = useState(1)

  const loadDrivers = useCallback(async (signal) => {
    setLoading(true)
    setError('')

    try {
      const response = await adminApi.getDrivers(signal)

      let list = []

      if (Array.isArray(response)) {
        list = response
      } else if (Array.isArray(response?.drivers)) {
        list = response.drivers
      } else if (Array.isArray(response?.data)) {
        list = response.data
      } else if (Array.isArray(response?.items)) {
        list = response.items
      }

      setDrivers(list)
    } catch (loadError) {
      if (
        loadError?.name === 'CanceledError' ||
        loadError?.code === 'ERR_CANCELED'
      ) {
        return
      }

      setError(
        loadError?.response?.data?.message ||
          loadError?.message ||
          t.unableToLoadVerificationQueue
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()

    loadDrivers(controller.signal)

    return () => controller.abort()
  }, [loadDrivers])

  const filteredDrivers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    return drivers.filter((driver) => {
      const status = getDriverStatus(driver)

      const statusMatches =
        statusFilter === 'ALL' ||
        status === statusFilter

      const searchableValues = [
        getDriverName(driver, t),
        getDriverEmail(driver, t),
        getDriverPhone(driver, t),
        driver?.identifier,
        driver?.user?.identifier,
        getVehicleNumber(driver, t),
        getCity(driver, t),
        getVehicleType(driver, t),
      ]

      const searchMatches =
        !query ||
        searchableValues
          .filter(Boolean)
          .some((value) =>
            String(value)
              .toLowerCase()
              .includes(query)
          )

      return statusMatches && searchMatches
    })
  }, [drivers, statusFilter, searchQuery])

  useEffect(() => {
    setPage(1)
  }, [statusFilter, searchQuery])

  const totalPages = Math.max(
    1,
    Math.ceil(filteredDrivers.length / PAGE_SIZE)
  )

  const paginatedDrivers = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filteredDrivers.slice(
      start,
      start + PAGE_SIZE
    )
  }, [filteredDrivers, page])

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

  const pendingCount = drivers.filter((driver) => {
    const status = getDriverStatus(driver)

    return (
      status === 'PENDING' ||
      status === 'UNDER_REVIEW' ||
      status === 'RE_UPLOAD_REQUIRED'
    )
  }).length

  const approvedCount = drivers.filter(
    (driver) => getDriverStatus(driver) === 'APPROVED'
  ).length

  const rejectedCount = drivers.filter(
    (driver) => getDriverStatus(driver) === 'REJECTED'
  ).length

  const handleRefresh = async () => {
    await loadDrivers()
  }

  const handleOpenDriver = (driver) => {
    setSelectedDriver(driver)
    setSelectedDocument(null)
  }

  const handleCloseDriver = () => {
    if (actionLoading) return

    setSelectedDriver(null)
    setSelectedDocument(null)
  }

  const handleOpenDocument = (document) => {
    setSelectedDocument(document)
  }

  const handleCloseDocument = () => {
    if (actionLoading) return

    setSelectedDocument(null)
  }

  const handleApprove = async () => {
    if (!selectedDriver || actionLoading) return

    const driverId = getDriverId(selectedDriver)

    if (!driverId) {
      window.alert(t.driverIdMissingApprove)
      return
    }

    const currentStatus = getDriverStatus(selectedDriver)

    if (
      currentStatus === 'APPROVED' ||
      currentStatus === 'REJECTED'
    ) {
      window.alert(
        `This driver is already ${currentStatus.toLowerCase()}.`
      )
      return
    }

    setActionLoading(true)
    setActionType('approve')

    try {
      await adminApi.approveDriver(driverId)

      window.alert(t.verificationApprovedSuccess)

      setSelectedDocument(null)
      setSelectedDriver(null)

      await loadDrivers()
    } catch (actionError) {
      window.alert(
        actionError?.response?.data?.message ||
          actionError?.message ||
          'Unable to approve driver verification'
      )
    } finally {
      setActionLoading(false)
      setActionType('')
    }
  }

  const openRejectModal = () => {
    if (!selectedDriver || actionLoading) return

    const currentStatus = getDriverStatus(selectedDriver)

    if (
      currentStatus === 'REJECTED' ||
      currentStatus === 'APPROVED'
    ) {
      window.alert(
        `This driver is already ${currentStatus.toLowerCase()}.`
      )
      return
    }

    setRejectCategory('')
    setRejectReason('')
    setShowRejectModal(true)
  }

  const closeRejectModal = () => {
    if (actionLoading) return

    setShowRejectModal(false)
    setRejectCategory('')
    setRejectReason('')
  }

  const handleReject = async () => {
    if (!selectedDriver || actionLoading) return

    const reason = rejectReason.trim()

    if (!reason) {
      window.alert(t.rejectReasonMandatory)
      return
    }

    const driverId = getDriverId(selectedDriver)

    if (!driverId) {
      window.alert(t.driverIdMissingReject)
      return
    }

    setActionLoading(true)
    setActionType('reject')

    try {
      const payload = {
        reason,
      }

      if (rejectCategory) {
        payload.category = rejectCategory
      }

      await adminApi.rejectDriver(
        driverId,
        payload
      )

      window.alert(t.verificationRejectedSuccess)

      setShowRejectModal(false)
      setRejectCategory('')
      setRejectReason('')
      setSelectedDocument(null)
      setSelectedDriver(null)

      await loadDrivers()
    } catch (actionError) {
      window.alert(
        actionError?.response?.data?.message ||
          actionError?.message ||
          'Unable to reject driver verification'
      )
    } finally {
      setActionLoading(false)
      setActionType('')
    }
  }

  const handleComplianceApprove = async () => {
    if (!selectedDriver || !selectedDocument || actionLoading) return

    const documentType = String(
      selectedDocument?.raw?.documentType || ''
    ).trim().toUpperCase()

    if (!documentType) {
      window.alert('Compliance document type is missing.')
      return
    }

    await handleComplianceStatusChange(documentType, 'APPROVED')
  }

  const handleComplianceReject = async () => {
    if (!selectedDriver || !selectedDocument || actionLoading) return

    const documentType = String(
      selectedDocument?.raw?.documentType || ''
    ).trim().toUpperCase()

    if (!documentType) {
      window.alert('Compliance document type is missing.')
      return
    }

    await handleComplianceStatusChange(documentType, 'REJECTED')
  }

  const handleComplianceStatusChange = async (documentType, status) => {
    if (!selectedDriver || actionLoading) return

    const driverId = getDriverId(selectedDriver)

    if (!driverId) {
      window.alert(t.driverIdMissingCompliance)
      return
    }

    setActionLoading(true)
    setActionType(`compliance-${documentType}`)

    try {
      await adminApi.updateDriverCompliance(driverId, {
        documentType,
        status,
      })

      window.alert(t.complianceStatusUpdated)

      setSelectedDocument(null)
      setSelectedDriver(null)

      await loadDrivers()
    } catch (actionError) {
      window.alert(
        actionError?.response?.data?.message ||
          actionError?.message ||
          'Unable to update compliance status'
      )
    } finally {
      setActionLoading(false)
      setActionType('')
    }
  }

  const handleComplianceUpload = async (documentType, file) => {
    if (!selectedDriver || actionLoading || !file) return

    const driverId = getDriverId(selectedDriver)

    if (!driverId) {
      window.alert(t.driverIdMissingUpload)
      return
    }

    const formData = new FormData()
    formData.append('documentType', documentType)
    formData.append('document', file)

    setActionLoading(true)
    setActionType(`compliance-upload-${documentType}`)

    try {
      await adminApi.uploadDriverComplianceDocument(driverId, formData)

      window.alert(t.complianceDocumentUploaded)

      setSelectedDocument(null)
      setSelectedDriver(null)

      await loadDrivers()
    } catch (actionError) {
      window.alert(
        actionError?.response?.data?.message ||
          actionError?.message ||
          'Unable to upload compliance document'
      )
    } finally {
      setActionLoading(false)
      setActionType('')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminRole')

    navigate('/admin', {
      replace: true,
    })
  }

  return (
    <>
      <div className="space-y-6">

        {/* PAGE HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#718096]">
              {t.adminVerification}
            </p>

            <h1 className="mt-2 text-2xl font-bold tracking-[-0.03em] text-[#152238] sm:text-3xl">
              {t.documentVerification}
            </h1>

            <p className="mt-1 max-w-2xl text-sm text-[#718096]">
              {t.reviewVerificationRequests}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex w-fit items-center rounded-full bg-[#FFF7E6] px-3 py-1.5 text-xs font-semibold text-[#B77900]">
              {pendingCount} {t.pending}
            </div>

            <button
              type="button"
              onClick={handleRefresh}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-3.5 py-2 text-sm font-semibold text-[#152238] shadow-sm transition hover:border-[#FFB21C] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <i
                className={`ri-refresh-line ${
                  loading ? 'animate-spin' : ''
                }`}
              />
              {t.refresh}
            </button>
          </div>
        </div>

        {/* SUMMARY */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <SummaryCard
            title={t.totalDrivers}
            value={drivers.length}
            icon="ri-group-line"
          />

          <SummaryCard
            title={t.pendingReview}
            value={pendingCount}
            icon="ri-time-line"
            warning
          />

          <SummaryCard
            title={t.approved}
            value={approvedCount}
            icon="ri-checkbox-circle-line"
            success
          />
        </div>

        {/* QUEUE */}
        <section className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">

          {/* SECTION HEADER */}
          <div className="flex flex-col gap-1 border-b border-[#E5E7EB] px-5 py-5 sm:px-6">
            <h2 className="text-lg font-bold text-[#152238]">
              {t.verificationQueue}
            </h2>

            <p className="text-sm text-[#718096]">
              {t.reviewVerificationRequests}
            </p>
          </div>

          {/* SEARCH + FILTERS */}
          <div className="space-y-4 border-b border-[#E5E7EB] p-4 sm:p-5">

            <div className="relative max-w-xl">
              <i className="ri-search-line pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />

              <input
                type="text"
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
                placeholder={t.searchVerification}
                className="w-full rounded-xl border border-[#E5E7EB] bg-white py-2.5 pl-10 pr-4 text-sm text-[#152238] outline-none placeholder:text-[#94A3B8] focus:border-[#FFB21C] focus:ring-2 focus:ring-[#FFB21C]/20"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {STATUS_FILTERS.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`rounded-xl px-3 py-2 text-xs font-semibold transition ${
                    statusFilter === status
                      ? 'bg-[#FFB21C] text-[#0B1B2B]'
                      : 'border border-[#E5E7EB] bg-white text-[#718096] hover:border-[#FFB21C] hover:text-[#152238]'
                  }`}
                >
                  {status === 'ALL'
                    ? t.all
                    : formatDocumentStatus(status, t)}
                </button>
              ))}
            </div>
          </div>

          {/* CONTENT */}
          {loading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState
              message={error}
              onRetry={handleRefresh}
            />
          ) : filteredDrivers.length === 0 ? (
            <EmptyState
              hasFilters={
                Boolean(searchQuery.trim()) ||
                statusFilter !== 'ALL'
              }
            />
          ) : (
            <>
              {/* DESKTOP TABLE */}
              <div className="hidden overflow-x-auto md:block">
                <table className="min-w-full">
                  <thead className="bg-[#F7F9FC]">
                    <tr>
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#718096]">
  {t.driver}</th>

<th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#718096]">
  {t.documentStatus}</th>

<th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#718096]">
  {t.verification}</th>

<th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#718096]">
  {t.expiry}</th>

<th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#718096]">
  {t.lastUpdated}</th>

<th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-[#718096]">
  {t.action}</th>
                    </tr>
                  </thead>

                  <tbody>
                    {paginatedDrivers.map((driver) => (
                      <DriverTableRow
                        key={getDriverId(driver)}
                        driver={driver}
                        onOpen={handleOpenDriver}
                      />
                    ))}
                  </tbody>
                </table>
              </div>

              {/* MOBILE */}
              <div className="space-y-3 p-4 md:hidden">
                {paginatedDrivers.map((driver) => (
                  <DriverMobileCard
                    key={getDriverId(driver)}
                    driver={driver}
                    onOpen={handleOpenDriver}
                  />
                ))}
              </div>

              {/* PAGINATION */}
              {totalPages > 1 && (
                <Pagination
                  page={page}
                  totalPages={totalPages}
                  total={filteredDrivers.length}
                  onPageChange={setPage}
                />
              )}
            </>
          )}
        </section>
      </div>

      {/* DRIVER DOCUMENT LIST MODAL */}
      {selectedDriver && !selectedDocument && (
        <DriverDocumentsModal
          driver={selectedDriver}
          actionLoading={actionLoading}
          onClose={handleCloseDriver}
          onOpenDocument={handleOpenDocument}
          onApprove={handleApprove}
          onReject={openRejectModal}
          onComplianceStatusChange={handleComplianceStatusChange}
          onComplianceUpload={handleComplianceUpload}
        />
      )}

      {/* DOCUMENT DETAIL MODAL */}
      {selectedDocument && (
        <DocumentDetailsModal
          driver={selectedDriver}
          document={selectedDocument}
          actionLoading={actionLoading}
          onBack={handleCloseDocument}
          onApprove={handleComplianceApprove}
          onReject={handleComplianceReject}
        />
      )}

      {/* REJECT MODAL */}
      {showRejectModal && selectedDriver && (
        <RejectModal
          driver={selectedDriver}
          category={rejectCategory}
          reason={rejectReason}
          loading={actionLoading}
          onCategoryChange={setRejectCategory}
          onReasonChange={setRejectReason}
          onClose={closeRejectModal}
          onSubmit={handleReject}
        />
      )}
    </>
  )
}

function SummaryCard ({
  title,
  value,
  icon,
  warning,
  success,
}) {
  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div
          className={`grid h-10 w-10 place-items-center rounded-xl ${
            warning
              ? 'bg-[#FFF7E6] text-[#B77900]'
              : success
                ? 'bg-[#EAFBF2] text-[#16A34A]'
                : 'bg-[#EFF6FF] text-[#2563EB]'
          }`}
        >
          <i className={`${icon} text-lg`} />
        </div>

        <div>
          <p className="text-xs font-medium text-[#718096]">
            {title}
          </p>

          <p className="mt-0.5 text-xl font-bold text-[#152238]">
            {value}
          </p>
        </div>
      </div>
    </div>
  )
}

function DriverTableRow ({
  driver,
  onOpen,
}) {
  const { t } = useAdminLanguage()
  const status = getDriverStatus(driver)
  const documents = getDocumentList(driver)

  const documentStatus =
    documents.length > 0
      ? normalizeStatus(
          documents[0]?.status || 'PENDING'
        )
      : 'PENDING'

  const expiryDate = getDriverExpiryDate(driver)
  const expiryState = getExpiryState(expiryDate, t)

  const lastUpdated =
    driver?.updatedAt ||
    driver?.verification?.updatedAt ||
    driver?.verificationUpdatedAt ||
    driver?.lastUpdatedAt ||
    driver?.submittedAt ||
    driver?.createdAt ||
    null

  return (
    <tr className="border-t border-[#E5E7EB] transition hover:bg-[#FCFDFE]">

      {/* DRIVER */}
      <td className="px-5 py-4">
        <div>
          <p className="font-semibold text-[#152238]">
            {getDriverName(driver, t)}
          </p>

          <p className="mt-1 text-xs text-[#718096]">
            ID: {getDriverIdentifier(driver, t)}
          </p>

          <p className="mt-1 text-xs text-[#718096]">
            {getDriverPhone(driver, t)}
          </p>
        </div>
      </td>

      {/* DOCUMENT STATUS */}
      <td className="px-5 py-4">
        <StatusBadge status={documentStatus} />
      </td>

      {/* VERIFICATION STATUS */}
      <td className="px-5 py-4">
        <StatusBadge status={status} />
      </td>

      {/* EXPIRY */}
      <td className="px-5 py-4">
        <div>
          <p className="text-sm font-medium text-[#152238]">
            {formatExpiryDate(expiryDate, t)}
          </p>

          {expiryDate && (
            <span
              className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${expiryClasses(
                expiryDate,
                t
              )}`}
            >
              {expiryState.label}
            </span>
          )}
        </div>
      </td>

      {/* LAST UPDATED */}
      <td className="px-5 py-4 text-sm text-[#718096]">
        {formatDate(lastUpdated)}
      </td>

      {/* ACTION */}
      <td className="px-5 py-4 text-right">
        <button
          type="button"
          onClick={() => onOpen(driver)}
          className="rounded-xl bg-[#FFB21C] px-4 py-2.5 text-sm font-semibold text-[#0B1B2B] shadow-sm transition hover:bg-[#F5A900]"
        >
          {t.viewDocuments}
        </button>
      </td>

    </tr>
  )
}
function DriverMobileCard ({
  driver,
  onOpen,
}) {
  const { t } = useAdminLanguage()
  const status = getDriverStatus(driver)
  const documents = getDocumentList(driver)

  const documentStatus =
    documents.length > 0
      ? normalizeStatus(
          documents[0]?.status || 'PENDING'
        )
      : 'PENDING'

  const expiryDate = getDriverExpiryDate(driver)
  const expiryState = getExpiryState(expiryDate, t)

  const lastUpdated =
    driver?.updatedAt ||
    driver?.verification?.updatedAt ||
    driver?.verificationUpdatedAt ||
    driver?.lastUpdatedAt ||
    driver?.submittedAt ||
    driver?.createdAt ||
    null

  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-bold text-[#152238]">
            {getDriverName(driver, t)}
          </h3>

          <p className="mt-1 text-xs text-[#718096]">
            ID: {getDriverIdentifier(driver, t)}
          </p>

          <p className="mt-1 text-xs text-[#718096]">
            {getDriverPhone(driver, t)}
          </p>
        </div>

        <StatusBadge status={status} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-[#F7F9FC] p-3">
          <p className="text-[11px] font-semibold uppercase text-[#94A3B8]">
            Document
          </p>
          <p className="mt-1 text-sm font-semibold text-[#152238]">
            <StatusBadge status={documentStatus} />
          </p>
        </div>

        <div className="rounded-xl bg-[#F7F9FC] p-3">
          <p className="text-[11px] font-semibold uppercase text-[#94A3B8]">
            Expiry
          </p>

          <p className="mt-1 text-sm font-semibold text-[#152238]">
            {formatExpiryDate(expiryDate, t)}
          </p>

          {expiryDate && (
            <span
              className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold ${expiryClasses(
                expiryDate,
                t
              )}`}
            >
              {expiryState.label}
            </span>
          )}
        </div>
      </div>

      <div className="mt-3 border-t border-[#F0F2F5] pt-3">
        <p className="text-xs text-[#94A3B8]">
          Last updated
        </p>

        <p className="mt-1 text-xs font-medium text-[#718096]">
          {formatDate(lastUpdated)}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onOpen(driver)}
        className="mt-4 w-full rounded-xl bg-[#FFB21C] px-4 py-2.5 text-sm font-semibold text-[#0B1B2B]"
      >
        {t.viewDocuments}
      </button>
    </div>
  )
}
function StatusBadge ({ status }) {
  const normalized = normalizeStatus(status)

  let classes = 'bg-[#FFF7E6] text-[#B77900]'

  if (normalized === 'APPROVED') {
    classes = 'bg-[#EAFBF2] text-[#16803C]'
  } else if (normalized === 'REJECTED') {
    classes = 'bg-[#FEE2E2] text-[#DC2626]'
  } else if (normalized === 'UNDER_REVIEW') {
    classes = 'bg-[#EFF6FF] text-[#2563EB]'
  } else if (normalized === 'RE_UPLOAD_REQUIRED') {
    classes = 'bg-[#FFF3E0] text-[#B86B00]'
  } else if (normalized === 'EXPIRED') {
    classes = 'bg-[#FEE2E2] text-[#DC2626]'
  }

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${classes}`}
    >
      {normalized
        ? normalized.replaceAll('_', ' ')
        : t.notAvailable}
    </span>
  )
}

function DriverDocumentsModal ({
  driver,
  actionLoading,
  onClose,
  onOpenDocument,
  onApprove,
  onReject,
  onComplianceStatusChange,
  onComplianceUpload,
}) {
  const { t } = useAdminLanguage()

  const documents = getDocumentList(driver)
  const status = getDriverStatus(driver)

  const licence =
    driver?.license ||
    driver?.licence ||
    'Not available'

  const vehicleNumber =
    getVehicleNumber(driver, t)

  const vehicleType =
    getVehicleType(driver, t)

  const rejectionReason =
    driver?.rejectionReason ||
    driver?.rejectedReason ||
    driver?.verification?.rejectionReason ||
    driver?.verification?.rejectedReason ||
    ''

  const subscriptionExpiry =
    driver?.subscriptionExpiresAt || null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-3 py-4 sm:px-4 sm:py-6">
      <div className="flex max-h-[90vh] w-full max-w-[760px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-4">
          <div>
            <h2 className="text-lg font-bold text-[#152238]">
              {t.verificationDocuments}
            </h2>

            <p className="mt-0.5 text-xs text-[#718096]">
              {t.reviewDriverVerificationInfo}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={actionLoading}
            className="grid h-9 w-9 place-items-center rounded-lg text-[#64748B] transition hover:bg-[#F1F5F9] disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={t.close}
          >
            <i className="ri-close-line text-xl" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {/* DRIVER SUMMARY */}
          <div className="border-b border-[#E5E7EB] bg-[#F7F9FC] p-4 sm:p-5">

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

            <InfoBox
              label={t.driver}
              value={getDriverName(driver, t)}
            />

            <InfoBox
              label={t.phone}
              value={getDriverPhone(driver, t)}
            />

            <InfoBox
              label={t.email}
              value={getDriverEmail(driver, t)}
            />

            <InfoBox
              label={t.city}
              value={getCity(driver, t)}
            />

            <InfoBox
              label={t.vehicleType}
              value={vehicleType}
            />

            <InfoBox
              label={t.vehicleNumber}
              value={vehicleNumber}
            />

            <InfoBox
              label={t.licence}
              value={licence}
            />

            <InfoBox
              label={t.lastUpdated}
              value={getSubmittedDate(driver, t)}
            />

          </div>

          {/* VERIFICATION STATUS */}
          <div className="mt-4 flex items-center justify-between rounded-xl border border-[#E5E7EB] bg-white px-4 py-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-[#718096]">
              {t.overallStatus}
            </span>

            <StatusBadge status={status} />
          </div>

          {/* SUBSCRIPTION EXPIRY */}
          {subscriptionExpiry && (
            <div className="mt-3 rounded-xl border border-[#E5E7EB] bg-white px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#718096]">
                    {t.subscriptionExpiry}
                  </p>

                  <p className="mt-1 text-sm font-semibold text-[#152238]">
                    {formatExpiryDate(subscriptionExpiry, t)}
                  </p>
                </div>

                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${expiryClasses(
                    subscriptionExpiry,
                    t
                  )}`}
                >
                  {getExpiryState(subscriptionExpiry, t).label}
                </span>
              </div>
            </div>
          )}

          {/* REJECTION REASON */}
          {status === 'REJECTED' && rejectionReason && (
            <div className="mt-3 rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#B91C1C]">
                {t.rejectionReason}
              </p>

              <p className="mt-1 text-sm leading-5 text-[#7F1D1D]">
                {rejectionReason}
              </p>
            </div>
          )}
        </div>

        {/* COMPLIANCE */}
        <div className="border-b border-[#E5E7EB] bg-white p-4 sm:p-5">
          <div className="mb-3">
            <h3 className="text-sm font-bold text-[#152238]">
              {t.captainCompliance}
            </h3>
            <p className="mt-1 text-xs text-[#718096]">
              {t.reviewCompliance}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              {
                title: t.policeVerification,
                type: 'POLICE_VERIFICATION',
                icon: 'ri-police-car-line',
              },
              {
                title: t.medicalFitness,
                type: 'MEDICAL_FITNESS',
                icon: 'ri-heart-pulse-line',
              },
              {
                title: t.eyeExamination,
                type: 'EYE_EXAMINATION',
                icon: 'ri-eye-line',
              },
              {
                title: t.psychologicalAssessment,
                type: 'PSYCHOLOGICAL_ASSESSMENT',
                icon: 'ri-mental-health-line',
              },
            ].map((item) => {
              const complianceDocument =
                documents.find(
                  (document) =>
                    String(document?.raw?.documentType || '').toUpperCase() ===
                    item.type
                ) || null

              const complianceStatus =
                complianceDocument?.status || 'PENDING'

              const complianceStatusLabel =
                formatDocumentStatus(complianceStatus, t)

              const complianceSubmittedText = complianceDocument
                ? complianceDocument.uploadedAt
                  ? `${t.submitted} ${formatDate(complianceDocument.uploadedAt)}`
                  : t.submitted
                : t.notSubmitted

              return (
                <div
                  key={item.title}
                  className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-[#2563EB] shadow-sm">
                        <i className={`${item.icon} text-lg`} />
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#152238]">
                          {item.title}
                        </p>
                        <p className="mt-1 text-xs text-[#94A3B8]">
                          {complianceSubmittedText}
                        </p>
                      </div>
                    </div>

                    <select
                      value={complianceStatus}
                      disabled={actionLoading}
                      onChange={(event) =>
                        onComplianceStatusChange(
                          item.type,
                          event.target.value
                        )
                      }
                      className="shrink-0 rounded-full border border-[#F3D79B] bg-[#FFF7E6] px-2.5 py-1 text-xs font-semibold text-[#B77900] outline-none disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {[
                        'PENDING',
                        'UNDER_REVIEW',
                        'APPROVED',
                        'REJECTED',
                        'EXPIRED',
                        'RE_UPLOAD_REQUIRED',
                      ].map((status) => (
                        <option key={status} value={status}>
                          {formatDocumentStatus(status, t)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <label
                      className={`inline-flex cursor-pointer items-center rounded-lg border border-[#CBD5E1] bg-white px-3 py-2 text-xs font-semibold text-[#334155] transition hover:bg-[#F8FAFC] ${
                        actionLoading
                          ? 'pointer-events-none opacity-60'
                          : ''
                      }`}
                    >
                      <input
                        type="file"
                        accept=".pdf,image/jpeg,image/png,image/webp"
                        className="hidden"
                        disabled={actionLoading}
                        onChange={(event) => {
                          const file = event.target.files?.[0]
                          if (file) {
                            onComplianceUpload(item.type, file)
                          }
                          event.target.value = ''
                        }}
                      />
                      <i className="ri-upload-2-line mr-1.5" />
                      {t.uploadDocument}
                    </label>

                    {complianceDocument?.raw?.documentUrl ? (
                      <button
                        type="button"
                        onClick={() => onOpenDocument(complianceDocument)}
                        className="inline-flex items-center rounded-lg border border-[#BFDBFE] bg-[#EFF6FF] px-3 py-2 text-xs font-semibold text-[#2563EB] transition hover:bg-[#DBEAFE]"
                      >
                        <i className="ri-eye-line mr-1.5" />
                        {t.view}
                      </button>
                    ) : null}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* DOCUMENT LIST */}
        <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">

          {documents.length === 0 ? (
            <div className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] px-5 text-center">

              <div className="grid h-12 w-12 place-items-center rounded-xl bg-white text-xl text-[#94A3B8] shadow-sm">
                <i className="ri-file-search-line" />
              </div>

              <h3 className="mt-3 font-semibold text-[#475569]">
                {t.noDocumentsAvailable}
              </h3>

              <p className="mt-1 max-w-sm text-xs leading-5 text-[#94A3B8]">
                {t.noDocumentsReturned}
              </p>

            </div>
          ) : (
            <div className="space-y-3">
              {documents.map((document) => (
                <button
                  key={document.id}
                  type="button"
                  onClick={() => onOpenDocument(document)}
                  className="flex w-full items-center justify-between gap-4 rounded-xl border border-[#E5E7EB] bg-white p-4 text-left transition hover:border-[#CBD5E1] hover:bg-[#F8FAFC]"
                >
                  <div className="flex min-w-0 items-center gap-3">

                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#FFF7E6] text-[#B77900]">
                      <i className={`${document.icon} text-lg`} />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#152238]">
                        {document.title}
                      </p>

                      <p className="mt-1 text-xs text-[#94A3B8]">
                        {t.version} {document.version}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${documentStatusClasses(
                      document.status
                    )}`}
                  >
                    {formatDocumentStatus(document.status, t)}
                  </span>
                </button>
              ))}
            </div>
          )}

        </div>
        </div>

        {/* ACTIONS */}
        <div className="border-t border-[#E5E7EB] bg-white px-4 py-4 sm:px-5">

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={onClose}
              disabled={actionLoading}
              className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm font-semibold text-[#475569] transition hover:bg-[#F8FAFC] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Close
            </button>

            {status !== 'APPROVED' && (
              <button
                type="button"
                onClick={onApprove}
                disabled={actionLoading}
                className="rounded-xl bg-[#16A34A] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#15803D] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {actionLoading
                  ? t.processing
                  : t.approve}
              </button>
            )}

            {status !== 'REJECTED' && (
              <button
                type="button"
                onClick={onReject}
                disabled={actionLoading}
                className="rounded-xl bg-[#DC2626] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#B91C1C] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {actionLoading
                  ? t.processing
                  : t.reject}
              </button>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
function DocumentDetailsModal ({
  driver,
  document,
  actionLoading,
  onBack,
  onApprove,
  onReject,
}) {
  const { t } = useAdminLanguage()
  const status = normalizeStatus(document.status)
  const [previewUrl, setPreviewUrl] = useState('')
  const [previewMimeType, setPreviewMimeType] = useState('')
  const [previewLoading, setPreviewLoading] = useState(false)
  const [previewError, setPreviewError] = useState('')

  useEffect(() => {
    let objectUrl = ''

    const loadPreview = async () => {
      const documentType = String(
        document?.raw?.documentType || ''
      ).trim().toUpperCase()
      const driverId = getDriverId(driver)

      if (!driverId || !documentType || !document?.documentUrl) {
        setPreviewUrl('')
        setPreviewMimeType('')
        setPreviewError('')
        setPreviewLoading(false)
        return
      }

      setPreviewLoading(true)
      setPreviewError('')

      try {
        const blob = await adminApi.getDriverComplianceDocument(
          driverId,
          documentType
        )

        objectUrl = URL.createObjectURL(blob)
        setPreviewMimeType(blob.type || '')
        setPreviewUrl(objectUrl)
      } catch (error) {
        setPreviewUrl('')
        setPreviewMimeType('')
        setPreviewError(
          error?.response?.data?.message ||
            error?.message ||
            t.unableToLoadDocumentPreview
        )
      } finally {
        setPreviewLoading(false)
      }
    }

    loadPreview()

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
      }
    }
  }, [driver, document])

  const canApprove =
    status !== 'APPROVED' &&
    status !== 'REJECTED'

  const canReject =
    status !== 'APPROVED' &&
    status !== 'REJECTED'

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-3 py-4 sm:px-4 sm:py-6">
      <div className="flex max-h-[90vh] w-full max-w-[560px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">

        {/* HEADER */}
        <div className="flex shrink-0 items-center justify-between border-b border-[#E5E7EB] px-4 py-3.5 sm:px-5 sm:py-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#FFF7E6] text-[#B77900]">
              <i className={`${document.icon} text-lg`} />
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-base font-bold text-[#152238] sm:text-lg">
                {document.title}
              </h2>

              <p className="mt-0.5 text-xs text-[#718096]">
                {t.documentReview}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onBack}
            disabled={actionLoading}
            className="ml-3 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#F7F9FC] text-[#718096] transition hover:bg-[#E5E7EB] disabled:opacity-50"
            aria-label={t.close}
          >
            <i className="ri-close-line text-lg" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4 sm:p-5">

          {/* STATUS */}
          <div className="rounded-xl border border-[#E5E7EB] bg-[#F7F9FC] px-3.5 py-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[#718096]">
                  {t.statusLabel}
                </p>

                <p className="mt-0.5 text-sm font-semibold text-[#152238]">
                  {formatDocumentStatus(document.status, t)}
                </p>
              </div>

              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${documentStatusClasses(document.status)}`}
              >
                {formatDocumentStatus(document.status, t)}
              </span>
            </div>
          </div>

          {/* VERSION / UPLOAD */}
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <InfoBox
              label={t.versionLabel}
              value={document.version || '1'}
            />

            <InfoBox
              label={t.uploadDate}
              value={formatDate(document.uploadedAt)}
            />
          </div>

          {/* REJECTION REASON */}
          {document.rejectionReason && (
            <div className="rounded-xl border border-[#FCA5A5] bg-[#FFF8F8] px-3.5 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#DC2626]">
                {t.rejectionReason}
              </p>

              <p className="mt-1 text-sm leading-5 text-[#7F1D1D]">
                {document.rejectionReason}
              </p>
            </div>
          )}

          {/* DOCUMENT INFORMATION */}
          <div>
            <h3 className="mb-2.5 text-sm font-bold text-[#152238]">
              {t.documentInformation}
            </h3>

            {document.fields?.length ? (
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {document.fields.map(
                  ([label, value], index) => (
                    <InfoBox
                      key={`${label}-${index}`}
                      label={label}
                      value={value}
                    />
                  )
                )}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] px-4 py-5 text-center">
                <p className="text-sm font-semibold text-[#475569]">
                  {t.noExtractedDocumentInformation}
                </p>

                <p className="mt-1 text-xs text-[#94A3B8]">
                  {t.apiDidNotProvideDocumentFields}
                </p>
              </div>
            )}
          </div>

          {/* PREVIEW */}
          <div>
            <div className="mb-2.5 flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#152238]">
                {t.documentPreview}
              </h3>

              {previewUrl && (
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-[#B77900] hover:underline"
                >
                  {t.openDocument}
                </a>
              )}
            </div>

            {previewLoading ? (
              <div className="flex min-h-[180px] items-center justify-center rounded-xl border border-[#E5E7EB] bg-[#F7F9FC]">
                <div className="text-center">
                  <i className="ri-loader-4-line animate-spin text-2xl text-[#B77900]" />
                  <p className="mt-2 text-xs text-[#718096]">
                    {t.loadingDocumentPreview}
                  </p>
                </div>
              </div>
            ) : previewUrl ? (
              <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-[#F7F9FC]">
                {previewMimeType.toLowerCase() === 'application/pdf' ? (
                  <iframe
                    src={previewUrl}
                    title={`${document.title} document`}
                    className="h-[320px] w-full border-0"
                  />
                ) : (
                  <img
                    src={previewUrl}
                    alt={`${document.title} document`}
                    className="max-h-[320px] w-full object-contain"
                  />
                )}
              </div>
            ) : (
              <div className="flex min-h-[140px] flex-col items-center justify-center rounded-xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] px-4 py-5 text-center">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-white text-lg text-[#94A3B8] shadow-sm">
                  <i className="ri-file-search-line" />
                </div>

                <p className="mt-2.5 text-sm font-semibold text-[#475569]">
                  {previewError || t.previewUnavailable}
                </p>

                <p className="mt-0.5 max-w-xs text-[11px] leading-4 text-[#94A3B8]">
                  {t.authorizedDocumentPreviewUnavailable}
                </p>
              </div>
            )}
          </div>

        </div>

        {/* FOOTER */}
        <div className="flex shrink-0 items-center justify-between gap-2 border-t border-[#E5E7EB] bg-[#F7F9FC] p-3 sm:p-4">
          <button
            type="button"
            onClick={onBack}
            disabled={actionLoading}
            className="rounded-xl border border-[#D1D5DB] bg-white px-3.5 py-2 text-sm font-semibold text-[#475569] transition hover:bg-[#F8FAFC] disabled:opacity-50"
          >
            {t.back}
          </button>

          <div className="flex items-center gap-2">
            {canReject && (
              <button
                type="button"
                onClick={onReject}
                disabled={actionLoading}
                className="rounded-xl border border-[#FCA5A5] bg-white px-3.5 py-2 text-sm font-semibold text-[#DC2626] transition hover:bg-red-50 disabled:opacity-50"
              >
                {t.reject}
              </button>
            )}

            {canApprove && (
              <button
                type="button"
                onClick={onApprove}
                disabled={actionLoading}
                className="rounded-xl bg-[#16A34A] px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-[#15803D] disabled:opacity-50"
              >
                {actionLoading ? t.processing : t.approve}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function RejectModal ({
  driver,
  category,
  reason,
  loading,
  onCategoryChange,
  onReasonChange,
  onClose,
  onSubmit,
}) {
  const { t } = useAdminLanguage()

  const categories = [
    'Invalid document',
    t.documentExpired,
    t.documentUnreadable,
    'Information mismatch',
    'Vehicle information mismatch',
    'Missing document',
    'Other',
  ]

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 px-3 py-4">
      <div className="w-full max-w-[500px] overflow-hidden rounded-2xl bg-white shadow-2xl">

        <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-4">
          <div>
            <h2 className="font-bold text-[#152238]">
              {t.rejectVerification}
            </h2>

            <p className="mt-1 text-xs text-[#718096]">
              {getDriverName(driver, t)}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="grid h-9 w-9 place-items-center rounded-xl bg-[#F7F9FC] text-[#718096] disabled:opacity-50"
          >
            <i className="ri-close-line text-lg" />
          </button>
        </div>

        <div className="space-y-4 p-5">

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-[#152238]">
              {t.reasonCategory}
              <span className="ml-1 text-xs font-normal text-[#94A3B8]">
                {t.optional}
              </span>
            </label>

            <select
              value={category}
              onChange={(event) =>
                onCategoryChange(event.target.value)
              }
              disabled={loading}
              className="w-full rounded-xl border border-[#E5E7EB] bg-white px-3.5 py-2.5 text-sm text-[#152238] outline-none focus:border-[#FFB21C] focus:ring-2 focus:ring-[#FFB21C]/20"
            >
              <option value="">
                {t.selectReasonCategory}
              </option>

              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-[#152238]">
              {t.rejectionReason}
              <span className="ml-1 text-[#DC2626]">*</span>
            </label>

            <textarea
              value={reason}
              onChange={(event) =>
                onReasonChange(event.target.value)
              }
              disabled={loading}
              rows={5}
              placeholder={t.enterRejectionReason}
              className="w-full resize-none rounded-xl border border-[#E5E7EB] bg-white px-3.5 py-3 text-sm text-[#152238] outline-none placeholder:text-[#94A3B8] focus:border-[#FFB21C] focus:ring-2 focus:ring-[#FFB21C]/20 disabled:bg-[#F7F9FC]"
            />

            <p className="mt-1 text-xs text-[#94A3B8]">
              {t.rejectionReasonBackend}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-[#E5E7EB] bg-[#F7F9FC] p-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-[#D1D5DB] bg-white px-4 py-2.5 text-sm font-semibold text-[#475569] disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onSubmit}
            disabled={loading || !reason.trim()}
            className="rounded-xl bg-[#DC2626] px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? t.rejecting : t.confirmReject}
          </button>
        </div>
      </div>
    </div>
  )
}

function InfoBox ({
  label,
  value,
}) {
  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-white px-3 py-2.5">
      <p className="text-[11px] text-[#718096]">
        {label}
      </p>

      <p className="mt-0.5 break-words text-sm font-semibold text-[#152238]">
        {value || t.notAvailable}
      </p>
    </div>
  )
}

function LoadingState () {
  const { t } = useAdminLanguage()

  return (
    <div className="flex min-h-[280px] items-center justify-center px-6 py-12">
      <div className="text-center">
        <i className="ri-loader-4-line inline-block animate-spin text-3xl text-[#FFB21C]" />

        <p className="mt-3 text-sm text-[#718096]">
          {t.loadingVerificationQueue}
        </p>
      </div>
    </div>
  )
}

function ErrorState ({
  message,
  onRetry,
}) {
  const { t } = useAdminLanguage()

  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center px-6 py-12 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#FEE2E2] text-2xl text-[#DC2626]">
        <i className="ri-error-warning-line" />
      </div>

      <h3 className="mt-4 text-base font-bold text-[#152238]">
        {t.unableToLoadVerificationQueue}
      </h3>

      <p className="mt-1 max-w-md text-sm text-[#718096]">
        {message}
      </p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-4 rounded-xl bg-[#FFB21C] px-4 py-2.5 text-sm font-semibold text-[#0B1B2B]"
      >
        Retry
      </button>
    </div>
  )
}

function EmptyState ({
  hasFilters,
}) {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center px-6 py-12 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#EAFBF2] text-2xl text-[#16A34A]">
        <i className="ri-checkbox-circle-line" />
      </div>

      <h3 className="mt-4 text-base font-bold text-[#152238]">
        {hasFilters
          ? t.noMatchingVerifications
          : t.noVerificationRequests}
      </h3>

      <p className="mt-1 max-w-sm text-sm text-[#718096]">
        {hasFilters
          ? 'Try another search term or status filter.'
          : 'There are currently no driver verification records returned by the API.'}
      </p>
    </div>
  )
}

function Pagination ({
  page,
  totalPages,
  total,
  onPageChange,
}) {
  const { t } = useAdminLanguage()
  const start = (page - 1) * PAGE_SIZE + 1
  const end = Math.min(page * PAGE_SIZE, total)

  return (
    <div className="flex flex-col gap-3 border-t border-[#E5E7EB] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
      <p className="text-xs text-[#718096]">
        Showing {start}–{end} of {total}
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() =>
            onPageChange(Math.max(1, page - 1))
          }
          disabled={page === 1}
          className="grid h-9 w-9 place-items-center rounded-lg border border-[#E5E7EB] bg-white text-[#475569] disabled:cursor-not-allowed disabled:opacity-40"
          aria-label={t.previousPage}
        >
          <i className="ri-arrow-left-s-line" />
        </button>

        <span className="min-w-[80px] text-center text-xs font-semibold text-[#475569]">
          Page {page} of {totalPages}
        </span>

        <button
          type="button"
          onClick={() =>
            onPageChange(
              Math.min(totalPages, page + 1)
            )
          }
          disabled={page === totalPages}
          className="grid h-9 w-9 place-items-center rounded-lg border border-[#E5E7EB] bg-white text-[#475569] disabled:cursor-not-allowed disabled:opacity-40"
          aria-label={t.nextPage}
        >
          <i className="ri-arrow-right-s-line" />
        </button>
      </div>
    </div>
  )
}

function actionTypeText () {
  return false
}

export default AdminVerification
