import { MessageCircle, Eye, Heart, Share2, Send } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';

import { API_BASE_URL } from './client';

export function PostView({ onBack, post }) {
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [likesCount, setLikesCount] = useState(post?.likesCount || 0);
  const [viewsCount, setViewsCount] = useState(post?.views || 0);
  const [isLiked, setIsLiked] = useState(false);

  // Get current user from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // Early return if post is not available
  if (!post) {
    return (
      <div>
        <div className="p-6 border-b border-gray-200">
          <button
            onClick={onBack}
            className="text-gray-600 hover:text-gray-900 mb-4 flex items-center gap-2"
            style={{ fontSize: '14px' }}
          >
            ← Back to discussions
          </button>
          <div className="text-center py-8">
            <p className="text-gray-500">Post not found</p>
          </div>
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (post?.post_id) {
      fetchComments();
      incrementView();
      checkIfLiked();
      console.log('Post data:', post); // Debug log
    }
  }, [post?.post_id]);

  const checkIfLiked = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.id && post?.likes) {
      const userLike = post.likes.find(like => like.user_id === user.id);
      setIsLiked(!!userLike);
    }
  };

  const incrementView = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/discussion-posts/${post.post_id}/view`, {
        method: 'POST',
      });
      const data = await response.json();
      if (data.success) {
        setViewsCount(data.viewsCount);
      }
    } catch (error) {
      console.error('Error incrementing view:', error);
    }
  };

  const handleLike = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to like posts');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/discussion-posts/${post.post_id}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setIsLiked(data.liked);
        setLikesCount(data.likesCount);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      alert('Failed to like/unlike post');
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/post-comments/${post.post_id}`);
      const data = await response.json();

      if (data.success) {
        setComments(data.comments);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAvatarUrl = (author) => {
    if (author.profileImage) {
      return author.profileImage;
    }

    const avatarStyle = lorelei;
    const avatar = createAvatar(avatarStyle, {
      seed: author.name || author.email,
      size: 40,
    });
    return `data:image/svg+xml;utf8,${encodeURIComponent(avatar.toString())}`;
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const commentDate = new Date(date);
    const diffInHours = Math.floor((now - commentDate) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}w ago`;
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to comment');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/post-comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          postId: post.post_id,
          content: newComment.trim()
        }),
      });

      const data = await response.json();

      if (data.success) {
        setComments([data.comment, ...comments]);
        setNewComment('');
      } else {
        alert(data.message || 'Failed to add comment');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to delete comment');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/post-comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setComments(comments.filter(comment => comment.comment_id !== commentId));
      } else {
        alert(data.message || 'Failed to delete comment');
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment. Please try again.');
    }
  };

  return (
    <div>
      {/* Post Header */}
      <div className="p-6 border-b border-gray-200">
        <button
          onClick={onBack}
          className="text-gray-600 hover:text-gray-900 mb-4 flex items-center gap-2"
          style={{ fontSize: '14px' }}
        >
          ← Back to discussions
        </button>

        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <img
              src={getAvatarUrl(post.author || {})}
              alt={(post.author?.name) || 'User'}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="text-gray-900" style={{ fontSize: '16px', fontWeight: 600 }}>
                {post.author?.name || 'Unknown User'}
              </p>
              <p className="text-gray-500" style={{ fontSize: '13px' }}>
                @{post.author?.name?.toLowerCase().replace(' ', '') || post.author?.email?.split('@')[0] || 'user'} · {formatTimeAgo(post.createdAt)}
              </p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl mb-4" style={{ fontWeight: 600 }}>
          {post.title}
        </h2>

        <div className="space-y-4 text-gray-700" style={{ fontSize: '15px', lineHeight: '1.6' }}>
          {post.content.split('\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        {/* Post Image */}
        {post.imageUrl && (
          <div className="mt-4">
            <img
              src={post.imageUrl}
              alt="Post image"
              className="w-full max-w-2xl h-auto rounded-lg shadow-sm"
              style={{ maxHeight: '500px', objectFit: 'cover' }}
              onError={(e) => {
                console.error('Image failed to load:', post.imageUrl);
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-2">
          {post.tags && post.tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-100 rounded-full text-gray-700"
              style={{ fontSize: '13px' }}
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-6 text-gray-500" style={{ fontSize: '14px' }}>
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 transition-colors ${
              isLiked ? 'text-red-500' : 'hover:text-[#FF6B55]'
            }`}
          >
            <Heart size={18} fill={isLiked ? 'currentColor' : 'none'} />
            <span>{likesCount} {likesCount === 1 ? 'like' : 'likes'}</span>
          </button>
          <div className="flex items-center gap-2">
            <MessageCircle size={18} />
            <span>{comments.length} {comments.length === 1 ? 'comment' : 'comments'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Eye size={18} />
            <span>{viewsCount} {viewsCount === 1 ? 'view' : 'views'}</span>
          </div>
          <button className="flex items-center gap-2 hover:text-[#FF6B55] transition-colors ml-auto">
            <Share2 size={18} />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Comments Section */}
      <div className="p-6">
        <h3 className="text-lg mb-4" style={{ fontWeight: 600 }}>
          Comments ({comments.length})
        </h3>

        {/* Add Comment */}
        <div className="mb-6">
          <div className="flex gap-3">
            <img
              src={getAvatarUrl({ name: user.name, email: user.email, profileImage: user.profileImage })}
              alt={user.name || 'User'}
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full border border-gray-200 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-[#FF6B55] focus:border-transparent"
                rows={3}
                style={{ fontSize: '14px' }}
                disabled={submitting}
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim() || submitting}
                  className="px-4 py-2 bg-[#FF6B55] text-white rounded-lg hover:bg-[#FF5542] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontSize: '14px', fontWeight: 500 }}
                >
                  <Send size={16} />
                  {submitting ? 'Posting...' : 'Comment'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-6">
          {loading ? (
            // Loading skeleton for comments
            [1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                  <div className="space-y-1">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              </div>
            ))
          ) : comments.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-gray-100 rounded-full mx-auto mb-3 flex items-center justify-center">
                <MessageCircle size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-500">No comments yet</p>
              <p className="text-sm text-gray-400">Be the first to share your thoughts!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.comment_id} className="flex gap-3">
                <img
                  src={getAvatarUrl(comment.author || {})}
                  alt={(comment.author?.name) || 'User'}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-gray-900" style={{ fontSize: '14px', fontWeight: 600 }}>
                      {comment.author?.name || 'Unknown User'}
                    </span>
                    <span className="text-gray-400" style={{ fontSize: '13px' }}>
                      {formatTimeAgo(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-2" style={{ fontSize: '14px', lineHeight: '1.6' }}>
                    {comment.content}
                  </p>
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1 text-gray-500 hover:text-[#FF6B55] transition-colors" style={{ fontSize: '13px' }}>
                      <Heart size={14} />
                      <span>Like</span>
                    </button>
                    <button className="text-gray-500 hover:text-gray-700 transition-colors" style={{ fontSize: '13px' }}>
                      Reply
                    </button>
                    {user.id && (user.id === post.author?.id || user.id === comment.author?.id) && (
                      <button
                        onClick={() => handleDeleteComment(comment.comment_id)}
                        className="text-gray-500 hover:text-red-500 transition-colors"
                        style={{ fontSize: '13px' }}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}