import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { User, LogOut, Settings, Briefcase, FileText, Heart } from 'lucide-react';
import { Search, SlidersHorizontal, Mail, Bell, ArrowLeft } from "lucide-react";
import { Input } from "./ui/input";
import { JobCard } from "./JobCard";
import { JobDetailPanel } from "./JobDetailPanel";
import { JobListItem } from "./JobListItem";
import { JobsGridView } from "./JobsGridView";
import { UserStatsPanel } from "./UserStatsPanel";
import { Button } from "./ui/button";
import { fetchJobs, searchJobs } from "./client";
import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';
import ProfileDropdown from "./ProfileDropdown";

// Navbar Component (same as Dashboard)
const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

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
              className="text-green-700 hover:text-green-900 transition-colors pb-2 border-b-2 border-green-600"
            >
              My Interests
            </Link>
            <Link
              to="/discussions"
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

export function MyInterestsPage() {
  const [activeJobId, setActiveJobId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  // Fetch jobs and user data on component mount
  useEffect(() => {
    const loadJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedJobs = await fetchJobs();
        setJobs(fetchedJobs);

        // Filter to only show bookmarked jobs from user data
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          const bookmarkedJobIds = userData.bookmarkedJobs?.map(bookmark => bookmark.job_id) || [];
          const bookmarkedJobs = fetchedJobs.filter(job => bookmarkedJobIds.includes(job._id));
          setFilteredJobs(bookmarkedJobs);
        } else {
          setFilteredJobs([]);
        }
      } catch (err) {
        setError('Failed to load jobs. Please try again later.');
        console.error('Error loading jobs:', err);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();

    // Listen for storage changes to update bookmarks
    const handleStorageChange = (e) => {
      if (e.key === 'user') {
        const newUser = e.newValue ? JSON.parse(e.newValue) : null;
        setUser(newUser);

        // Update filtered jobs when user data changes
        if (newUser && jobs.length > 0) {
          const bookmarkedJobIds = newUser.bookmarkedJobs?.map(bookmark => bookmark.job_id) || [];
          const bookmarkedJobs = jobs.filter(job => bookmarkedJobIds.includes(job._id));
          setFilteredJobs(bookmarkedJobs);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Handle search functionality within bookmarked jobs
  useEffect(() => {
    if (!user || jobs.length === 0) return;

    const performSearch = async () => {
      const bookmarkedJobIds = user.bookmarkedJobs?.map(bookmark => bookmark.job_id) || [];

      if (searchQuery.trim()) {
        try {
          const searchResults = await searchJobs(searchQuery.trim());
          // Filter search results to only include bookmarked jobs
          const bookmarkedSearchResults = searchResults.filter(job => bookmarkedJobIds.includes(job._id));
          setFilteredJobs(bookmarkedSearchResults);
        } catch (err) {
          console.error('Error searching jobs:', err);
          // Fallback to client-side filtering within bookmarked jobs
          const bookmarkedJobs = jobs.filter(job => bookmarkedJobIds.includes(job._id));
          const clientFiltered = bookmarkedJobs.filter(
            (job) =>
              job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              job.company_id?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              (typeof job.location === 'object' ? job.location.address : job.location)?.toLowerCase().includes(searchQuery.toLowerCase())
          );
          setFilteredJobs(clientFiltered);
        }
      } else {
        // Show all bookmarked jobs when no search query
        const bookmarkedJobs = jobs.filter(job => bookmarkedJobIds.includes(job._id));
        setFilteredJobs(bookmarkedJobs);
      }
    };

    performSearch();
  }, [searchQuery, jobs, user]);

  // Determine if showing search results or bookmarked jobs
  const isSearching = searchQuery.trim().length > 0;

  // Get active job if one is selected
  const activeJob = activeJobId ? jobs.find((job) => job._id === activeJobId) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto p-6 pt-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            My Interests
            <span className="ml-2">❤️</span>
          </h1>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Mail className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="w-full">

          <div className="grid grid-cols-12 gap-8">
            {/* Left Sidebar - Bookmarked Job List */}
            <div className="col-span-4 space-y-4">
              <div className="bg-gray-100 text-gray-900 rounded-2xl px-6 py-4 flex items-center justify-between border border-gray-200">
                <span className="font-medium">{isSearching ? "Search Result" : "Bookmarked Jobs"}</span>
                <span className="text-sm text-gray-600">
                  {filteredJobs.length} {filteredJobs.length === 1 ? "Job" : "Jobs"} {isSearching ? "Found" : "Saved"}
                </span>
              </div>

              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search bookmarked jobs..."
                  className="pl-12 pr-12 h-12 rounded-full border-gray-300"
                />
                <button className="absolute right-4 top-1/2 -translate-y-1/2 hover:bg-gray-100 rounded p-1">
                  <SlidersHorizontal className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
                {loading ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>Loading your interests...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-8 text-red-500">
                    <p>{error}</p>
                  </div>
                ) : filteredJobs.length > 0 ? (
                  filteredJobs.map((job) => (
                    <JobListItem
                      key={job._id}
                      companyName={job.company_id?.name || 'Unknown Company'}
                      position={job.title}
                      location={`${typeof job.location === 'object' ? job.location.address : job.location} - ${job.work_location}`}
                      salary={job.salary ? `${job.salary.replace('$', '₹')}/month` : 'Salary not specified'}
                      jobType={job.job_type}
                      level={job.experience_level}
                      requirements={job.requirements}
                      paymentInfo=""
                      timeAgo={new Date(job.createdAt).toLocaleDateString()}
                      logo={
                        <img
                          src={job.company_id?.logo || "https://images.unsplash.com/photo-1637489981573-e45e9297cb21?w=100&h=100&fit=crop"}
                          alt={job.company_id?.name || 'Company'}
                          className="w-full h-full object-cover rounded-full"
                          onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1637489981573-e45e9297cb21?w=100&h=100&fit=crop";
                          }}
                        />
                      }
                      logoColor="#4DB8FF"
                      onClick={() => setActiveJobId(job._id)}
                      jobId={job._id}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Heart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium mb-2">No bookmarked jobs yet</p>
                    <p className="text-sm">Start bookmarking jobs you're interested in from the Find Jobs page.</p>
                    <Link
                      to="/jobs"
                      className="inline-block mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Browse Jobs
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Center - Job Details or Grid View */}
            <div className="col-span-5">
              {activeJob ? (
                <div className="relative">
                  <Button
                    variant="ghost"
                    onClick={() => setActiveJobId(null)}
                    className="absolute -top-14 left-0 z-10 gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to all interests
                  </Button>
                  <JobDetailPanel
                    companyName={activeJob.company_id?.name || 'Unknown Company'}
                    position={activeJob.title}
                    location={`${activeJob.location} - ${activeJob.work_location}`}
                    salary={activeJob.salary ? `${activeJob.salary.replace('$', '₹')}/month` : 'Salary not specified'}
                    jobType={activeJob.job_type}
                    applicants="0 /0"
                    skillLevel={activeJob.experience_level}
                    logoColor="#4DB8FF"
                    logo={
                      <span className="text-white text-xl">
                        {(activeJob.company_id?.name || 'C').charAt(0).toUpperCase()}
                      </span>
                    }
                    description={activeJob.description}
                    requirements={activeJob.requirements}
                    onClose={() => setActiveJobId(null)}
                  />
                </div>
              ) : (
                <JobsGridView
                  jobs={filteredJobs}
                  onJobClick={(jobId) => setActiveJobId(jobId)}
                />
              )}
            </div>

            {/* Right Sidebar - User Stats */}
            <div className="col-span-3">
              <UserStatsPanel
                userName={user?.name || "User"}
                userRole={user?.title || "Job Seeker"}
                userLocation={user?.location || "Location not set"}
                profileImage={user?.profileImage}
                user={user}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}