'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signIn, signOut } from 'next-auth/react'
import { Menu, X, LogOut, User } from 'lucide-react'

const navItems = [
  { label: 'Free Upscale', href: '/enhance/free' },
  { label: 'General', href: '/enhance/general' },
  { label: 'Portrait', href: '/enhance/portrait' },
  { label: 'Print', href: '/enhance/print' },
  { label: 'Pricing', href: '/pricing' },
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
                <Link href="/dashboard" className="flex items-center space-x-2 hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors">
                  {session.user.image && (
                    <img
                      src={session.user.image}
                      alt="avatar"
                      className="w-8 h-8 rounded-full ring-2 ring-gray-200"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <span className="text-sm text-gray-700 max-w-[120px] truncate">
                    {session.user.name}
                  </span>
                  <User className="w-4 h-4 text-gray-400" />
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  title="Sign out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleSignIn}
                className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span>Sign in with Google</span>
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
                <div className="px-3 py-2.5 space-y-2">
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                  >
                    {session.user.image && (
                      <img
                        src={session.user.image}
                        alt="avatar"
                        className="w-8 h-8 rounded-full ring-2 ring-gray-200"
                        referrerPolicy="no-referrer"
                      />
                    )}
                    <span>{session.user.name}</span>
                    <User className="w-4 h-4 text-gray-400" />
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut()
                      setMobileOpen(false)
                    }}
                    className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-gray-50"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign out</span>
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
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span>Sign in with Google</span>
                </button>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
