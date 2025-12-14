'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { Heart, MessageCircle, Send, Bookmark, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface PostDetail {
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

interface Comment {
  id: number;
  content: string;
  username: string;
  profile_pic: string;
  created_at: string;
}

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, token } = useAuth();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [comment, setComment] = useState('');
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (token && params.id) {
      fetchPost();
      fetchComments();
    }
  }, [token, params.id]);

  const fetchPost = async () => {
    try {
      // For demo, we'll use feed and find the post
      const response = await axios.get('http://localhost:5000/api/posts/feed', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const foundPost = response.data.find((p: any) => p.id.toString() === params.id);
      if (foundPost) {
        setPost(foundPost);
        setLiked(foundPost.liked_by_user);
        setLikes(foundPost.like_count);
      }
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/posts/${params.id}/comments`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleLike = async () => {
    if (!user || !post) return;
    
    try {
      if (liked) {
        await axios.delete(`http://localhost:5000/api/posts/${post.id}/like`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLikes(likes - 1);
      } else {
        await axios.post(`http://localhost:5000/api/posts/${post.id}/like`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLikes(likes + 1);
      }
      setLiked(!liked);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async () => {
    if (!comment.trim() || !user || !post) return;
    
    try {
      const response = await axios.post(
        `http://localhost:5000/api/posts/${post.id}/comments`,
        { content: comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setComments([...comments, response.data]);
      setComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Post not found</h2>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <X className="w-5 h-5" />
          <span>Close</span>
        </button>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden card-hover">
          <div className="flex flex-col lg:flex-row">
            {/* Left side - Image */}
            <div className="lg:w-2/3 relative">
              <img
                src={post.image_url}
                alt={post.caption}
                className="w-full h-[600px] object-cover"
              />
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => setSaved(!saved)}
                  className="bg-white/80 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-colors"
                >
                  <Bookmark className={`w-6 h-6 ${saved ? 'fill-yellow-500 text-yellow-500' : 'text-gray-700'}`} />
                </button>
              </div>
            </div>

            {/* Right side - Content */}
            <div className="lg:w-1/3 flex flex-col">
              {/* Post Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-white font-bold">
                      {post.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{post.username}</h3>
                      <p className="text-xs text-gray-500">{formatDate(post.created_at)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comments Section */}
              <div className="flex-1 overflow-y-auto p-6" style={{ maxHeight: '400px' }}>
                {/* Caption */}
                <div className="mb-6">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-300 to-purple-400 flex-shrink-0"></div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold">{post.username}</span>
                        <span className="text-xs text-gray-500">{formatDate(post.created_at)}</span>
                      </div>
                      <p className="text-gray-700">{post.caption}</p>
                    </div>
                  </div>
                </div>

                {/* Comments List */}
                {comments.map((comment) => (
                  <div key={comment.id} className="mb-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-300 to-cyan-400 flex-shrink-0"></div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-semibold">{comment.username}</span>
                          <span className="text-xs text-gray-500">
                            {formatDate(comment.created_at)}
                          </span>
                        </div>
                        <p className="text-gray-700">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions and Add Comment */}
              <div className="p-6 border-t border-gray-100">
                {/* Action Buttons */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex space-x-4">
                    <button
                      onClick={handleLike}
                      className={`p-2 rounded-full transition-all duration-300 ${liked ? 'text-red-500 pulse-like' : 'text-gray-600 hover:text-red-500'}`}
                    >
                      <Heart className={`w-6 h-6 ${liked ? 'fill-red-500' : ''}`} />
                    </button>
                    <button className="p-2 rounded-full text-gray-600 hover:text-blue-500 transition-colors">
                      <MessageCircle className="w-6 h-6" />
                    </button>
                    <button className="p-2 rounded-full text-gray-600 hover:text-green-500 transition-colors">
                      <Send className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                {/* Likes Count */}
                <div className="mb-4">
                  <p className="font-semibold text-gray-800">
                    {likes.toLocaleString()} {likes === 1 ? 'like' : 'likes'}
                  </p>
                </div>

                {/* Add Comment */}
                <div className="flex space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-200 to-purple-200 flex-shrink-0"></div>
                  <div className="flex-1 flex space-x-2">
                    <input
                      type="text"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="flex-1 border border-gray-200 rounded-full px-4 py-3 focus:outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
                      onKeyPress={(e) => e.key === 'Enter' && handleComment()}
                    />
                    <button
                      onClick={handleComment}
                      disabled={!comment.trim()}
                      className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 rounded-full font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}