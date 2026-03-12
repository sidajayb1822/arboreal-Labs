import type { Metadata } from 'next'
import { Outfit, Inter } from 'next/font/google'
import './globals.css'

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
  title: 'Arboreal Labs - AI Automation SaaS',
  description: 'Arboreal Labs empowers businesses with custom reporting, automation platforms and enterprise-grade pre-built solutions.',
  icons: { icon: '/Favicon.png' },
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
