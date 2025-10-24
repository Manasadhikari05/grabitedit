// API client for making requests to the backend
const API_BASE_URL = 'http://localhost:5001/api';

export const fetchJobs = async (userSkills = []) => {
  try {
    const skillsQuery = userSkills.length > 0 ? `?skills=${encodeURIComponent(userSkills.join(','))}` : '';
    const response = await fetch(`${API_BASE_URL}/jobs${skillsQuery}`);
    if (!response.ok) {
      throw new Error('Failed to fetch jobs');
    }
    const data = await response.json();
    return data.jobs || [];
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
};

export const searchJobs = async (query) => {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs/search/${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Failed to search jobs');
    }
    const data = await response.json();
    return data.jobs || [];
  } catch (error) {
    console.error('Error searching jobs:', error);
    throw error;
  }
};

export const applyForJob = async (jobId, userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/apply/${jobId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      throw new Error('Failed to apply for job');
    }

    const data = await response.json();

    // Update localStorage with fresh user data after application
    const updateLocalStorage = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('http://localhost:5001/api/auth/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('user', JSON.stringify(data.user));

          // Update daily applied jobs count (same logic as bookmark)
          const user = data.user;
          const currentWeek = Math.ceil((new Date() - new Date(new Date().getFullYear(), 0, 1)) / (7 * 24 * 60 * 60 * 1000));
          const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });
          const appliedKey = `jobsAppliedPerDay_${user.id}`;

          const appliedStored = localStorage.getItem(appliedKey);
          let appliedData = { 'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0, 'Sun': 0 };

          if (appliedStored) {
            const parsed = JSON.parse(appliedStored);
            if (parsed.week === currentWeek) {
              appliedData = parsed.days;
            }
          }

          appliedData[today] = (appliedData[today] || 0) + 1;

          localStorage.setItem(appliedKey, JSON.stringify({
            week: currentWeek,
            days: appliedData
          }));

          // Trigger storage event to update components
          window.dispatchEvent(new StorageEvent('storage', {
            key: 'user',
            newValue: JSON.stringify(data.user),
            storageArea: localStorage
          }));

          // Trigger storage event for applied jobs chart update
          window.dispatchEvent(new StorageEvent('storage', {
            key: appliedKey,
            newValue: JSON.stringify({ week: currentWeek, days: appliedData }),
            storageArea: localStorage
          }));
        }
      } catch (error) {
        console.error('Error updating localStorage:', error);
      }
    };

    await updateLocalStorage();

    // Dispatch custom event to update job data in components
    window.dispatchEvent(new CustomEvent('jobApplied', {
      detail: {
        jobId,
        updatedApplicantsCount: data.updatedApplicantsCount
      }
    }));

    return data;
  } catch (error) {
    console.error('Error applying for job:', error);
    throw error;
  }
};

export const bookmarkJob = async (jobId, userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs/bookmark/${jobId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      throw new Error('Failed to bookmark job');
    }

    const data = await response.json();

    // Update localStorage with fresh user data after bookmarking
    const updateLocalStorage = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('http://localhost:5001/api/auth/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('user', JSON.stringify(data.user));

          // Update daily bookmarked jobs count
          const user = data.user;
          const currentWeek = Math.ceil((new Date() - new Date(new Date().getFullYear(), 0, 1)) / (7 * 24 * 60 * 60 * 1000));
          const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });
          const bookmarkedKey = `jobsBookmarkedPerDay_${user.id}`;

          const bookmarkedStored = localStorage.getItem(bookmarkedKey);
          let bookmarkedData = { 'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0, 'Sun': 0 };

          if (bookmarkedStored) {
            const parsed = JSON.parse(bookmarkedStored);
            if (parsed.week === currentWeek) {
              bookmarkedData = parsed.days;
            }
          }

          bookmarkedData[today] = (bookmarkedData[today] || 0) + 1;

          localStorage.setItem(bookmarkedKey, JSON.stringify({
            week: currentWeek,
            days: bookmarkedData
          }));

          // Trigger storage event to update components
          window.dispatchEvent(new StorageEvent('storage', {
            key: 'user',
            newValue: JSON.stringify(data.user),
            storageArea: localStorage
          }));

          // Trigger storage event for bookmarked jobs chart update
          window.dispatchEvent(new StorageEvent('storage', {
            key: bookmarkedKey,
            newValue: JSON.stringify({ week: currentWeek, days: bookmarkedData }),
            storageArea: localStorage
          }));
        }
      } catch (error) {
        console.error('Error updating localStorage:', error);
      }
    };

    await updateLocalStorage();

    // Fetch updated job data to get the new applicants count
    let updatedJob = null;
    try {
      const jobResponse = await fetch(`${API_BASE_URL}/jobs/${jobId}`);
      if (jobResponse.ok) {
        const jobData = await jobResponse.json();
        updatedJob = jobData.job;
      }
    } catch (error) {
      console.error('Error fetching updated job data:', error);
    }

    return { ...data, updatedJob };
  } catch (error) {
    console.error('Error bookmarking job:', error);
    throw error;
  }
};

