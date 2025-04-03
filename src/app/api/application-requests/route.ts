import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/application-requests - получение списка заявок
export async function GET() {
  try {
    const requests = await prisma.applicationRequest.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ requests })
  } catch (error) {
    console.error('Error fetching application requests:', error)
    return NextResponse.json(
      { error: 'Не удалось загрузить заявки' },
      { status: 500 }
    )
  }
}

// POST /api/application-requests - создание новой заявки
export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Валидация
    if (!data.name || !data.phone || !data.contactMethod) {
      return NextResponse.json(
        { error: 'Не все обязательные поля заполнены' },
        { status: 400 }
      )
    }

    // Создание заявки
    const newRequest = await prisma.applicationRequest.create({
      data: {
        name: data.name,
        phone: data.phone,
        contactMethod: data.contactMethod,
      },
    })

    return NextResponse.json({ success: true, request: newRequest })
  } catch (error) {
    console.error('Error creating application request:', error)
    return NextResponse.json(
      { error: 'Не удалось создать заявку' },
      { status: 500 }
    )
  }
}

// PATCH /api/application-requests/:id - обновление статуса заявки
export async function PATCH(request: Request) {
  try {
    const data = await request.json()
    const { id, status } = data

    if (!id || !status) {
      return NextResponse.json(
        { error: 'ID и статус обязательны' },
        { status: 400 }
      )
    }

    const updatedRequest = await prisma.applicationRequest.update({
      where: { id: Number(id) },
      data: { status },
    })

    return NextResponse.json({ success: true, request: updatedRequest })
  } catch (error) {
    console.error('Error updating application request:', error)
    return NextResponse.json(
      { error: 'Не удалось обновить заявку' },
      { status: 500 }
    )
  }
}

// DELETE /api/application-requests - удаление заявки
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID заявки не указан' },
        { status: 400 }
      )
    }

    await prisma.applicationRequest.delete({
      where: { id: Number(id) },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting application request:', error)
    return NextResponse.json(
      { error: 'Не удалось удалить заявку' },
      { status: 500 }
    )
  }
}
