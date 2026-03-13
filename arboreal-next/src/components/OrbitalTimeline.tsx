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
    content:
      'A specialized Project Management CRM tailored for scaling marketing agencies. Automate client onboarding, campaign tracking, and ROI reporting through AI-driven insights.',
    link: '/growx',
    orbit: 'outer',
  },
  {
    id: 2,
    title: 'Culture LMS',
    category: 'Pre-Built Ecosystem',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
    content:
      'An intelligent Learning Management System designed for culture classes (Music, Art, Design). AI-assisted feedback, interactive modules, and progress tracking for creatives.',
    orbit: 'outer',
  },
  {
    id: 3,
    title: 'Custom Platform',
    category: 'Custom Solutions',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`,
    content:
      "We don't just build disconnected AI features. Arboreal Labs equips your business with a unified, custom SaaS platform designed to manage and automate your entire operations seamlessly.",
    orbit: 'inner',
    accent: 'yellow',
  },
]

// Small moons that trail behind the Custom Platform (inner orbit, id=3)
// angleOffset: degrees behind the main node; radiusOffset: px variation from inner radius
const MOON_CONFIGS = [
  { id: 'm1', angleOffset: -12, radiusOffset: 12, size: 7, opacity: 0.78, phase: 0 },
  { id: 'm2', angleOffset: -24, radiusOffset: -9, size: 5, opacity: 0.58, phase: 2.1 },
  { id: 'm3', angleOffset: -38, radiusOffset: 4, size: 4, opacity: 0.40, phase: 4.2 },
]

function getResponsiveRadius(width: number) {
  if (width <= 375) return { inner: 80, outer: 125 }
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
  const nodeAnglesRef = useRef<Record<number, number>>({})
  const [activeItem, setActiveItem] = useState<TimelineItem | null>(null)
  const [contentVisible, setContentVisible] = useState(false)

  const updatePositions = useCallback(() => {
    if (!containerRef.current) return

    containerRef.current.querySelectorAll('.orbital-node').forEach((node) => {
      const el = node as HTMLElement
      const id = Number.parseInt(el.dataset.id ?? '', 10)
      const orbit = el.dataset.orbit

      if (!id || !orbit) return

      const baseAngle = nodeAnglesRef.current[id]
      const currentAngle = (baseAngle + rotationRef.current) % 360
      const radian = (currentAngle * Math.PI) / 180
      const r = orbit === 'outer' ? radiusRef.current.outer : radiusRef.current.inner

      // Only set transform; transitions here cause flicker during rAF updates.
      el.style.transform = `translate(${r * Math.cos(radian)}px, ${r * Math.sin(radian)}px)`
      if (el.classList.contains('yellow-node')) {
        el.style.setProperty('--trail-rotation', `${currentAngle - 90}deg`)
      }
    })

    // Animate moons trailing behind Custom Platform (id=3, inner orbit)
    containerRef.current.querySelectorAll('.orbital-moon').forEach((moon) => {
      const el = moon as HTMLElement
      const angleOffset = parseFloat(el.dataset.angleOffset ?? '0')
      const radiusOffset = parseFloat(el.dataset.radiusOffset ?? '0')
      const phase = parseFloat(el.dataset.phase ?? '0')
      const baseAngle = nodeAnglesRef.current[3] ?? 0
      const currentAngle = ((baseAngle + rotationRef.current + angleOffset) % 360 + 360) % 360
      const radian = (currentAngle * Math.PI) / 180
      // Sinusoidal radius variation gives each moon a slightly wobbly, organic orbit
      const variation = Math.sin((rotationRef.current * Math.PI) / 90 + phase) * 8
      const r = radiusRef.current.inner + radiusOffset + variation
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
    const inner = timelineData.filter((item) => item.orbit === 'inner')
    const outer = timelineData.filter((item) => item.orbit === 'outer')
    let innerIndex = 0
    let outerIndex = 0

    timelineData.forEach((item) => {
      if (item.orbit === 'inner') {
        nodeAnglesRef.current[item.id] = (innerIndex / inner.length) * 360
        innerIndex += 1
        return
      }

      nodeAnglesRef.current[item.id] = (outerIndex / outer.length) * 360
      outerIndex += 1
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
  }, [startRotation, updatePositions])

  const handleNodeClick = (item: TimelineItem) => {
    if (activeItem) return

    stopLoopRef.current = true
    cancelAnimationFrame(frameRef.current)
    setActiveItem(item)

    // Slight delay so the orbital fade starts before content appears.
    setTimeout(() => setContentVisible(true), 200)
  }

  const handleClose = useCallback(() => {
    setContentVisible(false)
    setTimeout(() => {
      setActiveItem(null)
      startRotation()
    }, 400)
  }, [startRotation])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }

    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [handleClose])

  const isYellow = activeItem?.accent === 'yellow'
  const accent = isYellow ? 'var(--accent-yellow)' : '#7ee87f'
  const accentBg = isYellow ? 'rgba(241,196,15,0.32)' : 'rgba(102,212,106,0.32)'

  return (
    <div className={`orbital-wrapper${activeItem ? ' has-active' : ''}`}>
      {/* Icon sidebar; fades in on the left when active. */}
      <div className={`orbital-node-sidebar${activeItem ? ' visible' : ''}`}>
        {timelineData.map((item) => (
          <button
            key={item.id}
            className={`node-sidebar-btn${item.accent === 'yellow' ? ' yellow' : ''}${activeItem?.id === item.id ? ' active' : ''}`}
            style={activeItem?.id === item.id ? { borderColor: accent, background: accentBg, color: accent } : {}}
            onClick={() => {
              if (activeItem?.id === item.id) return
              setContentVisible(false)
              setTimeout(() => setActiveItem(item), 10)
              setTimeout(() => setContentVisible(true), 220)
            }}
            title={item.title}
            dangerouslySetInnerHTML={{ __html: item.icon }}
          />
        ))}
      </div>

      {/* Orbital and content share the same space. */}
      <div className="orbital-main">
        {/* Orbital animation fades out when an item is active. */}
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

          {timelineData.map((item) => (
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

          {/* Moons trailing the Custom Platform */}
          {MOON_CONFIGS.map((moon) => (
            <div
              key={moon.id}
              className="orbital-moon"
              data-angle-offset={moon.angleOffset}
              data-radius-offset={moon.radiusOffset}
              data-phase={moon.phase}
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: `${moon.size}px`,
                height: `${moon.size}px`,
                marginLeft: `-${moon.size / 2}px`,
                marginTop: `-${moon.size / 2}px`,
                borderRadius: '50%',
                background: `rgba(241, 196, 15, ${moon.opacity})`,
                boxShadow: `0 0 ${moon.size * 2}px rgba(241, 196, 15, ${moon.opacity * 0.6})`,
                pointerEvents: 'none',
                zIndex: 9,
              }}
            />
          ))}
        </div>

        {/* Content panel fades in over the orbital. */}
        <div className={`orbital-content-panel${contentVisible ? ' visible' : ''}`}>
          {activeItem && (
            <>
              <div
                className="ocp-icon"
                style={{
                  background: accentBg,
                  color: accent,
                  borderColor: isYellow ? 'rgba(241,196,15,0.5)' : 'rgba(102,212,106,0.5)',
                }}
              >
                <div dangerouslySetInnerHTML={{ __html: activeItem.icon }} />
              </div>
              <span
                className="ocp-category"
                style={{
                  background: accentBg,
                  color: accent,
                  border: `1px solid ${isYellow ? 'rgba(241,196,15,0.4)' : 'rgba(102,212,106,0.4)'}`,
                }}
              >
                {activeItem.category}
              </span>
              <h3 className="ocp-title" style={{ color: '#e8ede8' }}>{activeItem.title}</h3>
              <p className="ocp-body" style={{ color: '#e8ede8' }}>{activeItem.content}</p>
              <div className="ocp-actions">
                {activeItem.link ? (
                  <Link href={activeItem.link} className="btn">
                    Explore {activeItem.title} -&gt;
                  </Link>
                ) : (
                  <a href="#contact" className="btn">
                    Learn More -&gt;
                  </a>
                )}
                <button className="ocp-back" onClick={handleClose}>
                  &lt;- Back
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
