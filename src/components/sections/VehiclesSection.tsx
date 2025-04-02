'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Car, Users, Briefcase, Wifi, Leaf, Coffee, Check, ChevronRight, ChevronLeft, ArrowUp, ArrowDown, Undo2 } from 'lucide-react'
import BookingForm from '@/components/forms/BookingForm'

// Тип для транспортных средств из API
type DBVehicle = {
  id: number
  class: string
  brand: string
  model: string
  year: number
  seats: number
  description: string | null
  imageUrl: string | null
  amenities: string | null
  isActive: boolean
}

// Тип для отображения на фронтенде с преобразованными данными
type DisplayVehicle = {
  id: string
  name: string
  brand: string
  model: string
  year: number
  seats: number
  description: string
  price: string
  imageUrl: string | null // Изменено с image на imageUrl для соответствия с БД
  fallbackImage: string
  features: string[]
  isActive: boolean
}

// Изображения по умолчанию для разных классов транспорта
const defaultImages: Record<string, string> = {
  'Standart': 'https://images.unsplash.com/photo-1590362891991-f776e747a588?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'Comfort': 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  'Business': 'https://images.unsplash.com/photo-1549399542-7e8f2e928464?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80',
  'VIP': 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?q=80&w=1025&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  'Minivan': 'https://images.unsplash.com/photo-1468818438311-4bab781ab9b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80',
  // Значение по умолчанию для неизвестных классов
  'default': 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
}

// Цены по умолчанию для разных классов транспорта
const defaultPrices: Record<string, string> = {
  'Standart': 'от 250.00 EUR',
  'Comfort': 'от 250.00 EUR',
  'Business': 'от 350.00 EUR',
  'VIP': 'от 500.00 EUR',
  'Minivan': 'от 500.00 EUR',
  // Значение по умолчанию для неизвестных классов
  'default': 'от 300.00 EUR'
}

// Основные удобства для разных классов транспорта, если не указано в БД
const defaultFeatures: Record<string, string[]> = {
  'Standart': [
    'Кондиционер',
    'Комфортабельные сиденья',
    'Wi-Fi',
    'Зарядные устройства',
    'Бутилированная вода',
    'Удобный багажник'
  ],
  'Comfort': [
    'Просторный салон',
    'Климат-контроль',
    'Wi-Fi',
    'Зарядные устройства',
    'Бутилированная вода',
    'Большой багажник'
  ],
  'Business': [
    'Кожаный салон',
    'Мультизонный климат-контроль',
    'Массаж сидений',
    'Wi-Fi',
    'Мини-бар',
    'Премиальная аудиосистема'
  ],
  'VIP': [
    'Эксклюзивный кожаный салон',
    'Интеллектуальный климат-контроль',
    'Массаж и вентиляция сидений',
    'Wi-Fi высокоскоростной',
    'Персональный мини-бар',
    'Аудиосистема премиум-класса',
    'Шумоизоляция'
  ],
  'Minivan': [
    'Просторный салон',
    'Комфортабельные сиденья',
    'Климат-контроль',
    'Wi-Fi',
    'Зарядные устройства',
    'Большое багажное отделение',
    'Складные столики'
  ]
}

// Иконки для особенностей автомобилей
const featureIcons: Record<string, React.ReactNode> = {
  'Wi-Fi': <Wifi className="w-4 h-4" />,
  'Wi-Fi высокоскоростной': <Wifi className="w-4 h-4" />,
  'Просторный салон': <Users className="w-4 h-4" />,
  'Кожаный салон': <Briefcase className="w-4 h-4" />,
  'Эксклюзивный кожаный салон': <Briefcase className="w-4 h-4" />,
  'Климат-контроль': <Leaf className="w-4 h-4" />,
  'Мультизонный климат-контроль': <Leaf className="w-4 h-4" />,
  'Интеллектуальный климат-контроль': <Leaf className="w-4 h-4" />,
  'Бутилированная вода': <Coffee className="w-4 h-4" />,
  'Мини-бар': <Coffee className="w-4 h-4" />,
  'Персональный мини-бар': <Coffee className="w-4 h-4" />,
}

