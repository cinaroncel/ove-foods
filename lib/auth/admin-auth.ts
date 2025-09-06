import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'
const SESSION_COOKIE = 'admin-session'
const SESSION_DURATION = 24 * 60 * 60 * 1000 // 24 hours

export interface AdminSession {
  authenticated: boolean
  expiresAt: number
}

export function createAdminSession(): string {
  const session: AdminSession = {
    authenticated: true,
    expiresAt: Date.now() + SESSION_DURATION
  }
  return Buffer.from(JSON.stringify(session)).toString('base64')
}

export function validateAdminSession(sessionToken?: string): boolean {
  if (!sessionToken) return false
  
  try {
    const session: AdminSession = JSON.parse(
      Buffer.from(sessionToken, 'base64').toString()
    )
    
    return session.authenticated && session.expiresAt > Date.now()
  } catch {
    return false
  }
}

export function getAdminSession(): AdminSession | null {
  try {
    const cookieStore = cookies()
    const sessionCookie = cookieStore.get(SESSION_COOKIE)
    
    if (!sessionCookie?.value) return null
    
    const session: AdminSession = JSON.parse(
      Buffer.from(sessionCookie.value, 'base64').toString()
    )
    
    if (session.expiresAt <= Date.now()) return null
    
    return session
  } catch (error) {
    console.error('Error getting admin session:', error)
    return null
  }
}

export function verifyAdminPassword(password: string): boolean {
  return password === ADMIN_PASSWORD
}

export function requireAdminAuth() {
  try {
    const session = getAdminSession()
    if (!session?.authenticated) {
      throw new Error('Unauthorized')
    }
    return session
  } catch (error) {
    throw new Error('Unauthorized')
  }
}

export function isAdminAuthenticated(request: NextRequest): boolean {
  const sessionCookie = request.cookies.get(SESSION_COOKIE)
  return validateAdminSession(sessionCookie?.value)
}

export function createAuthResponse(success: boolean, redirectTo: string = '/admin') {
  const response = NextResponse.redirect(new URL(redirectTo, process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'))
  
  if (success) {
    const sessionToken = createAdminSession()
    response.cookies.set(SESSION_COOKIE, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_DURATION / 1000
    })
  } else {
    response.cookies.delete(SESSION_COOKIE)
  }
  
  return response
}
