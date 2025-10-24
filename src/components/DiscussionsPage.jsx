import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from './Navbar';
import { DiscussionList } from './DiscussionList';
import { PostView } from './PostView';
import { Sidebar } from './Sidebar';
import { CreatePost } from './CreatePost';
import { FileText } from 'lucide-react';

export function DiscussionsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('discussion'); // 'discussion', 'post', or 'my-posts'
  const [currentView, setCurrentView] = useState('list'); // 'list' or 'post'
  const [selectedPost, setSelectedPost] = useState(null);

  const handleViewPost = (post) => {
    setSelectedPost(post);
    setCurrentView('post');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedPost(null);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Don't navigate, just switch the view within the same component
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="pt-20">
        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-center mb-6">
            <div className="bg-white rounded-full shadow-sm p-1 border border-gray-200">
              <div className="flex">
                <button
                  onClick={() => handleTabChange('discussion')}
                  className={`px-6 py-2 text-sm font-medium rounded-full transition-all duration-200 relative ${
                    activeTab === 'discussion'
                      ? 'text-[#FF6B55] font-bold'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Discussion
                  {activeTab === 'discussion' && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-[#FF6B55] rounded-full"></div>
                  )}
                </button>
                <button
                  onClick={() => handleTabChange('my-posts')}
                  className={`px-6 py-2 text-sm font-medium rounded-full transition-all duration-200 relative ${
                    activeTab === 'my-posts'
                      ? 'text-[#FF6B55] font-bold'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  My Posts
                  {activeTab === 'my-posts' && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-[#FF6B55] rounded-full"></div>
                  )}
                </button>
                <button
                  onClick={() => handleTabChange('post')}
                  className={`px-6 py-2 text-sm font-medium rounded-full transition-all duration-200 relative ${
                    activeTab === 'post'
                      ? 'text-[#FF6B55] font-bold'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Post
                  {activeTab === 'post' && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-[#FF6B55] rounded-full"></div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {activeTab === 'discussion' ? (
          currentView === 'list' ? (
            <div className="max-w-7xl mx-auto px-6 py-8">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-3">
                  <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Community Discussions</h1>
                    <p className="text-gray-600">Join the conversation and share your thoughts with the community.</p>
                  </div>
                  <DiscussionList onViewPost={handleViewPost} />
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                  <div className="sticky top-24">
                    <Sidebar />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <PostView onBack={handleBackToList} post={selectedPost} />
          )
        ) : activeTab === 'my-posts' ? (
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-3">
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">My Posts</h1>
                  <p className="text-gray-600">View and manage your community posts.</p>
                </div>
                <DiscussionList onViewPost={handleViewPost} showOnlyUserPosts={true} />
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <Sidebar />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-3">
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Post</h1>
                  <p className="text-gray-600">Share your thoughts and start a conversation with the community.</p>
                </div>
                <CreatePost />
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <Sidebar />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}