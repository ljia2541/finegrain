import { Lock, AlertTriangle } from 'lucide-react'

export default function PrivacyNotice() {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
      <div className="flex items-start gap-4">
        <Lock className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            🔒 Privacy First — 您的隐私是我们的首要任务
          </h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p>
              <strong>24 小时自动删除：</strong>所有上传的图片（包括原图和增强图）将在 24 小时后永久删除，无例外。
            </p>
            <p>
              <strong>零数据留存：</strong>我们不收集或存储您的个人信息，支持匿名使用。
            </p>
            <p>
              <strong>安全传输：</strong>所有数据传输均使用 HTTPS 加密，确保您的图片安全。
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex items-start gap-4 bg-yellow-50 border border-yellow-200 rounded p-3">
        <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-yellow-900">
          <strong>⚠️ 重要提示：</strong>请在 24 小时内下载您的增强图片，之后它们将被自动删除且无法恢复，请及时备份。
        </p>
      </div>
    </div>
  )
}
