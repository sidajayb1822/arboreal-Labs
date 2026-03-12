'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'

export default function SubNav() {
  const featuresLinkRef = useRef<HTMLAnchorElement>(null)
  const pricingLinkRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const sections = [
      { id: 'features', ref: featuresLinkRef },
      { id: 'pricing', ref: pricingLinkRef },
    ]

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            sections.forEach(s => s.ref.current?.classList.remove('active'))
            const match = sections.find(s => s.id === entry.target.id)
            if (match) match.ref.current?.classList.add('active')
          }
        })
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
    )

    sections.forEach(s => {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  // Scroll animation observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )
    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="sub-nav" id="subNav">
      <Link href="#features" ref={featuresLinkRef} className="active" id="subnav-features">
        Features
      </Link>
      <Link href="#pricing" ref={pricingLinkRef} id="subnav-pricing">
        Pricing
      </Link>
    </div>
  )
}
