import { NextRequest, NextResponse } from 'next/server'
import { categoriesService } from '@/lib/firebase/firestore'
export const dynamic = 'force-dynamic'
import { isAdminAuthenticated } from '@/lib/auth/admin-auth'

export async function GET(request: NextRequest) {
  try {
    if (!isAdminAuthenticated(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const categories = await categoriesService.getAll()
    return NextResponse.json(categories)
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isAdminAuthenticated(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const categoryData = await request.json()
    const categoryId = await categoriesService.create(categoryData)
    
    return NextResponse.json({ id: categoryId, ...categoryData }, { status: 201 })
  } catch (error) {
    console.error('Failed to create category:', error)
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
}