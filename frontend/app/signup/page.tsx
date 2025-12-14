'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    full_name: '',
  });
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await signup(formData);
      router.push('/');
    } catch (error) {
      console.error('Signup error:', error);
      alert('Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-2">Sign Up</h1>
      <p className="text-gray-600 mb-8">Join Instagram Clone today</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Username
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Name
          </label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700 disabled:opacity-50"
        >
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="text-pink-600 font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}