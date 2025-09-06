'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Save, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import type { Location } from '@/lib/cms/types'

const locationSchema = z.object({
  type: z.enum(['Headquarters', 'Factory', 'Office']),
  name: z.string().min(1, 'Name is required'),
  address: z.object({
    street: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'City is required'),
    region: z.string().min(1, 'Region is required'),
    postal: z.string().min(1, 'Postal code is required'),
    country: z.string().min(1, 'Country is required'),
  }),
  phone: z.string().optional(),
  fax: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  hours: z.string().optional(),
  mapUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  coordinates: z.object({
    lat: z.number().min(-90).max(90).optional(),
    lng: z.number().min(-180).max(180).optional(),
  }).optional(),
})

type LocationFormData = z.infer<typeof locationSchema>

interface AdminLocationFormProps {
  location?: Location
  mode: 'create' | 'edit'
}

export function AdminLocationForm({ location, mode }: AdminLocationFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<LocationFormData>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      type: location?.type || 'Office',
      name: location?.name || '',
      address: location?.address || {
        street: '',
        city: '',
        region: '',
        postal: '',
        country: '',
      },
      phone: location?.phone || '',
      fax: location?.fax || '',
      email: location?.email || '',
      hours: location?.hours || '',
      mapUrl: location?.mapUrl || '',
      coordinates: location?.coordinates || { lat: undefined, lng: undefined },
    }
  })

  const watchedValues = watch()

  const onSubmit = async (data: LocationFormData) => {
    setIsSubmitting(true)
    try {
      // Clean up empty optional fields
      const cleanData = {
        ...data,
        phone: data.phone || undefined,
        fax: data.fax || undefined,
        email: data.email || undefined,
        hours: data.hours || undefined,
        mapUrl: data.mapUrl || undefined,
        coordinates: (data.coordinates?.lat && data.coordinates?.lng) 
          ? data.coordinates 
          : undefined,
      }

      const url = mode === 'create' 
        ? '/api/admin/locations'
        : `/api/admin/locations/${location!.id}`
      
      const method = mode === 'create' ? 'POST' : 'PUT'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...cleanData,
          id: mode === 'edit' ? location!.id : undefined
        })
      })

      if (response.ok) {
        router.push('/admin/locations')
        router.refresh()
      } else {
        console.error('Failed to save location')
      }
    } catch (error) {
      console.error('Error saving location:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {mode === 'create' ? 'Add New Location' : 'Edit Location'}
          </h1>
          <p className="text-gray-600">
            {mode === 'create' ? 'Create a new location' : 'Update location information'}
          </p>
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          <Save className="w-4 h-4 mr-2" />
          {mode === 'create' ? 'Create Location' : 'Update Location'}
        </Button>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Location name"
              />
              {errors.name && (
                <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="type">Type</Label>
              <Select
                value={watchedValues.type}
                onValueChange={(value) => setValue('type', value as 'Headquarters' | 'Factory' | 'Office')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Headquarters">Headquarters</SelectItem>
                  <SelectItem value="Factory">Factory</SelectItem>
                  <SelectItem value="Office">Office</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-red-600 mt-1">{errors.type.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address */}
      <Card>
        <CardHeader>
          <CardTitle>Address</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="address.street">Street Address</Label>
            <Input
              id="address.street"
              {...register('address.street')}
              placeholder="123 Main Street"
            />
            {errors.address?.street && (
              <p className="text-sm text-red-600 mt-1">{errors.address.street.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="address.city">City</Label>
              <Input
                id="address.city"
                {...register('address.city')}
                placeholder="City"
              />
              {errors.address?.city && (
                <p className="text-sm text-red-600 mt-1">{errors.address.city.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="address.region">State/Province</Label>
              <Input
                id="address.region"
                {...register('address.region')}
                placeholder="State or Province"
              />
              {errors.address?.region && (
                <p className="text-sm text-red-600 mt-1">{errors.address.region.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="address.postal">Postal Code</Label>
              <Input
                id="address.postal"
                {...register('address.postal')}
                placeholder="12345"
              />
              {errors.address?.postal && (
                <p className="text-sm text-red-600 mt-1">{errors.address.postal.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="address.country">Country</Label>
              <Input
                id="address.country"
                {...register('address.country')}
                placeholder="Country"
              />
              {errors.address?.country && (
                <p className="text-sm text-red-600 mt-1">{errors.address.country.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information (Optional)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                {...register('phone')}
                placeholder="+1 (555) 123-4567"
              />
              {errors.phone && (
                <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="fax">Fax</Label>
              <Input
                id="fax"
                {...register('fax')}
                placeholder="+1 (555) 123-4568"
              />
              {errors.fax && (
                <p className="text-sm text-red-600 mt-1">{errors.fax.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="contact@example.com"
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="hours">Business Hours</Label>
            <Textarea
              id="hours"
              {...register('hours')}
              placeholder="Monday-Friday 9:00 AM - 5:00 PM"
              rows={2}
            />
            {errors.hours && (
              <p className="text-sm text-red-600 mt-1">{errors.hours.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Map Information */}
      <Card>
        <CardHeader>
          <CardTitle>Map Information (Optional)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="mapUrl">Map URL</Label>
            <Input
              id="mapUrl"
              {...register('mapUrl')}
              placeholder="https://maps.google.com/..."
            />
            {errors.mapUrl && (
              <p className="text-sm text-red-600 mt-1">{errors.mapUrl.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="coordinates.lat">Latitude</Label>
              <Input
                id="coordinates.lat"
                type="number"
                {...register('coordinates.lat', { valueAsNumber: true })}
                placeholder="40.7128"
                step="any"
                min="-90"
                max="90"
              />
              {errors.coordinates?.lat && (
                <p className="text-sm text-red-600 mt-1">{errors.coordinates.lat.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="coordinates.lng">Longitude</Label>
              <Input
                id="coordinates.lng"
                type="number"
                {...register('coordinates.lng', { valueAsNumber: true })}
                placeholder="-74.0060"
                step="any"
                min="-180"
                max="180"
              />
              {errors.coordinates?.lng && (
                <p className="text-sm text-red-600 mt-1">{errors.coordinates.lng.message}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}