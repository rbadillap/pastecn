import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono, Instrument_Sans, Instrument_Serif } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})
const brandFont = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-brand",
  weight: "400",
  display: "swap",
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://pastecn.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "pastecn — Create shareable shadcn/ui registry URLs",
    template: "%s — pastecn",
  },
  description: "Create shareable registry URLs for your shadcn/ui components. Paste your code and get a shadcn-compatible registry URL instantly.",
  keywords: ["shadcn", "shadcn/ui", "registry", "component sharing", "react components", "next.js", "ui components"],
  authors: [{ name: "Ronny Badilla" }],
  creator: "Ronny Badilla",
  publisher: "pastecn",
  generator: "Next.js",
  applicationName: "pastecn",
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "pastecn",
    title: "pastecn — Create shareable shadcn/ui registry URLs",
    description: "Create shareable registry URLs for your shadcn/ui components. Paste your code and get a shadcn-compatible registry URL instantly.",
    images: [
      {
        url: "/opengraph-image.jpg",
        width: 1200,
        height: 630,
        alt: "pastecn — Create shareable shadcn/ui registry URLs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "pastecn — Create shareable shadcn/ui registry URLs",
    description: "Create shareable registry URLs for your shadcn/ui components. Paste your code and get a shadcn-compatible registry URL instantly.",
    images: ["/opengraph-image.jpg"],
    creator: "@pastecn",
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${brandFont.variable}`}>
      <body className="font-sans antialiased bg-neutral-100">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
