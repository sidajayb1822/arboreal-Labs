'use client'

import { useEffect, useRef, useState } from 'react'

interface Plan {
  name: string
  users: string
  annualPrice: string
  quarterlyPrice: string
  desc: string
  featuresHeading: string
  features: { text: string; highlight?: boolean }[]
  cta: string
  ctaHref: string
  popular?: boolean
  customPrice?: boolean
}

const plans: Plan[] = [
  {
    name: 'Basic',
    users: 'Up to 5 Users',
    annualPrice: '699',
    quarterlyPrice: '899',
    desc: 'Perfect for small teams needing essential operational organization and structured project tracking.',
    featuresHeading: 'Features Included',
    features: [
      { text: 'Intelligent User Management' },
      { text: 'Complete Project Management Suite' },
      { text: 'Client Access Portals' },
    ],
    cta: 'Get Started',
    ctaHref: '#signup',
  },
  {
    name: 'Pro',
    users: 'Up to 15 Users',
    annualPrice: '1,999',
    quarterlyPrice: '2,499',
    desc: 'Built for growing agencies that need to keep their operations fluid and finances meticulously in check.',
    featuresHeading: 'Everything in Basic, plus:',
    features: [
      { text: 'Financial Cost Tracker', highlight: true },
      { text: 'Project-Based Accounting' },
      { text: 'Real-Time Analytics & Reporting' },
    ],
    cta: 'Start Free Trial',
    ctaHref: '#signup',
    popular: true,
  },
  {
    name: 'Pro Plus',
    users: 'Up to 30 Users',
    annualPrice: '3,599',
    quarterlyPrice: '4,499',
    desc: 'The ultimate suite for scaling businesses highly focused on aggressive sales tracking and execution.',
    featuresHeading: 'Everything in Pro, plus:',
    features: [
      { text: 'Lead Pipeline Tracker', highlight: true },
      { text: 'Quick-Action Scheduling' },
      { text: 'Referral Tracking Engine' },
    ],
    cta: 'Upgrade to Pro+',
    ctaHref: '#signup',
  },
  {
    name: 'Enterprise',
    users: 'Unlimited Users',
    annualPrice: 'Custom',
    quarterlyPrice: 'Custom',
    desc: 'For established organizations requiring complete brand control, white-labeling, and infinite scale.',
    featuresHeading: 'Everything in Pro Plus, plus:',
    features: [
      { text: 'Infinite Scale (Unlimited Seats)' },
      { text: 'Full Custom White-labeling' },
      { text: 'Custom Branded Domain Hosting' },
      { text: 'Priority Support' },
    ],
    cta: 'Contact Sales',
    ctaHref: '#contact',
    customPrice: true,
  },
]

export default function PricingSection() {
  const [isQuarterly, setIsQuarterly] = useState(false)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!gridRef.current) return
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
    gridRef.current.querySelectorAll('.pricing-card').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <section className="container" id="pricing">
      <h2 className="section-title">Flexible Pricing Plans</h2>

      <div className="pricing-toggle">
        <span
          className={`toggle-label${!isQuarterly ? ' active' : ''}`}
          onClick={() => setIsQuarterly(false)}
        >
          Billed Annually
        </span>
        <label className="switch">
          <input
            type="checkbox"
            checked={isQuarterly}
            onChange={e => setIsQuarterly(e.target.checked)}
          />
          <span className="slider" />
        </label>
        <span
          className={`toggle-label${isQuarterly ? ' active' : ''}`}
          onClick={() => setIsQuarterly(true)}
        >
          Billed Quarterly
        </span>
        <span className={`savings-badge${!isQuarterly ? ' visible' : ''}`}>Save up to 33%</span>
      </div>

      <div className="pricing-grid" ref={gridRef}>
        {plans.map((plan, i) => (
          <div
            key={plan.name}
            className={`pricing-card animate-on-scroll${plan.popular ? ' popular' : ''}`}
            style={{ animationDelay: `${(i + 1) * 0.1}s` }}
          >
            {plan.popular && <div className="popular-badge">Most Popular</div>}
            <h3 className="plan-name">{plan.name}</h3>
            <div className="plan-users">{plan.users}</div>
            <div
              className="plan-price"
              style={plan.customPrice ? { fontSize: '2rem', marginTop: '1rem' } : {}}
            >
              {plan.customPrice ? (
                'Custom'
              ) : (
                <>
                  ₹<span className="price-val">{isQuarterly ? plan.quarterlyPrice : plan.annualPrice}</span>
                  <span>/mo</span>
                </>
              )}
            </div>
            <p className="plan-desc">{plan.desc}</p>
            <div className="plan-features">
              <h4>{plan.featuresHeading}</h4>
              <ul>
                {plan.features.map(f => (
                  <li key={f.text}>
                    {f.highlight ? (
                      <strong style={{ color: '#66d46a' }}>{f.text}</strong>
                    ) : (
                      f.text
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <a href={plan.ctaHref} className="btn-liquid-glass btn-full">
              <span>{plan.cta}</span>
            </a>
          </div>
        ))}
      </div>
    </section>
  )
}
