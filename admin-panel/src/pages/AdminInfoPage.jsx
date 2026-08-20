import React from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../components/AdminLayout'

const content = {
  help: {
    title: 'Help & Support',
    subtitle: 'Get help and support',
    icon: 'ri-customer-service-2-line',
    sections: [
      {
        title: 'Need help?',
        text: 'If you are facing an issue with the RideEasy Admin Panel, contact the support team for assistance.',
      },
      {
        title: 'Admin Support',
        text: 'For account, dashboard, driver, booking or payment related issues, contact the RideEasy administration team.',
      },
      {
        title: 'Contact Support',
        text: 'Support contact details will be available here.',
      },
    ],
  },

  terms: {
    title: 'Terms & Conditions',
    subtitle: 'Review platform terms',
    icon: 'ri-file-text-line',
    sections: [
      {
        title: 'Terms & Conditions',
        text: 'These terms define the rules and conditions for using the RideEasy Admin Panel.',
      },
      {
        title: 'Admin Responsibilities',
        text: 'Administrators must use the platform responsibly and only access information required for their assigned responsibilities.',
      },
      {
        title: 'Platform Usage',
        text: 'Use of RideEasy services is subject to the applicable platform policies and operational guidelines.',
      },
    ],
  },

  privacy: {
    title: 'Privacy Policy',
    subtitle: 'Review privacy policy',
    icon: 'ri-shield-line',
    sections: [
      {
        title: 'Privacy',
        text: 'RideEasy is committed to protecting information handled through the administration platform.',
      },
      {
        title: 'Data Protection',
        text: 'Administrative information should only be accessed and used for legitimate RideEasy operational purposes.',
      },
      {
        title: 'Information Security',
        text: 'Keep administrator credentials secure and do not share account access with unauthorized users.',
      },
    ],
  },

  about: {
    title: 'About App',
    subtitle: 'RideEasy administrator console',
    icon: 'ri-information-line',
    sections: [
      {
        title: 'RideEasy Admin',
        text: 'RideEasy Admin is the administration console used to manage the RideEasy platform.',
      },
      {
        title: 'Version',
        text: 'RideEasy Admin Panel',
      },
      {
        title: 'Platform',
        text: 'Manage users, drivers, bookings, payments, services and platform operations from one place.',
      },
    ],
  },
}

export default function AdminInfoPage({ section }) {
  const navigate = useNavigate()

  const page = content[section] || content.help

  const goMore = () => {
    navigate('/admin/dashboard', {
      state: { tab: 'more' },
    })
  }

  return (
    <AdminLayout
      tab="more"
      setTab={(tab) => {
        navigate('/admin/dashboard', {
          state: { tab },
        })
      }}
      onRefresh={() => {}}
      onLogout={() => {
        if (
          window.confirm(
            'Log Out?\n\nAre you sure you want to logout from the admin panel?'
          )
        ) {
          localStorage.removeItem('adminToken')
          navigate('/admin')
        }
      }}
    >
      <div className="min-h-full bg-[#F5F7FA] pb-6">

        {/* PAGE HEADER */}
        <div className="border-b border-[#E5E7EB] bg-white px-4 py-4">
          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={goMore}
              aria-label="Back to More"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[#E6EBF2] bg-white text-[#152238] shadow-sm"
            >
              <i className="ri-arrow-left-line text-lg" />
            </button>

            <div className="min-w-0">
              <h1 className="truncate text-lg font-bold text-[#152238]">
                {page.title}
              </h1>

              <p className="text-xs text-[#718096]">
                {page.subtitle}
              </p>
            </div>

          </div>
        </div>

        {/* CONTENT */}
        <main className="px-4 py-5">

          {/* MORE LABEL + TITLE */}
          <div className="mb-5">

            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#FFB21C]">
              More
            </p>

            <div className="mt-1 flex items-center gap-2">
              <h2 className="text-[26px] font-bold tracking-[-0.03em] text-[#152238]">
                {page.title}
              </h2>
            </div>

          </div>

          {/* MAIN CARD */}
          <section className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">

            {/* ICON HEADER */}
            <div className="border-b border-[#EEF1F5] p-5">

              <div className="flex items-center gap-3">

                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#F3F6FA] text-[#152238]">
                  <i className={`${page.icon} text-xl`} />
                </div>

                <div>
                  <h3 className="font-bold text-[#152238]">
                    {page.title}
                  </h3>

                  <p className="mt-0.5 text-xs text-[#718096]">
                    {page.subtitle}
                  </p>
                </div>

              </div>

            </div>

            {/* INFORMATION */}
            <div className="divide-y divide-[#EEF1F5]">

              {page.sections.map((item, index) => (
                <div
                  key={`${item.title}-${index}`}
                  className="p-5"
                >
                  <h3 className="text-sm font-bold text-[#152238]">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#718096]">
                    {item.text}
                  </p>
                </div>
              ))}

            </div>

          </section>

        </main>

      </div>
    </AdminLayout>
  )
}