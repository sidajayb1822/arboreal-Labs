'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Navbar({ ctaHref = '#contact' }: { ctaHref?: string }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const closeMobileNav = () => {
    setMobileOpen(false)
    document.body.style.overflow = ''
  }

  const openMobileNav = () => {
    setMobileOpen(true)
    document.body.style.overflow = 'hidden'
  }

  return (
    <>
      {/* Mobile Nav Overlay */}
      <div
        className={`mobile-nav ${mobileOpen ? 'open visible' : ''}`}
        style={{ display: mobileOpen ? 'flex' : 'none', opacity: mobileOpen ? 1 : 0 }}
      >
        <Link href="/home" onClick={closeMobileNav}>Home</Link>
        <Link href="/home#about" onClick={closeMobileNav}>About Us</Link>

        <details className="mobile-nav-dropdown">
          <summary>Pre-Built Tools ▾</summary>
          <div className="mobile-dropdown-content">
            <Link href="/growx" onClick={closeMobileNav}>GrowX</Link>
            <a href="#" style={{ opacity: 0.5, pointerEvents: 'none' }}>Culture LMS</a>
          </div>
        </details>

        <Link
          href={ctaHref}
          className="btn-liquid-glass"
          style={{ fontSize: '1.5rem', padding: '0.8rem 2.2rem', borderRadius: '30px' }}
          onClick={closeMobileNav}
        >
          <span>Get Started</span>
        </Link>
      </div>

      <nav id="navbar" className={scrolled ? 'scrolled' : ''}>
        <Link href="/home" className="logo-container" style={{ textDecoration: 'none' }}>
          <Image
            src="/full-logo-darkmode.svg"
            className="logo-svg"
            alt="Arboreal Labs Logo"
            width={200}
            height={90}
            style={{ width: 'auto' }}
            priority
          />
        </Link>

        <div className="nav-links">
          <Link href="/home">Home</Link>
          <div className="nav-dropdown">
            <button className="nav-dropdown-trigger">
              Pre-Built Tools
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            <div className="nav-dropdown-menu">
              <Link href="/growx">
                <span className="dropdown-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                  </svg>
                </span>
                <span className="dropdown-label">GrowX <small>Project management for agencies</small></span>
              </Link>
              <a href="#" style={{ opacity: 0.45, pointerEvents: 'none' }}>
                <span className="dropdown-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  </svg>
                </span>
                <span className="dropdown-label">Culture LMS <small>Coming soon</small></span>
              </a>
            </div>
          </div>
          <Link href="/home#about">About Us</Link>
        </div>

        <div className="nav-actions">
          <Link href={ctaHref} className="btn-liquid-glass nav-cta"><span>Get Started</span></Link>
          <button
            className={`hamburger ${mobileOpen ? 'open' : ''}`}
            id="hamburger"
            aria-label="Toggle navigation menu"
            onClick={mobileOpen ? closeMobileNav : openMobileNav}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>
    </>
  )
}
