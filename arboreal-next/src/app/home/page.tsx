import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Blobs from '@/components/Blobs'
import ScrollProgress from '@/components/ScrollProgress'
import BackToTop from '@/components/BackToTop'
import OrbitalTimeline from '@/components/OrbitalTimeline'

export const metadata: Metadata = {
  title: 'Arboreal Labs - AI Automation SaaS',
  description: 'Arboreal Labs empowers businesses with custom reporting, automation platforms and enterprise-grade pre-built solutions. Streamline workflows, enhance learning, and supercharge your operations.',
}

export default function HomePage() {
  return (
    <>
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
