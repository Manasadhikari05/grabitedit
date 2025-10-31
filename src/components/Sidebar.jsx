import { useState, useEffect } from 'react';
import { ArrowRight, MessageCircle, Eye, Heart } from 'lucide-react';
import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';
import { API_BASE_URL as CLIENT_API_BASE_URL } from './client';

export function Sidebar() {
  const [topDiscussions, setTopDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopDiscussions();
  }, []);

  const fetchTopDiscussions = async () => {
    try {
      const response = await fetch(`${CLIENT_API_BASE_URL}/auth/top-discussions`);
      const data = await response.json();

      if (data.success) {
        setTopDiscussions(data.topDiscussions);
      }
    } catch (error) {
      console.error('Error fetching top discussions:', error);
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
      size: 32,
    });
    return `data:image/svg+xml;utf8,${encodeURIComponent(avatar.toString())}`;
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

  return (
    <div className="space-y-6">
      {/* Top Discussion Card */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-gray-900 mb-4" style={{ fontSize: '16px', fontWeight: 600 }}>
          Top discussion this week 🔥
        </h3>

        {loading ? (
          // Loading skeleton
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-1 mb-3">
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-3 bg-gray-200 rounded w-12"></div>
                  <div className="h-3 bg-gray-200 rounded w-12"></div>
                  <div className="h-3 bg-gray-200 rounded w-12"></div>
                </div>
              </div>
            ))}
          </div>
        ) : topDiscussions.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-gray-100 rounded-full mx-auto mb-3 flex items-center justify-center">
              <span className="text-2xl">💬</span>
            </div>
            <p className="text-gray-500 text-sm">No discussions this week yet</p>
            <p className="text-xs text-gray-400">Be the first to start a trending discussion!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {topDiscussions.map((discussion, index) => (
              <div key={discussion.post_id} className="pb-4 border-b border-gray-100 last:border-b-0 last:pb-0">
                <div className="flex items-start gap-3 mb-3">
                  <img
                    src={getAvatarUrl(discussion.author)}
                    alt={discussion.author.name}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 text-sm font-medium truncate">
                      {discussion.author.name}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {formatTimeAgo(discussion.createdAt)}
                    </p>
                  </div>
                </div>

                <h4 className="text-gray-900 text-sm font-medium mb-2 line-clamp-2">
                  {discussion.title}
                </h4>

                <p className="text-gray-600 text-xs mb-3 line-clamp-2">
                  {discussion.content}
                </p>

                <div className="flex items-center gap-4 text-gray-500 text-xs">
                  <div className="flex items-center gap-1">
                    <Heart size={12} />
                    <span>{discussion.likesCount}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle size={12} />
                    <span>{discussion.commentsCount}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye size={12} />
                    <span>{discussion.viewsCount}</span>
                  </div>
                </div>

                <button
                  onClick={() => window.location.href = '/discussions'}
                  className="flex items-center gap-1 text-gray-900 hover:gap-2 transition-all mt-2 cursor-pointer"
                  style={{ fontSize: '12px', fontWeight: 500 }}
                >
                  View Discussion <ArrowRight size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommended Topics */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-gray-900 mb-4" style={{ fontSize: '16px', fontWeight: 600 }}>
          Recommended topics
        </h3>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-3 py-1.5 bg-gray-100 rounded-full text-gray-700 hover:bg-gray-200 cursor-pointer transition-colors" style={{ fontSize: '13px' }}>
            Programming
          </span>
          <span className="px-3 py-1.5 bg-gray-100 rounded-full text-gray-700 hover:bg-gray-200 cursor-pointer transition-colors" style={{ fontSize: '13px' }}>
            Copywriting
          </span>
          <span className="px-3 py-1.5 bg-gray-100 rounded-full text-gray-700 hover:bg-gray-200 cursor-pointer transition-colors" style={{ fontSize: '13px' }}>
            Product
          </span>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-3 py-1.5 bg-gray-100 rounded-full text-gray-700 hover:bg-gray-200 cursor-pointer transition-colors" style={{ fontSize: '13px' }}>
            Machine learning
          </span>
          <span className="px-3 py-1.5 bg-gray-100 rounded-full text-gray-700 hover:bg-gray-200 cursor-pointer transition-colors" style={{ fontSize: '13px' }}>
            Productivity
          </span>
        </div>
        <button className="text-[#FF6B55] hover:text-[#FF5542] transition-colors" style={{ fontSize: '13px', fontWeight: 500 }}>
          See more topics
        </button>
      </div>

    </div>
  );
}