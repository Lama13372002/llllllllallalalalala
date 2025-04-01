import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { SettingsProvider } from '@/lib/settings-context'
import { HomeSettingsProvider } from '@/lib/home-settings-context'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export const metadata: Metadata = {
  title: 'RoyalTransfer',
  description: 'Трансферы из Калининграда в города Европы',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <SettingsProvider>
          <HomeSettingsProvider>
            {children}
            <Toaster position="top-right" richColors />
          </HomeSettingsProvider>
        </SettingsProvider>
      </body>
    </html>
  )
}
