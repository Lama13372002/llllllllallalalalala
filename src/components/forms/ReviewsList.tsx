'use client'

import { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Pencil,
  Trash2,
  Plus,
  X,
  Star,
  StarOff,
  User,
  ExternalLink
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog'
import { toast } from 'sonner'

// Тип для отзыва
interface Review {
  id: number
  customerName: string
  rating: number
  comment: string
  imageUrl: string | null
  isPublished: boolean
  createdAt: string
  updatedAt: string
}

export default function ReviewsList() {
  // Состояния
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Состояния для диалогов
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Состояние для текущего отзыва
  const [currentReview, setCurrentReview] = useState<Review | null>(null)

  // Состояние формы
  const [formData, setFormData] = useState({
    customerName: '',
    rating: 5,
    comment: '',
    imageUrl: '',
    isPublished: true
  })

  // Состояние для операций
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Загрузка отзывов при монтировании компонента
  useEffect(() => {
    fetchReviews()
  }, [])

  // Функция для загрузки отзывов
  const fetchReviews = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/reviews')

      if (!response.ok) {
        throw new Error('Failed to fetch reviews')
      }

      const data = await response.json()
      setReviews(data)
    } catch (err) {
      console.error('Error loading reviews:', err)
      setError('Не удалось загрузить отзывы')
      toast.error('Не удалось загрузить отзывы')
    } finally {
      setLoading(false)
    }
  }

  // Обработка изменений в форме
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Обработка изменения рейтинга
  const handleRatingChange = (newRating: number) => {
    setFormData(prev => ({ ...prev, rating: newRating }))
  }

  // Обработка изменения статуса публикации
  const handlePublishedChange = (isPublished: boolean) => {
    setFormData(prev => ({ ...prev, isPublished }))
  }

  // Открытие диалога для создания отзыва
  const openCreateDialog = () => {
    setFormData({
      customerName: '',
      rating: 5,
      comment: '',
      imageUrl: '',
      isPublished: true
    })
    setIsCreateDialogOpen(true)
  }

  // Открытие диалога для редактирования отзыва
  const openEditDialog = (review: Review) => {
    setCurrentReview(review)
    setFormData({
      customerName: review.customerName,
      rating: review.rating,
      comment: review.comment,
      imageUrl: review.imageUrl || '',
      isPublished: review.isPublished
    })
    setIsEditDialogOpen(true)
  }

  // Открытие диалога для удаления отзыва
  const openDeleteDialog = (review: Review) => {
    setCurrentReview(review)
    setIsDeleteDialogOpen(true)
  }

  // Создание нового отзыва
  const createReview = async () => {
    if (!formData.customerName || !formData.comment) {
      toast.error('Пожалуйста, заполните все обязательные поля')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customerName: formData.customerName,
          rating: formData.rating,
          comment: formData.comment,
          imageUrl: formData.imageUrl || null,
          isPublished: formData.isPublished
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create review')
      }

      await fetchReviews()
      setIsCreateDialogOpen(false)
      toast.success('Отзыв успешно создан')
    } catch (err) {
      console.error('Error creating review:', err)
      toast.error('Не удалось создать отзыв')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Обновление отзыва
  const updateReview = async () => {
    if (!currentReview) return

    if (!formData.customerName || !formData.comment) {
      toast.error('Пожалуйста, заполните все обязательные поля')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/reviews?id=${currentReview.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          customerName: formData.customerName,
          rating: formData.rating,
          comment: formData.comment,
          imageUrl: formData.imageUrl || null,
          isPublished: formData.isPublished
        })
      })

      if (!response.ok) {
        throw new Error('Failed to update review')
      }

      await fetchReviews()
      setIsEditDialogOpen(false)
      toast.success('Отзыв успешно обновлен')
    } catch (err) {
      console.error('Error updating review:', err)
      toast.error('Не удалось обновить отзыв')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Удаление отзыва
  const deleteReview = async () => {
    if (!currentReview) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/reviews?id=${currentReview.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete review')
      }

      await fetchReviews()
      setIsDeleteDialogOpen(false)
      toast.success('Отзыв успешно удален')
    } catch (err) {
      console.error('Error deleting review:', err)
      toast.error('Не удалось удалить отзыв')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Компонент для отображения рейтинга в виде звезд
  const RatingStars = ({ rating, onChange }: { rating: number, onChange?: (rating: number) => void }) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            onClick={() => onChange && onChange(star)}
            className={`${onChange ? 'cursor-pointer hover:scale-110 transition-transform' : ''} focus:outline-none`}
          >
            <Star
              className={`w-5 h-5 ${
                star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    )
  }

  // Отображение при загрузке
  if (loading && reviews.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Управление отзывами</CardTitle>
          <CardDescription>Загрузка отзывов...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Управление отзывами</CardTitle>
            <CardDescription>
              Просмотр, добавление и редактирование отзывов клиентов
            </CardDescription>
          </div>
          <Button onClick={openCreateDialog} className="flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Добавить отзыв
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="p-3 rounded bg-red-50 text-red-700 text-sm mb-4">
            {error}
          </div>
        )}

        {reviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Отзывы отсутствуют. Нажмите &quot;Добавить отзыв&quot; чтобы создать первый отзыв.
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map(review => (
              <div
                key={review.id}
                className={`border rounded-lg p-4 ${review.isPublished ? 'border-gray-200' : 'border-gray-200 bg-gray-50'}`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    {review.imageUrl ? (
                      <div
                        className="w-12 h-12 rounded-full bg-cover bg-center mr-4"
                        style={{ backgroundImage: `url(${review.imageUrl})` }}
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-200 mr-4">
                        <User className="w-6 h-6 text-gray-500" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold">{review.customerName}</h3>
                      <div className="flex items-center space-x-2">
                        <RatingStars rating={review.rating} />
                        {!review.isPublished && (
                          <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                            Скрыт
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(review)}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => openDeleteDialog(review)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="mt-3 text-gray-600 text-sm">
                  {review.comment}
                </div>
                {review.imageUrl && (
                  <div className="mt-2">
                    <a
                      href={review.imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-500 flex items-center"
                    >
                      <img
                        src={review.imageUrl}
                        alt={`Аватар ${review.customerName}`}
                        className="w-8 h-8 object-cover rounded mr-2"
                      />
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                )}
                <div className="mt-2 text-xs text-gray-400">
                  Последнее обновление: {new Date(review.updatedAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Диалог создания отзыва */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Добавить новый отзыв</DialogTitle>
            <DialogDescription>
              Заполните форму для создания нового отзыва клиента.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="customerName" className="text-sm font-medium">
                Имя клиента *
              </label>
              <Input
                id="customerName"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                placeholder="Имя и фамилия"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Рейтинг *</label>
              <RatingStars rating={formData.rating} onChange={handleRatingChange} />
            </div>
            <div className="space-y-2">
              <label htmlFor="comment" className="text-sm font-medium">
                Текст отзыва *
              </label>
              <Textarea
                id="comment"
                name="comment"
                value={formData.comment}
                onChange={handleInputChange}
                placeholder="Текст отзыва клиента"
                rows={4}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="imageUrl" className="text-sm font-medium">
                URL изображения (аватара)
              </label>
              <Input
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                placeholder="https://example.com/avatar.jpg"
              />
              <p className="text-xs text-gray-500">
                Укажите URL изображения аватара клиента (необязательно)
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Статус публикации</label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => handlePublishedChange(true)}
                  className={`px-3 py-1 rounded-full text-sm flex items-center ${
                    formData.isPublished
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : 'bg-gray-100 text-gray-800 border border-gray-200'
                  }`}
                >
                  <Star className="w-3 h-3 mr-1" />
                  Опубликован
                </button>
                <button
                  type="button"
                  onClick={() => handlePublishedChange(false)}
                  className={`px-3 py-1 rounded-full text-sm flex items-center ${
                    !formData.isPublished
                      ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                      : 'bg-gray-100 text-gray-800 border border-gray-200'
                  }`}
                >
                  <StarOff className="w-3 h-3 mr-1" />
                  Скрыт
                </button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={isSubmitting}>
                Отмена
              </Button>
            </DialogClose>
            <Button
              type="button"
              onClick={createReview}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Сохранение...' : 'Создать отзыв'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Диалог редактирования отзыва */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Редактировать отзыв</DialogTitle>
            <DialogDescription>
              Внесите изменения в отзыв клиента.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="customerName" className="text-sm font-medium">
                Имя клиента *
              </label>
              <Input
                id="customerName"
                name="customerName"
                value={formData.customerName}
                onChange={handleInputChange}
                placeholder="Имя и фамилия"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Рейтинг *</label>
              <RatingStars rating={formData.rating} onChange={handleRatingChange} />
            </div>
            <div className="space-y-2">
              <label htmlFor="comment" className="text-sm font-medium">
                Текст отзыва *
              </label>
              <Textarea
                id="comment"
                name="comment"
                value={formData.comment}
                onChange={handleInputChange}
                placeholder="Текст отзыва клиента"
                rows={4}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="imageUrl" className="text-sm font-medium">
                URL изображения (аватара)
              </label>
              <Input
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                placeholder="https://example.com/avatar.jpg"
              />
              <p className="text-xs text-gray-500">
                Укажите URL изображения аватара клиента или оставьте пустым, чтобы удалить
              </p>
              {formData.imageUrl && (
                <div className="mt-2 flex items-center">
                  <img
                    src={formData.imageUrl}
                    alt="Предпросмотр"
                    className="w-10 h-10 object-cover rounded-full mr-2"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                  <span className="text-xs">Предпросмотр аватара</span>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Статус публикации</label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => handlePublishedChange(true)}
                  className={`px-3 py-1 rounded-full text-sm flex items-center ${
                    formData.isPublished
                      ? 'bg-green-100 text-green-800 border border-green-200'
                      : 'bg-gray-100 text-gray-800 border border-gray-200'
                  }`}
                >
                  <Star className="w-3 h-3 mr-1" />
                  Опубликован
                </button>
                <button
                  type="button"
                  onClick={() => handlePublishedChange(false)}
                  className={`px-3 py-1 rounded-full text-sm flex items-center ${
                    !formData.isPublished
                      ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                      : 'bg-gray-100 text-gray-800 border border-gray-200'
                  }`}
                >
                  <StarOff className="w-3 h-3 mr-1" />
                  Скрыт
                </button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={isSubmitting}>
                Отмена
              </Button>
            </DialogClose>
            <Button
              type="button"
              onClick={updateReview}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Сохранение...' : 'Сохранить изменения'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Диалог удаления отзыва */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Удалить отзыв</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить этот отзыв? Это действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {currentReview && (
              <div className="border rounded-lg p-3 bg-gray-50">
                <div className="flex items-center mb-2">
                  <div className="font-medium">{currentReview.customerName}</div>
                  <div className="ml-2">
                    <RatingStars rating={currentReview.rating} />
                  </div>
                </div>
                <div className="text-sm text-gray-600 line-clamp-2">{currentReview.comment}</div>
              </div>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={isSubmitting}>
                Отмена
              </Button>
            </DialogClose>
            <Button
              type="button"
              variant="destructive"
              onClick={deleteReview}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Удаление...' : 'Удалить'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
