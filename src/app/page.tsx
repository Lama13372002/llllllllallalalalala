import HeroSection from '@/components/sections/HeroSection'
import RoutesSection from '@/components/sections/RoutesSection'
import VehiclesSection from '@/components/sections/VehiclesSection'
import BenefitsSection from '@/components/sections/BenefitsSection'
import ReviewsSection from '@/components/sections/ReviewsSection'
import BlogSection from '@/components/sections/BlogSection'
import ContactsSection from '@/components/sections/ContactsSection'
import CTA from '@/components/sections/CTA'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

// Изменяем на динамическую генерацию страницы
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'
export const revalidate = 0

export default function Home() {
  return (
    <>
      <Header />
      <div className="flex flex-col min-h-screen">
        <HeroSection />
        <RoutesSection />
        <VehiclesSection />
        <BenefitsSection />
        <ReviewsSection />
        <BlogSection />
        <ContactsSection />
        <CTA />
      </div>
      <Footer />
    </>
  )
}
