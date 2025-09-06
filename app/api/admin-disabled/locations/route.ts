import { NextRequest, NextResponse } from 'next/server'
import { locationsService } from '@/lib/firebase/firestore'
export const dynamic = 'force-dynamic'
import { isAdminAuthenticated } from '@/lib/auth/admin-auth'

export async function GET(request: NextRequest) {
  try {
    if (!isAdminAuthenticated(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const locations = await locationsService.getAll()
    return NextResponse.json(locations)
  } catch (error) {
    console.error('Failed to fetch locations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch locations' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!isAdminAuthenticated(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const locationData = await request.json()
    const locationId = await locationsService.create(locationData)
    
    return NextResponse.json({ id: locationId, ...locationData }, { status: 201 })
  } catch (error) {
    console.error('Failed to create location:', error)
    return NextResponse.json(
      { error: 'Failed to create location' },
      { status: 500 }
    )
  }
}