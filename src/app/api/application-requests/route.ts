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
    // Проверяем подключение к базе данных
    await prisma.$connect();

    const data = await request.json()

    // Дополнительная проверка данных
    if (!data.name) {
      return NextResponse.json(
        { error: 'Имя обязательно для заполнения' },
        { status: 400 }
      )
    }

    if (!data.phone) {
      return NextResponse.json(
        { error: 'Телефон обязателен для заполнения' },
        { status: 400 }
      )
    }

    if (!data.contactMethod) {
      return NextResponse.json(
        { error: 'Способ связи обязателен для заполнения' },
        { status: 400 }
      )
    }

    // Создание заявки с обработкой возможных ошибок Prisma
    try {
      const newRequest = await prisma.applicationRequest.create({
        data: {
          name: data.name,
          phone: data.phone,
          contactMethod: data.contactMethod,
          status: 'new'
        },
      })

      console.log('Заявка успешно создана:', newRequest);

      return NextResponse.json({
        success: true,
        request: newRequest
      });
    } catch (prismaError) {
      console.error('Ошибка Prisma при создании заявки:', prismaError)
      return NextResponse.json(
        { error: 'Ошибка базы данных при создании заявки' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error creating application request:', error)
    return NextResponse.json(
      { error: 'Не удалось создать заявку' },
      { status: 500 }
    )
  } finally {
    // Отключаемся от базы данных
    await prisma.$disconnect();
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
