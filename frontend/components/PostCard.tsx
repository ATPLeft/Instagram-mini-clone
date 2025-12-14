'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { Heart, MessageCircle, Send, Bookmark, MoreVertical } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface PostCardProps {
  post: {
    id: number;
    image_url: string;
    caption: string;
    username: string;
    profile_pic: string;
    like_count: number;
    comment_count: number;
    liked_by_user: boolean;
    created_at: string;
  };
  onPostUpdate?: () => void;
}

interface Comment {
  id: number;
  content: string;
  username: string;
  profile_pic: string;
  created_at: string;
}

export default function PostCard({ post, onPostUpdate }: PostCardProps) {
  const [liked, setLiked] = useState(post.liked_by_user);
  const [likes, setLikes] = useState(post.like_count);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const { token, user } = useAuth();

  useEffect(() => {
    if (showComments) {
      fetchComments();
    }
  }, [showComments]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/posts/${post.id}/comments`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleLike = async () => {
    if (!user) return;
    
    setLoading(true);
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
      if (onPostUpdate) onPostUpdate();
    } catch (error) {
      console.error('Error liking post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleComment = async () => {
    if (!comment.trim() || !user) return;
    
    setLoading(true);
    try {
      const response = await axios.post(
        `http://localhost:5000/api/posts/${post.id}/comments`,
        { content: comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setComments([...comments, response.data]);
      setComment('');
      if (onPostUpdate) onPostUpdate();
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  return (
    <div className="card-hover bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 mb-8 fade-in">
      {/* Post Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="story-ring">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-300 to-purple-400 flex items-center justify-center text-white font-bold">
              {post.username.charAt(0).toUpperCase()}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{post.username}</h3>
            <p className="text-xs text-gray-500">{formatDate(post.created_at)}</p>
          </div>
        </div>
        <button className="text-gray-500 hover:text-gray-700">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
      
      {/* Post Image */}
      <div className="relative">
        <img
          src={post.image_url}
          alt={post.caption}
          className="w-full h-96 object-cover"
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131';
          }}
        />
        <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          📷
        </div>
      </div>
      
      {/* Post Actions */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <div className="flex space-x-4">
            <button
              onClick={handleLike}
              disabled={loading}
              className={`p-2 rounded-full transition-all duration-300 ${liked ? 'text-red-500 pulse-like' : 'text-gray-600 hover:text-red-500'}`}
            >
              <Heart className={`w-6 h-6 ${liked ? 'fill-red-500' : ''}`} />
            </button>
            <button
              onClick={() => setShowComments(!showComments)}
              className="p-2 rounded-full text-gray-600 hover:text-blue-500 transition-colors"
            >
              <MessageCircle className="w-6 h-6" />
            </button>
            <button className="p-2 rounded-full text-gray-600 hover:text-green-500 transition-colors">
              <Send className="w-6 h-6" />
            </button>
          </div>
          <button
            onClick={() => setSaved(!saved)}
            className="p-2 rounded-full text-gray-600 hover:text-yellow-500 transition-colors"
          >
            <Bookmark className={`w-6 h-6 ${saved ? 'fill-yellow-500' : ''}`} />
          </button>
        </div>
        
        {/* Likes Count */}
        <div className="mb-2">
          <p className="font-semibold text-gray-800">
            {likes.toLocaleString()} {likes === 1 ? 'like' : 'likes'}
          </p>
        </div>
        
        {/* Caption */}
        <div className="mb-3">
          <p className="text-gray-800">
            <span className="font-semibold mr-2">{post.username}</span>
            {post.caption}
          </p>
        </div>
        
        {/* View Comments Toggle */}
        {post.comment_count > 0 && !showComments && (
          <button
            onClick={() => setShowComments(true)}
            className="text-gray-500 text-sm mb-3 hover:text-gray-700 transition-colors"
          >
            View all {post.comment_count} {post.comment_count === 1 ? 'comment' : 'comments'}
          </button>
        )}
        
        {/* Comments Section */}
        {showComments && (
          <div className="mt-4 space-y-3 max-h-64 overflow-y-auto pr-2">
            {comments.map((comment) => (
              <div key={comment.id} className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-300 to-purple-300 flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="bg-gray-50 rounded-2xl rounded-tl-none px-4 py-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-sm">{comment.username}</span>
                      <span className="text-xs text-gray-500">
                        {formatDate(comment.created_at)}
                      </span>
                    </div>
                    <p className="text-gray-700 mt-1">{comment.content}</p>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Add Comment */}
            <div className="flex space-x-3 mt-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-200 to-purple-200 flex-shrink-0"></div>
              <div className="flex-1 flex space-x-2">
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 border border-gray-200 rounded-full px-4 py-2 focus:outline-none focus:border-pink-300 focus:ring-2 focus:ring-pink-100"
                  onKeyPress={(e) => e.key === 'Enter' && handleComment()}
                />
                <button
                  onClick={handleComment}
                  disabled={loading || !comment.trim()}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-5 rounded-full font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}