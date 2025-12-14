'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import PostCard from '@/components/PostCard';
import { Plus, Flame, Compass, Video, RefreshCw } from 'lucide-react';

interface Post {
  id: number;
  image_url: string;
  caption: string;
  username: string;
  profile_pic: string;
  like_count: number;
  comment_count: number;
  liked_by_user: boolean;
  created_at: string;
}

export default function Home() {
  const { user, token } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (token) {
      fetchFeed();
    }
  }, [token]);

  const fetchFeed = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/posts/feed', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching feed:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchFeed();
  };

  if (!token || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold gradient-text mb-4">Instagram Clone</h1>
          <p className="text-gray-600 mb-8">Please login to see your personalized feed</p>
          <div className="space-x-4">
            <a
              href="/login"
              className="inline-block px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-medium hover:opacity-90 transition-opacity"
            >
              Login
            </a>
            <a
              href="/signup"
              className="inline-block px-8 py-3 border-2 border-pink-500 text-pink-500 rounded-full font-medium hover:bg-pink-50 transition-colors"
            >
              Sign Up
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome back, <span className="gradient-text">{user.username}</span>! 👋
        </h1>
        <p className="text-gray-600">Here's what's happening in your network</p>
      </div>

      {/* Stories Bar */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 card-hover">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Stories</h2>
          <button className="text-pink-500 hover:text-pink-600 font-medium">
            See all
          </button>
        </div>
        <div className="flex space-x-6 overflow-x-auto pb-4">
          {/* Add Story */}
          <div className="flex-shrink-0 text-center">
            <div className="relative mb-2">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
                  <Plus className="w-6 h-6 text-pink-500" />
                </div>
              </div>
              <div className="absolute bottom-0 right-0 bg-pink-500 text-white w-6 h-6 rounded-full flex items-center justify-center">
                +
              </div>
            </div>
            <p className="text-xs font-medium">Add Story</p>
          </div>

          {/* Story items */}
          {['🔥 Trending', '🌎 Explore', '🎬 Reels', '❤️ Favorites'].map((title, index) => (
            <div key={index} className="flex-shrink-0 text-center">
              <div className="story-ring mb-2">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold
                  ${index === 0 ? 'bg-gradient-to-br from-orange-400 to-red-500' : 
                    index === 1 ? 'bg-gradient-to-br from-blue-400 to-cyan-500' :
                    index === 2 ? 'bg-gradient-to-br from-purple-400 to-pink-500' :
                    'bg-gradient-to-br from-red-400 to-pink-500'}`}
                >
                  {index === 0 ? <Flame className="w-8 h-8" /> : 
                   index === 1 ? <Compass className="w-8 h-8" /> :
                   index === 2 ? <Video className="w-8 h-8" /> : '❤️'}
                </div>
              </div>
              <p className="text-xs font-medium">{title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Feed Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Your Feed</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center space-x-2"
          >
            {refreshing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Refreshing...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                <span>Refresh Feed</span>
              </>
            )}
          </button>
          <a
            href="/create-post"
            className="px-4 py-2 border-2 border-pink-500 text-pink-500 rounded-lg font-medium hover:bg-pink-50 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Post</span>
          </a>
        </div>
      </div>

      {/* Feed Content */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500 mb-4"></div>
          <p className="text-gray-600">Loading your feed...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
          <div className="w-24 h-24 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Compass className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Your feed is empty</h3>
          <p className="text-gray-600 mb-6">Start following people to see their posts here!</p>
          <div className="space-x-4">
            <a
              href="/create-post"
              className="inline-block px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Create First Post
            </a>
            <button className="inline-block px-6 py-3 border-2 border-pink-500 text-pink-500 rounded-lg font-medium hover:bg-pink-50 transition-colors">
              Explore Users
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onPostUpdate={fetchFeed}
            />
          ))}
        </div>
      )}
    </div>
  );
}