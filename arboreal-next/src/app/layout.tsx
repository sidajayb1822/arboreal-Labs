import type { Metadata } from 'next'
import { Outfit, Inter } from 'next/font/google'
import './globals.css'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://arboreallabs.com'

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '600', '800'],
  variable: '--font-heading-next',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-body-next',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Arboreal Labs – AI Automation & Custom SaaS Platform',
    template: '%s | Arboreal Labs',
  },
  description:
    'Arboreal Labs builds custom AI automation platforms and pre-built SaaS tools for businesses. Streamline workflows, manage projects, and scale operations faster.',
  keywords: [
    'AI automation',
    'custom SaaS platform',
    'business automation software',
    'agency project management',
    'AI-powered CRM',
    'workflow automation',
    'enterprise SaaS',
    'Arboreal Labs',
  ],
  authors: [{ name: 'Arboreal Labs', url: SITE_URL }],
  creator: 'Arboreal Labs',
  openGraph: {
    type: 'website',
    siteName: 'Arboreal Labs',
    locale: 'en_US',
    url: SITE_URL,
    title: 'Arboreal Labs – AI Automation & Custom SaaS Platform',
    description:
      'Custom AI automation platforms and pre-built SaaS tools for businesses. Streamline workflows, manage projects, and scale operations faster.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Arboreal Labs – AI Automation & Custom SaaS Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Arboreal Labs – AI Automation & Custom SaaS Platform',
    description:
      'Custom AI automation platforms and pre-built SaaS tools for businesses. Streamline workflows and scale operations faster.',
    images: ['/og-image.png'],
  },
  icons: { icon: '/Favicon.png' },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  )
}
