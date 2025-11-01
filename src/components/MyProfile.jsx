import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Users,
  BarChart3,
  Lightbulb,
  MapPin,
  Send,
  ExternalLink,
  Facebook,
  Instagram,
  Trophy,
  Pencil,
  Trash2
} from 'lucide-react';
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { ApplicationAnalytics } from './ApplicationAnalytics';
import { SmartInsights } from './SmartInsights';
import ProfileDropdown from './ProfileDropdown';
import { API_BASE_URL } from './client';

// Navbar Component
const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <nav className="bg-white shadow-sm fixed w-full top-0 z-50 border-b border-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="text-2xl font-bold text-green-800">
            GrabIt
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-green-700 hover:text-green-900 transition-colors pb-2 border-b-2 border-transparent hover:border-green-600"
            >
              Home
            </Link>
            <Link
              to="/jobs"
              className="text-green-700 hover:text-green-900 transition-colors pb-2 border-b-2 border-transparent hover:border-green-600"
            >
              Find Jobs
            </Link>
            <Link
              to="/interests"
              className="text-green-700 hover:text-green-900 transition-colors pb-2 border-b-2 border-transparent hover:border-green-600"
            >
              My Interests
            </Link>
            <Link
              to="/articles"
              className="text-green-700 hover:text-green-900 transition-colors pb-2 border-b-2 border-transparent hover:border-green-600"
            >
              Article
            </Link>
            <Link
              to="/contact"
              className="text-green-700 hover:text-green-900 transition-colors pb-2 border-b-2 border-transparent hover:border-green-600"
            >
              Contact
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {!isAuthenticated ? (
              <Link
                to="/login"
                className="bg-green-800 text-white px-4 py-2 rounded-lg hover:bg-green-900 transition-colors"
              >
                Login
              </Link>
            ) : (
              <ProfileDropdown user={user} onLogout={logout} />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export function MyProfile() {
  const [activeNav, setActiveNav] = useState('users');
  const [activeView, setActiveView] = useState('profile');
  const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('user') || '{}'));

  // Refresh user data when component mounts or when storage changes
  useEffect(() => {
    const updateUserData = () => {
      const updatedData = JSON.parse(localStorage.getItem('user') || '{}');
      setUserData(updatedData);
      console.log('MyProfile - Updated userData:', updatedData);
      console.log('Applied Jobs:', updatedData?.appliedJobs?.length || 0);
      console.log('Bookmarked Jobs:', updatedData?.bookmarkedJobs?.length || 0);
      console.log('Viewed Jobs:', updatedData?.viewedJobs?.length || 0);
    };

    // Initial load
    updateUserData();

    // Listen for storage changes
    const handleStorageChange = (e) => {
      if (e.key === 'user') {
        console.log('Storage changed, updating userData');
        updateUserData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    role: '',
    industry: '',
    location: '',
    bio: '',
    experience: '',
    education: ''
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setEditForm({
        name: userData.name || '',
        role: userData.role || '',
        industry: userData.industry || '',
        location: userData.location || '',
        bio: userData.bio || '',
        experience: userData.experience || '',
        education: userData.education || ''
      });
    }
  }, []);

  const navItems = [
    { id: 'users', icon: Users, color: '#6366F1', active: true, view: 'profile' },
    { id: 'analytics', icon: BarChart3, color: '#9E9E9E', view: 'analytics' },
    { id: 'lightbulb', icon: Lightbulb, color: '#9E9E9E', view: 'smart-insights' }
  ];

  const skillTags = user?.skills || [];

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });

      if (response.ok) {
        const result = await response.json();
        const updatedUser = { ...user, ...editForm };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setIsEditing(false);
        console.log('Profile updated successfully');
      } else {
        const error = await response.json();
        console.error('Failed to update profile:', error.message);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleCancel = () => {
    setEditForm({
      name: user?.name || '',
      role: user?.role || '',
      industry: user?.industry || '',
      location: user?.location || '',
      bio: user?.bio || '',
      experience: user?.experience || '',
      education: user?.education || ''
    });
    setIsEditing(false);
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      const token = localStorage.getItem('token');
      const uploadResponse = await fetch(`${API_BASE_URL}/api/upload/image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image');
      }

      const uploadResult = await uploadResponse.json();

      // Update profile with new image URL
      const updateResponse = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ profileImage: uploadResult.imageUrl })
      });

      if (updateResponse.ok) {
        const updateResult = await updateResponse.json();
        setUser(updateResult.user);
        localStorage.setItem('user', JSON.stringify(updateResult.user));
        alert('Profile picture updated successfully!');
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.'
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/auth/account/${user?.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        alert('Account deleted successfully');
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = '/';
      } else {
        const error = await response.json();
        alert(`Failed to delete account: ${error.message}`);
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      alert('Network error. Please try again.');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-[#F5F5F5] flex">
        {/* Left Sidebar Navigation */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-20 bg-white flex flex-col items-center py-6 gap-4 shadow-sm"
        >
          {/* Logo */}
          <div className="w-10 h-10 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center mb-4">
            <div className="w-4 h-4 bg-gray-900 rounded-sm"></div>
          </div>

          {/* Nav Items */}
          {navItems.map((item, index) => (
            <motion.button
              key={item.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => {
                setActiveNav(item.id);
                if (item.view) {
                  setActiveView(item.view);
                }
              }}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                (item.active || (item.view && item.view === activeView))
                  ? 'bg-[#6366F1] shadow-lg shadow-indigo-500/30'
                  : 'hover:bg-gray-100'
              }`}
            >
              <item.icon
                className={`w-5 h-5 ${(item.active || (item.view && item.view === activeView)) ? 'text-white' : 'text-gray-600'}`}
              />
            </motion.button>
          ))}
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-[1200px] mx-auto">
            {/* Top Bar */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="flex items-center justify-between mb-6"
            >
              <div className="flex items-center gap-2 text-gray-600">
                <span className="text-sm">Job Seeker Profile</span>
              </div>
            </motion.div>

            {/* Profile Card */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl shadow-sm overflow-hidden"
            >
              <div className="flex gap-6 p-8">
                {/* Main Content Area */}
                <div className="flex-1 min-w-0">
                  {/* Header Banner with Profile Photo */}
                  <div className="relative mb-20">
                    {/* Blue Geometric Banner */}
                    <div className="h-[180px] bg-gradient-to-r from-[#1E40AF] via-[#3B82F6] to-[#60A5FA] rounded-2xl overflow-hidden relative">
                      {/* Geometric Pattern Overlay */}
                      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 180" preserveAspectRatio="none">
                        <defs>
                          <pattern id="geometric" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                            <path d="M 50 0 L 100 50 L 50 100 L 0 50 Z" fill="rgba(0,0,0,0.1)" stroke="rgba(0,0,0,0.2)" strokeWidth="2"/>
                          </pattern>
                        </defs>
                        <rect width="600" height="180" fill="url(#geometric)" opacity="0.3"/>
                        {/* Additional geometric shapes for visual interest */}
                        <polygon points="0,0 150,0 0,150" fill="rgba(30,64,175,0.3)" />
                        <polygon points="600,0 450,180 600,180" fill="rgba(96,165,250,0.3)" />
                        <line x1="100" y1="0" x2="300" y2="180" stroke="rgba(0,0,0,0.15)" strokeWidth="3" />
                        <line x1="300" y1="0" x2="500" y2="180" stroke="rgba(0,0,0,0.15)" strokeWidth="3" />
                        <circle cx="200" cy="90" r="80" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                      </svg>
                    </div>

                    {/* Profile Photo */}
                    <div className="absolute left-0 -bottom-16">
                      <div className="relative">
                        <Avatar className="w-32 h-32 border-8 border-white shadow-xl">
                          <AvatarImage src={user?.profileImage || undefined} />
                          <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        {/* Upload Button */}
                        <button
                          onClick={() => document.getElementById('profile-image-upload').click()}
                          className="absolute bottom-0 right-0 bg-[#6366F1] hover:bg-[#5558E3] text-white p-2 rounded-full shadow-lg"
                          title="Change Profile Picture"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        {/* Hidden File Input */}
                        <input
                          id="profile-image-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </div>
                    </div>

                    {/* Send Message Button */}
                    <div className="absolute right-0 -bottom-12">
                      <Button className="bg-[#6366F1] hover:bg-[#5558E3] text-white px-6 py-2.5 rounded-lg shadow-lg shadow-indigo-500/30">
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </Button>
                    </div>
                  </div>

                  {/* Profile Info */}
                  <div className="mb-8">
                    {isEditing ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 mb-2">
                          <input
                            type="text"
                            value={editForm.name}
                            onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                            className="text-[28px] tracking-tight border-b-2 border-gray-300 focus:border-blue-500 outline-none bg-transparent"
                            placeholder="Your name"
                          />
                          <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancel}
                            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input
                            type="text"
                            value={editForm.role}
                            onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                            placeholder="Your role"
                          />
                          <input
                            type="text"
                            value={editForm.industry}
                            onChange={(e) => setEditForm({...editForm, industry: e.target.value})}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                            placeholder="Industry"
                          />
                          <input
                            type="text"
                            value={editForm.location}
                            onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                            placeholder="Location"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-[28px] tracking-tight">{user?.name || 'User'}</h1>
                        <button
                          onClick={handleEditClick}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Edit Profile"
                        >
                          <Pencil className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>
                    )}
                    <p className="text-gray-600 text-[15px] mb-1">{user?.role || 'Job Seeker'} · {user?.industry || 'Technology'}</p>
                    <p className="text-gray-500 text-[14px] mb-4">{user?.location || 'Location not specified'}</p>

                    {/* Skill Tags */}
                    <div className="flex flex-wrap gap-2">
                      {skillTags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1 rounded-md border-0"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Content Area - Switches between Profile and Analytics */}
                  <AnimatePresence mode="wait">
                    {activeView === 'profile' ? (
                      <motion.div
                        key="profile"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        {/* About Me Section */}
                        <div>
                          <h2 className="text-[18px] mb-4">About Me</h2>
                          {isEditing ? (
                            <div className="space-y-4">
                              <textarea
                                value={editForm.bio}
                                onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none resize-vertical"
                                placeholder="Tell us about yourself..."
                                rows={3}
                              />
                              <textarea
                                value={editForm.experience}
                                onChange={(e) => setEditForm({...editForm, experience: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none resize-vertical"
                                placeholder="Your experience..."
                                rows={2}
                              />
                              <textarea
                                value={editForm.education}
                                onChange={(e) => setEditForm({...editForm, education: e.target.value})}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none resize-vertical"
                                placeholder="Your education..."
                                rows={2}
                              />
                            </div>
                          ) : (
                            <div className="text-gray-700 text-[15px] leading-relaxed space-y-4">
                              {user?.bio || user?.experience || user?.education ? (
                                <>
                                  {user?.bio && <p>{user.bio}</p>}
                                  {user?.experience && <p>{user.experience}</p>}
                                  {user?.education && <p>{user.education}</p>}
                                  <button className="text-gray-600 hover:text-gray-900 text-[14px] mt-2">
                                    Read More ...
                                  </button>
                                </>
                              ) : (
                                <p className="text-gray-500 italic">No information added yet. Click the edit button to add your bio.</p>
                              )}
                            </div>
                          )}

                          {/* Activity Summary */}
                          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                            <h3 className="text-sm font-semibold mb-3 text-blue-900">Activity Summary</h3>
                            <div className="grid grid-cols-3 gap-4 text-center">
                              <div className="bg-white p-3 rounded-lg shadow-sm">
                                <div className="text-2xl font-bold text-blue-600">{userData?.appliedJobs?.length || 0}</div>
                                <div className="text-xs text-gray-600">Jobs Applied</div>
                                <div className="text-xs text-gray-400 mt-1">Apply Now clicks</div>
                              </div>
                              <div className="bg-white p-3 rounded-lg shadow-sm">
                                <div className="text-2xl font-bold text-green-600">{userData?.bookmarkedJobs?.length || 0}</div>
                                <div className="text-xs text-gray-600">Jobs Bookmarked</div>
                                <div className="text-xs text-gray-400 mt-1">Bookmark actions</div>
                              </div>
                              <div className="bg-white p-3 rounded-lg shadow-sm">
                                <div className="text-2xl font-bold text-purple-600">{userData?.viewedJobs?.length || 0}</div>
                                <div className="text-xs text-gray-600">Jobs Viewed</div>
                                <div className="text-xs text-gray-400 mt-1">View Details clicks</div>
                              </div>
                            </div>
                            <div className="mt-3 text-xs text-gray-500 text-center">
                              Data from user interactions • Rings update in real-time
                            </div>
                          </div>

                          {/* Delete Account Button */}
                          <div className="mt-8 pt-6 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="text-[16px] text-gray-900 mb-1">Delete Account</h3>
                                <p className="text-[14px] text-gray-600">Permanently delete your account and all associated data</p>
                              </div>
                              <Button
                                onClick={handleDeleteAccount}
                                variant="destructive"
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete Account
                              </Button>
                            </div>
                          </div>
                        </div>

                      </motion.div>
                    ) : activeView === 'analytics' ? (
                      <motion.div
                        key="analytics"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ApplicationAnalytics userData={userData} />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="smart-insights"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <SmartInsights />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Right Sidebar */}
                <div className="w-[280px] space-y-6">
                  {/* Location */}
                  <div>
                    <h3 className="text-[15px] text-gray-900 mb-3">Location</h3>
                    <div className="flex items-center gap-2 text-gray-700 text-[14px]">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span>{user?.location || 'Location not specified'}</span>
                    </div>
                  </div>

                  {/* Connect */}
                  <div>
                    <h3 className="text-[15px] text-gray-900 mb-3">Connect</h3>
                    <div className="space-y-2.5">
                      {user?.portfolio && (
                        <a href={user.portfolio} className="flex items-center gap-2 text-gray-700 text-[14px] hover:text-[#6366F1] group">
                          <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-[#6366F1]" />
                          <span>Portfolio</span>
                        </a>
                      )}
                      {user?.linkedin && (
                        <a href={user.linkedin} className="flex items-center gap-2 text-gray-700 text-[14px] hover:text-[#6366F1] group">
                          <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-[#6366F1]" />
                          <span>LinkedIn</span>
                        </a>
                      )}
                      {user?.github && (
                        <a href={user.github} className="flex items-center gap-2 text-gray-700 text-[14px] hover:text-[#6366F1] group">
                          <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-[#6366F1]" />
                          <span>GitHub</span>
                        </a>
                      )}
                      {!user?.portfolio && !user?.linkedin && !user?.github && (
                        <p className="text-gray-500 text-[14px]">No social links added yet</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};