import { Bookmark, MapPin, ExternalLink, X } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { bookmarkJob, removeBookmark, trackJobView } from "./client";

export function JobListItem({
  companyName,
  position,
  location,
  salary,
  jobType,
  level,
  requirements,
  paymentInfo,
  timeAgo,
  logo,
  logoColor,
  onClick,
  jobId,
  applicantsCount,
}) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showMapPopup, setShowMapPopup] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Check if job is bookmarked on component mount and when localStorage changes
  useEffect(() => {
    const updateBookmarkStatus = () => {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const bookmarks = user.bookmarkedJobs || [];
      setIsBookmarked(bookmarks.some(bookmark => bookmark.job_id === jobId));
    };

    updateBookmarkStatus();

    // Listen for storage changes
    const handleStorageChange = (e) => {
      if (e.key === 'user') {
        updateBookmarkStatus();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [jobId]);

  const toggleBookmark = async (e) => {
    e.stopPropagation(); // Prevent triggering the onClick for the job item

    // Get current user from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.id) {
      alert('Please log in to bookmark jobs.');
      return;
    }

    try {
      if (isBookmarked) {
        // Remove from bookmarks
        await removeBookmark(jobId, user.id);
        setIsBookmarked(false);
        alert('Bookmark removed successfully!');
      } else {
        // Add to bookmarks
        await bookmarkJob(jobId, user.id);
        setIsBookmarked(true);
        alert('Job bookmarked successfully!');
      }

      // Update localStorage with fresh user data after bookmark
      const updateLocalStorage = async () => {
        try {
          const response = await fetch('http://localhost:5001/api/auth/profile', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
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
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      alert('Failed to update bookmark. Please try again.');
      // Revert the state change on error
      setIsBookmarked(!isBookmarked);
    }
  };

  const openInMaps = (e) => {
    e.stopPropagation();
    // Open location in Google Maps
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
    window.open(mapsUrl, '_blank');
    setIsPopupOpen(false);
  };

  const togglePopup = (e) => {
    e.stopPropagation();
    setIsPopupOpen(!isPopupOpen);
  };
  return (
    <div className="border-b last:border-b-0 py-6 first:pt-0 hover:bg-gray-50 transition-colors px-4 -mx-4 rounded-lg">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
          {logo}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="mb-1 text-lg font-semibold">{position}</h3>
              <p className="text-gray-600 text-sm">{companyName}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleBookmark}
                className={`p-2 rounded-lg transition-colors ${
                  isBookmarked ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-white'
                }`}
              >
                <Bookmark
                  className={`w-4 h-4 ${
                    isBookmarked ? 'text-red-500 fill-current' : 'text-gray-600'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3 relative">
            <div className="relative">
              <MapPin
                className="w-4 h-4 cursor-pointer hover:text-blue-500 transition-colors"
                onClick={togglePopup}
              />
              {isPopupOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-80 max-w-sm mx-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">Location Details</h3>
                      <button
                        onClick={togglePopup}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <X className="w-5 h-5 text-gray-500" />
                      </button>
                    </div>
                    <div className="text-sm text-gray-600 mb-3">Location: {location}</div>
                    <div className="bg-gray-100 rounded h-32 mb-3 overflow-hidden relative">
                      <iframe
                        src={`https://maps.google.com/maps?q=${encodeURIComponent(location)}&output=embed&z=15`}
                        width="100%"
                        height="128"
                        style={{ border: 'none' }}
                        title="Location Map"
                        allowFullScreen=""
                        loading="lazy"
                      ></iframe>
                      <div className="absolute top-2 right-2 flex flex-col gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const iframe = e.target.closest('.bg-gray-100').querySelector('iframe');
                            const currentSrc = iframe.src;
                            const zoomMatch = currentSrc.match(/z=(\d+)/);
                            const currentZoom = zoomMatch ? parseInt(zoomMatch[1]) : 15;
                            const newZoom = Math.min(currentZoom + 1, 20);
                            iframe.src = currentSrc.replace(/z=\d+/, `z=${newZoom}`);
                          }}
                          className="bg-white hover:bg-gray-50 border border-gray-300 rounded p-1 shadow-sm"
                          title="Zoom In"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.35-4.35"></path>
                            <line x1="11" y1="8" x2="11" y2="14"></line>
                            <line x1="8" y1="11" x2="14" y2="11"></line>
                          </svg>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const iframe = e.target.closest('.bg-gray-100').querySelector('iframe');
                            const currentSrc = iframe.src;
                            const zoomMatch = currentSrc.match(/z=(\d+)/);
                            const currentZoom = zoomMatch ? parseInt(zoomMatch[1]) : 15;
                            const newZoom = Math.max(currentZoom - 1, 1);
                            iframe.src = currentSrc.replace(/z=\d+/, `z=${newZoom}`);
                          }}
                          className="bg-white hover:bg-gray-50 border border-gray-300 rounded p-1 shadow-sm"
                          title="Zoom Out"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.35-4.35"></path>
                            <line x1="8" y1="11" x2="14" y2="11"></line>
                          </svg>
                        </button>
                      </div>
                    </div>
                    <Button
                      onClick={openInMaps}
                      size="sm"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm h-8"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open in Maps
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <span>{location}</span>
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{requirements}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                {jobType}
              </span>
              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
                {level}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-400 text-sm">Last date: {timeAgo}</span>
              <Button onClick={() => {
                // Track job view when clicking "View Details"
                trackJobView(jobId);
                onClick();
              }} className="bg-black text-white hover:bg-gray-800 rounded-full px-4 py-2 text-sm">
                View Details
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}