'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-pink-600">
          Instagram Clone
        </Link>
        
        {user ? (
          <div className="flex items-center space-x-4">
            <Link href="/create-post" className="text-gray-700 hover:text-pink-600">
              Create Post
            </Link>
            <Link href={`/profile/${user.id}`} className="text-gray-700 hover:text-pink-600">
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="space-x-4">
            <Link href="/login" className="text-gray-700 hover:text-pink-600">
              Login
            </Link>
            <Link href="/signup" className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}