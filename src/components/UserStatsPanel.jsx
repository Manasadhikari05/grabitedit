import { Button } from "./ui/button";
import { createAvatar } from '@dicebear/core';
import { lorelei, avataaars } from '@dicebear/collection';
import { useState, useEffect } from 'react';
import { API_BASE_URL } from './client';

export function UserStatsPanel({
  userName,
  userRole,
  userLocation,
  profileImage,
  user,
}) {
  const [jobsAppliedData, setJobsAppliedData] = useState({});
  const [jobsBookmarkedData, setJobsBookmarkedData] = useState({});
  const [dbUserData, setDbUserData] = useState(null);

  // Get current week number
  const getCurrentWeek = () => {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const days = Math.floor((now - startOfYear) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + startOfYear.getDay() + 1) / 7);
  };

  // Load data from database via API call
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) {
        // Initialize with empty data if no user
        setJobsAppliedData({ 'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0, 'Sun': 0 });
        setJobsBookmarkedData({ 'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0, 'Sun': 0 });
        setDbUserData(null);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          // Initialize with empty data if no token
          setJobsAppliedData({ 'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0, 'Sun': 0 });
          setJobsBookmarkedData({ 'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0, 'Sun': 0 });
          setDbUserData(null);
          return;
        }

        const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setDbUserData(data.user);

          const currentWeek = getCurrentWeek();

          // Calculate applied jobs per day from database records
          const appliedJobs = data.user.appliedJobs || [];
          const appliedPerDay = { 'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0, 'Sun': 0 };

          appliedJobs.forEach(job => {
            if (job.appliedAt) {
              const jobDate = new Date(job.appliedAt);
              const startOfYear = new Date(jobDate.getFullYear(), 0, 1);
              const days = Math.floor((jobDate - startOfYear) / (24 * 60 * 60 * 1000));
              const jobWeek = Math.ceil((days + startOfYear.getDay() + 1) / 7);
              if (jobWeek === currentWeek) {
                const dayName = jobDate.toLocaleDateString('en-US', { weekday: 'short' });
                appliedPerDay[dayName] = (appliedPerDay[dayName] || 0) + 1;
              }
            }
          });

          // Calculate bookmarked jobs per day from database records
          const bookmarkedJobs = data.user.bookmarkedJobs || [];
          const bookmarkedPerDay = { 'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0, 'Sun': 0 };

          bookmarkedJobs.forEach(job => {
            if (job.bookmarkedAt) {
              const jobDate = new Date(job.bookmarkedAt);
              const startOfYear = new Date(jobDate.getFullYear(), 0, 1);
              const days = Math.floor((jobDate - startOfYear) / (24 * 60 * 60 * 1000));
              const jobWeek = Math.ceil((days + startOfYear.getDay() + 1) / 7);
              if (jobWeek === currentWeek) {
                const dayName = jobDate.toLocaleDateString('en-US', { weekday: 'short' });
                bookmarkedPerDay[dayName] = (bookmarkedPerDay[dayName] || 0) + 1;
              }
            }
          });

          setJobsAppliedData(appliedPerDay);
          setJobsBookmarkedData(bookmarkedPerDay);

          console.log('Fetched user data from DB:', data.user);
          console.log('Calculated applied per day:', appliedPerDay);
          console.log('Calculated bookmarked per day:', bookmarkedPerDay);
        } else {
          // If API call fails, initialize with empty data
          setJobsAppliedData({ 'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0, 'Sun': 0 });
          setJobsBookmarkedData({ 'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0, 'Sun': 0 });
          setDbUserData(null);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Initialize with empty data on error - don't crash the UI
        setJobsAppliedData({ 'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0, 'Sun': 0 });
        setJobsBookmarkedData({ 'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0, 'Sun': 0 });
        setDbUserData(null);
      }
    };

    fetchUserData();
  }, [user?.id]);

  // Listen for storage changes to update the chart in real-time
  useEffect(() => {
    if (!user?.id) return;

    const handleStorageChange = async (e) => {
      if (e.key === 'user') {
        // Fetch fresh data from database when user data changes
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            // Initialize with empty data if no token
            setJobsAppliedData({ 'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0, 'Sun': 0 });
            setJobsBookmarkedData({ 'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0, 'Sun': 0 });
            setDbUserData(null);
            return;
          }

          const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();
            setDbUserData(data.user);

            const currentWeek = getCurrentWeek();

            // Recalculate applied jobs per day from fresh database data
            const appliedJobs = data.user.appliedJobs || [];
            const appliedPerDay = { 'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0, 'Sun': 0 };

            appliedJobs.forEach(job => {
              if (job.appliedAt) {
                const jobDate = new Date(job.appliedAt);
                const startOfYear = new Date(jobDate.getFullYear(), 0, 1);
                const days = Math.floor((jobDate - startOfYear) / (24 * 60 * 60 * 1000));
                const jobWeek = Math.ceil((days + startOfYear.getDay() + 1) / 7);
                if (jobWeek === currentWeek) {
                  const dayName = jobDate.toLocaleDateString('en-US', { weekday: 'short' });
                  appliedPerDay[dayName] = (appliedPerDay[dayName] || 0) + 1;
                }
              }
            });

            // Recalculate bookmarked jobs per day from fresh database data
            const bookmarkedJobs = data.user.bookmarkedJobs || [];
            const bookmarkedPerDay = { 'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0, 'Sun': 0 };

            bookmarkedJobs.forEach(job => {
              if (job.bookmarkedAt) {
                const jobDate = new Date(job.bookmarkedAt);
                const startOfYear = new Date(jobDate.getFullYear(), 0, 1);
                const days = Math.floor((jobDate - startOfYear) / (24 * 60 * 60 * 1000));
                const jobWeek = Math.ceil((days + startOfYear.getDay() + 1) / 7);
                if (jobWeek === currentWeek) {
                  const dayName = jobDate.toLocaleDateString('en-US', { weekday: 'short' });
                  bookmarkedPerDay[dayName] = (bookmarkedPerDay[dayName] || 0) + 1;
                }
              }
            });

            setJobsAppliedData(appliedPerDay);
            setJobsBookmarkedData(bookmarkedPerDay);

            console.log('Storage change - Updated applied per day:', appliedPerDay);
            console.log('Storage change - Updated bookmarked per day:', bookmarkedPerDay);
          } else {
            // Initialize with empty data if API call fails
            setJobsAppliedData({ 'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0, 'Sun': 0 });
            setJobsBookmarkedData({ 'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0, 'Sun': 0 });
            setDbUserData(null);
          }
        } catch (error) {
          console.error('Error fetching updated user data:', error);
          // Initialize with empty data on error
          setJobsAppliedData({ 'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0, 'Sun': 0 });
          setJobsBookmarkedData({ 'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0, 'Sun': 0 });
          setDbUserData(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [user?.id]);

  // Get real user data from database state
  const appliedJobsTotal = dbUserData?.appliedJobs?.length || 0;
  const bookmarkedJobsTotal = dbUserData?.bookmarkedJobs?.length || 0;
  const postViewsTotal = dbUserData?.discussionPosts?.reduce((sum, post) => sum + (post.views || 0), 0) || 0;

  // Initialize data objects if they are null/undefined
  const safeJobsAppliedData = jobsAppliedData || { 'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0, 'Sun': 0 };
  const safeJobsBookmarkedData = jobsBookmarkedData || { 'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0, 'Sun': 0 };

  // Get real stats from data
  const appliedJobs = Object.values(safeJobsAppliedData).reduce((sum, count) => sum + count, 0);
  const bookmarkedJobs = Object.values(safeJobsBookmarkedData).reduce((sum, count) => sum + count, 0);
  const totalActivity = appliedJobs + bookmarkedJobs;

  // Generate DiceBear avatar based on gender
  const getAvatarStyle = (gender) => {
    switch (gender?.toLowerCase()) {
      case 'male':
        return avataaars; // Male avatar style
      case 'female':
        return lorelei; // Female avatar style
      default:
        return lorelei; // Default to female style
    }
  };

  const avatarStyle = getAvatarStyle(user?.gender);
  const avatar = createAvatar(avatarStyle, {
    seed: userName || 'default',
    size: 80,
  });
  const avatarDataUri = `data:image/svg+xml;utf8,${encodeURIComponent(avatar.toString())}`;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6">
        <div className="flex flex-col items-center">
          <img
            src={avatarDataUri}
            alt={`${userName} avatar`}
            className="w-20 h-20 rounded-full mb-4"
          />
          <h3 className="mb-1">{userName}</h3>
          <p className="text-gray-600 text-sm">{userRole}</p>
          <p className="text-gray-500 text-sm">{userLocation}</p>
          <Button variant="outline" className="w-full mt-4 rounded-full">
            Edit Profile
          </Button>
        </div>
      </div>

      <div className="bg-gray-50 rounded-2xl p-6">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">{totalActivity} Jobs Activity This Week</span>
          </div>
          <div className="h-24 relative">
            <svg className="w-full h-full" viewBox="0 0 200 80" preserveAspectRatio="none">
              <defs>
                <linearGradient id="appliedGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: "#10b981", stopOpacity: 0.6 }} />
                  <stop offset="100%" style={{ stopColor: "#10b981", stopOpacity: 0.1 }} />
                </linearGradient>
                <linearGradient id="bookmarkedGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: "#f59e0b", stopOpacity: 0.6 }} />
                  <stop offset="100%" style={{ stopColor: "#f59e0b", stopOpacity: 0.1 }} />
                </linearGradient>
              </defs>
              {/* Create dynamic paths for both applied and bookmarked jobs */}
              {(() => {
                const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

                // Applied jobs path
                const appliedPoints = days.map((day, index) => {
                  const x = (index / 6) * 200;
                  const value = safeJobsAppliedData[day] || 0;
                  const y = 80 - Math.min(value * 8, 70); // Increased scale for better visibility
                  return `${x},${y}`;
                }).join(' L ');

                // Bookmarked jobs path
                const bookmarkedPoints = days.map((day, index) => {
                  const x = (index / 6) * 200;
                  const value = safeJobsBookmarkedData[day] || 0;
                  const y = 80 - Math.min(value * 8, 70); // Increased scale for better visibility
                  return `${x},${y}`;
                }).join(' L ');

                return (
                  <>
                    {/* Bookmarked jobs area (bottom layer) */}
                    <path
                      d={`M ${bookmarkedPoints} L 200 80 L 0 80 Z`}
                      fill="url(#bookmarkedGradient)"
                    />
                    <path
                      d={`M ${bookmarkedPoints}`}
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                    />
                    {/* Applied jobs area (top layer) */}
                    <path
                      d={`M ${appliedPoints} L 200 80 L 0 80 Z`}
                      fill="url(#appliedGradient)"
                    />
                    <path
                      d={`M ${appliedPoints}`}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2"
                    />
                  </>
                );
              })()}
            </svg>
          </div>
          {/* Legend */}
          <div className="flex items-center justify-center gap-4 mt-2 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-0.5 bg-green-500"></div>
              <span className="text-gray-600">Applied</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-0.5 bg-amber-500 opacity-60" style={{borderTop: '1px dashed #f59e0b'}}></div>
              <span className="text-gray-600">Bookmarked</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div className="text-center flex flex-col items-center justify-center min-h-[80px]">
             <div className="text-gray-600 text-sm mb-1">Applied Jobs</div>
             <div className="text-3xl mb-1 font-bold">{appliedJobsTotal}</div>
             <div className="text-gray-500 text-sm">Total: {appliedJobsTotal}</div>
           </div>
           <div className="text-center flex flex-col items-center justify-center min-h-[80px]">
             <div className="text-gray-600 text-sm mb-1">Bookmarked Jobs</div>
             <div className="text-3xl mb-1 font-bold">{bookmarkedJobsTotal}</div>
             <div className="text-gray-500 text-sm">Total: {bookmarkedJobsTotal}</div>
           </div>
         </div>

        <div className="border-t mt-4 pt-4">
          <div className="text-center mb-3">
            <div className="text-gray-600 text-sm mb-1">Post Views</div>
            <div className="text-3xl mb-1">{postViewsTotal}</div>
            <div className="text-gray-500 text-sm">Views</div>
          </div>
          <div className="text-center">
            <div className="text-gray-600 text-sm mb-1">Experience</div>
            <div className="text-3xl mb-1">5</div>
            <div className="text-gray-500 text-sm">Month</div>
          </div>
        </div>
      </div>
    </div>
  );
}