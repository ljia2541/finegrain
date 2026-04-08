import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'API Docs | Finegrain',
  description: 'Finegrain AI image enhancement platform API documentation.',
}

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">API Documentation</h1>
        <p className="text-gray-500 mb-8">Finegrain REST API v1.0</p>

        <div className="space-y-8">
          {/* Authentication */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">🔐 Authentication</h2>
            <p className="text-sm text-gray-600 mb-3">All APIs require Bearer Token authentication (via Google OAuth).</p>
            <div className="bg-gray-900 rounded-lg p-4 text-sm font-mono text-green-400">
              Authorization: Bearer &lt;your_jwt_token&gt;
            </div>
          </section>

          {/* Upload */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">📤 Upload Image</h2>
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-bold">POST</span>
              <code className="text-sm text-gray-700">/api/upload</code>
            </div>
            <p className="text-sm text-gray-600 mb-2">Upload images to Tencent Cloud COS, returns image URL.</p>
            <p className="text-xs text-gray-500">Supported: JPG, PNG, WebP, HEIC, AVIF | Max 10MB</p>
          </section>

          {/* Enhancement */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">✨ Image Enhancement</h2>
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-bold">POST</span>
              <code className="text-sm text-gray-700">/api/enhance</code>
            </div>
            <p className="text-sm text-gray-600 mb-3">Submit an AI image enhancement task.</p>

            <h3 className="text-sm font-semibold text-gray-700 mb-2">Request Parameters</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-3 py-2 font-medium text-gray-700">Parameter</th>
                    <th className="text-left px-3 py-2 font-medium text-gray-700">Type</th>
                    <th className="text-left px-3 py-2 font-medium text-gray-700">Required</th>
                    <th className="text-left px-3 py-2 font-medium text-gray-700">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr><td className="px-3 py-2 font-mono text-blue-600">imageUrl</td><td className="px-3 py-2">string</td><td className="px-3 py-2">Yes</td><td className="px-3 py-2">COS signed URL</td></tr>
                  <tr><td className="px-3 py-2 font-mono text-blue-600">model</td><td className="px-3 py-2">string</td><td className="px-3 py-2">Yes</td><td className="px-3 py-2">realesrgan | recraft | google</td></tr>
                  <tr><td className="px-3 py-2 font-mono text-blue-600">scale</td><td className="px-3 py-2">number</td><td className="px-3 py-2">No</td><td className="px-3 py-2">Scale factor 2/4/6/8</td></tr>
                  <tr><td className="px-3 py-2 font-mono text-blue-600">faceEnhance</td><td className="px-3 py-2">boolean</td><td className="px-3 py-2">No</td><td className="px-3 py-2">Real-ESRGAN only, enables face enhancement</td></tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-sm font-semibold text-gray-700 mt-4 mb-2">Credits Cost</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-3 py-2 font-medium text-gray-700">Model</th>
                    <th className="text-left px-3 py-2 font-medium text-gray-700">Credits</th>
                    <th className="text-left px-3 py-2 font-medium text-gray-700">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr><td className="px-3 py-2">Real-ESRGAN</td><td className="px-3 py-2">1</td><td className="px-3 py-2">Free tier</td></tr>
                  <tr><td className="px-3 py-2">Google Upscaler</td><td className="px-3 py-2">3</td><td className="px-3 py-2">Basic paid</td></tr>
                  <tr><td className="px-3 py-2">Recraft</td><td className="px-3 py-2">6</td><td className="px-3 py-2">Print pro</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Query Task */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">📊 Query Task Status</h2>
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-bold">GET</span>
              <code className="text-sm text-gray-700">/api/task/[taskId]</code>
            </div>
            <p className="text-sm text-gray-600">Query the processing status and result image URL of an enhancement task.</p>
          </section>

          {/* User */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">👤 User Information</h2>
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-bold">GET</span>
              <code className="text-sm text-gray-700">/api/user/profile</code>
            </div>
            <p className="text-sm text-gray-600">Get the current user's credits balance, statistics, and recent transaction records.</p>
          </section>

          {/* Payment */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">💳 Payment</h2>
            <div className="space-y-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-bold">POST</span>
                  <code className="text-sm text-gray-700">/api/payment/create-order</code>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">PayPal</span>
                </div>
                <p className="text-xs text-gray-500">Create PayPal payment order (credits)</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-bold">POST</span>
                  <code className="text-sm text-gray-700">/api/payment/capture</code>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">PayPal</span>
                </div>
                <p className="text-xs text-gray-500">Confirm PayPal payment</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-bold">POST</span>
                  <code className="text-sm text-gray-700">/api/stripe/checkout</code>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">Stripe</span>
                </div>
                <p className="text-xs text-gray-500">Create Stripe Checkout Session (credits / monthly subscription)</p>
              </div>
            </div>
          </section>

          {/* Error Codes */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">⚠️ Error Codes</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-3 py-2 font-medium text-gray-700">Status Code</th>
                    <th className="text-left px-3 py-2 font-medium text-gray-700">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr><td className="px-3 py-2 font-mono">400</td><td className="px-3 py-2">Bad request</td></tr>
                  <tr><td className="px-3 py-2 font-mono">401</td><td className="px-3 py-2">Not authenticated</td></tr>
                  <tr><td className="px-3 py-2 font-mono">402</td><td className="px-3 py-2">Insufficient credits</td></tr>
                  <tr><td className="px-3 py-2 font-mono">429</td><td className="px-3 py-2">Too many requests</td></tr>
                  <tr><td className="px-3 py-2 font-mono">500</td><td className="px-3 py-2">Server error</td></tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div className="text-center text-xs text-gray-400 mt-12">
          API Documentation v1.0 · Contact support@finegrainimageenhancer.com for questions
        </div>
      </div>
    </div>
  )
}
