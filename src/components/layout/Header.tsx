'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Menu, X, Phone } from 'lucide-react'
import { FaInstagram, FaTelegram, FaWhatsapp } from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog'
import BookingForm from '@/components/forms/BookingForm'
import { useSettings } from '@/lib/settings-context'

export default function Header() {
  const { settings } = useSettings()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Navigation links
  const navLinks = [
    { name: 'Главная', href: '/' },
    { name: 'Маршруты', href: '/#routes' },
    { name: 'Автомобили', href: '/#vehicles' },
    { name: 'Преимущества', href: '/#benefits' },
    { name: 'Отзывы', href: '/#reviews' },
    { name: 'Блог', href: '/blog' },
    { name: 'Контакты', href: '/#contacts' },
    { name: 'Политика конфиденциальности', href: '/privacy-policy' },
  ]

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-md py-2'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold text-primary flex items-center space-x-2 group mr-auto"
        >
          {/* Логотип и название компании */}
          <div className="flex items-center">
            <Image
              src="/images/logo.png"
              alt={settings.companyName}
              width={150}
              height={40}
              className="h-10 w-auto object-contain mr-2"
              priority
            />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700 hidden sm:inline">
              {settings.companyName}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 ml-4">
          {navLinks.slice(0, 7).map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="nav-link px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Contact & Book Button */}
        <div className="hidden md:flex items-center space-x-4 ml-2">
          {/* Social Media Icons */}
          <div className="flex space-x-2 mr-4">
            <a
              href={settings.instagramLink}
              className="bg-pink-600 hover:bg-pink-700 p-1.5 rounded-full transition-colors"
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram className="w-3.5 h-3.5 text-white" />
            </a>
            <a
              href={settings.telegramLink}
              className="bg-blue-500 hover:bg-blue-600 p-1.5 rounded-full transition-colors"
              aria-label="Telegram"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTelegram className="w-3.5 h-3.5 text-white" />
            </a>
            <a
              href={settings.whatsappLink}
              className="bg-green-600 hover:bg-green-700 p-1.5 rounded-full transition-colors"
              aria-label="WhatsApp"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp className="w-3.5 h-3.5 text-white" />
            </a>
          </div>

          <a
            href={`tel:${settings.phone.replace(/\s+/g, '')}`}
            className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors"
          >
            <Phone className="w-4 h-4 mr-2 animate-pulse" />
            <span>{settings.phone}</span>
          </a>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="btn-gradient text-white font-medium">
                Заказать трансфер
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px] p-0 overflow-hidden">
              <DialogTitle className="sr-only">Заказать трансфер</DialogTitle>
              <BookingForm />
            </DialogContent>
          </Dialog>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 shadow-lg">
          <div className="container mx-auto py-4 px-4">
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}

              {/* Social Media Icons for mobile */}
              <div className="flex space-x-3 py-2">
                <a
                  href={settings.instagramLink}
                  className="bg-pink-600 hover:bg-pink-700 p-2 rounded-full transition-colors"
                  aria-label="Instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaInstagram className="w-4 h-4 text-white" />
                </a>
                <a
                  href={settings.telegramLink}
                  className="bg-blue-500 hover:bg-blue-600 p-2 rounded-full transition-colors"
                  aria-label="Telegram"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaTelegram className="w-4 h-4 text-white" />
                </a>
                <a
                  href={settings.whatsappLink}
                  className="bg-green-600 hover:bg-green-700 p-2 rounded-full transition-colors"
                  aria-label="WhatsApp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaWhatsapp className="w-4 h-4 text-white" />
                </a>
              </div>

              <a
                href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors"
              >
                <Phone className="w-4 h-4 mr-2" />
                <span>{settings.phone}</span>
              </a>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    className="btn-gradient text-white font-medium w-full"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Заказать трансфер
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[625px] p-0 overflow-hidden">
                  <DialogTitle className="sr-only">Заказать трансфер</DialogTitle>
                  <BookingForm />
                </DialogContent>
              </Dialog>
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
