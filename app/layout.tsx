import type { Metadata, Viewport } from 'next'
import { Geist, Fraunces, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { NudgeProvider } from '@/components/nudge-provider'
import './globals.css'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
})
const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
})
const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

const SITE_URL = 'https://nudgeem.app'
const SITE_NAME = 'NudgeEm'
const TITLE = 'NudgeEm — Learn Behavioral Economics by Living It'
const DESCRIPTION =
  'NudgeEm teaches Behavioral Economics and Nudge Theory through real-time, interactive economic simulations. Spot the dark patterns, beat your biases, and protect your Rationality Score.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: '%s — NudgeEm',
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  generator: 'NudgeEm',
  keywords: [
    'behavioral economics',
    'nudge theory',
    'loss aversion',
    'anchoring effect',
    'scarcity mindset',
    'default bias',
    'framing effect',
    'financial literacy',
    'interactive simulation',
    'dark patterns',
  ],
  authors: [{ name: 'NudgeEm' }],
  creator: 'NudgeEm',
  publisher: 'NudgeEm',
  category: 'Education',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: '#09090b',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`dark ${geist.variable} ${fraunces.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased bg-zinc-950 text-zinc-100">
        <NudgeProvider>{children}</NudgeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
