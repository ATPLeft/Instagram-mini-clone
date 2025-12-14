'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Camera, Image, Loader2, CheckCircle } from 'lucide-react';

export default function CreatePost() {
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const { token } = useAuth();
  const router = useRouter();

  const handleImageUrlChange = (url: string) => {
    setImageUrl(url);
    if (url) {
      setImagePreview(url);
    }
  };

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
      
      setSuccess(true);
      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Error creating post');
    } finally {
      setLoading(false);
    }
  };

  // Sample images for quick selection
  const sampleImages = [
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba',
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    'https://images.unsplash.com/photo-1518837695005-2083093ee35b',
    'https://images.unsplash.com/photo-1518709268805-4e9042af2176',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden card-hover">
          <div className="p-8 border-b border-gray-100">
            <h1 className="text-3xl font-bold gradient-text mb-2">Create New Post</h1>
            <p className="text-gray-600">Share your moments with the world</p>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Image Preview */}
              <div>
                <label className="block text-lg font-semibold text-gray-800 mb-4">
                  <Camera className="inline-block mr-2 text-pink-500" />
                  Image Preview
                </label>
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center min-h-[300px]">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-64 rounded-xl shadow-lg"
                    />
                  ) : (
                    <div className="text-center">
                      <div className="w-24 h-24 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Image className="w-12 h-12 text-gray-400" />
                      </div>
                      <p className="text-gray-600">No image selected</p>
                      <p className="text-sm text-gray-500 mt-2">Add an image URL to see preview</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Image URL Input */}
              <div>
                <label className="block text-lg font-semibold text-gray-800 mb-4">
                  Image URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => handleImageUrlChange(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-6 py-4 text-lg focus:outline-none focus:border-pink-300 focus:ring-4 focus:ring-pink-100 transition-all"
                  placeholder="https://example.com/your-image.jpg"
                  required
                />
                <p className="text-sm text-gray-500 mt-2">
                  Enter a direct link to your image
                </p>
              </div>

              {/* Quick Image Selection */}
              <div>
                <label className="block text-lg font-semibold text-gray-800 mb-4">
                  Quick Select
                </label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {sampleImages.map((url, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleImageUrlChange(url)}
                      className="aspect-square rounded-xl overflow-hidden border-2 border-gray-200 hover:border-pink-300 transition-colors group"
                    >
                      <img
                        src={url}
                        alt={`Sample ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Caption Input */}
              <div>
                <label className="block text-lg font-semibold text-gray-800 mb-4">
                  Caption
                </label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full border-2 border-gray-200 rounded-xl px-6 py-4 text-lg focus:outline-none focus:border-pink-300 focus:ring-4 focus:ring-pink-100 transition-all min-h-[150px]"
                  placeholder="What's on your mind? Share your thoughts..."
                  required
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm text-gray-500">
                    {caption.length}/2200 characters
                  </p>
                  <div className="text-sm text-gray-500">
                    #️⃣ 🌟 ✨ 📸
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading || success}
                  className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white text-lg font-semibold py-5 rounded-xl hover:opacity-90 disabled:opacity-50 transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span>Creating Post...</span>
                    </>
                  ) : success ? (
                    <>
                      <CheckCircle className="w-6 h-6" />
                      <span>Post Created Successfully!</span>
                    </>
                  ) : (
                    <>
                      <Camera className="w-6 h-6" />
                      <span>Share with the World</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}