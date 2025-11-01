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
  Trash2,
  Twitter,
  Linkedin,
  Code,
  Target,
  Plus,
  X,
  Check,
  FileText
} from 'lucide-react';
import { Button } from "./button";
import { Badge } from "./badge";
import { Avatar, AvatarImage, AvatarFallback } from "./avatar";
import { ApplicationAnalytics } from '../ApplicationAnalytics';
import { SmartInsights } from '../SmartInsights';
import { JobDetailPanel } from '../JobDetailPanel';
import ProfileDropdown from '../ProfileDropdown';
import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';
import Spline from '@splinetool/react-spline';

import { API_BASE_URL } from '../client';

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
              Discussion
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
  const [selectedJob, setSelectedJob] = useState(null);

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
  const [showSkillsModal, setShowSkillsModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    role: '',
    industry: '',
    location: '',
    bio: '',
    experience: '',
    education: '',
    twitter: '',
    linkedin: '',
    dribbble: '',
    leetcode: '',
    codeforces: '',
    skills: []
  });

  // Popular skills list with logos - Backend Developer focused
  const popularSkills = [
    // Backend Programming Languages
    { name: 'Node.js', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
    { name: 'Python', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
    { name: 'Java', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
    { name: 'Go', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg' },
    { name: 'PHP', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg' },
    { name: 'Ruby', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ruby/ruby-original.svg' },
    { name: 'C#', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg' },
    { name: 'Rust', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-plain.svg' },

    // Backend Frameworks
    { name: 'Express.js', logo: 'https://img.icons8.com/?size=100&id=kg46nzojXaV9&format=png&color=000000' },
    { name: 'Django', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg' },
    { name: 'Flask', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg' },
    { name: 'Spring Boot', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg' },
    { name: 'FastAPI', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg' },
    { name: 'Laravel', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-plain.svg' },
    { name: 'Ruby on Rails', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rails/rails-original-wordmark.svg' },
    { name: '.NET Core', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dotnetcore/dotnetcore-original.svg' },

    // Databases
    { name: 'MongoDB', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
    { name: 'PostgreSQL', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
    { name: 'MySQL', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
    { name: 'Redis', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg' },
    { name: 'Elasticsearch', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/elasticsearch/elasticsearch-original.svg' },
    { name: 'Cassandra', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cassandra/cassandra-original.svg' },

    // Cloud & Infrastructure
    { name: 'AWS', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg' },
    { name: 'Docker', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
    { name: 'Kubernetes', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg' },
    { name: 'Terraform', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/terraform/terraform-original.svg' },
    { name: 'Google Cloud', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg' },
    { name: 'Azure', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg' },

    // DevOps & Tools
    { name: 'Git', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
    { name: 'Jenkins', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jenkins/jenkins-original.svg' },
    { name: 'GitLab CI', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gitlab/gitlab-original.svg' },
    { name: 'Linux', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg' },
    { name: 'Nginx', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nginx/nginx-original.svg' },
    { name: 'Apache', logo: 'https://img.icons8.com/?size=100&id=108783&format=png&color=000000' },

    // APIs & Protocols
    { name: 'REST APIs', logo: 'https://img.icons8.com/?size=100&id=108782&format=png&color=000000' },
    { name: 'GraphQL', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg' },
    { name: 'WebSockets', logo: 'https://img.icons8.com/?size=100&id=108781&format=png&color=000000' },
    { name: 'OAuth', logo: 'https://img.icons8.com/?size=100&id=108780&format=png&color=000000' },
    { name: 'JWT', logo: 'https://img.icons8.com/?size=100&id=108779&format=png&color=000000' },

    // Security & Best Practices
    { name: 'OWASP', logo: 'https://img.icons8.com/?size=100&id=108778&format=png&color=000000' },
    { name: 'SSL/TLS', logo: 'https://img.icons8.com/?size=100&id=108777&format=png&color=000000' },
    { name: 'Unit Testing', logo: 'https://img.icons8.com/?size=100&id=108776&format=png&color=000000' },
    { name: 'TDD', logo: 'https://img.icons8.com/?size=100&id=108775&format=png&color=000000' },
    { name: 'Microservices', logo: 'https://img.icons8.com/?size=100&id=108774&format=png&color=000000' },
    { name: 'Serverless', logo: 'https://img.icons8.com/?size=100&id=108773&format=png&color=000000' },

    // Monitoring & Logging
    { name: 'Prometheus', logo: 'https://img.icons8.com/?size=100&id=108772&format=png&color=000000' },
    { name: 'Grafana', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/grafana/grafana-original.svg' },
    { name: 'ELK Stack', logo: 'https://img.icons8.com/?size=100&id=108771&format=png&color=000000' },
    { name: 'DataDog', logo: 'https://img.icons8.com/?size=100&id=108770&format=png&color=000000' },

    // Additional Backend Skills
    { name: 'Message Queues', logo: 'https://img.icons8.com/?size=100&id=108769&format=png&color=000000' },
    { name: 'RabbitMQ', logo: 'https://img.icons8.com/?size=100&id=108768&format=png&color=000000' },
    { name: 'Kafka', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apachekafka/apachekafka-original.svg' },
    { name: 'Load Balancing', logo: 'https://img.icons8.com/?size=100&id=108767&format=png&color=000000' },
    { name: 'Caching', logo: 'https://img.icons8.com/?size=100&id=108766&format=png&color=000000' },
    { name: 'Database Design', logo: 'https://img.icons8.com/?size=100&id=108765&format=png&color=000000' },

    // Methodologies & Soft Skills
    { name: 'Agile', logo: 'https://img.icons8.com/?size=100&id=108795&format=png&color=000000' },
    { name: 'Scrum', logo: 'https://img.icons8.com/?size=100&id=108794&format=png&color=000000' },
    { name: 'CI/CD', logo: 'https://img.icons8.com/?size=100&id=108793&format=png&color=000000' },
    { name: 'Code Review', logo: 'https://img.icons8.com/?size=100&id=108764&format=png&color=000000' },
    { name: 'Documentation', logo: 'https://img.icons8.com/?size=100&id=108763&format=png&color=000000' },
    { name: 'Problem Solving', logo: 'https://img.icons8.com/?size=100&id=108762&format=png&color=000000' }
  ];

  // Generate avatar URL if no profile image
  const getAvatarUrl = () => {
    if (user?.profileImage) {
      return user.profileImage;
    }
    if (user?.name) {
      return createAvatar(lorelei, {
        seed: user.name,
        size: 128,
        backgroundColor: ['b6e3f4', 'c0aede', 'd1d4f9', 'ffd5dc', 'ffdfbf'],
      }).toDataUri();
    }
    return null;
  };

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
        education: userData.education || '',
        twitter: userData.twitter || '',
        linkedin: userData.linkedin || '',
        dribbble: userData.dribbble || '',
        leetcode: userData.leetcode || '',
        codeforces: userData.codeforces || '',
        skills: userData.skills || []
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
      education: user?.education || '',
      twitter: user?.twitter || '',
      linkedin: user?.linkedin || '',
      dribbble: user?.dribbble || '',
      leetcode: user?.leetcode || '',
      codeforces: user?.codeforces || '',
      skills: user?.skills || []
    });
    setIsEditing(false);
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

  // Handle skill selection from modal
  const handleSkillSelect = (skill) => {
    if (!editForm.skills.includes(skill.name)) {
      setEditForm({
        ...editForm,
        skills: [...editForm.skills, skill.name]
      });
    }
  };

  // Handle skill removal
  const handleSkillRemove = (skillToRemove) => {
    setEditForm({
      ...editForm,
      skills: editForm.skills.filter(skill => skill !== skillToRemove)
    });
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
                    {/* Spline Background */}
                    <div className="h-[180px] bg-white rounded-2xl overflow-hidden relative">
                      <Spline
                        scene="https://prod.spline.design/SpFXWe4vrbCD8-4z/scene.splinecode"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transform: 'scale(2.2)',
                          transformOrigin: 'center'
                        }}
                      />
                    </div>

                    {/* Profile Photo */}
                    <div className="absolute left-0 -bottom-16">
                      <div className="relative">
                        <Avatar className="w-32 h-32 border-8 border-white shadow-xl">
                          <AvatarImage src={getAvatarUrl()} />
                          <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold">
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                      </div>
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

                        {/* Social Media Links */}
                        <div className="mt-6">
                          <h4 className="text-sm font-medium text-gray-700 mb-3">Social Media Links</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                              type="url"
                              value={editForm.twitter}
                              onChange={(e) => setEditForm({...editForm, twitter: e.target.value})}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                              placeholder="Twitter URL"
                            />
                            <input
                              type="url"
                              value={editForm.linkedin}
                              onChange={(e) => setEditForm({...editForm, linkedin: e.target.value})}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                              placeholder="LinkedIn URL"
                            />
                            <input
                              type="url"
                              value={editForm.dribbble}
                              onChange={(e) => setEditForm({...editForm, dribbble: e.target.value})}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                              placeholder="Dribbble URL"
                            />
                            <input
                              type="url"
                              value={editForm.leetcode}
                              onChange={(e) => setEditForm({...editForm, leetcode: e.target.value})}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                              placeholder="LeetCode URL"
                            />
                            <input
                              type="url"
                              value={editForm.codeforces}
                              onChange={(e) => setEditForm({...editForm, codeforces: e.target.value})}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                              placeholder="Codeforces URL"
                            />
                          </div>
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
                    {selectedJob ? (
                      <motion.div
                        key="job-detail"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="relative">
                          <button
                            onClick={() => setSelectedJob(null)}
                            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
                          >
                            <X className="w-5 h-5 text-gray-500" />
                          </button>
                          <JobDetailPanel
                            companyName={selectedJob.company_id?.name || 'Unknown Company'}
                            position={selectedJob.title}
                            location={`${typeof selectedJob.location === 'object' ? selectedJob.location.address : selectedJob.location} - ${selectedJob.work_location}`}
                            salary={selectedJob.salary ? `${selectedJob.salary.replace('$', '₹')}/month` : 'Salary not specified'}
                            jobType={selectedJob.job_type}
                            applicants="0 /0"
                            skillLevel={selectedJob.experience_level}
                            logoColor="#4DB8FF"
                            logo={
                              <img
                                src={selectedJob.company_id?.logo || "https://images.unsplash.com/photo-1637489981573-e45e9297cb21?w=100&h=100&fit=crop"}
                                alt={selectedJob.company_id?.name || 'Company'}
                                className="w-full h-full object-cover rounded-full"
                                onError={(e) => {
                                  e.target.src = "https://images.unsplash.com/photo-1637489981573-e45e9297cb21?w=100&h=100&fit=crop";
                                }}
                              />
                            }
                            description={selectedJob.description}
                            requirements={selectedJob.requirements}
                            jobId={selectedJob._id}
                            applicationLink={selectedJob.application_link}
                          />
                        </div>
                      </motion.div>
                    ) : activeView === 'profile' ? (
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

                              {/* Skills Input */}
                              <div className="mt-6">
                                <h4 className="text-sm font-medium text-gray-700 mb-3">Skills</h4>
                                <div className="flex gap-2 mb-3">
                                  <textarea
                                    value={editForm.skills.join(', ')}
                                    onChange={(e) => setEditForm({...editForm, skills: e.target.value.split(',').map(skill => skill.trim()).filter(skill => skill)})}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:border-blue-500 outline-none resize-vertical"
                                    placeholder="Enter skills separated by commas (e.g., JavaScript, React, Node.js)"
                                    rows={2}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => setShowSkillsModal(true)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                                  >
                                    <Plus className="w-4 h-4" />
                                    Add
                                  </button>
                                </div>
                                <p className="text-xs text-gray-500">Separate skills with commas or use the Add button to select from popular skills.</p>
                              </div>
                            </div>
                          ) : (
                            <div className="text-gray-700 text-[15px] leading-relaxed space-y-4">
                              {user?.bio || user?.experience || user?.education ? (
                                <>
                                  {user?.bio && <p>{user.bio}</p>}
                                  {user?.experience && <p>{user.experience}</p>}
                                  {user?.education && <p>{user.education}</p>}
                                </>
                              ) : (
                                <p className="text-gray-500 italic">No information added yet. Click the edit button to add your bio.</p>
                              )}
                            </div>
                          )}

                          {/* Skills Section */}
                          <div className="mt-6">
                            <h3 className="text-[18px] mb-4 font-semibold text-gray-800" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif' }}>Skills</h3>
                            {user?.skills && user.skills.length > 0 ? (
                              <div className="relative overflow-hidden bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200">
                                <div className="flex animate-marquee whitespace-nowrap gap-6">
                                  {[...user.skills, ...user.skills, ...user.skills].map((skill, index) => {
                                    const skillData = popularSkills.find(s => s.name === skill);
                                    return (
                                      <div
                                        key={`${skill}-${index}`}
                                        className="inline-flex items-center justify-center bg-white w-16 h-16 rounded-full border border-gray-200 shadow-sm flex-shrink-0 hover:scale-105 transition-transform duration-200"
                                        title={skill}
                                      >
                                        <img
                                          src={skillData?.logo || 'https://img.icons8.com/?size=100&id=108784&format=png&color=000000'}
                                          alt={skill}
                                          className="w-8 h-8 object-contain"
                                          onError={(e) => {
                                            e.target.src = 'https://img.icons8.com/?size=100&id=108784&format=png&color=000000';
                                          }}
                                        />
                                      </div>
                                    );
                                  })}
                                </div>
                                <style jsx>{`
                                  @keyframes marquee {
                                    0% { transform: translateX(0); }
                                    100% { transform: translateX(-50%); }
                                  }
                                  .animate-marquee {
                                    animation: marquee 25s linear infinite;
                                  }
                                `}</style>
                              </div>
                            ) : (
                              <p className="text-gray-500 italic text-[15px]" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif' }}>No skills added yet. Click the edit button to add your skills.</p>
                            )}
                          </div>

                          {/* Activity Summary */}
                          <div className="mt-8 relative">
                            {/* Background Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-purple-50 via-blue-50 to-transparent rounded-3xl"></div>

                            <div className="relative bg-white rounded-3xl shadow-lg border border-gray-100/50 p-8">
                              {/* Header */}
                              <div className="text-center mb-8">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Activity Summary</h3>
                                <p className="text-gray-600 text-sm">Your job search journey at a glance</p>
                              </div>

                              {/* Activity Rows */}
                              <div className="space-y-4">
                                {/* Jobs Applied Row */}
                                <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-2xl hover:border-gray-300 transition-colors duration-200 shadow-sm">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                      <Send className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div className="flex-1">
                                      <div className="font-medium text-gray-900">Jobs Applied</div>
                                      <div className="text-sm text-gray-500">Applications submitted</div>
                                    </div>
                                    <div className="text-gray-400">
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                      </svg>
                                    </div>
                                  </div>
                                  <div className="text-2xl font-bold text-gray-900 ml-4">
                                    {userData?.appliedJobs?.length || 0}
                                  </div>
                                </div>

                                {/* Jobs Saved Row */}
                                <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-2xl hover:border-gray-300 transition-colors duration-200 shadow-sm">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                      <Target className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div className="flex-1">
                                      <div className="font-medium text-gray-900">Jobs Saved</div>
                                      <div className="text-sm text-gray-500">Bookmarks for later</div>
                                    </div>
                                    <div className="text-gray-400">
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                      </svg>
                                    </div>
                                  </div>
                                  <div className="text-2xl font-bold text-gray-900 ml-4">
                                    {userData?.bookmarkedJobs?.length || 0}
                                  </div>
                                </div>

                                {/* Jobs Viewed Row */}
                                <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-2xl hover:border-gray-300 transition-colors duration-200 shadow-sm">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                      <BarChart3 className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div className="flex-1">
                                      <div className="font-medium text-gray-900">Jobs Viewed</div>
                                      <div className="text-sm text-gray-500">Detailed explorations</div>
                                    </div>
                                    <div className="text-gray-400">
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                      </svg>
                                    </div>
                                  </div>
                                  <div className="text-2xl font-bold text-gray-900 ml-4">
                                    {userData?.viewedJobs?.length || 0}
                                  </div>
                                </div>

                                {/* My Posts Row */}
                                <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-2xl hover:border-gray-300 transition-colors duration-200 shadow-sm">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                      <FileText className="w-5 h-5 text-orange-600" />
                                    </div>
                                    <div className="flex-1">
                                      <div className="font-medium text-gray-900">My Posts</div>
                                      <div className="text-sm text-gray-500">Community contributions</div>
                                    </div>
                                    <div className="text-gray-400">
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                      </svg>
                                    </div>
                                  </div>
                                  <div className="text-2xl font-bold text-gray-900 ml-4">
                                    <Link
                                      to="/discussions"
                                      className="text-orange-600 hover:text-orange-700 transition-colors"
                                    >
                                      View
                                    </Link>
                                  </div>
                                </div>
                              </div>


                              {/* Footer */}
                              <div className="mt-6 text-center">
                                <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
                                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                  Live data from your interactions • Updates automatically
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Account Management Section */}
                          <div className="mt-12 pt-8 border-t border-gray-100">
                            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200/50">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h3 className="text-lg font-semibold text-gray-900 mb-2 tracking-tight">Account Management</h3>
                                  <p className="text-sm text-gray-600 leading-relaxed max-w-md">
                                    If you need to permanently remove your account and all associated data, you can do so here.
                                    This action cannot be undone.
                                  </p>
                                </div>
                                <div className="ml-8">
                                  <Button
                                    onClick={handleDeleteAccount}
                                    className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-6 py-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-2 font-medium"
                                  >
                                    <Trash2 className="w-4 h-4 text-gray-500" />
                                    Delete Account
                                  </Button>
                                </div>
                              </div>
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
                        <SmartInsights onJobClick={(job) => {
                          // Open job details in the same view, similar to Find Jobs section
                          setSelectedJob(job);
                        }} />
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
                    <h3 className="text-[15px] font-semibold text-gray-900 mb-4 tracking-tight">Connect</h3>
                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-100">
                      <div className="grid grid-cols-3 gap-4">
                        {user?.twitter && (
                          <a
                            href={user.twitter.startsWith('http') ? user.twitter : `https://${user.twitter}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="aspect-square flex items-center justify-center p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200 group"
                            title="Twitter"
                          >
                            <img
                              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/twitter/twitter-original.svg"
                              alt="Twitter"
                              className="w-10 h-10 opacity-70 group-hover:opacity-100 transition-opacity"
                            />
                          </a>
                        )}
                        {user?.linkedin && (
                          <a
                            href={user.linkedin.startsWith('http') ? user.linkedin : `https://${user.linkedin}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="aspect-square flex items-center justify-center p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200 group"
                            title="LinkedIn"
                          >
                            <img
                              src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg"
                              alt="LinkedIn"
                              className="w-10 h-10 opacity-70 group-hover:opacity-100 transition-opacity"
                            />
                          </a>
                        )}
                        {user?.dribbble && (
                          <a
                            href={user.dribbble.startsWith('http') ? user.dribbble : `https://${user.dribbble}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="aspect-square flex items-center justify-center p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200 group"
                            title="Dribbble"
                          >
                            <img
                              src="/images/social/dribble.png"
                              alt="Dribbble"
                              className="w-10 h-10 opacity-70 group-hover:opacity-100 transition-opacity"
                            />
                          </a>
                        )}
                        {user?.leetcode && (
                          <a
                            href={user.leetcode.startsWith('http') ? user.leetcode : `https://${user.leetcode}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="aspect-square flex items-center justify-center p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200 group"
                            title="LeetCode"
                          >
                            <img
                              src="/images/social/leetcode.png"
                              alt="LeetCode"
                              className="w-10 h-10 opacity-70 group-hover:opacity-100 transition-opacity"
                            />
                          </a>
                        )}
                        {user?.codeforces && (
                          <a
                            href={user.codeforces.startsWith('http') ? user.codeforces : `https://${user.codeforces}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="aspect-square flex items-center justify-center p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200 group"
                            title="Codeforces"
                          >
                            <img
                              src="/images/social/codeforces.png"
                              alt="Codeforces"
                              className="w-10 h-10 opacity-70 group-hover:opacity-100 transition-opacity"
                            />
                          </a>
                        )}
                        {(!user?.twitter && !user?.linkedin && !user?.dribbble && !user?.leetcode && !user?.codeforces) && (
                          <div className="col-span-3 text-center py-8">
                            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                              <ExternalLink className="w-6 h-6 text-gray-400" />
                            </div>
                            <p className="text-sm text-gray-500 font-medium">No social links added yet</p>
                            <p className="text-xs text-gray-400 mt-1">Add your profiles to connect with others</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Skills Selection Modal */}
      {showSkillsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">Select Skills</h3>
                <button
                  onClick={() => setShowSkillsModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-1">Choose from popular skills or add your own</p>
            </div>

            <div className="p-6 overflow-y-auto max-h-96">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {popularSkills.map((skill) => {
                  const isSelected = editForm.skills.includes(skill.name);
                  return (
                    <button
                      key={skill.name}
                      onClick={() => isSelected ? handleSkillRemove(skill.name) : handleSkillSelect(skill)}
                      className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                        isSelected
                          ? 'bg-blue-50 border-blue-300 text-blue-700'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={skill.logo}
                          alt={skill.name}
                          className="w-6 h-6 object-contain"
                          onError={(e) => {
                            e.target.src = 'https://img.icons8.com/?size=100&id=108784&format=png&color=000000';
                          }}
                        />
                        <span className="text-sm font-medium">{skill.name}</span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {editForm.skills.length} skill{editForm.skills.length !== 1 ? 's' : ''} selected
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowSkillsModal(false)}
                    className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

