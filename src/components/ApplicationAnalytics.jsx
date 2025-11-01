import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Bookmark, Target, Flame, Briefcase, Calendar } from 'lucide-react';
import { Badge } from './ui/badge';

import { API_BASE_URL } from './client';

export function ApplicationAnalytics({ userData: propUserData }) {
  // Get real user data from props or localStorage
  const userData = propUserData || JSON.parse(localStorage.getItem('user') || '{}');

  // Debug: Check if userData has the arrays
  console.log('Raw userData:', userData);
  console.log('userData.appliedJobs:', userData.appliedJobs);
  console.log('userData.bookmarkedJobs:', userData.bookmarkedJobs);
  console.log('userData.viewedJobs:', userData.viewedJobs);

  const appliedJobs = userData.appliedJobs || [];
  const bookmarkedJobs = userData.bookmarkedJobs || [];
  const viewedJobs = userData.viewedJobs || [];

  // State for jobs with full details
  const [jobsWithDetails, setJobsWithDetails] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);

  // Debug logging
  console.log('ApplicationAnalytics - User Data:', userData);
  console.log('Applied Jobs:', appliedJobs.length, appliedJobs);
  console.log('Bookmarked Jobs:', bookmarkedJobs.length, bookmarkedJobs);
  console.log('Viewed Jobs:', viewedJobs.length, viewedJobs);

  // Force immediate re-render when data changes
  const [forceUpdate, setForceUpdate] = useState(0);

  // Force immediate re-render when data changes
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'user') {
        console.log('Storage changed, forcing update');
        setForceUpdate(prev => prev + 1);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Fetch job details for applied jobs
  useEffect(() => {
    const fetchJobDetails = async () => {
      if (appliedJobs.length === 0) return;

      setLoadingJobs(true);
      try {
        const jobIds = appliedJobs.slice(-2).map(app => app.job_id);
        const jobDetailsPromises = jobIds.map(async (jobId) => {
          try {
            const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`);
            if (response.ok) {
              const jobData = await response.json();
              return {
                ...jobData.job,
                appliedAt: appliedJobs.find(app => app.job_id === jobId)?.appliedAt,
                status: appliedJobs.find(app => app.job_id === jobId)?.status
              };
            }
          } catch (error) {
            console.error(`Error fetching job ${jobId}:`, error);
          }
          return null;
        });

        const jobDetails = (await Promise.all(jobDetailsPromises)).filter(job => job !== null);
        setJobsWithDetails(jobDetails.reverse()); // Most recent first
      } catch (error) {
        console.error('Error fetching job details:', error);
      } finally {
        setLoadingJobs(false);
      }
    };

    fetchJobDetails();
  }, [appliedJobs]);

  // Use array lengths for analytics (as requested)
  const x = appliedJobs.length;    // Total applied jobs (from apply now button clicks)
  const y = bookmarkedJobs.length; // Total bookmarked jobs (from bookmark/unbookmark actions)
  const z = viewedJobs.length;     // Total viewed jobs (from view details button clicks)

  console.log('Analytics Data - Applied:', x, 'Bookmarked:', y, 'Viewed:', z);
  console.log('Applied Jobs Array Length:', appliedJobs.length);
  console.log('Bookmarked Jobs Array Length:', bookmarkedJobs.length);
  console.log('Viewed Jobs Array Length:', viewedJobs.length);

  // Define goals for the rings
  const goals = {
    applied: 10,      // goal: apply to 10 jobs
    bookmarked: 15,   // goal: bookmark 15 jobs
    viewed: 20        // goal: view 20 jobs
  };

  // Calculate progress using the specified formula: Math.min((value / goal) * 100, 100)
  const appliedProgress = Math.min((x / goals.applied) * 100, 100);
  const bookmarkedProgress = Math.min((y / goals.bookmarked) * 100, 100);
  const viewedProgress = Math.min((z / goals.viewed) * 100, 100);

  console.log('Progress calculations:');
  console.log('Applied:', appliedProgress + '% (' + x + '/' + goals.applied + ')');
  console.log('Bookmarked:', bookmarkedProgress + '% (' + y + '/' + goals.bookmarked + ')');
  console.log('Viewed:', viewedProgress + '% (' + z + '/' + goals.viewed + ')');

  // Debug: Check if rings should be visible
  console.log('Ring visibility check:');
  console.log('Applied ring should show:', x > 0 ? 'YES' : 'NO', 'progress:', appliedProgress);
  console.log('Bookmarked ring should show:', y > 0 ? 'YES' : 'NO', 'progress:', bookmarkedProgress);
  console.log('Viewed ring should show:', z > 0 ? 'YES' : 'NO', 'progress:', viewedProgress);

  // Today's data - large stacked rings (using total counts, not just today's)
  const todayRings = [
    { value: x, goal: goals.applied, color: '#FF0080', progress: appliedProgress }, // Pink: Applications (outer ring)
    { value: y, goal: goals.bookmarked, color: '#ADFF00', progress: bookmarkedProgress },     // Green: Bookmarks (middle ring)
    { value: z, goal: goals.viewed, color: '#00E0FF', progress: viewedProgress }         // Blue: Views (inner ring)
  ];

  // Calculate week data based on real user applications, bookmarks, and views
  const getWeekData = () => {
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S']; // Sunday to Saturday
    const today = new Date();
    const weekData = [];

    console.log('Calculating week data for user:', userData.name);

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toDateString();

      // Pink ring: Jobs Applied on this day
      const dayApplications = appliedJobs.filter(job => {
        const jobDate = new Date(job.appliedAt).toDateString();
        const matches = jobDate === dateString;
        if (matches) console.log(`Found applied job on ${dateString}:`, job);
        return matches;
      }).length;

      // Green ring: Jobs Bookmarked on this day
      const dayBookmarks = bookmarkedJobs.filter(job => {
        const jobDate = new Date(job.bookmarkedAt).toDateString();
        const matches = jobDate === dateString;
        if (matches) console.log(`Found bookmarked job on ${dateString}:`, job);
        return matches;
      }).length;

      // Blue ring: Jobs Viewed on this day
      const dayViews = viewedJobs.filter(job => {
        const jobDate = new Date(job.viewedAt).toDateString();
        const matches = jobDate === dateString;
        if (matches) console.log(`Found viewed job on ${dateString}:`, job);
        return matches;
      }).length;

      console.log(`Day ${days[date.getDay()]} (${dateString}): Applied=${dayApplications}, Bookmarked=${dayBookmarks}, Viewed=${dayViews}`);

      // Use the same formula for weekly rings
      const dayAppliedProgress = Math.min((dayApplications / goals.applied) * 100, 100);
      const dayBookmarkedProgress = Math.min((dayBookmarks / goals.bookmarked) * 100, 100);
      const dayViewedProgress = Math.min((dayViews / goals.viewed) * 100, 100);

      weekData.push({
        day: days[date.getDay()],
        rings: [
          { value: dayApplications, goal: goals.applied, color: '#FF0080', progress: dayAppliedProgress }, // Pink: Applications
          { value: dayBookmarks, goal: goals.bookmarked, color: '#ADFF00', progress: dayBookmarkedProgress },     // Green: Bookmarks
          { value: dayViews, goal: goals.viewed, color: '#00E0FF', progress: dayViewedProgress }         // Blue: Views
        ]
      });
    }

    console.log('Final week data:', weekData);
    return weekData;
  };

  const weekData = getWeekData();

  const totalApplied = appliedJobs.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-[18px] mb-1">Application Analytics</h2>
        <p className="text-[13px] text-gray-500">Track your weekly job search performance</p>
      </motion.div>

      {/* Main Activity Card with Rings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-[#1C1C1E] via-[#2C2C2E] to-[#1C1C1E] rounded-2xl p-6"
      >
        <div className="flex items-start gap-2">
          {/* Large Today's Rings */}
          <div className="flex-shrink-0">
            <div className="relative">
              <svg width="180" height="180" className="transform -rotate-90">
                {/* Outer Ring - Applied Jobs */}
                <circle
                  cx="90"
                  cy="90"
                  r="72"
                  fill="none"
                  stroke="#2d2d2d"
                  strokeWidth="13"
                  opacity="0.2"
                />
                <circle
                  cx="90"
                  cy="90"
                  r="72"
                  fill="none"
                  stroke="#FF0080"
                  strokeWidth="13"
                  strokeDasharray={2 * Math.PI * 72}
                  strokeDashoffset={2 * Math.PI * 72 - ((Math.min(x / goals.applied, 1)) * 2 * Math.PI * 72)}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                  style={{
                    filter: x > 0 ? `drop-shadow(0 0 8px #FF008080)` : 'none',
                  }}
                />

                {/* Middle Ring - Bookmarked Jobs */}
                <circle
                  cx="90"
                  cy="90"
                  r="56"
                  fill="none"
                  stroke="#2d2d2d"
                  strokeWidth="13"
                  opacity="0.2"
                />
                <circle
                  cx="90"
                  cy="90"
                  r="56"
                  fill="none"
                  stroke="#ADFF00"
                  strokeWidth="13"
                  strokeDasharray={2 * Math.PI * 56}
                  strokeDashoffset={2 * Math.PI * 56 - ((Math.min(y / goals.bookmarked, 1)) * 2 * Math.PI * 56)}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                  style={{
                    filter: y > 0 ? `drop-shadow(0 0 8px #ADFF0080)` : 'none',
                  }}
                />

                {/* Inner Ring - Viewed Jobs */}
                <circle
                  cx="90"
                  cy="90"
                  r="40"
                  fill="none"
                  stroke="#2d2d2d"
                  strokeWidth="13"
                  opacity="0.2"
                />
                <circle
                  cx="90"
                  cy="90"
                  r="40"
                  fill="none"
                  stroke="#00E0FF"
                  strokeWidth="13"
                  strokeDasharray={2 * Math.PI * 40}
                  strokeDashoffset={2 * Math.PI * 40 - ((Math.min(z / goals.viewed, 1)) * 2 * Math.PI * 40)}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                  style={{
                    filter: z > 0 ? `drop-shadow(0 0 8px #00E0FF80)` : 'none',
                  }}
                />

                {/* Center text */}
                <text
                  x="90"
                  y="90"
                  textAnchor="middle"
                  dy="0.3em"
                  className="transform rotate-90"
                  style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    fill: '#fff',
                    transformOrigin: '50% 50%',
                  }}
                >
                  {x + y + z}
                </text>
              </svg>
            </div>
          </div>

          {/* Weekly Summary */}
          <div className="flex-1 min-w-0">
            <div className="mb-5">
              <h3 className="text-[16px] text-white mb-1">Weekly Activity</h3>
              <p className="text-[13px] text-gray-400">Last 7 days • {totalApplied} applications</p>
            </div>

            {/* Small Week Rings */}
            <div className="flex items-start justify-between gap-1 mb-5">
              {weekData.map((day, index) => (
                <div key={index} className="flex flex-col items-center gap-2">
                  <div className="relative">
                    <svg width="60" height="60" className="transform -rotate-90">
                      {/* Outer Ring - Applied Jobs */}
                      <circle
                        cx="30"
                        cy="30"
                        r="22"
                        fill="none"
                        stroke="#2d2d2d"
                        strokeWidth="4"
                        opacity="0.2"
                      />
                      <circle
                        cx="30"
                        cy="30"
                        r="22"
                        fill="none"
                        stroke="#FF0080"
                        strokeWidth="4"
                        strokeDasharray={2 * Math.PI * 22}
                        strokeDashoffset={2 * Math.PI * 22 - ((Math.min(day.rings[0].value / goals.applied, 1)) * 2 * Math.PI * 22)}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                      />

                      {/* Middle Ring - Bookmarked Jobs */}
                      <circle
                        cx="30"
                        cy="30"
                        r="17"
                        fill="none"
                        stroke="#2d2d2d"
                        strokeWidth="4"
                        opacity="0.2"
                      />
                      <circle
                        cx="30"
                        cy="30"
                        r="17"
                        fill="none"
                        stroke="#ADFF00"
                        strokeWidth="4"
                        strokeDasharray={2 * Math.PI * 17}
                        strokeDashoffset={2 * Math.PI * 17 - ((Math.min(day.rings[1].value / goals.bookmarked, 1)) * 2 * Math.PI * 17)}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                      />

                      {/* Inner Ring - Viewed Jobs */}
                      <circle
                        cx="30"
                        cy="30"
                        r="12"
                        fill="none"
                        stroke="#2d2d2d"
                        strokeWidth="4"
                        opacity="0.2"
                      />
                      <circle
                        cx="30"
                        cy="30"
                        r="12"
                        fill="none"
                        stroke="#00E0FF"
                        strokeWidth="4"
                        strokeDasharray={2 * Math.PI * 12}
                        strokeDashoffset={2 * Math.PI * 12 - ((Math.min(day.rings[2].value / goals.viewed, 1)) * 2 * Math.PI * 12)}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                  </div>
                  <div className="text-xs text-white font-medium">{day.day}</div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#FF0080' }}></div>
                <span className="text-[11px] text-gray-400">Applied</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#ADFF00' }}></div>
                <span className="text-[11px] text-gray-400">Bookmarked</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#00E0FF' }}></div>
                <span className="text-[11px] text-gray-400">Viewed</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid - 2x2 */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-gradient-to-br from-pink-50 to-white border border-pink-100 rounded-xl p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-lg bg-pink-100 flex items-center justify-center">
              <TrendingUp className="w-4.5 h-4.5 text-pink-600" />
            </div>
            <Badge variant="secondary" className="bg-pink-100 text-pink-700 border-0 text-[11px] px-2 py-0.5">
              +12%
            </Badge>
          </div>
          <div className="text-2xl mb-1 text-pink-600">{totalApplied}</div>
          <div className="text-[13px] text-gray-700">Total Applied</div>
          <div className="text-[11px] text-gray-500 mt-0.5">All time</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-xl p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
              <Bookmark className="w-4.5 h-4.5 text-blue-600" />
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-700 border-0 text-[11px] px-2 py-0.5">
              {bookmarkedJobs.length} jobs
            </Badge>
          </div>
          <div className="text-2xl mb-1 text-green-600">{bookmarkedJobs.length}</div>
          <div className="text-[13px] text-gray-700">Bookmarked Jobs</div>
          <div className="text-[11px] text-gray-500 mt-0.5">Saved for later</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-gradient-to-br from-green-50 to-white border border-green-100 rounded-xl p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center">
              <Target className="w-4.5 h-4.5 text-green-600" />
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-700 border-0 text-[11px] px-2 py-0.5">
              {appliedJobs.filter(job => job.status !== 'applied').length}/{totalApplied}
            </Badge>
          </div>
          <div className="text-2xl mb-1 text-green-600">
            {totalApplied > 0 ? Math.round((appliedJobs.filter(job => job.status !== 'applied').length / totalApplied) * 100) : 0}%
          </div>
          <div className="text-[13px] text-gray-700">Response Rate</div>
          <div className="text-[11px] text-gray-500 mt-0.5">Applications with updates</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-orange-50 to-white border border-orange-100 rounded-xl p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center">
              <Flame className="w-4.5 h-4.5 text-orange-600" />
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-0 text-[11px] px-2 py-0.5">
              {viewedJobs.length} jobs
            </Badge>
          </div>
          <div className="text-2xl mb-1 text-blue-600">{viewedJobs.length}</div>
          <div className="text-[13px] text-gray-700">Jobs Viewed</div>
          <div className="text-[11px] text-gray-500 mt-0.5">Total views</div>
        </motion.div>
      </div>

      {/* Recent Jobs Applied */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="bg-white border border-gray-200 rounded-2xl p-6"
      >
        <h3 className="text-[16px] text-gray-900 mb-4">Recent Jobs Applied</h3>
        <div className="space-y-3">
          {loadingJobs ? (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500">Loading...</p>
            </div>
          ) : jobsWithDetails.length > 0 ? (
            jobsWithDetails.map((job, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                    {job.company_id?.logo ? (
                      <img
                        src={job.company_id.logo}
                        alt={job.company_id.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1637489981573-e45e9297cb21?w=100&h=100&fit=crop";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white font-bold text-xs">
                          {job.company_id?.name?.charAt(0)?.toUpperCase() || 'C'}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{job.title}</p>
                    <p className="text-xs text-gray-500">{job.company_id?.name || 'Company'}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-400">
                  {new Date(job.appliedAt).toLocaleDateString()}
                </span>
              </div>
            ))
          ) : appliedJobs.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500">No recent applications</p>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500">Unable to load job details</p>
            </div>
          )}
        </div>
      </motion.div>

    </div>
  );
}