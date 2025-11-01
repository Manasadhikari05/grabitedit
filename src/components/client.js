// Smart API URL detection - automatically uses deployed backend for production
export const API_BASE_URL = (() => {
  const currentHost = window.location.hostname;
  
  // If we're accessing from a different machine (not localhost), use deployed backend
  if (currentHost !== 'localhost' && currentHost !== '127.0.0.1') {
    // Use the deployed backend for non-localhost access
    return 'https://grabitedit-1.onrender.com/api';
  }
  
  // Development mode - use localhost
  return 'http://localhost:5001/api';
})();

// Enhanced fetch wrapper with comprehensive error handling
export const apiRequest = async (url, options = {}) => {
  const defaultOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // Add necessary headers to prevent messaging channel errors
      'X-Requested-With': 'XMLHttpRequest',
    },
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    console.log(`🌐 API Request: ${mergedOptions.method || 'GET'} ${url}`);
    
    const response = await fetch(url, mergedOptions);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ API Error: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`✅ API Success:`, data);
    return data;
  } catch (error) {
    console.error(`🚫 API Request Failed:`, error);
    
    // Handle messaging channel errors specifically
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network connection failed. Please check your internet connection.');
    }
    
    // Handle CORS errors
    if (error.message.includes('CORS') || error.message.includes('blocked')) {
      throw new Error('CORS Error: Unable to connect to backend service.');
    }
    
    // Re-throw with more descriptive message
    throw new Error(error.message || 'Request failed');
  }
};

export const fetchJobs = async (userSkills = []) => {
  try {
    const skillsQuery = userSkills.length > 0 ? `?skills=${encodeURIComponent(userSkills.join(','))}` : '';
    const data = await apiRequest(`${API_BASE_URL}/jobs${skillsQuery}`);
    return data.jobs || [];
  } catch (error) {
    console.error('Error fetching jobs:', error);
    // Return empty array instead of throwing error to prevent UI crashes
    return [];
  }
};

export const searchJobs = async (query) => {
  try {
    const data = await apiRequest(`${API_BASE_URL}/jobs/search/${encodeURIComponent(query)}`);
    return data.jobs || [];
  } catch (error) {
    console.error('Error searching jobs:', error);
    throw error;
  }
};

export const sendOTP = async (email) => {
  try {
    console.log('🔐 Sending OTP request for:', email);
    const data = await apiRequest(`${API_BASE_URL}/otp/send-otp`, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
    
    // Handle both email delivery and demo mode
    if (data.demoMode) {
      console.log('🎭 Demo mode activated - OTP shown on screen');
    }
    
    return data;
  } catch (error) {
    console.error('❌ Send OTP error:', error);
    throw error;
  }
};

export const verifyOTP = async (email, otp) => {
  try {
    console.log('🔍 Verifying OTP:', email, otp);
    const data = await apiRequest(`${API_BASE_URL}/otp/verify-otp`, {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
    return data;
  } catch (error) {
    console.error('❌ Verify OTP error:', error);
    throw error;
  }
};

export const applyForJob = async (jobId, userId) => {
  try {
    const data = await apiRequest(`${API_BASE_URL}/auth/apply/${jobId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ userId }),
    });

    // Update localStorage with fresh user data after application
    const updateLocalStorage = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const profileData = await apiRequest(`${API_BASE_URL}/auth/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        localStorage.setItem('user', JSON.stringify(profileData.user));

        // Update daily applied jobs count
        const user = profileData.user;
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

        // Trigger storage event
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'user',
          newValue: JSON.stringify(profileData.user),
          storageArea: localStorage
        }));
      } catch (error) {
        console.error('Error updating localStorage:', error);
      }
    };

    await updateLocalStorage();

    // Dispatch custom event
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
    const data = await apiRequest(`${API_BASE_URL}/jobs/bookmark/${jobId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ userId }),
    });

    // Update localStorage
    const updateLocalStorage = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const profileData = await apiRequest(`${API_BASE_URL}/auth/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        localStorage.setItem('user', JSON.stringify(profileData.user));

        // Trigger storage event
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'user',
          newValue: JSON.stringify(profileData.user),
          storageArea: localStorage
        }));
      } catch (error) {
        console.error('Error updating localStorage:', error);
      }
    };

    await updateLocalStorage();

    return data;
  } catch (error) {
    console.error('Error bookmarking job:', error);
    throw error;
  }
};