export default function VehiclesSection() {
  const [vehicles, setVehicles] = useState<DisplayVehicle[]>([])
  const [activeVehicle, setActiveVehicle] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showVehicleDetails, setShowVehicleDetails] = useState(false) // Новое состояние для переключения между каруселью и деталями
  const [showLeftScroll, setShowLeftScroll] = useState(false)
  const [showRightScroll, setShowRightScroll] = useState(true)
  const [showMobileSelector, setShowMobileSelector] = useState(false)

  const tabsListRef = useRef<HTMLDivElement>(null)

  // Функция для определения видимости стрелок прокрутки
  const checkScrollIndicators = () => {
    if (tabsListRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsListRef.current
      setShowLeftScroll(scrollLeft > 0)
      setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 5)

      // Найдем родительский контейнер и добавим/удалим класс для левого градиента
      const tabsContainer = tabsListRef.current.closest('.vehicles-tabs-container')
      if (tabsContainer) {
        if (scrollLeft > 0) {
          tabsContainer.classList.add('can-scroll-left')
        } else {
          tabsContainer.classList.remove('can-scroll-left')
        }
      }
    }
  }

  // Функция для прокрутки списка влево
  const scrollLeft = () => {
    if (tabsListRef.current) {
      tabsListRef.current.scrollBy({ left: -100, behavior: 'smooth' })
    }
  }

  // Функция для прокрутки списка вправо
  const scrollRight = () => {
    if (tabsListRef.current) {
      tabsListRef.current.scrollBy({ left: 100, behavior: 'smooth' })
    }
  }

  // Функция для конвертации данных из БД в формат для отображения
  const formatVehicleData = (dbVehicle: DBVehicle): DisplayVehicle => {
    // Получаем класс автомобиля и нормализуем его для поиска в словарях
    const vehicleClass = dbVehicle.class.trim()

    // Получаем изображение по умолчанию для данного класса или общее значение по умолчанию
    const fallbackImage = defaultImages[vehicleClass] || defaultImages.default

    // Получаем цену по умолчанию для данного класса или общее значение по умолчанию
    const price = defaultPrices[vehicleClass] || defaultPrices.default

    // Разбираем строку с удобствами из БД, если она есть
    const features = dbVehicle.amenities
      ? dbVehicle.amenities.split(';')
      : (defaultFeatures[vehicleClass] || [])

    // Формируем объект для отображения
    return {
      id: dbVehicle.id.toString(),
      name: vehicleClass,
      brand: dbVehicle.brand,
      model: dbVehicle.model,
      year: dbVehicle.year,
      seats: dbVehicle.seats,
      description: dbVehicle.description || `Комфортабельный автомобиль класса ${vehicleClass}.`,
      price: price,
      imageUrl: dbVehicle.imageUrl, // Прямое присваивание URL изображения из БД
      fallbackImage: fallbackImage,
      features: features,
      isActive: dbVehicle.isActive
    }
  }

  // Функция для загрузки транспортных средств из API
  const fetchVehicles = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/vehicles')

      if (!response.ok) {
        throw new Error('Не удалось загрузить данные об автопарке')
      }

      const data = await response.json()

      if (data.vehicles && Array.isArray(data.vehicles)) {
        // Фильтруем только активные транспортные средства и конвертируем их
        const activeVehicles = data.vehicles
          .filter((v: DBVehicle) => v.isActive)
          .map(formatVehicleData)

        setVehicles(activeVehicles)

        // Устанавливаем активную вкладку, если есть транспортные средства
        if (activeVehicles.length > 0) {
          setActiveVehicle(activeVehicles[0].id)
        }
      } else {
        // Если нет данных, используем демо-данные
        setVehicles([])
        setError('Нет данных об автопарке')
      }
    } catch (err) {
      console.error('Error fetching vehicles:', err)
      setError('Ошибка при загрузке данных об автопарке')
      // В случае ошибки устанавливаем пустой массив
      setVehicles([])
    } finally {
      setLoading(false)
    }
  }

  // Загружаем данные при монтировании компонента
  useEffect(() => {
    fetchVehicles()
  }, [])

  // Для отладки - выводим в консоль данные о загруженных транспортных средствах
  useEffect(() => {
    if (vehicles.length > 0) {
      console.log('Loaded vehicles:', vehicles)
    }
  }, [vehicles])

  // Добавляем эффект для отслеживания прокрутки
  useEffect(() => {
    const tabsListElement = tabsListRef.current
    if (tabsListElement) {
      checkScrollIndicators()
      tabsListElement.addEventListener('scroll', checkScrollIndicators)
      window.addEventListener('resize', checkScrollIndicators)

      return () => {
        tabsListElement.removeEventListener('scroll', checkScrollIndicators)
        window.removeEventListener('resize', checkScrollIndicators)
      }
    }
  }, [vehicles])

  // Функция для обработки выбора автомобиля
  const handleVehicleSelect = (vehicleId: string) => {
    // Устанавливаем активное значение
    setActiveVehicle(vehicleId);

    // Показываем детали автомобиля
    setShowVehicleDetails(true);

    // Добавляем тактильную отдачу при выборе, если поддерживается
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  // Функция для возврата к карусели
  const handleBackToCarousel = () => {
    setShowVehicleDetails(false);
  };

  // Если данные загружаются, показываем индикатор загрузки
  if (loading) {
    return (
      <section id="vehicles" className="py-16 md:py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 heading-underline inline-block">
              Наш автопарк
            </h2>
            <div className="flex justify-center items-center min-h-[300px]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Если произошла ошибка или нет данных, показываем сообщение
  if (error || vehicles.length === 0) {
    return (
      <section id="vehicles" className="py-16 md:py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 heading-underline inline-block">
              Наш автопарк
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {error || 'Информация об автопарке временно недоступна. Пожалуйста, свяжитесь с нами для получения актуальной информации.'}
            </p>
          </div>
        </div>
      </section>
    )
  }

  // Получаем данные активного автомобиля
  const currentVehicle = vehicles.find(v => v.id === activeVehicle)

  return (
    <section id="vehicles" className="py-16 md:py-20 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-4 heading-underline inline-block"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Наш автопарк
          </motion.h2>
          <motion.p
            className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Мы предлагаем комфортабельные автомобили разных классов для ваших поездок.
            Выберите подходящий вариант и наслаждайтесь путешествием.
          </motion.p>
        </div>

        <AnimatePresence mode="wait">
          {!showVehicleDetails ? (
            <motion.div
              key="carousel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col"
            >
              {/* Карусель (только круговой селектор) */}
              <div className="vehicle-class-selector max-w-4xl mx-auto px-4 mb-8">
                <div className="flex justify-center">
                  <motion.div
                    className="vehicle-circle-selector relative"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, type: "spring" }}
                  >
                    {vehicles.map((vehicle, index) => {
                      // Вычисляем положение для каждой кнопки на круге
                      const totalItems = vehicles.length;
                      const angleStep = (2 * Math.PI) / totalItems;
                      const angle = index * angleStep - Math.PI / 2; // Начинаем с верхней позиции

                      // Определяем радиус в зависимости от количества элементов
                      // Для маленького количества элементов радиус может быть меньше
                      const baseRadius = Math.min(160, 130 + (totalItems * 5));

                      // Вычисляем координаты X и Y для позиционирования
                      const x = Math.cos(angle) * baseRadius;
                      const y = Math.sin(angle) * baseRadius;

                      return (
                        <motion.button
                          key={vehicle.id}
                          className="vehicle-circle-item absolute z-10"
                          style={{
                            left: "50%",
                            top: "50%",
                            transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
                          }}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{
                            scale: 1,
                            opacity: 1,
                            transition: { delay: index * 0.1, duration: 0.4 }
                          }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleVehicleSelect(vehicle.id)}
                        >
                          <div className="flex flex-col items-center justify-center w-24 h-24 rounded-full shadow-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:shadow-lg transition-all duration-300">
                            <Car className="w-6 h-6 mb-1 text-primary" />
                            <span className="text-sm font-medium whitespace-nowrap">{vehicle.name}</span>
                            {vehicle.name === 'VIP' && (
                              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full animate-pulse">
                                New
                              </span>
                            )}
                          </div>
                        </motion.button>
                      );
                    })}

                    {/* Центральный круг */}
                    <motion.div
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full bg-white dark:bg-gray-800 shadow-md flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, type: "spring" }}
                    >
                      <div className="text-center">
                        <Car className="w-8 h-8 text-primary mx-auto mb-1" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Выберите<br/>класс</span>
                      </div>
                    </motion.div>

                    {/* Добавим декоративный круг для визуальной подсказки */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] rounded-full border border-dashed border-gray-200 dark:border-gray-700 opacity-30"></div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="details"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="mt-8"
            >
              {currentVehicle && (
                <div className="grid md:grid-cols-2 gap-8 md:gap-10 items-center">
                  <motion.div
                    className="relative rounded-lg overflow-hidden shadow-xl group"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                  >
                    <div
                      className="aspect-[16/9] bg-cover bg-center relative transition-all duration-700 transform group-hover:scale-105"
                      style={{
                        backgroundImage: `url(${currentVehicle.imageUrl || currentVehicle.fallbackImage})`,
                        animationDuration: '3s'
                      }}
                    >
                    </div>
                    <div className="absolute top-4 right-4 bg-primary/90 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm shadow-lg transform hover:scale-105 transition-transform">
                      {currentVehicle.price}
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <div className="mb-6">
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 text-gray-900 dark:text-white flex flex-wrap items-center gap-1">
                        <Car className="w-5 h-5 mr-1 text-primary" />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-700">
                          {currentVehicle.name}
                        </span>
                        <span className="mx-1">-</span>
                        <span>{currentVehicle.brand} {currentVehicle.model}</span>
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 flex items-center flex-wrap gap-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs">
                          {currentVehicle.year} год
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs">
                          <Users className="w-3 h-3 mr-1" />
                          {currentVehicle.seats} места
                        </span>
                      </p>
                      <p className="text-gray-700 dark:text-gray-300 mb-6">
                        {currentVehicle.description}
                      </p>

                      <motion.div
                        className="grid grid-cols-1 xs:grid-cols-2 gap-3 mb-8"
                        initial="hidden"
                        animate="show"
                        variants={{
                          hidden: { opacity: 0 },
                          show: {
                            opacity: 1,
                            transition: {
                              staggerChildren: 0.1
                            }
                          }
                        }}
                      >
                        {currentVehicle.features.map((feature, index) => (
                          <motion.div
                            key={index}
                            variants={{
                              hidden: { opacity: 0, x: 20 },
                              show: { opacity: 1, x: 0 }
                            }}
                            className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 group hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-md transition-colors"
                          >
                            <div className="text-primary group-hover:scale-110 transition-transform">
                              {featureIcons[feature] ?? <Check className="w-4 h-4" />}
                            </div>
                            <span className="text-sm sm:text-base">{feature}</span>
                          </motion.div>
                        ))}
                      </motion.div>

                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                          className="w-full sm:w-auto btn-secondary relative group overflow-hidden rounded-full font-medium transition-all px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-center gap-2"
                          onClick={handleBackToCarousel}
                        >
                          <Undo2 className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span>Выбрать другой класс</span>
                        </Button>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="w-full sm:w-auto btn-gradient relative group overflow-hidden rounded-full font-medium transition-all px-4 sm:px-6 py-3 sm:py-4 vehicle-order-button">
                              <span className="relative z-10 flex items-center justify-center gap-2">
                                <span>Заказать трансфер</span>
                                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                              </span>
                              <span className="absolute inset-0 bg-white/20 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[625px] p-0 overflow-hidden max-w-[95vw] mx-auto">
                            <BookingForm />
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
