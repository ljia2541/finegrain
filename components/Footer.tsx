import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          {/* Brand */}
          <div>
            <div className="text-white font-bold text-lg mb-3">Finegrain</div>
            <p className="text-sm max-w-xs">
              AI-powered online image upscaling service, focused on super resolution and quality enhancement.
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-white text-sm font-medium mb-3">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/enhance/free" className="hover:text-white transition-colors">Image Upscaler</Link></li>
                <li><Link href="/#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/#examples" className="hover:text-white transition-colors">Examples</Link></li>
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-sm font-medium mb-3">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-sm font-medium mb-3">From the Same Team</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="https://gotaskmind.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GoTaskMind — AI Project Planner</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>© 2026 Finegrain. All rights reserved.</p>
          <p className="text-xs text-gray-600 mt-2 md:mt-0">
            Powered by AI super resolution technology
          </p>
        </div>
      </div>
    </footer>
  )
}