export const removeBookmark = async (jobId, userId) => {
  try {
    const data = await apiRequest(`${API_BASE_URL}/jobs/bookmark/${jobId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ userId }),
    });

    // Update localStorage
    const updateLocalStorage = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const profileData = await apiRequest(`${API_BASE_URL}/auth/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        localStorage.setItem('user', JSON.stringify(profileData.user));

        // Trigger storage event
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'user',
          newValue: JSON.stringify(profileData.user),
          storageArea: localStorage
        }));
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
    const data = await apiRequest(`${API_BASE_URL}/jobs/view/${jobId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });

    // Update activity data
    const updateActivityData = () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user.id) return;

        const currentWeek = Math.ceil((new Date() - new Date(new Date().getFullYear(), 0, 1)) / (7 * 24 * 60 * 60 * 1000));
        const today = new Date().toLocaleDateString('en-US', { weekday: 'short' });

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

        // Trigger storage event
        window.dispatchEvent(new StorageEvent('storage', {
          key: viewedKey,
          newValue: JSON.stringify({ week: currentWeek, days: viewedData }),
          storageArea: localStorage
        }));
      } catch (error) {
        console.error('Error updating activity data:', error);
      }
    };

    updateActivityData();

    return data;
  } catch (error) {
    console.error('Error tracking job view:', error);
    throw error;
  }
};

export const fetchCompanyByName = async (companyName) => {
  try {
    const data = await apiRequest(`${API_BASE_URL}/companies`);
    
    const company = data.companies?.find(c =>
      c.name?.toLowerCase() === companyName?.toLowerCase()
    );
    
    return company || null;
  } catch (error) {
    console.error('Error fetching company:', error);
    return null;
  }
};

// Browser extension detection and warnings
export const detectBrowserIssues = () => {
  const warnings = [];
  
  // Check for common extension conflicts
  if (window.chrome && window.chrome.runtime && window.chrome.runtime.onMessage) {
    // Check if we're in an extension context
    warnings.push('Browser extension detected - some features may not work properly');
  }
  
  // Check for ad blockers
  const testDiv = document.createElement('div');
  testDiv.id = 'adblock-test';
  testDiv.style.display = 'none';
  document.body.appendChild(testDiv);
  
  if (window.getComputedStyle(testDiv).display === 'none') {
    warnings.push('Ad blocker detected - some API calls may be blocked');
  }
  
  document.body.removeChild(testDiv);
  
  // Check CORS support
  try {
    const xhr = new XMLHttpRequest();
    xhr.open('HEAD', window.location.origin, false);
    xhr.send();
  } catch (error) {
    warnings.push('CORS restrictions detected');
  }
  
  return warnings;
};

// Environment info for debugging
export const getEnvironmentInfo = () => {
  return {
    hostname: window.location.hostname,
    protocol: window.location.protocol,
    apiBaseUrl: API_BASE_URL,
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    cookieEnabled: navigator.cookieEnabled,
    onLine: navigator.onLine,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timestamp: new Date().toISOString(),
  };
};

// Comprehensive error handler
export const handleError = (error, context = 'Unknown') => {
  console.error(`🚨 Error in ${context}:`, error);
  
  // Detect browser issues
  const browserIssues = detectBrowserIssues();
  if (browserIssues.length > 0) {
    console.warn('🔍 Browser Issues Detected:', browserIssues);
  }
  
  // Get environment info
  const envInfo = getEnvironmentInfo();
  console.log('🌍 Environment Info:', envInfo);
  
  // Determine error type and provide helpful messages
  if (error.message.includes('CORS')) {
    return {
      type: 'CORS_ERROR',
      message: 'Unable to connect to backend service. This might be due to browser extensions or network restrictions.',
      suggestions: [
        'Try disabling browser extensions (especially ad blockers)',
        'Use a different browser or incognito mode',
        'Check your network connection',
        'Contact support if the issue persists'
      ]
    };
  }
  
  if (error.message.includes('Network') || error.message.includes('fetch')) {
    return {
      type: 'NETWORK_ERROR',
      message: 'Network connection failed. Please check your internet connection.',
      suggestions: [
        'Check your internet connection',
        'Try refreshing the page',
        'Disable any VPN or proxy connections'
      ]
    };
  }
  
  if (error.message.includes('OTP') || error.message.includes('email')) {
    return {
      type: 'EMAIL_SERVICE_ERROR',
      message: 'Email service is temporarily unavailable. Using demo mode.',
      suggestions: [
        'The system will show OTP codes on screen for testing',
        'Any 6-digit code will work during demo mode',
        'Email delivery will be restored once the service is available'
      ]
    };
  }
  
  return {
    type: 'UNKNOWN_ERROR',
    message: error.message || 'An unexpected error occurred',
    suggestions: [
      'Try refreshing the page',
      'Check the browser console for more details',
      'Contact support if the issue persists'
    ]
  };
};