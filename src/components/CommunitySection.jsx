import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, MoreHorizontal, TrendingUp, Clock, Users, Plus } from 'lucide-react';
import { CommunityPost } from './CommunityPost';
import { CreatePost } from './CreatePost';
import { DiscussionList } from './DiscussionList';
import { PostView } from './PostView';

export function CommunitySection() {
  const [activeTab, setActiveTab] = useState('post');
  const [viewingPost, setViewingPost] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);

  const discussions = [
    {
      id: 1,
      title: "How to prepare for FAANG interviews in 2024?",
      author: "Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
      timeAgo: "2 hours ago",
      content: "I've been preparing for FAANG interviews and wanted to share my experience. The competition is intense but with the right strategy, it's definitely achievable...",
      likes: 124,
      comments: 28,
      shares: 12,
      tags: ["interview", "faang", "career"],
      isLiked: false
    },
    {
      id: 2,
      title: "Remote work productivity tips that actually work",
      author: "Mike Johnson",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      timeAgo: "4 hours ago",
      content: "After 3 years of remote work, here are the productivity hacks that have transformed my workflow...",
      likes: 89,
      comments: 15,
      shares: 8,
      tags: ["remote-work", "productivity", "tips"],
      isLiked: true
    },
    {
      id: 3,
      title: "Salary negotiation strategies for software engineers",
      author: "Alex Rodriguez",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      timeAgo: "6 hours ago",
      content: "Just negotiated a 40% raise! Here are the exact strategies I used...",
      likes: 156,
      comments: 42,
      shares: 23,
      tags: ["salary", "negotiation", "career-growth"],
      isLiked: false
    }
  ];

  const tabs = [
    { id: 'trending', label: 'Trending', icon: TrendingUp },
    { id: 'recent', label: 'Recent', icon: Clock },
    { id: 'following', label: 'Following', icon: Users }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => {
            setActiveTab('post');
            setViewingPost(false);
          }}
          className={`px-6 py-3 flex items-center gap-2 transition-colors ${
            activeTab === 'post'
              ? 'border-b-2 border-[#FF6B55] text-gray-900'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          style={{ fontSize: '14px', fontWeight: 500 }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="3" y="4" width="10" height="8" rx="1" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M6 4V3C6 2.44772 6.44772 2 7 2H9C9.55228 2 10 2.44772 10 3V4" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
          Post
        </button>
        <button
          onClick={() => {
            setActiveTab('discussion');
            setViewingPost(false);
          }}
          className={`px-6 py-3 flex items-center gap-2 transition-colors ${
            activeTab === 'discussion'
              ? 'border-b-2 border-[#FF6B55] text-gray-900'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          style={{ fontSize: '14px', fontWeight: 500 }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 6C3 4.89543 3.89543 4 5 4H11C12.1046 4 13 4.89543 13 6V10C13 11.1046 12.1046 12 11 12H8L5 14V12H5C3.89543 12 3 11.1046 3 10V6Z" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
          Discussion
        </button>
      </div>

      {/* Content */}
      <div>
        {activeTab === 'post' && <CreatePost />}
        {activeTab === 'discussion' && !viewingPost && (
          <div className="p-6">
            <DiscussionList onViewPost={() => setViewingPost(true)} />
          </div>
        )}
        {activeTab === 'discussion' && viewingPost && (
          <PostView onBack={() => setViewingPost(false)} />
        )}
      </div>
    </div>
  );
}