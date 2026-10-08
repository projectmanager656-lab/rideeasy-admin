import React, { useEffect, useMemo, useState } from 'react'
import { adminApi } from '../services/adminApi'
import { useAdminLanguage } from '../context/AdminLanguageContext'

const INITIAL_COUPONS = [
  {
    id: 1,
    code: 'WELCOME50',
    discountType: 'percentage',
    discountValue: '50',
    minRide: '200',
    maxDiscount: '100',
    validFrom: '2026-09-01',
    validUntil: '2026-09-30',
    usageLimit: '100',
    usage: 12,
    status: 'Active',
  },
  {
    id: 2,
    code: 'RIDE100',
    discountType: 'fixed',
    discountValue: '100',
    minRide: '500',
    maxDiscount: '100',
    validFrom: '2026-09-15',
    validUntil: '2026-10-15',
    usageLimit: '50',
    usage: 5,
    status: 'Active',
  },
  {
    id: 3,
    code: 'FIRST20',
    discountType: 'percentage',
    discountValue: '20',
    minRide: '150',
    maxDiscount: '100',
    validFrom: '2026-08-01',
    validUntil: '2026-08-31',
    usageLimit: '50',
    usage: 50,
    status: 'Expired',
  },
]

const EMPTY_FORM = {
  code: '',
  discountType: 'percentage',
  discountValue: '',
  minRide: '',
  maxDiscount: '',
  validFrom: '',
  validUntil: '',
  usageLimit: '',
}

