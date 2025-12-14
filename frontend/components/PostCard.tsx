'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { FaHeart, FaRegHeart, FaComment, FaPaperPlane } from 'react-icons/fa';

interface PostCardProps {
  post: {
    id: number;
    image_url: string;
    caption: string;
    username: string;
    profile_pic: string;
    like_count: number;
    comment_count: number;
  };
}

export default function PostCard({ post }: PostCardProps) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post.like_count);
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<any[]>([]);
  const { token } = useAuth();

  const handleLike = async () => {
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
    if (!comment.trim()) return;
    
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

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-gray-300"></div>
        <span className="font-semibold">{post.username}</span>
      </div>
      
      <img
        src={post.image_url}
        alt={post.caption}
        className="w-full h-64 object-cover"
        onError={(e) => {
          e.currentTarget.src = 'https://via.placeholder.com/800x600';
        }}
      />
      
      <div className="p-4">
        <div className="flex space-x-4 mb-3">
          <button
            onClick={handleLike}
            className={`p-2 rounded-full ${liked ? 'text-red-500' : 'text-gray-600'}`}
          >
            {liked ? (
              <FaHeart className="w-6 h-6" />
            ) : (
              <FaRegHeart className="w-6 h-6" />
            )}
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="p-2 rounded-full text-gray-600"
          >
            <FaComment className="w-6 h-6" />
          </button>
        </div>
        
        <div className="mb-2">
          <span className="font-semibold mr-2">{post.username}</span>
          <span>{post.caption}</span>
        </div>
        
        <div className="text-gray-500 text-sm mb-2">
          {likes} likes • {post.comment_count} comments
        </div>
        
        {showComments && (
          <div className="mt-4 space-y-3">
            <div className="flex space-x-2">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 border rounded-lg px-3 py-2"
              />
              <button
                onClick={handleComment}
                className="bg-pink-600 text-white px-4 py-2 rounded-lg"
              >
                <FaPaperPlane className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}