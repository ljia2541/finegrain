import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Finegrain</h3>
            <p className="text-gray-400">
              基于 AI 的在线图像放大服务，专注于超分辨率放大和画质增强。
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">产品</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="#upload" className="hover:text-white transition-colors">图片增强</Link></li>
              <li><Link href="#pricing" className="hover:text-white transition-colors">定价</Link></li>
              <li><Link href="/docs" className="hover:text-white transition-colors">文档</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">公司</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/about" className="hover:text-white transition-colors">关于我们</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">联系我们</Link></li>
              <li><a href="https://github.com/ljia2541/finegrain" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">法律</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/privacy" className="hover:text-white transition-colors">隐私政策</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">服务条款</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2026 Finegrain. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
