export default function PaymentCancel() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
        <div className="text-5xl mb-4">🚫</div>
        <h2 className="text-2xl font-bold mb-2">支付已取消</h2>
        <p className="text-gray-600 mb-6">您可以随时回来继续购买</p>
        <a href="/pricing" className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
          返回定价页
        </a>
      </div>
    </div>
  )
}
