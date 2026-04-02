import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'API 文档 | Finegrain',
  description: 'Finegrain AI 图像增强平台 API 接口文档',
}

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">API 文档</h1>
        <p className="text-gray-500 mb-8">Finegrain REST API v1.0</p>

        <div className="space-y-8">
          {/* 认证 */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">🔐 认证</h2>
            <p className="text-sm text-gray-600 mb-3">所有 API 需要 Bearer Token 认证（通过 Google OAuth 获取）。</p>
            <div className="bg-gray-900 rounded-lg p-4 text-sm font-mono text-green-400">
              Authorization: Bearer &lt;your_jwt_token&gt;
            </div>
          </section>

          {/* 上传 */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">📤 上传图片</h2>
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-bold">POST</span>
              <code className="text-sm text-gray-700">/api/upload</code>
            </div>
            <p className="text-sm text-gray-600 mb-2">上传图片到腾讯云 COS，返回图片 URL。</p>
            <p className="text-xs text-gray-500">支持格式：JPG, PNG, WebP, HEIC, AVIF | 最大 10MB</p>
          </section>

          {/* 增强 */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">✨ 图片增强</h2>
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-bold">POST</span>
              <code className="text-sm text-gray-700">/api/enhance</code>
            </div>
            <p className="text-sm text-gray-600 mb-3">提交 AI 图片增强任务。</p>

            <h3 className="text-sm font-semibold text-gray-700 mb-2">请求参数</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-3 py-2 font-medium text-gray-700">参数</th>
                    <th className="text-left px-3 py-2 font-medium text-gray-700">类型</th>
                    <th className="text-left px-3 py-2 font-medium text-gray-700">必填</th>
                    <th className="text-left px-3 py-2 font-medium text-gray-700">说明</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr><td className="px-3 py-2 font-mono text-blue-600">imageUrl</td><td className="px-3 py-2">string</td><td className="px-3 py-2">是</td><td className="px-3 py-2">COS 签名 URL</td></tr>
                  <tr><td className="px-3 py-2 font-mono text-blue-600">model</td><td className="px-3 py-2">string</td><td className="px-3 py-2">是</td><td className="px-3 py-2">crystal | realesrgan | recraft | google</td></tr>
                  <tr><td className="px-3 py-2 font-mono text-blue-600">scale</td><td className="px-3 py-2">number</td><td className="px-3 py-2">否</td><td className="px-3 py-2">放大倍率 2/4/6/8/10</td></tr>
                  <tr><td className="px-3 py-2 font-mono text-blue-600">faceEnhance</td><td className="px-3 py-2">boolean</td><td className="px-3 py-2">否</td><td className="px-3 py-2">仅 Real-ESRGAN，开启人脸增强</td></tr>
                  <tr><td className="px-3 py-2 font-mono text-blue-600">imageWidth</td><td className="px-3 py-2">number</td><td className="px-3 py-2">否</td><td className="px-3 py-2">原图宽度（Crystal 需要校验）</td></tr>
                  <tr><td className="px-3 py-2 font-mono text-blue-600">imageHeight</td><td className="px-3 py-2">number</td><td className="px-3 py-2">否</td><td className="px-3 py-2">原图高度（Crystal 需要校验）</td></tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-sm font-semibold text-gray-700 mt-4 mb-2">积分消耗</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-3 py-2 font-medium text-gray-700">模型</th>
                    <th className="text-left px-3 py-2 font-medium text-gray-700">积分</th>
                    <th className="text-left px-3 py-2 font-medium text-gray-700">说明</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr><td className="px-3 py-2">Real-ESRGAN</td><td className="px-3 py-2">1</td><td className="px-3 py-2">免费档</td></tr>
                  <tr><td className="px-3 py-2">Google Upscaler</td><td className="px-3 py-2">3</td><td className="px-3 py-2">付费基础</td></tr>
                  <tr><td className="px-3 py-2">Recraft</td><td className="px-3 py-2">6</td><td className="px-3 py-2">印刷专业</td></tr>
                  <tr><td className="px-3 py-2">Crystal 4x</td><td className="px-3 py-2">15</td><td className="px-3 py-2">人像主力</td></tr>
                  <tr><td className="px-3 py-2">Crystal 10x</td><td className="px-3 py-2">$3.99/张</td><td className="px-3 py-2">不走积分</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 查询任务 */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">📊 查询任务状态</h2>
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-bold">GET</span>
              <code className="text-sm text-gray-700">/api/task/[taskId]</code>
            </div>
            <p className="text-sm text-gray-600">查询增强任务的处理状态和结果图片 URL。</p>
          </section>

          {/* 用户 */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">👤 用户信息</h2>
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-bold">GET</span>
              <code className="text-sm text-gray-700">/api/user/profile</code>
            </div>
            <p className="text-sm text-gray-600">获取当前用户的积分余额、统计信息和最近交易记录。</p>
          </section>

          {/* 支付 */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">💳 支付</h2>
            <div className="space-y-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-bold">POST</span>
                  <code className="text-sm text-gray-700">/api/payment/create-order</code>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">PayPal</span>
                </div>
                <p className="text-xs text-gray-500">创建 PayPal 支付订单（积分包 / Crystal 10x）</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-bold">POST</span>
                  <code className="text-sm text-gray-700">/api/payment/capture</code>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">PayPal</span>
                </div>
                <p className="text-xs text-gray-500">确认 PayPal 支付</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-bold">POST</span>
                  <code className="text-sm text-gray-700">/api/stripe/checkout</code>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">Stripe</span>
                </div>
                <p className="text-xs text-gray-500">创建 Stripe Checkout Session（积分包 / 月订阅）</p>
              </div>
            </div>
          </section>

          {/* 错误码 */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-3">⚠️ 错误码</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-3 py-2 font-medium text-gray-700">状态码</th>
                    <th className="text-left px-3 py-2 font-medium text-gray-700">说明</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr><td className="px-3 py-2 font-mono">400</td><td className="px-3 py-2">请求参数错误</td></tr>
                  <tr><td className="px-3 py-2 font-mono">401</td><td className="px-3 py-2">未登录或 Token 无效</td></tr>
                  <tr><td className="px-3 py-2 font-mono">402</td><td className="px-3 py-2">积分不足</td></tr>
                  <tr><td className="px-3 py-2 font-mono">429</td><td className="px-3 py-2">请求过于频繁</td></tr>
                  <tr><td className="px-3 py-2 font-mono">500</td><td className="px-3 py-2">服务器错误</td></tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div className="text-center text-xs text-gray-400 mt-12">
          API 文档 v1.0 · 如有疑问请联系 support@finegrainimageenhancer.com
        </div>
      </div>
    </div>
  )
}
