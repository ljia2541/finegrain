import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Finegrain
          </Link>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#upload" className="text-gray-700 hover:text-blue-600 transition-colors">
              图片增强
            </a>
            <a href="#pricing" className="text-gray-700 hover:text-blue-600 transition-colors">
              定价
            </a>
            <Link href="/docs" className="text-gray-700 hover:text-blue-600 transition-colors">
              文档
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <a 
              href="https://github.com/ljia2541/finegrain" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
