'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signIn, signOut } from 'next-auth/react'
import { Menu, X, LogIn, LogOut, User } from 'lucide-react'

const navItems = [
  { label: '免费增强', href: '/enhance/free' },
  { label: '通用增强', href: '/enhance/general' },
  { label: '人像增强', href: '/enhance/portrait' },
  { label: '印刷高清', href: '/enhance/print' },
  { label: '10倍超清', href: '/enhance/ultra' },
]

export default function Header() {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  const handleSignIn = () => {
    signIn('google', { callbackUrl: '/' })
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-blue-600">
            Finegrain
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-6">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm transition-colors ${
                  isActive(item.href)
                    ? 'text-blue-600 font-semibold'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Right */}
          <div className="hidden lg:flex items-center space-x-4">
            {status === 'loading' ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
            ) : session?.user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  {session.user.image && (
                    <img
                      src={session.user.image}
                      alt="头像"
                      className="w-8 h-8 rounded-full ring-2 ring-gray-200"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <span className="text-sm text-gray-700 max-w-[120px] truncate">
                    {session.user.name}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  title="退出登录"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleSignIn}
                className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span>登录</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden text-gray-700 hover:text-blue-600 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <nav className="lg:hidden pt-4 pb-2 border-t border-gray-100 mt-4 space-y-1">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive(item.href)
                    ? 'text-blue-600 font-semibold bg-blue-50'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* Mobile Auth */}
            <div className="border-t border-gray-100 pt-2 mt-2">
              {status === 'loading' ? (
                <div className="px-3 py-2.5">
                  <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
                </div>
              ) : session?.user ? (
                <div className="px-3 py-2.5 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {session.user.image && (
                      <img
                        src={session.user.image}
                        alt="头像"
                        className="w-8 h-8 rounded-full ring-2 ring-gray-200"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    <span className="text-sm text-gray-700">{session.user.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      handleSignOut()
                      setMobileOpen(false)
                    }}
                    className="text-sm text-red-500 hover:text-red-600"
                  >
                    退出登录
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    handleSignIn()
                    setMobileOpen(false)
                  }}
                  className="w-full px-3 py-2.5 rounded-lg text-sm text-blue-600 hover:bg-blue-50 transition-colors flex items-center space-x-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Google 登录</span>
                </button>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
