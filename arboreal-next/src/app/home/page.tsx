import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Blobs from '@/components/Blobs'
import ScrollProgress from '@/components/ScrollProgress'
import BackToTop from '@/components/BackToTop'
import OrbitalTimeline from '@/components/OrbitalTimeline'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://arboreallabs.com'

export const metadata: Metadata = {
  title: 'AI Automation Platform for Businesses – Custom SaaS Solutions',
  description:
    'Arboreal Labs equips your business with custom AI automation platforms and pre-built SaaS tools. Automate workflows, scale operations, and eliminate manual work. Book a free consultation.',
  alternates: {
    canonical: `${SITE_URL}/home`,
  },
  openGraph: {
    title: 'AI Automation Platform for Businesses – Custom SaaS Solutions | Arboreal Labs',
    description:
      'Custom AI automation platforms and pre-built SaaS tools. Automate workflows, scale operations, and eliminate manual work.',
    url: `${SITE_URL}/home`,
    type: 'website',
  },
  twitter: {
    title: 'AI Automation Platform for Businesses | Arboreal Labs',
    description:
      'Custom AI automation platforms and pre-built SaaS tools. Automate workflows and scale operations faster.',
  },
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'Arboreal Labs',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/full-logo-darkmode.svg`,
        width: 200,
        height: 90,
      },
      description:
        'Arboreal Labs builds custom AI automation platforms and pre-built SaaS tools for businesses. Specialising in project management CRMs, learning management systems, and enterprise workflow automation.',
      sameAs: [],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'sales',
        url: `${SITE_URL}/home#contact`,
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'Arboreal Labs',
      publisher: { '@id': `${SITE_URL}/#organization` },
      inLanguage: 'en-US',
    },
    {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/home#webpage`,
      url: `${SITE_URL}/home`,
      name: 'AI Automation Platform for Businesses – Custom SaaS Solutions | Arboreal Labs',
      isPartOf: { '@id': `${SITE_URL}/#website` },
      about: { '@id': `${SITE_URL}/#organization` },
      description:
        'Arboreal Labs equips your business with custom AI automation platforms and pre-built SaaS tools to automate workflows and scale operations.',
      inLanguage: 'en-US',
    },
  ],
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <ScrollProgress />
      <Blobs />
      <Navbar ctaHref="#contact" />

      <section className="hero" id="hero">
        <div className="hero-text">
          <h1>Intelligent Automation<br />Rooted in Innovation</h1>
          <p className="hero-description">
            Arboreal Labs empowers businesses with custom reporting, automation platforms and enterprise-grade pre-built solutions. Streamline workflows, enhance learning, and supercharge your operations.
          </p>
        </div>

        <h2 className="ecosystem-header">The Arboreal Universe</h2>

        <OrbitalTimeline />
      </section>

      <Footer />
      <BackToTop />
    </>
  )
}