function formatDate(date) {
  if (!date) return '-'

  const value = new Date(`${date}T00:00:00`)

  return value.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default function AdminCoupons() {
  const { t } = useAdminLanguage()
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('All')

  const [showModal, setShowModal] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)

  const loadCoupons = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await adminApi.getCoupons()

      console.log('[AdminCoupons] RAW COUPON RESPONSE:', response)

      const data = response?.coupons || []

      console.log('[AdminCoupons] FIRST COUPON FROM API:', data[0])

      setCoupons(
        data.map((coupon) => ({
          ...coupon,
          id: coupon._id || coupon.id,
          _id: coupon._id || coupon.id,
          validFrom: coupon.validFrom
            ? String(coupon.validFrom).slice(0, 10)
            : '',
          validUntil: coupon.validUntil
            ? String(coupon.validUntil).slice(0, 10)
            : '',
          discountValue: String(coupon.discountValue ?? ''),
          minRide: String(coupon.minRide ?? ''),
          maxDiscount:
            coupon.maxDiscount == null
              ? ''
              : String(coupon.maxDiscount),
          usageLimit: String(coupon.usageLimit ?? ''),
        }))
      )
    } catch (err) {
      console.error('[AdminCoupons] Failed to load coupons:', err)
      setError(t.couponLoadFailed)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCoupons()
  }, [])

  const filteredCoupons = useMemo(() => {
    return coupons.filter((coupon) => {
      const matchesSearch = coupon.code
        .toLowerCase()
        .includes(search.toLowerCase())

      const matchesStatus =
        status === 'All' || coupon.status === status

      return matchesSearch && matchesStatus
    })
  }, [coupons, search, status])

  const openCreateModal = () => {
    setEditingCoupon(null)
    setForm(EMPTY_FORM)
    setShowModal(true)
  }

  const openEditModal = (coupon) => {
    const couponId = coupon?._id || coupon?.id

    console.log('[AdminCoupons] Opening coupon:', {
      code: coupon?.code,
      _id: coupon?._id,
      id: coupon?.id,
      selectedId: couponId,
      selectedIdLength: String(couponId || '').length,
    })

    setEditingCoupon({
      ...coupon,
      _id: couponId,
      id: couponId,
    })

    setForm({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minRide: coupon.minRide,
      maxDiscount: coupon.maxDiscount,
      validFrom: coupon.validFrom,
      validUntil: coupon.validUntil,
      usageLimit: coupon.usageLimit,
    })

    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingCoupon(null)
    setForm(EMPTY_FORM)
  }

  const handleChange = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (
      !form.code.trim() ||
      !form.discountValue ||
      !form.minRide ||
      !form.validFrom ||
      !form.validUntil ||
      !form.usageLimit
    ) {
      alert(t.couponFillRequired)
      return
    }

    const payload = {
      code: form.code.trim().toUpperCase(),
      discountType: form.discountType,
      discountValue: Number(form.discountValue),
      minRide: Number(form.minRide),
      maxDiscount:
        form.maxDiscount === ''
          ? null
          : Number(form.maxDiscount),
      validFrom: form.validFrom,
      validUntil: form.validUntil,
      usageLimit: Number(form.usageLimit),
    }

    try {
      if (editingCoupon) {
        const couponId = editingCoupon._id

        console.log('[AdminCoupons] Updating coupon:', {
          id: couponId,
          length: String(couponId || '').length,
          code: editingCoupon.code,
        })

        if (!couponId || !/^[a-f\d]{24}$/i.test(String(couponId))) {
          throw new Error('Invalid coupon ID')
        }

        await adminApi.updateCoupon(couponId, payload)
      } else {
        await adminApi.createCoupon(payload)
      }

      await loadCoupons()
      closeModal()
    } catch (err) {
      console.error('[AdminCoupons] Failed to save coupon:', err)
      alert(
        err?.response?.data?.message ||
        t.couponSaveFailed
      )
    }
  }

  const handleDelete = async (coupon) => {
    const confirmed = window.confirm(
      `${t.couponDeleteConfirm} "${coupon.code}"?`
    )

    if (!confirmed) return

    try {
      await adminApi.deleteCoupon(coupon.id)
      await loadCoupons()
    } catch (err) {
      console.error('[AdminCoupons] Failed to delete coupon:', err)
      alert(
        err?.response?.data?.message ||
        t.couponDeleteFailed
      )
    }
  }

  const getDiscountLabel = (coupon) => {
    if (coupon.discountType === 'percentage') {
      return `${coupon.discountValue}%`
    }

    return `₹${coupon.discountValue}`
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111827]">
            {t.couponPageTitle}
          </h1>
          <p className="mt-1 text-sm text-[#64748B]">
            {t.couponPageSubtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#FFB21A] px-4 py-2.5 text-sm font-semibold text-[#111827] shadow-sm transition hover:opacity-90"
        >
          <i className="ri-add-line text-lg" />
          {t.couponCreate}
        </button>
      </div>

      {/* Filters */}
      <div className="mb-5 rounded-xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B]" />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t.couponSearch}
              className="w-full rounded-lg border border-[#CBD5E1] py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#FFB21A]"
            />
          </div>

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="rounded-lg border border-[#CBD5E1] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#FFB21A]"
          >
            <option value="All">{t.couponAllStatus}</option>
            <option value="Active">{t.couponActive}</option>
            <option value="Expired">{t.couponExpired}</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full">
            <thead className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <tr className="text-left text-xs font-semibold uppercase tracking-wide text-[#64748B]">
                <th className="px-5 py-4">{t.couponCode}</th>
                <th className="px-5 py-4">{t.couponDiscount}</th>
                <th className="px-5 py-4">{t.couponMinRide}</th>
                <th className="px-5 py-4">{t.couponValidity}</th>
                <th className="px-5 py-4">{t.couponUsage}</th>
                <th className="px-5 py-4">{t.couponStatus}</th>
                <th className="px-5 py-4 text-right">{t.couponActions}</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#E2E8F0]">
              {filteredCoupons.length > 0 ? (
                filteredCoupons.map((coupon) => (
                  <tr
                    key={coupon.id}
                    className="text-sm text-[#334155] hover:bg-[#F8FAFC]"
                  >
                    <td className="px-5 py-4">
                      <span className="font-semibold text-[#111827]">
                        {coupon.code}
                      </span>
                    </td>

                    <td className="px-5 py-4 font-medium">
                      {getDiscountLabel(coupon)}
                    </td>

                    <td className="px-5 py-4">
                      ₹{coupon.minRide}
                    </td>

                    <td className="px-5 py-4">
                      {formatDate(coupon.validFrom)} -{' '}
                      {formatDate(coupon.validUntil)}
                    </td>

                    <td className="px-5 py-4">
                      {coupon.usage} / {coupon.usageLimit}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                          coupon.status === 'Active'
                            ? 'bg-green-50 text-green-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {coupon.status === 'Active' ? t.couponActive : t.couponExpired}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => openEditModal(coupon)}
                        className="mr-2 rounded-lg p-2 text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#111827]"
                        title={t.couponEdit}
                      >
                        <i className="ri-edit-line" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(coupon)}
                        className="rounded-lg p-2 text-[#64748B] hover:bg-[#F1F5F9] hover:text-red-600"
                        title={t.couponDelete}
                      >
                        <i className="ri-delete-bin-line" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-5 py-12 text-center text-sm text-[#64748B]"
                  >
                    {t.couponNoCoupons}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-[#111827]">
                  {editingCoupon ? t.couponEditTitle : t.couponCreateTitle}
                </h2>
                <p className="mt-1 text-sm text-[#64748B]">
                  {
                    editingCoupon
                      ? t.couponUpdateDetails
                      : t.couponCreateForRiders
                  }
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg p-2 text-[#64748B] hover:bg-[#F1F5F9]"
              >
                <i className="ri-close-line text-xl" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-[#334155]">
                    Coupon Code *
                  </label>

                  <input
                    type="text"
                    value={form.code}
                    onChange={(event) =>
                      handleChange(
                        'code',
                        event.target.value.toUpperCase()
                      )
                    }
                    placeholder={`${t.couponExample} WELCOME50`}
                    className="w-full rounded-lg border border-[#CBD5E1] px-3 py-2.5 text-sm outline-none focus:border-[#FFB21A]"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#334155]">
                    Discount Type *
                  </label>

                  <select
                    value={form.discountType}
                    onChange={(event) =>
                      handleChange(
                        'discountType',
                        event.target.value
                      )
                    }
                    className="w-full rounded-lg border border-[#CBD5E1] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#FFB21A]"
                  >
                    <option value="percentage">
                      Percentage (%)
                    </option>
                    <option value="fixed">
                      Fixed Amount (₹)
                    </option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#334155]">
                    Discount Value *
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={form.discountValue}
                    onChange={(event) =>
                      handleChange(
                        'discountValue',
                        event.target.value
                      )
                    }
                    placeholder={
                      form.discountType === 'percentage'
                        ? `${t.couponExample} 20`
                        : `${t.couponExample} 100`
                    }
                    className="w-full rounded-lg border border-[#CBD5E1] px-3 py-2.5 text-sm outline-none focus:border-[#FFB21A]"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#334155]">
                    Minimum Ride Amount *
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={form.minRide}
                    onChange={(event) =>
                      handleChange(
                        'minRide',
                        event.target.value
                      )
                    }
                    placeholder={`${t.couponExample} 200`}
                    className="w-full rounded-lg border border-[#CBD5E1] px-3 py-2.5 text-sm outline-none focus:border-[#FFB21A]"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#334155]">
                    Maximum Discount
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={form.maxDiscount}
                    onChange={(event) =>
                      handleChange(
                        'maxDiscount',
                        event.target.value
                      )
                    }
                    placeholder={`${t.couponExample} 100`}
                    className="w-full rounded-lg border border-[#CBD5E1] px-3 py-2.5 text-sm outline-none focus:border-[#FFB21A]"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#334155]">
                    Valid From *
                  </label>

                  <input
                    type="date"
                    value={form.validFrom}
                    onChange={(event) =>
                      handleChange(
                        'validFrom',
                        event.target.value
                      )
                    }
                    className="w-full rounded-lg border border-[#CBD5E1] px-3 py-2.5 text-sm outline-none focus:border-[#FFB21A]"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#334155]">
                    Valid Until *
                  </label>

                  <input
                    type="date"
                    value={form.validUntil}
                    onChange={(event) =>
                      handleChange(
                        'validUntil',
                        event.target.value
                      )
                    }
                    className="w-full rounded-lg border border-[#CBD5E1] px-3 py-2.5 text-sm outline-none focus:border-[#FFB21A]"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#334155]">
                    Usage Limit *
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={form.usageLimit}
                    onChange={(event) =>
                      handleChange(
                        'usageLimit',
                        event.target.value
                      )
                    }
                    placeholder={`${t.couponExample} 100`}
                    className="w-full rounded-lg border border-[#CBD5E1] px-3 py-2.5 text-sm outline-none focus:border-[#FFB21A]"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3 border-t border-[#E2E8F0] pt-5">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-lg border border-[#CBD5E1] px-4 py-2.5 text-sm font-semibold text-[#334155] hover:bg-[#F8FAFC]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-[#FFB21A] px-5 py-2.5 text-sm font-semibold text-[#111827] hover:opacity-90"
                >
                  {editingCoupon ? t.couponUpdate : t.couponSave}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
