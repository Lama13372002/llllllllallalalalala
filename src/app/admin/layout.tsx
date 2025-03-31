'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'

// Простой пароль для демонстрации
const ADMIN_PASSWORD = 'admin123'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Проверяем аутентификацию в localStorage
    const checkAuth = () => {
      const auth = localStorage.getItem('adminAuth')
      if (auth === 'true') {
        setIsAuthenticated(true)
      }
      setIsLoading(false)
    }
    checkAuth()
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('adminAuth', 'true')
      setIsAuthenticated(true)
      setError('')
    } else {
      setError('Неверный пароль')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminAuth')
    setIsAuthenticated(false)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Вход в панель администратора</CardTitle>
            </CardHeader>
            <form onSubmit={handleLogin}>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Пароль
                    </label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full"
                    />
                  </div>

                  {error && (
                    <div className="p-3 rounded bg-red-50 text-red-700 text-sm">
                      {error}
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  className="w-full"
                >
                  Войти
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="bg-gray-100 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h2 className="font-semibold">Панель администратора</h2>
          <Button variant="outline" onClick={handleLogout}>Выйти</Button>
        </div>
      </div>
      {children}
    </div>
  )
}
