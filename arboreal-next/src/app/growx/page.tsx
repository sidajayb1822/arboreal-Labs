import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Blobs from '@/components/Blobs'
import ScrollProgress from '@/components/ScrollProgress'
import BackToTop from '@/components/BackToTop'
import SubNav from '@/components/SubNav'
import PricingSection from '@/components/PricingSection'

export const metadata: Metadata = {
  title: 'GrowX - Arboreal Labs',
  description: 'A specialized suite built for scaling agencies. Master your operations with integrated project management, financial tracking, and intelligent pipeline workflows.',
}

const features = [
  {
    delay: '0s',
    icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    title: 'Intelligent User & Team Management',
    items: [
      { bold: 'Role-Based Access:', text: ' Secure, customized dashboards for Business Owners, Freelancers, and Clients.' },
      { bold: 'Centralized Directory:', text: ' Search, manage, and communicate with your entire team in one place.' },
      { bold: 'Seamless Onboarding:', text: ' Quickly generate secure login credentials for new users.' },
    ],
  },
  {
    delay: '0.1s',
    icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/><line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/></svg>`,
    title: 'Collaborative Project Management',
    items: [
      { bold: 'Unified Command Center:', text: ' View all active, finished, and paused projects instantly.' },
      { bold: 'Smart Milestones:', text: ' Break projects into actionable steps with specific tracking.' },
      { bold: 'Client Visibility Controls:', text: ' Choose what milestone submissions your clients see.' },
      { bold: 'Team Assignment:', text: ' Easily distribute specific responsibilities to freelancers.' },
    ],
  },
  {
    delay: '0.2s',
    icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
    title: 'Financial Cost Tracker',
    titleBadge: 'PRO',
    titleBadgeDim: false,
    items: [
      { bold: 'Income & Expense Logging:', text: ' Log all business transactions with ease.' },
      { bold: 'Project-Based Accounting:', text: ' Link expenses and revenues directly to specific projects.' },
      { bold: 'Real-Time Analytics:', text: ' View your total revenue, expenses, and bottom line.' },
      { bold: 'Smart Filtering:', text: ' Filter financial health by month, year, or specific project.' },
    ],
  },
  {
    delay: '0.3s',
    icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
    title: 'Lead Pipeline Tracker',
    titleBadge: 'PRO+',
    titleBadgeDim: true,
    items: [
      { bold: 'Pipeline Management:', text: ' Move leads seamlessly through customizable closing phases.' },
      { bold: 'Quick-Action Scheduling:', text: ' Schedule "Next Actions" with due dates from the dashboard.' },
      { bold: 'Centralized Notes:', text: ' Keep a running log of context and POC details for prospects.' },
      { bold: 'Referral Tracking:', text: ' Monitor exactly where high-value leads originate from.' },
    ],
  },
]

export default function GrowXPage() {
  return (
    <>
      <ScrollProgress />
      <Blobs />
      <Navbar ctaHref="#pricing" />
      <SubNav />

      <header className="page-header">
        <span>Arboreal Pre-Built</span>
        <h1>GrowX Platform</h1>
        <p>A specialized suite built for scaling agencies. Master your operations with integrated project management, financial tracking, and intelligent pipeline workflows.</p>
      </header>

      <section className="container" id="features">
        <div className="glass-panel animate-on-scroll">
          <h2 className="section-title">Core Platform Features</h2>
          <div className="feature-grid">
            {features.map(f => (
              <div key={f.title} className="feature-item" style={{ animationDelay: f.delay }}>
                <div
                  className="feature-icon-wrapper"
                  dangerouslySetInnerHTML={{ __html: f.icon }}
                />
                <h3>
                  {f.title}
                  {f.titleBadge && (
                    <span style={{
                      fontSize: '0.7rem',
                      background: f.titleBadgeDim ? '#e8ede8' : '#66d46a',
                      color: 'white',
                      padding: '2px 6px',
                      borderRadius: '10px',
                      verticalAlign: 'middle',
                      marginLeft: '5px',
                    }}>
                      {f.titleBadge}
                    </span>
                  )}
                </h3>
                <ul className="feature-list">
                  {f.items.map(item => (
                    <li key={item.bold}><strong>{item.bold}</strong>{item.text}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PricingSection />

      <Footer />
      <BackToTop />
    </>
  )
}
