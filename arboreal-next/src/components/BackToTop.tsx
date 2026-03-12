'use client'

import { useEffect, useRef } from 'react'

export default function BackToTop() {
  const btnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!btnRef.current) return
      btnRef.current.classList.toggle('visible', window.scrollY > 320)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <button
      className="back-to-top"
      ref={btnRef}
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 15l-6-6-6 6" />
      </svg>
    </button>
  )
}
