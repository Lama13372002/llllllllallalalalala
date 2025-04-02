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
              className="h-10 w-auto object-contain mr-2 custom-logo"
              priority
            />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700 hidden sm:inline text-sm font-medium company-name">
              {settings.companyName}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1 ml-4 main-nav">
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
        <div className="hidden md:flex items-center space-x-4 ml-2 action-buttons">
          {/* Social Media Icons */}
          <div className="flex space-x-2 mr-4 social-icons">
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
            className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors phone-link"
          >
            <Phone className="w-4 h-4 mr-2 animate-pulse" />
            <span>{settings.phone}</span>
          </a>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="btn-gradient text-white font-medium book-button">
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

      {/* Добавим стили для адаптации шапки под указанные разрешения */}
      <style jsx global>{`
        /* Адаптация для разрешения 1024x600 */
        @media (width: 1024px) and (height: 600px) {
          .custom-logo {
            height: 2.25rem; /* Уменьшаем размер логотипа */
            width: auto;
          }
          .company-name {
            font-size: 0.75rem; /* Уменьшаем размер текста */
          }
          .main-nav {
            gap: 0;
          }
          .main-nav .nav-link {
            padding: 0.5rem 0.5rem;
            font-size: 0.7rem;
          }
          .action-buttons {
            margin-left: 0.5rem;
          }
          .social-icons {
            margin-right: 0.5rem;
          }
          .social-icons a {
            padding: 0.25rem;
          }
          .social-icons svg {
            width: 0.75rem;
            height: 0.75rem;
          }
          .phone-link {
            font-size: 0.7rem;
          }
          .phone-link svg {
            width: 0.75rem;
            height: 0.75rem;
            margin-right: 0.25rem;
          }
          .book-button {
            font-size: 0.7rem;
            padding: 0.25rem 0.5rem;
          }
        }

        /* Адаптация для разрешения 1024x768 */
        @media (width: 1024px) and (height: 768px) {
          .custom-logo {
            height: 2.5rem;
            width: auto;
          }
          .company-name {
            font-size: 0.8rem;
          }
          .main-nav {
            gap: 0;
          }
          .main-nav .nav-link {
            padding: 0.5rem 0.75rem;
            font-size: 0.75rem;
          }
          .social-icons a {
            padding: 0.3rem;
          }
          .social-icons svg {
            width: 0.8rem;
            height: 0.8rem;
          }
        }

        /* Адаптация для разрешения 960x600 */
        @media (width: 960px) and (height: 600px) {
          .custom-logo {
            height: 2rem;
            width: auto;
          }
          .company-name {
            font-size: 0.7rem;
          }
          .main-nav {
            gap: 0;
            margin-left: 0.5rem;
          }
          .main-nav .nav-link {
            padding: 0.25rem 0.4rem;
            font-size: 0.65rem;
          }
          .action-buttons {
            margin-left: 0.25rem;
            gap: 0.5rem;
          }
          .social-icons {
            margin-right: 0.25rem;
            gap: 0.25rem;
          }
          .social-icons a {
            padding: 0.2rem;
          }
          .social-icons svg {
            width: 0.7rem;
            height: 0.7rem;
          }
          .phone-link {
            font-size: 0.65rem;
          }
          .phone-link svg {
            width: 0.7rem;
            height: 0.7rem;
            margin-right: 0.25rem;
          }
          .book-button {
            font-size: 0.65rem;
            padding: 0.25rem 0.5rem;
          }
        }
      `}</style>
    </header>
  )
}
