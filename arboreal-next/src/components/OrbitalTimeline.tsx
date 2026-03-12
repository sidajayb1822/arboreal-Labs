'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface TimelineItem {
  id: number
  title: string
  category: string
  icon: string
  content: string
  link?: string
  orbit: 'inner' | 'outer'
  accent?: 'yellow'
}

const timelineData: TimelineItem[] = [
  {
    id: 1,
    title: 'GrowX',
    category: 'Pre-Built Ecosystem',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>`,
    content: 'A specialized Project Management CRM tailored for scaling marketing agencies. Automate client onboarding, campaign tracking, and ROI reporting through AI-driven insights.',
    link: '/growx',
    orbit: 'outer',
  },
  {
    id: 2,
    title: 'Culture LMS',
    category: 'Pre-Built Ecosystem',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
    content: 'An intelligent Learning Management System designed for culture classes (Music, Art, Design). AI-assisted feedback, interactive modules, and progress tracking for creatives.',
    orbit: 'outer',
  },
  {
    id: 3,
    title: 'Custom Platform',
    category: 'Custom Solutions',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`,
    content: "We don't just build disconnected AI features. Arboreal Labs equips your business with a unified, custom SaaS platform designed to manage and automate your entire operations seamlessly.",
    orbit: 'inner',
    accent: 'yellow',
  },
]

function getResponsiveRadius(width: number) {
  if (width <= 480) return { inner: 95, outer: 145 }
  if (width <= 768) return { inner: 120, outer: 180 }
  return { inner: 200, outer: 300 }
}

