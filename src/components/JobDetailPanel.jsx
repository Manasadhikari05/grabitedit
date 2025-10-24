import { MapPin, ExternalLink, X } from "lucide-react";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useState, useEffect, useRef } from "react";
import { applyForJob, trackJobView } from "./client";

export function JobDetailPanel({
  companyName,
  position,
  location,
  salary,
  jobType,
  applicants,
  skillLevel,
  logo,
  description,
  requirements,
  onClose,
  jobId,
  applicationLink,
}) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const hasTrackedView = useRef(false);

  // Track job view when component mounts (only once per job view)
  useEffect(() => {
    const trackView = async () => {
      if (hasTrackedView.current) return; // Prevent multiple calls

      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.id && jobId) {
        try {
          hasTrackedView.current = true;
          await trackJobView(jobId);
        } catch (error) {
          console.error('Error tracking job view:', error);
          hasTrackedView.current = false; // Reset on error to allow retry
        }
      }
    };
    trackView();
  }, [jobId]); // Include jobId in dependency array to track when job changes

  const openInMaps = (e) => {
    e.stopPropagation();
    // Open location in OpenStreetMap
    const mapsUrl = `https://www.openstreetmap.org/search?query=${encodeURIComponent(location)}`;
    window.open(mapsUrl, '_blank');
    setIsPopupOpen(false);
  };

  const togglePopup = (e) => {
    e.stopPropagation();
    setIsPopupOpen(!isPopupOpen);
  };
  return (
    <div className="bg-white rounded-2xl p-6 h-full flex flex-col relative z-0">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
          {logo}
        </div>
        <div className="flex-1">
          <h2 className="mb-1">{companyName}</h2>
          <p className="text-gray-600">{position}</p>
          <div className="flex items-center gap-1 text-gray-500 text-sm mt-1 relative">
            <MapPin
              className="w-4 h-4 cursor-pointer hover:text-blue-500 transition-colors"
              onClick={togglePopup}
            />
            <span>{location}</span>
            {isPopupOpen && (
              <div
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
                onClick={togglePopup}
              >
                <div
                  className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-80 max-w-sm mx-4"
                  onClick={(e) => e.stopPropagation()}
                >
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
                  <div className="bg-gray-100 rounded h-32 mb-3 flex items-center justify-center">
                    <span className="text-sm text-gray-500">Map Preview</span>
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
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="bg-green-100 rounded-xl p-3">
          <div className="text-xs text-gray-600 mb-1">Salary</div>
          <div className="">{salary}</div>
        </div>
        <div className="bg-blue-100 rounded-xl p-3">
          <div className="text-xs text-gray-600 mb-1">Job Type</div>
          <div className="">{jobType}</div>
        </div>
        <div className="bg-orange-100 rounded-xl p-3">
          <div className="text-xs text-gray-600 mb-1">Number of Applicants</div>
          <div className="">{applicants}</div>
        </div>
        <div className="bg-purple-100 rounded-xl p-3">
          <div className="text-xs text-gray-600 mb-1">Skill</div>
          <div className="">{skillLevel}</div>
        </div>
      </div>

      <Tabs defaultValue="description" className="flex-1 flex flex-col">
        <TabsList className="w-full bg-black rounded-full mb-6">
          <TabsTrigger value="description" className="flex-1 rounded-full data-[state=active]:bg-black data-[state=active]:text-white">
            Description
          </TabsTrigger>
          <TabsTrigger value="company" className="flex-1 rounded-full data-[state=active]:bg-white data-[state=active]:text-black">
            Company
          </TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="flex-1 overflow-auto mt-0">
          <div className="space-y-6">
            <div>
              <h3 className="mb-3">Job Description</h3>
              <div className="text-gray-600 text-sm whitespace-pre-line">
                {description || "No description provided."}
              </div>
            </div>

            <div>
              <h3 className="mb-3">Requirements</h3>
              <div className="text-gray-600 text-sm whitespace-pre-line">
                {requirements || "No requirements specified."}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="company" className="flex-1 overflow-auto mt-0">
          <p className="text-gray-600">Company information will be displayed here.</p>
        </TabsContent>
      </Tabs>

      {applicationLink ? (
        <a
          href={applicationLink.startsWith('http') ? applicationLink : `https://${applicationLink}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-black text-white hover:bg-gray-800 rounded-full mt-6 h-12 flex items-center justify-center transition-colors"
          onClick={async (e) => {
            // Get current user from localStorage
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            if (!user.id) {
              e.preventDefault();
              alert('Please log in to apply for jobs.');
              return;
            }

            try {
              // Track application before redirecting
              await applyForJob(jobId, user.id);
            } catch (error) {
              console.error('Error applying for job:', error);
              e.preventDefault();
              alert('Failed to apply for job. Please try again.');
            }
          }}
        >
          Apply Now
        </a>
      ) : (
        <Button
          className="w-full bg-black text-white hover:bg-gray-800 rounded-full mt-6 h-12"
          onClick={async () => {
            // Get current user from localStorage
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            if (!user.id) {
              alert('Please log in to apply for jobs.');
              return;
            }

            try {
              await applyForJob(jobId, user.id);
              alert('Application submitted successfully! No external application link provided.');
            } catch (error) {
              console.error('Error applying for job:', error);
              alert('Failed to apply for job. Please try again.');
            }
          }}
        >
          Apply Now
        </Button>
      )}
    </div>
  );
}