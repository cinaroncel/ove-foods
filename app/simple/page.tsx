export default function SimplePage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          OVE Foods - Site Working
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          The Next.js application is deployed and running correctly.
        </p>
        <div className="space-y-2 text-sm text-gray-500">
          <p>Node Environment: {process.env.NODE_ENV}</p>
          <p>Deployed successfully to Vercel</p>
          <p>Firebase configured: {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? 'Yes' : 'No'}</p>
        </div>
        <div className="mt-8">
          <a 
            href="/admin/login" 
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Admin Login
          </a>
        </div>
      </div>
    </div>
  )
}