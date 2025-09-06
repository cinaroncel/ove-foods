'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
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
import { Edit, Trash2, Search } from 'lucide-react'
import type { Category } from '@/lib/cms/types'
import { useRouter } from 'next/navigation'

interface AdminCategoryListProps {
  categories: Category[]
}

export function AdminCategoryList({ categories }: AdminCategoryListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const router = useRouter()

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleDelete = async (categoryId: string) => {
    setDeletingId(categoryId)
    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.refresh()
      } else {
        console.error('Failed to delete category')
      }
    } catch (error) {
      console.error('Error deleting category:', error)
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
          placeholder="Search categories..."
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
              <TableHead>Slug</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Order</TableHead>
              <TableHead className="w-32">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCategories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>
                  <div className="font-medium">{category.name}</div>
                </TableCell>
                <TableCell>
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                    {category.slug}
                  </code>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-gray-500 max-w-xs truncate">
                    {category.description || 'No description'}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">{category.order || 0}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/categories/${category.id}`}>
                        <Edit className="w-4 h-4" />
                      </Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          disabled={deletingId === category.id}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Category</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{category.name}"? 
                            This action cannot be undone and may affect products using this category.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(category.id)}
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

      {filteredCategories.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          {searchTerm ? 'No categories found matching your search.' : 'No categories found.'}
        </div>
      )}
    </div>
  )
}
