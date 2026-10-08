import React, { useEffect, useState } from 'react'
import { adminApi } from '../../services/adminApi'
import { useAdminLanguage } from '../../context/AdminLanguageContext'

const formatDate = (value) => {
  if (!value) return '—'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'

  return date.toLocaleString('en-IN')
}

export default function AuditLogsTab () {
  const { t } = useAdminLanguage()
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actorType, setActorType] = useState('')
  const [targetType, setTargetType] = useState('')

  const loadLogs = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await adminApi.getAuditLogs({
        actorType: actorType || undefined,
        targetType: targetType || undefined,
        limit: 100,
      })

      setLogs(response?.logs || [])
    } catch (err) {
      setError(err?.message || '{t.failedToLoadAuditLogs}')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLogs()
  }, [actorType, targetType])

  return (
    <div className="space-y-5 pb-6 sm:space-y-6">
      <div>
        <h1 className="text-[28px] font-bold tracking-[-0.04em] text-[#152238] sm:text-[32px]">
          {t.auditLogs}
        </h1>
        <p className="mt-1 text-sm text-[#718096]">
          {t.auditLogsSubtitle}
        </p>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-[#E6EBF2] bg-white p-4 shadow-sm sm:flex-row">
        <select
          value={actorType}
          onChange={(e) => setActorType(e.target.value)}
          className="rounded-xl border border-[#D9E0E8] px-3 py-2 text-sm"
        >
          <option value="">{t.allActors}</option>
          <option value="admin">Admin</option>
          <option value="captain">Captain</option>
          <option value="user">User</option>
          <option value="system">System</option>
        </select>

        <select
          value={targetType}
          onChange={(e) => setTargetType(e.target.value)}
          className="rounded-xl border border-[#D9E0E8] px-3 py-2 text-sm"
        >
          <option value="">{t.allTargets}</option>
          <option value="user">User</option>
          <option value="driver">Driver</option>
          <option value="vehicle">Vehicle</option>
          <option value="ride">Ride</option>
          <option value="payment">Payment</option>
          <option value="settings">Settings</option>
        </select>

      </div>

      {loading && (
        <div className="rounded-2xl border border-[#E6EBF2] bg-white p-10 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-[#E5E7EB] border-t-[#0B1B2B]" />
          <p className="mt-3 text-sm text-[#718096]">
            {t.loadingAuditLogs}
          </p>
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">
          {error}
          <button
            type="button"
            onClick={loadLogs}
            className="ml-3 font-semibold underline"
          >
            {t.retry}
          </button>
        </div>
      )}

      {!loading && !error && logs.length === 0 && (
        <div className="rounded-2xl border border-[#E6EBF2] bg-white p-10 text-center">
          <p className="text-sm font-semibold text-[#152238]">
            {t.noAuditLogsFound}
          </p>
          <p className="mt-1 text-xs text-[#718096]">
            {t.auditLogsEmptyDescription}
          </p>
        </div>
      )}

      {!loading && !error && logs.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-[#E6EBF2] bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-[900px] w-full text-left">
              <thead className="bg-[#F8FAFC]">
                <tr>
                  <th className="px-4 py-3 text-xs font-semibold text-[#718096]">{t.action}</th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#718096]">{t.actor}</th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#718096]">{t.actorType}</th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#718096]">{t.target}</th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#718096]">{t.timestamp}</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#E6EBF2]">
                {logs.map((log) => (
                  <tr key={log._id}>
                    <td className="px-4 py-3 text-sm font-medium text-[#152238]">
                      {log.action || '—'}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#4A5568]">
                      {log.actor || 'System'}
                    </td>
                    <td className="px-4 py-3 text-sm capitalize text-[#4A5568]">
                      {log.actorType || '—'}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#4A5568]">
                      {log.targetType || '—'}
                      {log.targetId ? ` · ${log.targetId}` : ''}
                    </td>
                    <td className="px-4 py-3 text-sm text-[#718096]">
                      {formatDate(log.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
