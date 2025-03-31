'use client'

import React, { useState } from 'react'
import { useSettings } from '@/lib/settings-context'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { toast } from 'sonner'
import Image from 'next/image'

export default function LogoSettingsForm() {
  const { settings, updateSettings, loading } = useSettings()

  const [headerLogoUrl, setHeaderLogoUrl] = useState(settings.headerLogoUrl || '')
  const [footerLogoUrl, setFooterLogoUrl] = useState(settings.footerLogoUrl || '')
  const [isUpdating, setIsUpdating] = useState(false)
  const [headerPreviewError, setHeaderPreviewError] = useState(false)
  const [footerPreviewError, setFooterPreviewError] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsUpdating(true)
    try {
      await updateSettings({
        headerLogoUrl: headerLogoUrl || null,
        footerLogoUrl: footerLogoUrl || null,
      })
      toast.success('Настройки логотипов успешно обновлены')
    } catch (err) {
      toast.error('Не удалось обновить настройки логотипов')
      console.error(err)
    } finally {
      setIsUpdating(false)
    }
  }

  const resetHeaderLogo = () => {
    setHeaderLogoUrl('')
    setHeaderPreviewError(false)
  }

  const resetFooterLogo = () => {
    setFooterLogoUrl('')
    setFooterPreviewError(false)
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Настройки логотипов</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="headerLogoUrl" className="block text-sm font-medium text-gray-700 mb-1">
                URL логотипа в шапке
              </label>
              <Input
                id="headerLogoUrl"
                type="url"
                placeholder="https://example.com/logo.png"
                value={headerLogoUrl}
                onChange={(e) => {
                  setHeaderLogoUrl(e.target.value)
                  setHeaderPreviewError(false)
                }}
                className="w-full"
              />
              <p className="mt-1 text-sm text-gray-500">
                Введите полный URL изображения логотипа, который будет отображаться в шапке сайта
              </p>

              {headerLogoUrl && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Предпросмотр:</p>
                  <div className="border border-gray-200 rounded-md p-4 bg-gray-50 flex items-center justify-center">
                    {!headerPreviewError ? (
                      <Image
                        src={headerLogoUrl}
                        alt="Логотип в шапке"
                        width={150}
                        height={40}
                        className="h-10 w-auto"
                        onError={() => setHeaderPreviewError(true)}
                      />
                    ) : (
                      <div className="text-red-500 text-sm py-2">
                        Ошибка загрузки изображения. Проверьте URL.
                      </div>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={resetHeaderLogo}
                    className="mt-2"
                  >
                    Отменить выбор
                  </Button>
                </div>
              )}
            </div>

            <div className="mt-6">
              <label htmlFor="footerLogoUrl" className="block text-sm font-medium text-gray-700 mb-1">
                URL логотипа в футере
              </label>
              <Input
                id="footerLogoUrl"
                type="url"
                placeholder="https://example.com/footer-logo.png"
                value={footerLogoUrl}
                onChange={(e) => {
                  setFooterLogoUrl(e.target.value)
                  setFooterPreviewError(false)
                }}
                className="w-full"
              />
              <p className="mt-1 text-sm text-gray-500">
                Введите полный URL изображения логотипа, который будет отображаться в футере сайта
              </p>

              {footerLogoUrl && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Предпросмотр:</p>
                  <div className="border border-gray-200 rounded-md p-4 bg-gray-800 flex items-center justify-center">
                    {!footerPreviewError ? (
                      <Image
                        src={footerLogoUrl}
                        alt="Логотип в футере"
                        width={150}
                        height={40}
                        className="h-10 w-auto"
                        onError={() => setFooterPreviewError(true)}
                      />
                    ) : (
                      <div className="text-red-500 text-sm py-2">
                        Ошибка загрузки изображения. Проверьте URL.
                      </div>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={resetFooterLogo}
                    className="mt-2"
                  >
                    Отменить выбор
                  </Button>
                </div>
              )}
            </div>
          </div>

          <CardFooter className="px-0 pb-0">
            <Button
              type="submit"
              disabled={isUpdating || loading}
              className="ml-auto"
            >
              {isUpdating ? 'Сохранение...' : 'Сохранить настройки'}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  )
}
