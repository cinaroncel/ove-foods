import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({ success: true })
    
    // Clear the admin session cookie
    response.cookies.set('admin-session', '', {
      httpOnly: true,
      expires: new Date(0), // Set to past date to delete
      path: '/'
    })
    
    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    )
  }
}