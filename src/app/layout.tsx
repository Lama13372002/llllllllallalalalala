import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { SettingsProvider } from '@/lib/settings-context'
import { HomeSettingsProvider } from '@/lib/home-settings-context'
import { Toaster } from 'sonner'
import ClientBody from './ClientBody'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export const metadata: Metadata = {
  title: 'Royal Transfer - Комфортные трансферы из Калининграда в Европу',
  description: 'Безопасные и удобные поездки в города Европы с комфортом и по фиксированным ценам',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className="scroll-smooth">
      <ClientBody>
        <SettingsProvider>
          <HomeSettingsProvider>
            <div className={`flex flex-col min-h-screen ${inter.className}`}>
              <Header />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
              <Toaster position="top-right" />
            </div>
          </HomeSettingsProvider>
        </SettingsProvider>
      </ClientBody>
    </html>
  )
}
