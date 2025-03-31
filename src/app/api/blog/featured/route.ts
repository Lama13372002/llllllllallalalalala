import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Получение опубликованных статей для главной страницы
export async function GET() {
  try {
    // Получаем только опубликованные статьи, сортируем по дате публикации
    const blogPosts = await prisma.blogPost.findMany({
      where: {
        isPublished: true
      },
      orderBy: {
        publishedAt: 'desc'
      },
      take: 3 // Ограничиваем количество записей для главной страницы
    })

    return NextResponse.json({ blogPosts })
  } catch (error) {
    console.error('Error fetching featured blog posts:', error)
    return NextResponse.json({ error: 'Не удалось получить статьи блога' }, { status: 500 })
  }
}
