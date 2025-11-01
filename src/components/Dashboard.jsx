import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { User, LogOut, Settings, Briefcase, FileText, Heart, Folder, AlertTriangle } from 'lucide-react';
import { Search, SlidersHorizontal, Mail, Bell, ArrowLeft, X } from "lucide-react";
import { Input } from "./ui/input";
import { JobCard } from "./JobCard";
import { JobDetailPanel } from "./JobDetailPanel";
import { JobListItem } from "./JobListItem";
import { JobsGridView } from "./JobsGridView";
import { UserStatsPanel } from "./UserStatsPanel";
import { Button } from "./ui/button";
import { fetchJobs, searchJobs, API_BASE_URL } from "./client";
import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';
import ProfileDropdown from "./ProfileDropdown";

// Removed hardcoded jobs array - now fetching from API

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
              className="text-green-700 hover:text-green-900 transition-colors pb-2 border-b-2 border-transparent hover:border-green-600"
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

export function Dashboard() {
  const [activeJobId, setActiveJobId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [showExpiringJobs, setShowExpiringJobs] = useState(false);
  const [expiringJobsData, setExpiringJobsData] = useState({
    bookmarkedExpiringJobs: [],
    recommendedExpiringJobs: []
  });
  const [expiringJobsLoading, setExpiringJobsLoading] = useState(false);
  const mailButtonRef = useRef(null);
  const popupRef = useRef(null);

  // Fetch jobs and user data on component mount
  useEffect(() => {
    const loadJobs = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load user data from localStorage first
        const storedUser = localStorage.getItem('user');
        const userData = storedUser ? JSON.parse(storedUser) : null;
        setUser(userData);

        // Check if there's a jobId in the URL params and set it as active
        const urlParams = new URLSearchParams(window.location.search);
        const jobIdFromUrl = urlParams.get('jobId');
        if (jobIdFromUrl) {
          setActiveJobId(jobIdFromUrl);
        }

        // Fetch jobs with user's skills for personalized recommendations
        const userSkills = userData?.skills || [];
        const fetchedJobs = await fetchJobs(userSkills);
        setJobs(fetchedJobs);
        setFilteredJobs(fetchedJobs);
      } catch (err) {
        setError('Failed to load jobs. Please try again later.');
        console.error('Error loading jobs:', err);
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, []);

  // Function to fetch expiring jobs
  const fetchExpiringJobs = async () => {
    if (!user?.id) return;

    try {
      setExpiringJobsLoading(true);
      const storedUser = localStorage.getItem('user');
      if (!storedUser) return;

      const userData = JSON.parse(storedUser);
      const bookmarkedJobIds = userData.bookmarkedJobs?.map(bookmark => bookmark.job_id) || [];
      const response = await fetch(`${API_BASE_URL}/api/jobs/expiring/today/${user.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookmarkedJobIds })
      });

      if (!response.ok) {
        // If API fails, silently fail and don't show expiring jobs
        setExpiringJobsData({
          bookmarkedExpiringJobs: [],
          recommendedExpiringJobs: []
        });
        return;
      }

      const data = await response.json();

      if (data.success) {
        setExpiringJobsData({
          bookmarkedExpiringJobs: data.bookmarkedExpiringJobs || [],
          recommendedExpiringJobs: data.recommendedExpiringJobs || []
        });
      }
    } catch (error) {
      console.error('Error fetching expiring jobs:', error);
      // Silently fail and don't show expiring jobs
      setExpiringJobsData({
        bookmarkedExpiringJobs: [],
        recommendedExpiringJobs: []
      });
    } finally {
      setExpiringJobsLoading(false);
    }
  };

  // Load expiring jobs when user is available
  useEffect(() => {
    if (user?.id) {
      fetchExpiringJobs();
    }
  }, [user?.id]);

  // Handle click outside to close popup
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showExpiringJobs &&
        mailButtonRef.current &&
        popupRef.current &&
        !mailButtonRef.current.contains(event.target) &&
        !popupRef.current.contains(event.target)
      ) {
        setShowExpiringJobs(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showExpiringJobs]);

  // Handle search functionality
  useEffect(() => {
    const performSearch = async () => {
      if (searchQuery.trim()) {
        try {
          const searchResults = await searchJobs(searchQuery.trim());
          setFilteredJobs(searchResults);
        } catch (err) {
          console.error('Error searching jobs:', err);
          // Fallback to client-side filtering if API search fails
          const clientFiltered = jobs.filter(
            (job) =>
              job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              job.company_id?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              job.location?.toLowerCase().includes(searchQuery.toLowerCase())
          );
          setFilteredJobs(clientFiltered);
        }
      } else {
        setFilteredJobs(jobs);
      }
    };

    performSearch();
  }, [searchQuery, jobs]);

  // Determine if showing search results or recommended jobs
  const isSearching = searchQuery.trim().length > 0;

  // Get active job if one is selected
  const activeJob = activeJobId ? jobs.find((job) => job._id === activeJobId) : null;

  // Listen for job application events to refresh job data
  useEffect(() => {
    const handleJobApplied = (event) => {
      const { jobId, updatedApplicantsCount } = event.detail;
      if (updatedApplicantsCount !== undefined) {
        setJobs(prevJobs =>
          prevJobs.map(job =>
            job._id === jobId ? { ...job, applicantsCount: updatedApplicantsCount } : job
          )
        );
        setFilteredJobs(prevFilteredJobs =>
          prevFilteredJobs.map(job =>
            job._id === jobId ? { ...job, applicantsCount: updatedApplicantsCount } : job
          )
        );
        // Force re-render of active job if it's the one that was applied to
        if (activeJobId === jobId) {
          setActiveJobId(null);
          setTimeout(() => setActiveJobId(jobId), 0);
        }
      }
    };

    window.addEventListener('jobApplied', handleJobApplied);
    return () => window.removeEventListener('jobApplied', handleJobApplied);
  }, [activeJobId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto p-6 pt-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome Back, Let's Find Your Job!
            <span className="ml-2">🔥</span>
          </h1>
          <div className="flex items-center gap-4">
            {/* Mail Button */}
            <button
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Messages"
            >
              <Mail className="w-5 h-5 text-gray-600" />
            </button>
            {/* Expiring Jobs Alert Button - Bell Icon */}
            <div className="relative">
              <button
                ref={mailButtonRef}
                onClick={() => setShowExpiringJobs(!showExpiringJobs)}
                className={`relative p-2 hover:bg-gray-100 rounded-lg transition-colors ${
                  showExpiringJobs ? 'bg-orange-100' : ''
                }`}
                title="Jobs expiring today"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                {(expiringJobsData.bookmarkedExpiringJobs.length > 0 || expiringJobsData.recommendedExpiringJobs.length > 0) && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">
                      {expiringJobsData.bookmarkedExpiringJobs.length + expiringJobsData.recommendedExpiringJobs.length}
                    </span>
                  </span>
                )}
              </button>

              {/* Expiring Jobs Popup */}
              <AnimatePresence>
                {showExpiringJobs && (
                  <motion.div
                    ref={popupRef}
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto"
                  >
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-4">
                        <AlertTriangle className="w-5 h-5 text-orange-600" />
                        <h3 className="font-semibold text-gray-900">Jobs Expiring Today</h3>
                        <button
                          onClick={() => setShowExpiringJobs(false)}
                          className="ml-auto p-1 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <X className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>

                      {expiringJobsLoading ? (
                        <div className="text-center py-4">
                          <p className="text-gray-500">Loading...</p>
                        </div>
                      ) : (expiringJobsData.bookmarkedExpiringJobs.length > 0 || expiringJobsData.recommendedExpiringJobs.length > 0) ? (
                        <div className="space-y-4">
                          {/* Bookmarked Jobs Expiring Today */}
                          {expiringJobsData.bookmarkedExpiringJobs.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium text-orange-700 mb-2">Bookmarked Jobs:</h4>
                              <div className="space-y-2">
                                {expiringJobsData.bookmarkedExpiringJobs.map((job) => (
                                  <div
                                    key={job._id}
                                    onClick={() => {
                                      setActiveJobId(job._id);
                                      setShowExpiringJobs(false);
                                    }}
                                    className="flex items-center justify-between bg-orange-50 p-3 rounded-lg border border-orange-200 hover:bg-orange-100 cursor-pointer transition-colors"
                                  >
                                    <div className="flex-1 min-w-0">
                                      <p className="font-medium text-gray-900 truncate">{job.title}</p>
                                      <p className="text-sm text-gray-600 truncate">{job.company_id?.name}</p>
                                      <p className="text-xs text-gray-500 truncate">{typeof job.location === 'object' ? job.location.address : job.location} • {job.salary ? `${job.salary.replace('$', '₹')}/month` : 'Salary not specified'}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Recommended Jobs Expiring Today */}
                          {expiringJobsData.recommendedExpiringJobs.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium text-orange-700 mb-2">Recommended Jobs:</h4>
                              <div className="space-y-2">
                                {expiringJobsData.recommendedExpiringJobs.map((job) => (
                                  <div
                                    key={job._id}
                                    onClick={() => {
                                      setActiveJobId(job._id);
                                      setShowExpiringJobs(false);
                                    }}
                                    className="flex items-center justify-between bg-orange-50 p-3 rounded-lg border border-orange-200 hover:bg-orange-100 cursor-pointer transition-colors"
                                  >
                                    <div className="flex-1 min-w-0">
                                      <p className="font-medium text-gray-900 truncate">{job.title}</p>
                                      <p className="text-sm text-gray-600 truncate">{job.company_id?.name}</p>
                                      <p className="text-xs text-gray-500 truncate">{typeof job.location === 'object' ? job.location.address : job.location} • {job.salary ? `${job.salary.replace('$', '₹')}/month` : 'Salary not specified'}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-6">
                          <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                          <p className="text-gray-500 font-medium">No jobs expiring today</p>
                          <p className="text-sm text-gray-400 mt-1">Check back later for job deadlines</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {/* Removed hardcoded user info - now using UserStatsPanel in sidebar */}
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Left Sidebar - Job List */}
          <div className="col-span-4 space-y-4">
            <div className="bg-gray-100 text-gray-900 rounded-2xl px-6 py-4 flex items-center justify-between border border-gray-200">
              <span className="font-medium">{isSearching ? "Search Result" : "Recommended Jobs"}</span>
              <span className="text-sm text-gray-600">
                {filteredJobs.length} {filteredJobs.length === 1 ? "Job" : "Jobs"} {isSearching ? "Found" : ""}
              </span>
            </div>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search jobs..."
                className="pl-12 pr-12 h-12 rounded-full border-gray-300"
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 hover:bg-gray-100 rounded p-1">
                <SlidersHorizontal className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Expiring Jobs Alert Section */}
            <AnimatePresence>
              {showExpiringJobs && (expiringJobsData.bookmarkedExpiringJobs.length > 0 || expiringJobsData.recommendedExpiringJobs.length > 0) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4 bg-orange-50 border border-orange-200 rounded-xl p-4"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-5 h-5 text-orange-600" />
                    <h3 className="font-semibold text-orange-800">Jobs Expiring Today</h3>
                  </div>

                  {/* Bookmarked Jobs Expiring Today */}
                  {expiringJobsData.bookmarkedExpiringJobs.length > 0 && (
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-orange-700 mb-2">Bookmarked Jobs:</h4>
                      <div className="space-y-2">
                        {expiringJobsData.bookmarkedExpiringJobs.map((job) => (
                          <div key={job._id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-orange-200">
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{job.title}</p>
                              <p className="text-sm text-gray-600">{job.company_id?.name}</p>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => setActiveJobId(job._id)}
                              className="bg-orange-600 hover:bg-orange-700 text-white"
                            >
                              View
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommended Jobs Expiring Today */}
                  {expiringJobsData.recommendedExpiringJobs.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-orange-700 mb-2">Recommended Jobs:</h4>
                      <div className="space-y-2">
                        {expiringJobsData.recommendedExpiringJobs.map((job) => (
                          <div key={job._id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-orange-200">
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{job.title}</p>
                              <p className="text-sm text-gray-600">{job.company_id?.name}</p>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => setActiveJobId(job._id)}
                              className="bg-orange-600 hover:bg-orange-700 text-white"
                            >
                              View
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Expiring Jobs Alert Section - REMOVED INLINE DISPLAY */}
            {/* The expiring jobs are now shown in the popup above */}

            <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
              {loading ? (
                <div className="text-center py-8 text-gray-500">
                  <p>Loading jobs...</p>
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
                  timeAgo={job.last_date ? new Date(job.last_date).toLocaleDateString() : 'No deadline'}
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
                  applicantsCount={job.applicantsCount || 0}
                />
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No jobs found matching your search.</p>
                  <p className="text-sm mt-2">Try different keywords or browse recommended jobs.</p>
                </div>
              )}
            </div>
          </div>

          {/* Center - Job Details or Grid View */}
          <div className="col-span-5">
            {activeJob ? (
              <div className="relative">
                <button
                  onClick={() => setActiveJobId(null)}
                  className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
                <JobDetailPanel
                  companyName={activeJob.company_id?.name || 'Unknown Company'}
                  position={activeJob.title}
                  location={`${typeof activeJob.location === 'object' ? activeJob.location.address : activeJob.location} - ${activeJob.work_location}`}
                  salary={activeJob.salary ? `${activeJob.salary.replace('$', '₹')}/month` : 'Salary not specified'}
                  jobType={activeJob.job_type}
                  applicants={`${activeJob.applicantsCount || 0}`}
                  skillLevel={activeJob.experience_level}
                  logoColor="#4DB8FF"
                  logo={
                    <img
                      src={activeJob.company_id?.logo || "https://images.unsplash.com/photo-1637489981573-e45e9297cb21?w=100&h=100&fit=crop"}
                      alt={activeJob.company_id?.name || 'Company'}
                      className="w-full h-full object-cover rounded-full"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1637489981573-e45e9297cb21?w=100&h=100&fit=crop";
                      }}
                    />
                  }
                  description={activeJob.description}
                  requirements={activeJob.requirements}
                  jobId={activeJob._id}
                  applicationLink={activeJob.application_link}
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
  );
}