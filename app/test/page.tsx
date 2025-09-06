export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          🎉 Deployment Successful!
        </h1>
        <p className="text-gray-600 mb-4">
          The Next.js application is running correctly on Vercel.
        </p>
        <div className="space-y-2">
          <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
          <p><strong>Firebase Project:</strong> {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}</p>
          <p><strong>Admin Password Set:</strong> {process.env.NEXT_PUBLIC_ADMIN_PASSWORD ? 'Yes' : 'No'}</p>
        </div>
      </div>
    </div>
  )
}