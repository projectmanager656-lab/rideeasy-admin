import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminLanguage } from '../context/AdminLanguageContext'

const languages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
]

export default function AdminLanguage () {
  const navigate = useNavigate()
  const { language: currentLanguage, changeLanguage, t } = useAdminLanguage()

  const [language, setLanguage] = useState(currentLanguage)
  const [message, setMessage] = useState('')

  const handleSave = () => {
    changeLanguage(language)
    setMessage(t.languagePreferenceSaved)
  }

  return (
    <div className="min-h-full bg-white p-4 sm:p-6">
      <div className="mx-auto max-w-2xl">
        <button
          type="button"
          onClick={() => navigate('/admin/dashboard', { state: { tab: 'settings' } })}
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-neutral-900"
        >
          <i className="ri-arrow-left-line" />
          {t.backToSettings}
        </button>

        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-6">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
              <i className="ri-global-line text-xl" />
            </div>

            <h1 className="text-xl font-semibold text-neutral-900">
              {t.language}
            </h1>

            <p className="mt-1 text-sm text-neutral-500">
              {t.selectPreferredLanguage}
            </p>
          </div>

          <div className="space-y-3">
            {languages.map((item) => (
              <button
                key={item.code}
                type="button"
                onClick={() => {
                  setLanguage(item.code)
                  setMessage('')
                }}
                className={`flex w-full items-center justify-between rounded-xl border p-4 text-left transition ${
                  language === item.code
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-neutral-200 bg-white hover:border-neutral-300'
                }`}
              >
                <div>
                  <p className="text-sm font-semibold text-neutral-900">
                    {item.code === 'en'
                      ? t.english
                      : item.code === 'hi'
                        ? t.hindi
                        : t.marathi}
                  </p>
                  <p className="mt-1 text-sm text-neutral-500">
                    {item.nativeName}
                  </p>
                </div>

                {language === item.code && (
                  <i className="ri-checkbox-circle-fill text-xl text-orange-500" />
                )}
              </button>
            ))}
          </div>

          {message && (
            <div className="mt-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {message}
            </div>
          )}

          <button
            type="button"
            onClick={handleSave}
            className="mt-6 w-full rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            {t.saveLanguage}
          </button>
        </div>
      </div>
    </div>
  )
}
