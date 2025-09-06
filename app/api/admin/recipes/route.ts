import { NextRequest, NextResponse } from 'next/server'
import { recipesService } from '@/lib/firebase/firestore'
export const dynamic = 'force-dynamic'
import { isAdminAuthenticated } from '@/lib/auth/admin-auth'

export async function GET(request: NextRequest) {
  try {
    if (!isAdminAuthenticated(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const recipes = await recipesService.getAll()
    return NextResponse.json(recipes)
  } catch (error) {
    console.error('Failed to fetch recipes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recipes' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isAdminAuthenticated(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const recipeData = await request.json()
    const recipeId = await recipesService.create(recipeData)
    
    return NextResponse.json({ id: recipeId, ...recipeData }, { status: 201 })
  } catch (error) {
    console.error('Failed to create recipe:', error)
    return NextResponse.json(
      { error: 'Failed to create recipe' },
      { status: 500 }
    )
  }
}