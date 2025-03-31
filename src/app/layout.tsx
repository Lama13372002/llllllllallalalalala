import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ClientBody from './ClientBody'
import { SettingsProvider } from '@/lib/settings-context'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export const metadata: Metadata = {
  title: 'RoyalTransfer - Комфортные трансферы по Европе',
  description: 'Заказывайте трансферы из Калининграда в города Европы. Комфортные автомобили и опытные водители.',
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
          <div className={inter.className}>
            <Header />
            <main>
              {children}
            </main>
            <Footer />
            <Toaster position="top-right" />
          </div>
        </SettingsProvider>
      </ClientBody>
    </html>
  )
}
