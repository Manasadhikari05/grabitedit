import { useState, useEffect } from 'react';
import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';
import { Search } from 'lucide-react';
import { API_BASE_URL } from './client';

export function DiscussionList({ onViewPost, showOnlyUserPosts = false }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPosts, setFilteredPosts] = useState([]);

  const handleDeletePost = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to delete posts');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/auth/discussion-posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        // Remove the post from the local state
        setPosts(posts.filter(post => post.post_id !== postId));
        alert('Post deleted successfully');
      } else {
        alert(data.message || 'Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. Please try again.');
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [showOnlyUserPosts]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPosts(filtered);
    }
  }, [posts, searchQuery, showOnlyUserPosts]);

  const fetchPosts = async () => {
    try {
      // Always fetch all posts first
      const response = await fetch(`${API_BASE_URL}/auth/discussion-posts`);
      const data = await response.json();

      if (data.success) {
        if (showOnlyUserPosts) {
          // Filter posts on frontend for current user
          const user = JSON.parse(localStorage.getItem('user') || '{}');
          const userPosts = data.posts.filter(post => post.author?.id === user.id);
          setPosts(userPosts);
        } else {
          // Show all posts
          setPosts(data.posts);
        }
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInHours = Math.floor((now - postDate) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}w ago`;
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

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
              <div className="h-3 bg-gray-200 rounded w-12"></div>
            </div>
            <div className="space-y-2 mb-4">
              <div className="h-5 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
            <div className="flex gap-2 mb-4">
              <div className="h-6 bg-gray-200 rounded-full w-16"></div>
              <div className="h-6 bg-gray-200 rounded-full w-20"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <span className="text-2xl">💬</span>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No discussions yet</h3>
        <p className="text-gray-500">Be the first to start a conversation!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex gap-3">
          <div className="flex-1 bg-gray-100 rounded-lg p-3 flex items-center gap-3">
            <Search className="w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search discussions by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-500"
            />
          </div>
        </div>
      </div>

      {filteredPosts.length === 0 && searchQuery.trim() !== '' ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No discussions found</h3>
          <p className="text-gray-500">Try searching with different keywords.</p>
        </div>
      ) : (
        filteredPosts.map((post) => (
          <div
            key={post.post_id}
            onClick={() => onViewPost(post)}
            className="cursor-pointer bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <img
                  src={getAvatarUrl(post.author)}
                  alt={post.author.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-gray-600" style={{ fontSize: '13px' }}>
                    By: {post.author.name}
                  </p>
                </div>
              </div>
              <span className="text-gray-400" style={{ fontSize: '13px' }}>
                {formatTimeAgo(post.createdAt)}
              </span>
            </div>

            <h3 className="text-gray-900 mb-2" style={{ fontSize: '16px', fontWeight: 600 }}>
              {post.title}
            </h3>

            <p className="text-gray-600 mb-4" style={{ fontSize: '14px', lineHeight: '1.6' }}>
              {post.content.length > 200 ? `${post.content.substring(0, 200)}...` : post.content}
            </p>

            {/* Post Image */}
            {post.imageUrl && (
              <div className="mb-4">
                <img
                  src={post.imageUrl}
                  alt="Post image"
                  className="w-full max-w-sm h-auto rounded-lg shadow-sm"
                  style={{ maxHeight: '200px', objectFit: 'cover' }}
                  onError={(e) => {
                    console.error('Image failed to load:', post.imageUrl);
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2 mb-4">
              {post.tags && post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 rounded-full text-gray-700"
                  style={{ fontSize: '12px' }}
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => onViewPost(post)}
                className="flex items-center gap-4 text-gray-500 hover:text-[#FF6B55] transition-colors cursor-pointer"
                style={{ fontSize: '13px' }}
              >
                <div className="flex items-center gap-1">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 6C3 4.89543 3.89543 4 5 4H11C12.1046 4 13 4.89543 13 6V10C13 11.1046 12.1046 12 11 12H8L5 14V12H5C3.89543 12 3 11.1046 3 10V6Z" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  <span>{post.commentsCount || 0} {post.commentsCount === 1 ? 'reply' : 'replies'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M2 8C2 8 4 4 8 4C12 4 14 8 14 8C14 8 12 12 8 12C4 12 2 8 2 8Z" stroke="currentColor" strokeWidth="1.5"/>
                    <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  <span>{post.views || 0} {post.views === 1 ? 'view' : 'views'}</span>
                </div>
              </button>

              <div className="flex items-center gap-2">
                {/* Delete button for post owner */}
                {(() => {
                  const user = JSON.parse(localStorage.getItem('user') || '{}');
                  return user.id && post.author?.id === user.id && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
                          handleDeletePost(post.post_id);
                        }
                      }}
                      className="w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors"
                      title="Delete post"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                      </svg>
                    </button>
                  );
                })()}

                <div className="flex items-center">
                  <span className="text-gray-500 mr-2" style={{ fontSize: '12px' }}>Replied by:</span>
                  <div className="flex -space-x-1">
                    {post.comments && post.comments.length > 0 ? (
                      <>
                        {post.comments.slice(0, 4).map((comment, index) => (
                              <img
                                key={comment.comment_id || index}
                                src={comment.author?.profileImage || `data:image/svg+xml;utf8,${encodeURIComponent(
                                  createAvatar(lorelei, {
                                    seed: comment.author?.name || comment.author?.email || `user${index}`,
                                    size: 32,
                                  }).toString()
                                )}`}
                                alt={comment.author?.name || 'User'}
                                className="w-8 h-8 rounded-full border-2 border-white shadow-sm object-cover"
                                style={{ zIndex: 4 - index }}
                              />
                            ))}
                        {(post.commentsCount || 0) > 4 && (
                          <div
                            className="w-8 h-8 rounded-full bg-gray-400 border-2 border-white shadow-sm flex items-center justify-center text-white text-xs font-medium"
                            style={{ zIndex: 0 }}
                          >
                            +{(post.commentsCount || 0) - 4}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 border-2 border-white shadow-sm"></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      )}

    </div>
  );
}