export const removeBookmark = async (jobId, userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs/bookmark/${jobId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      throw new Error('Failed to remove bookmark');
    }

    const data = await response.json();

    // Update localStorage with fresh user data after removing bookmark
    const updateLocalStorage = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('http://localhost:5001/api/auth/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('user', JSON.stringify(data.user));

          // Update daily bookmarked jobs count (decrement)
          const user = data.user;
          const currentWeek = Math.ceil((new Date() - new Date(new Date().getFullYear(), 0, 1)) / (7 * 24 * 60 * 60 * 1000));
          const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });
          const bookmarkedKey = `jobsBookmarkedPerDay_${user.id}`;

          const bookmarkedStored = localStorage.getItem(bookmarkedKey);
          let bookmarkedData = { 'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0, 'Sun': 0 };

          if (bookmarkedStored) {
            const parsed = JSON.parse(bookmarkedStored);
            if (parsed.week === currentWeek) {
              bookmarkedData = parsed.days;
            }
          }

          bookmarkedData[today] = Math.max((bookmarkedData[today] || 0) - 1, 0);

          localStorage.setItem(bookmarkedKey, JSON.stringify({
            week: currentWeek,
            days: bookmarkedData
          }));

          // Trigger storage event to update components
          window.dispatchEvent(new StorageEvent('storage', {
            key: 'user',
            newValue: JSON.stringify(data.user),
            storageArea: localStorage
          }));

          // Trigger storage event for bookmarked jobs chart update
          window.dispatchEvent(new StorageEvent('storage', {
            key: bookmarkedKey,
            newValue: JSON.stringify({ week: currentWeek, days: bookmarkedData }),
            storageArea: localStorage
          }));
        }
      } catch (error) {
        console.error('Error updating localStorage:', error);
      }
    };

    await updateLocalStorage();

    return data;
  } catch (error) {
    console.error('Error removing bookmark:', error);
    throw error;
  }
};

export const trackJobView = async (jobId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs/view/${jobId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to track job view');
    }

    const data = await response.json();

    // Update activity rings data in localStorage
    const updateActivityData = () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user.id) return;

        const currentWeek = Math.ceil((new Date() - new Date(new Date().getFullYear(), 0, 1)) / (7 * 24 * 60 * 60 * 1000));
        const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });

        // Update jobs viewed per day
        const viewedKey = `jobsViewedPerDay_${user.id}`;
        const viewedStored = localStorage.getItem(viewedKey);
        let viewedData = { 'Mon': 0, 'Tue': 0, 'Wed': 0, 'Thu': 0, 'Fri': 0, 'Sat': 0, 'Sun': 0 };

        if (viewedStored) {
          const parsed = JSON.parse(viewedStored);
          if (parsed.week === currentWeek) {
            viewedData = parsed.days;
          }
        }

        viewedData[today] = (viewedData[today] || 0) + 1;

        localStorage.setItem(viewedKey, JSON.stringify({
          week: currentWeek,
          days: viewedData
        }));

        // Trigger storage event for activity rings update
        window.dispatchEvent(new StorageEvent('storage', {
          key: viewedKey,
          newValue: JSON.stringify({ week: currentWeek, days: viewedData }),
          storageArea: localStorage
        }));

        // Also trigger a general update for components that listen to 'user' changes
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'user',
          newValue: localStorage.getItem('user'),
          storageArea: localStorage
        }));

      } catch (error) {
        console.error('Error updating activity data:', error);
      }
    };

    updateActivityData();

    // Update localStorage with fresh user data after viewing job
    const updateLocalStorage = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('http://localhost:5001/api/auth/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem('user', JSON.stringify(data.user));
          // Trigger storage event to update components
          window.dispatchEvent(new StorageEvent('storage', {
            key: 'user',
            newValue: JSON.stringify(data.user),
            storageArea: localStorage
          }));
        }
      } catch (error) {
        console.error('Error updating localStorage:', error);
      }
    };

    await updateLocalStorage();

    return data;
  } catch (error) {
    console.error('Error tracking job view:', error);
    throw error;
  }
};