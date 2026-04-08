import { Lock, AlertTriangle } from 'lucide-react'

export default function PrivacyNotice() {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <div className="flex items-start gap-4">
        <Lock className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            🔒 Privacy First — Your privacy is our top priority
          </h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p>
              <strong>24h Auto-delete:</strong>All uploaded images (including originals and enhanced) are permanently deleted after 24 hours. No exceptions.
            </p>
            <p>
              <strong>Zero Data Retention:</strong>We do not collect or store your personal information. Anonymous use is supported.
            </p>
            <p>
              <strong>Secure Transfer:</strong>All data transfer is encrypted with HTTPS to keep your images safe.
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex items-start gap-4 bg-yellow-50 border border-yellow-200 rounded p-3">
        <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-yellow-900">
          <strong>⚠️ Important:</strong>Please download your enhanced images within 24 hours. After that, they will be automatically deleted and cannot be recovered. Please backup in time.
        </p>
      </div>
    </div>
  )
}
