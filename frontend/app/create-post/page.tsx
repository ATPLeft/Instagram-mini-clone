'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function CreatePost() {
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imageUrl || !caption) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);
    
    try {
      await axios.post(
        'http://localhost:5000/api/posts',
        { image_url: imageUrl, caption },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setImageUrl('');
      setCaption('');
      router.push('/');
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Error creating post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-8">Create New Post</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image URL
          </label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
            placeholder="https://example.com/image.jpg"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Caption
          </label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 h-32"
            placeholder="What's on your mind?"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-pink-600 text-white py-3 rounded-lg font-semibold hover:bg-pink-700 disabled:opacity-50"
        >
          {loading ? 'Creating Post...' : 'Create Post'}
        </button>
      </form>
    </div>
  );
}