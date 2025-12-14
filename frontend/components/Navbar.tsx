'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { Home, PlusSquare, Compass, Heart, UserCircle, Instagram, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // This ensures component only renders on client side
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const isActive = (path: string) => {
    return pathname === path ? 'text-pink-600' : 'text-gray-600';
  };

  // Don't render anything during SSR for auth-dependent parts
  if (!mounted) {
    return (
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo - Always visible */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="gradient-text text-3xl font-bold">
                <Instagram className="w-7 h-7" />
              </div>
              <span className="hidden md:inline text-2xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
                Instagram
              </span>
            </Link>
            {/* Placeholder for auth buttons */}
            <div className="w-32 h-10 bg-gray-100 rounded-full animate-pulse"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="gradient-text text-3xl font-bold">
              <Instagram className="w-7 h-7" />
            </div>
            <span className="hidden md:inline text-2xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-transparent">
              Instagram
            </span>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-xl mx-8">
            <div className="relative">
              <input
                type="search"
                placeholder="Search posts, people, or tags..."
                className="w-full px-6 py-2 bg-gray-50 rounded-full border border-gray-200 focus:outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
                suppressHydrationWarning
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Search className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Navigation Icons */}
          {user ? (
            <div className="flex items-center space-x-6">
              <Link href="/" className={`text-2xl hover:text-pink-500 transition-colors ${isActive('/')}`}>
                <Home className="w-6 h-6" />
              </Link>
              <Link href="/create-post" className={`text-2xl hover:text-pink-500 transition-colors ${isActive('/create-post')}`}>
                <PlusSquare className="w-6 h-6" />
              </Link>
              <Link href="/explore" className={`text-2xl hover:text-pink-500 transition-colors ${isActive('/explore')}`}>
                <Compass className="w-6 h-6" />
              </Link>
              <button className="text-2xl text-gray-600 hover:text-red-500 transition-colors relative">
                <Heart className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  3
                </span>
              </button>
              <Link href="/profile" className={`text-2xl hover:text-pink-500 transition-colors ${isActive('/profile')}`}>
                <UserCircle className="w-6 h-6" />
              </Link>
              
              {/* User Menu */}
              <div className="relative group">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold cursor-pointer">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="p-4">
                    <div className="font-semibold text-gray-800">{user.username}</div>
                    <div className="text-sm text-gray-500 truncate">{user.email}</div>
                  </div>
                  <div className="border-t border-gray-100">
                    <Link href="/profile" className="block px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors">
                      Your Profile
                    </Link>
                    <Link href="/settings" className="block px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors">
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Log Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link href="/login" className="px-6 py-2 border-2 border-pink-500 text-pink-500 rounded-full font-medium hover:bg-pink-50 transition-colors">
                Log In
              </Link>
              <Link href="/signup" className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-medium hover:opacity-90 transition-opacity">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}