'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Menu, X, Phone, ChevronRight } from 'lucide-react'
import { FaInstagram, FaTelegram, FaWhatsapp } from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog'
import BookingForm from '@/components/forms/BookingForm'
import { useSettings } from '@/lib/settings-context'
import { motion, AnimatePresence } from 'framer-motion'

export default function Header() {
  const { settings } = useSettings()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Добавляем эффект для предотвращения прокрутки страницы при открытом меню
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  // Обработчик диалога
  const handleDialogChange = (open: boolean) => {
    setIsDialogOpen(open)
    if (open) {
      setIsMobileMenuOpen(false)
    }
  }

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

          <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
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
            className="relative group"
          >
            <div className="flex flex-col justify-center items-center w-6 h-6">
              <span className={`block w-5 h-0.5 bg-gray-700 dark:bg-gray-200 rounded-full transition-all duration-300 ease-out ${isMobileMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'}`}></span>
              <span className={`block w-5 h-0.5 bg-gray-700 dark:bg-gray-200 rounded-full transition-all duration-300 ease-out ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
              <span className={`block w-5 h-0.5 bg-gray-700 dark:bg-gray-200 rounded-full transition-all duration-300 ease-out ${isMobileMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'}`}></span>
            </div>
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden fixed inset-0 bg-white/95 dark:bg-gray-900/95 z-40 backdrop-blur-md overflow-y-auto"
            style={{ top: '4rem' }}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "calc(100vh - 4rem)" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="container mx-auto py-6 px-4 flex flex-col h-full mobile-menu-container">
              <div className="overflow-y-auto flex-1">
                <nav className="flex flex-col space-y-4 mb-6">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 + 0.1 }}
                    >
                      <Link
                        href={link.href}
                        className="text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors flex items-center justify-between group"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <span>{link.name}</span>
                        <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all" />
                      </Link>
                      <div className="h-px bg-gradient-to-r from-blue-200/50 to-transparent dark:from-blue-800/30 mt-2"></div>
                    </motion.div>
                  ))}
                </nav>

                <motion.div
                  className="mt-4 pb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {/* Контактная информация и социальные сети */}
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 shadow-sm mb-5 mobile-contact-card">
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3">Связаться с нами</h3>

                    <a
                      href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                      className="flex items-center text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors mb-4 mobile-contact-text"
                    >
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-3">
                        <Phone className="w-4 h-4 text-primary" />
                      </div>
                      <span>{settings.phone}</span>
                    </a>

                    <div className="flex items-center justify-between">
                      <a
                        href={settings.instagramLink}
                        className="flex flex-col items-center justify-center"
                        aria-label="Instagram"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mb-1 transform hover:scale-110 transition-transform mobile-social-icon">
                          <FaInstagram className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Instagram</span>
                      </a>

                      <a
                        href={settings.telegramLink}
                        className="flex flex-col items-center justify-center"
                        aria-label="Telegram"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mb-1 transform hover:scale-110 transition-transform mobile-social-icon">
                          <FaTelegram className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Telegram</span>
                      </a>

                      <a
                        href={settings.whatsappLink}
                        className="flex flex-col items-center justify-center"
                        aria-label="WhatsApp"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mb-1 transform hover:scale-110 transition-transform mobile-social-icon">
                          <FaWhatsapp className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">WhatsApp</span>
                      </a>
                    </div>
                  </div>

                  {/* Кнопка заказа с контролируемым состоянием диалога */}
                  <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
                    <DialogTrigger asChild>
                      <Button
                        className="w-full py-4 rounded-xl btn-gradient text-white font-medium text-base shadow-lg relative overflow-hidden group mb-4 mobile-order-button"
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          Заказать трансфер
                          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                        <span className="absolute inset-0 bg-white/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[625px] p-0 overflow-hidden">
                      <DialogTitle className="sr-only">Заказать трансфер</DialogTitle>
                      <BookingForm />
                    </DialogContent>
                  </Dialog>

                  <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                    © {new Date().getFullYear()} {settings.companyName}. Все права защищены.
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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

        /* Адаптации для мобильных устройств с малыми экранами */
        @media (max-width: 414px) {
          /* Уменьшаем отступы в мобильном меню */
          .mobile-menu-container {
            padding: 1rem;
          }

          /* Уменьшаем размер карточки контактов */
          .mobile-contact-card {
            padding: 0.75rem;
            margin-bottom: 0.75rem;
          }

          /* Уменьшаем размер иконок соцсетей */
          .mobile-social-icon {
            width: 2rem;
            height: 2rem;
          }

          /* Увеличиваем размер кнопки */
          .mobile-order-button {
            margin-top: 0.5rem;
            padding: 0.75rem !important;
          }
        }

        /* Специфичная адаптация для iPhone SE и подобных */
        @media (max-width: 320px) {
          .mobile-menu-container {
            padding: 0.75rem 0.5rem;
          }

          .mobile-social-icon {
            width: 1.75rem;
            height: 1.75rem;
          }

          .mobile-contact-text {
            font-size: 0.8rem;
          }
        }
      `}</style>
    </header>
  )
}
