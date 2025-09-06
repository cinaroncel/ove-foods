import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminPassword, createAuthResponse } from '@/lib/auth/admin-auth'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()
    
    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      )
    }
    
    const isValid = verifyAdminPassword(password)
    
    if (isValid) {
      return createAuthResponse(true, '/admin')
    } else {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      )
    }
  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}