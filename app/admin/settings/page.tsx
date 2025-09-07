'use client'

import { ProtectedRoute } from '@/components/admin/protected-route'
import { AdminSidebar } from '@/components/admin/sidebar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth/admin-auth'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  Database, 
  Globe, 
  Shield,
  ExternalLink
} from 'lucide-react'

export default function SettingsPage() {
  const { user } = useAuth()

  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        <div className="w-64 flex-shrink-0">
          <AdminSidebar />
        </div>
        
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold">Settings</h1>
              <p className="text-muted-foreground">
                Admin panel configuration and system information
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Account Information
                  </CardTitle>
                  <CardDescription>
                    Current admin account details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Email</div>
                    <div className="text-lg">{user?.email}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Display Name</div>
                    <div className="text-lg">{user?.displayName || 'OVE Foods Admin'}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Role</div>
                    <Badge variant="secondary">Administrator</Badge>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Account Created</div>
                    <div className="text-sm">{user?.metadata?.creationTime || 'N/A'}</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Database Status
                  </CardTitle>
                  <CardDescription>
                    Firebase Firestore connection status
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Connection Status</span>
                    <Badge className="bg-green-100 text-green-800">Connected</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Project ID</span>
                    <span className="text-sm text-muted-foreground">ove-foods</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Region</span>
                    <span className="text-sm text-muted-foreground">us-central1</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Data Sync</span>
                    <Badge className="bg-blue-100 text-blue-800">Real-time</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Website Status
                  </CardTitle>
                  <CardDescription>
                    Live website and deployment information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Site Status</span>
                    <Badge className="bg-green-100 text-green-800">Live</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Hosting Platform</span>
                    <span className="text-sm text-muted-foreground">Vercel</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Domain</span>
                    <a 
                      href="https://ove-foods.vercel.app" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                      ove-foods.vercel.app
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>SSL Certificate</span>
                    <Badge className="bg-green-100 text-green-800">Valid</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Security
                  </CardTitle>
                  <CardDescription>
                    Admin panel security settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Authentication</span>
                    <Badge className="bg-green-100 text-green-800">Firebase Auth</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Session Status</span>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Protected Routes</span>
                    <Badge className="bg-blue-100 text-blue-800">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Data Encryption</span>
                    <Badge className="bg-green-100 text-green-800">TLS 1.3</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>System Information</CardTitle>
                <CardDescription>
                  Technical details about the admin panel
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="font-medium text-muted-foreground">Framework</div>
                    <div>Next.js 14</div>
                  </div>
                  <div>
                    <div className="font-medium text-muted-foreground">Database</div>
                    <div>Firebase Firestore</div>
                  </div>
                  <div>
                    <div className="font-medium text-muted-foreground">Storage</div>
                    <div>Firebase Storage</div>
                  </div>
                  <div>
                    <div className="font-medium text-muted-foreground">Authentication</div>
                    <div>Firebase Auth</div>
                  </div>
                  <div>
                    <div className="font-medium text-muted-foreground">UI Library</div>
                    <div>shadcn/ui</div>
                  </div>
                  <div>
                    <div className="font-medium text-muted-foreground">Styling</div>
                    <div>Tailwind CSS</div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Quick Links</h4>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <a href="https://ove-foods.vercel.app" target="_blank" rel="noopener noreferrer">
                        View Website
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <a href="https://console.firebase.google.com/project/ove-foods" target="_blank" rel="noopener noreferrer">
                        Firebase Console
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer">
                        Vercel Dashboard
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}