export default function OrbitalTimeline() {
  const containerRef = useRef<HTMLDivElement>(null)
  const rotationRef = useRef(0)
  const frameRef = useRef<number>(0)
  const stopLoopRef = useRef(false)
  const radiusRef = useRef(getResponsiveRadius(typeof window !== 'undefined' ? window.innerWidth : 1200))
  const nodeAnglesRef = useRef<{ [id: number]: number }>({})
  const [activeItem, setActiveItem] = useState<TimelineItem | null>(null)
  const [contentVisible, setContentVisible] = useState(false)

  const updatePositions = useCallback(() => {
    if (!containerRef.current) return
    containerRef.current.querySelectorAll('.orbital-node').forEach(node => {
      const el = node as HTMLElement
      const id = parseInt(el.dataset.id!)
      const orbit = el.dataset.orbit!
      const baseAngle = nodeAnglesRef.current[id]
      const currentAngle = (baseAngle + rotationRef.current) % 360
      const radian = (currentAngle * Math.PI) / 180
      const r = orbit === 'outer' ? radiusRef.current.outer : radiusRef.current.inner
      // Only set transform — no transition on this element to prevent flickering
      el.style.transform = `translate(${r * Math.cos(radian)}px, ${r * Math.sin(radian)}px)`
    })
  }, [])

  const startRotation = useCallback(() => {
    stopLoopRef.current = false
    const tick = () => {
      if (stopLoopRef.current) return
      rotationRef.current = (rotationRef.current + 0.2) % 360
      updatePositions()
      frameRef.current = requestAnimationFrame(tick)
    }
    frameRef.current = requestAnimationFrame(tick)
  }, [updatePositions])

  useEffect(() => {
    const inner = timelineData.filter(i => i.orbit === 'inner')
    const outer = timelineData.filter(i => i.orbit === 'outer')
    let ii = 0, oi = 0
    timelineData.forEach(item => {
      if (item.orbit === 'inner') { nodeAnglesRef.current[item.id] = (ii / inner.length) * 360; ii++ }
      else { nodeAnglesRef.current[item.id] = (oi / outer.length) * 360; oi++ }
    })
    updatePositions()
    startRotation()

    const handleResize = () => {
      radiusRef.current = getResponsiveRadius(window.innerWidth)
      updatePositions()
    }
    window.addEventListener('resize', handleResize)
    return () => {
      stopLoopRef.current = true
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener('resize', handleResize)
    }
  }, [updatePositions, startRotation])

  const handleNodeClick = (item: TimelineItem) => {
    if (activeItem) return
    stopLoopRef.current = true
    cancelAnimationFrame(frameRef.current)
    setActiveItem(item)
    // Slight delay so the orbital fade starts before content appears
    setTimeout(() => setContentVisible(true), 200)
  }

  const handleClose = () => {
    setContentVisible(false)
    setTimeout(() => {
      setActiveItem(null)
      startRotation()
    }, 400)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  })

  const isYellow = activeItem?.accent === 'yellow'
  const accent = isYellow ? 'var(--accent-yellow)' : 'var(--primary)'
  const accentBg = isYellow ? 'rgba(241,196,15,0.12)' : 'rgba(102,212,106,0.12)'

  return (
    <div className={`orbital-wrapper${activeItem ? ' has-active' : ''}`}>

      {/* Icon sidebar — fades in on the left when active */}
      <div className={`orbital-node-sidebar${activeItem ? ' visible' : ''}`}>
        {timelineData.map(item => (
          <button
            key={item.id}
            className={`node-sidebar-btn${item.accent === 'yellow' ? ' yellow' : ''}${activeItem?.id === item.id ? ' active' : ''}`}
            style={activeItem?.id === item.id ? { borderColor: accent, background: accentBg, color: accent } : {}}
            onClick={() => activeItem?.id !== item.id && (() => {
              setContentVisible(false)
              setTimeout(() => setActiveItem(item), 10)
              setTimeout(() => setContentVisible(true), 220)
            })()}
            title={item.title}
            dangerouslySetInnerHTML={{ __html: item.icon }}
          />
        ))}
      </div>

      {/* Orbital + content share the same space */}
      <div className="orbital-main">

        {/* Orbital animation — fades out when active */}
        <div
          className={`orbital-timeline${activeItem ? ' orbital-faded' : ''}`}
          ref={containerRef}
        >
          <div className="central-hub">
            <Image
              src="/Favicon-Logo-lightmode.svg"
              className="hub-inner"
              alt="Arboreal Labs"
              width={330}
              height={330}
              style={{ width: '330px', height: '330px' }}
            />
          </div>
          <div className="orbit-ring inner-orbit" />
          <div className="orbit-ring outer-orbit" />

          {timelineData.map(item => (
            <div
              key={item.id}
              className={`orbital-node${item.accent === 'yellow' ? ' yellow-node' : ''}`}
              data-id={item.id}
              data-orbit={item.orbit}
              onClick={() => handleNodeClick(item)}
            >
              <div className="node-glow" />
              <div className="node-icon" dangerouslySetInnerHTML={{ __html: item.icon }} />
              <div className="node-label">{item.title}</div>
            </div>
          ))}
        </div>

        {/* Content panel — fades in over the orbital */}
        <div className={`orbital-content-panel${contentVisible ? ' visible' : ''}`}>
          {activeItem && (
            <>
              <div className="ocp-icon" style={{ background: accentBg, color: accent, borderColor: isYellow ? 'rgba(241,196,15,0.25)' : 'rgba(102,212,106,0.25)' }}>
                <div dangerouslySetInnerHTML={{ __html: activeItem.icon }} />
              </div>
              <span className="ocp-category" style={{ background: accentBg, color: accent }}>
                {activeItem.category}
              </span>
              <h3 className="ocp-title">{activeItem.title}</h3>
              <p className="ocp-body">{activeItem.content}</p>
              <div className="ocp-actions">
                {activeItem.link
                  ? <Link href={activeItem.link} className="btn">Explore {activeItem.title} →</Link>
                  : <a href="#contact" className="btn">Learn More →</a>
                }
                <button className="ocp-back" onClick={handleClose}>← Back</button>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  )
}
