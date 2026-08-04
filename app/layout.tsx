import type { Metadata } from 'next'
import { Inter, Caveat, Orbitron } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const caveat = Caveat({ subsets: ['latin'], variable: '--font-caveat', display: 'swap' })
const orbitron = Orbitron({ subsets: ['latin'], variable: '--font-orbitron', display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL("https://streakathon.vercel.app"),
  title: "STREAKATHON | Continuous Innovation Platform",
  description: "The ultimate hackathon platform for IT students to build streaks, earn credits, and climb the leaderboard.",
  keywords: ["hackathon", "student platform", "innovation", "college", "programming", "leaderboard"],
  authors: [{ name: "IT Department" }],
  manifest: "/manifest.json",
  openGraph: {
    title: "STREAKATHON",
    description: "Build streaks. Earn credits. Become a legend.",
    url: "https://streakathon.vercel.app",
    siteName: "STREAKATHON",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "STREAKATHON",
    description: "Continuous Innovation Platform for IT Students",
  }
}

import NextAuthSessionProvider from '@/components/providers/session-provider'
import NextTopLoader from 'nextjs-toploader';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${inter.variable} ${caveat.variable} ${orbitron.variable} min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-primary/30 selection:text-primary`}>
        <NextAuthSessionProvider>
          <NextTopLoader
            color="#3b82f6"
            initialPosition={0.08}
            crawlSpeed={200}
            height={3}
            crawl={true}
            showSpinner={false}
            easing="ease"
            speed={200}
            shadow="0 0 10px #3b82f6,0 0 5px #3b82f6"
          />
          <Navbar />
          <main className="flex-1 flex flex-col items-center w-full">
            {children}
          </main>
          <Footer />
        </NextAuthSessionProvider>
      </body>
    </html>
  )
}
