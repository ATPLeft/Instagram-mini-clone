'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import PostCard from '@/components/PostCard';

interface Post {
  id: number;
  image_url: string;
  caption: string;
  username: string;
  profile_pic: string;
  like_count: number;
  comment_count: number;
}

export default function Home() {
  const { token } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

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
    }
  };

  if (!token) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Welcome to Instagram Clone</h2>
        <p className="text-gray-600">Please login to see your feed</p>
      </div>
    );
  }

  if (loading) {
    return <div className="text-center py-12">Loading feed...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Your Feed</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}