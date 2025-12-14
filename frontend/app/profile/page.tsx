'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { Heart, MessageCircle } from 'lucide-react';
import { UserPlus, UserCheck, Camera, Grid3x3, Bookmark, Edit } from 'lucide-react';

interface UserProfile {
  id: number;
  username: string;
  email: string;
  full_name: string;
  bio: string;
  profile_pic: string;
  posts_count: number;
  followers_count: number;
  following_count: number;
}

export default function ProfilePage() {
  const { user, token } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (user && token) {
      fetchProfile();
      fetchUserPosts();
    }
  }, [user, token]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users/${user?.id}/posts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await axios.delete(`http://localhost:5000/api/users/${profile?.id}/follow`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`http://localhost:5000/api/users/${profile?.id}/follow`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setIsFollowing(!isFollowing);
      fetchProfile(); // Refresh counts
    } catch (error) {
      console.error('Error following/unfollowing:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please login to view profile</h2>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 card-hover">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-12">
          {/* Profile Picture */}
          <div className="relative">
            <div className="story-ring">
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-pink-400 via-purple-500 to-blue-500 flex items-center justify-center text-white text-6xl font-bold">
                {profile?.username?.charAt(0).toUpperCase()}
              </div>
            </div>
            <button className="absolute bottom-2 right-2 bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow">
              <Camera className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6 mb-6">
              <h1 className="text-3xl font-bold text-gray-800">{profile?.username}</h1>
              <div className="flex space-x-4">
                <button className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center space-x-2">
                  <Edit className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
                <button
                  onClick={handleFollow}
                  className={`px-6 py-2 rounded-lg font-medium transition-all flex items-center space-x-2 ${
                    isFollowing
                      ? 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:opacity-90'
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <UserCheck className="w-4 h-4" />
                      <span>Following</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Follow</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="flex space-x-8 mb-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-800">{profile?.posts_count || 0}</p>
                <p className="text-gray-600">Posts</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-800">{profile?.followers_count || 0}</p>
                <p className="text-gray-600">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-800">{profile?.following_count || 0}</p>
                <p className="text-gray-600">Following</p>
              </div>
            </div>

            {/* Bio */}
            <div>
              <h2 className="font-semibold text-gray-800 mb-2">{profile?.full_name}</h2>
              <p className="text-gray-600">
                {profile?.bio || 'No bio yet. ✨'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('posts')}
            className={`py-4 px-2 flex items-center space-x-2 font-medium transition-colors ${
              activeTab === 'posts'
                ? 'text-pink-600 border-b-2 border-pink-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Grid3x3 className="w-5 h-5" />
            <span>POSTS</span>
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`py-4 px-2 flex items-center space-x-2 font-medium transition-colors ${
              activeTab === 'saved'
                ? 'text-pink-600 border-b-2 border-pink-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Bookmark className="w-5 h-5" />
            <span>SAVED</span>
          </button>
        </div>
      </div>

      {/* Posts Grid */}
      {activeTab === 'posts' && (
        <div>
          {posts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
              <div className="w-24 h-24 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Camera className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Share Photos</h3>
              <p className="text-gray-600 mb-6">When you share photos, they will appear on your profile.</p>
              <a
                href="/create-post"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                <Camera className="w-5 h-5" />
                <span>Share your first photo</span>
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="relative group overflow-hidden rounded-2xl shadow-lg card-hover"
                >
                  <img
                    src={post.image_url}
                    alt={post.caption}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-4 text-white">
                      <div className="flex items-center space-x-4 mb-2">
                        <span className="flex items-center space-x-1">
                          <Heart className="w-4 h-4" />
                          <span>{post.like_count}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MessageCircle className="w-4 h-4" />
                          <span>{post.comment_count}</span>
                        </span>
                      </div>
                      <p className="text-sm truncate">{post.caption}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Saved Posts */}
      {activeTab === 'saved' && (
        <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
          <div className="w-24 h-24 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Bookmark className="w-12 h-12 text-yellow-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Save Photos</h3>
          <p className="text-gray-600 mb-6">Save photos you want to see again. Only you can see what you've saved.</p>
          <p className="text-gray-500 text-sm">Save posts by clicking the bookmark icon</p>
        </div>
      )}
    </div>
  );
}