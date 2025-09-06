'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Edit, Trash2, Search, MapPin, Phone, Mail } from 'lucide-react'
import type { Location } from '@/lib/cms/types'
import { useRouter } from 'next/navigation'

interface AdminLocationListProps {
  locations: Location[]
}

export function AdminLocationList({ locations }: AdminLocationListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const router = useRouter()

  const filteredLocations = locations.filter(location =>
    location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.address.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.address.country.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'headquarters': return 'bg-blue-100 text-blue-800'
      case 'factory': return 'bg-green-100 text-green-800'
      case 'office': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const handleDelete = async (locationId: string) => {
    setDeletingId(locationId)
    try {
      const response = await fetch(`/api/admin/locations/${locationId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.refresh()
      } else {
        console.error('Failed to delete location')
      }
    } catch (error) {
      console.error('Error deleting location:', error)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search locations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead className="w-32">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLocations.map((location) => (
              <TableRow key={location.id}>
                <TableCell>
                  <div className="font-medium">{location.name}</div>
                </TableCell>
                <TableCell>
                  <Badge className={getTypeColor(location.type)}>
                    {location.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-start gap-1">
                      <MapPin className="w-3 h-3 mt-1 text-gray-400 flex-shrink-0" />
                      <div className="text-sm">
                        <div>{location.address.street}</div>
                        <div>
                          {location.address.city}, {location.address.region} {location.address.postal}
                        </div>
                        <div>{location.address.country}</div>
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {location.phone && (
                      <div className="flex items-center gap-1 text-sm">
                        <Phone className="w-3 h-3 text-gray-400" />
                        {location.phone}
                      </div>
                    )}
                    {location.email && (
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="w-3 h-3 text-gray-400" />
                        {location.email}
                      </div>
                    )}
                    {location.fax && (
                      <div className="text-xs text-gray-500">
                        Fax: {location.fax}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/locations/${location.id}`}>
                        <Edit className="w-4 h-4" />
                      </Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          disabled={deletingId === location.id}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Location</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{location.name}"? 
                            This action cannot be undone and will remove the location from your contact pages.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(location.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredLocations.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          {searchTerm ? 'No locations found matching your search.' : 'No locations found.'}
        </div>
      )}
    </div>
  )
}
