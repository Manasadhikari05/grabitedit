import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { MapPin, Briefcase, DollarSign, Clock, Building2, CheckCircle2 } from 'lucide-react';

// JobDetail Component
const JobDetail = ({ job, onBackClick }) => {
  const [activeTab, setActiveTab] = useState("description");

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={onBackClick}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm font-medium">Back to all jobs</span>
        </button>
      </div>

      {/* Job Detail Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100">
          <div className="flex items-start gap-4 mb-4">
            <div
              className={`w-16 h-16 ${job.logoColor} rounded-2xl flex items-center justify-center flex-shrink-0 text-white text-3xl shadow-lg`}
            >
              {job.logo}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h1>
              <div className="flex items-center gap-2 mb-3">
                <p className="text-gray-700 font-medium">{job.company}</p>
                {job.verified && (
                  <CheckCircle2 className="w-5 h-5 text-blue-500 fill-current" />
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-green-100 text-green-800 hover:bg-green-200 px-3 py-1">
                  {job.salary}
                </Badge>
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 px-3 py-1">
                  {job.type}
                </Badge>
                <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 px-3 py-1">
                  {job.level}
                </Badge>
                <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200 px-3 py-1">
                  {job.workFrom}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-gray-600">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{job.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span className="text-sm">{job.posted}</span>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Job Details Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="description" className="text-sm font-medium">
                Description
              </TabsTrigger>
              <TabsTrigger value="company" className="text-sm font-medium">
                Company
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-0">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Job Description</h3>
                  <p className="text-gray-700 leading-relaxed mb-4">{job.description}</p>
                </div>

                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Requirements</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Strong portfolio demonstrating UI/UX design skills</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Proficiency in Figma, Adobe XD, or similar design tools</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Understanding of user-centered design principles</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Experience with responsive design and mobile-first approach</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Benefits</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Competitive salary and equity package</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Health, dental, and vision insurance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Flexible working hours and remote work options</span>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="company" className="mt-0">
              <div className="space-y-4">
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className={`w-12 h-12 ${job.logoColor} rounded-xl flex items-center justify-center text-white text-xl`}
                  >
                    {job.logo}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{job.company}</h3>
                    <p className="text-gray-600">Technology Company</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-1">Industry</h4>
                    <p className="text-gray-600 text-sm">Technology</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-1">Company Size</h4>
                    <p className="text-gray-600 text-sm">1000+ employees</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-1">Founded</h4>
                    <p className="text-gray-600 text-sm">2010</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-1">Location</h4>
                    <p className="text-gray-600 text-sm">{job.location}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">About {job.company}</h4>
                  <p className="text-gray-700 leading-relaxed">
                    {job.company} is a leading technology company that specializes in creating innovative solutions
                    for modern businesses. We are committed to fostering a collaborative and inclusive work environment
                    where creativity and innovation thrive.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <Button
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => {
                // Get current week number
                const getCurrentWeek = () => {
                  const now = new Date();
                  const startOfYear = new Date(now.getFullYear(), 0, 1);
                  const days = Math.floor((now - startOfYear) / (24 * 60 * 60 * 1000));
                  return Math.ceil((days + startOfYear.getDay() + 1) / 7);
                };

                const currentWeek = getCurrentWeek();
                const storedData = localStorage.getItem('jobsAppliedData');
                let count = 0;

                if (storedData) {
                  const data = JSON.parse(storedData);
                  if (data.week === currentWeek) {
                    count = data.count + 1;
                  } else {
                    count = 1;
                  }
                } else {
                  count = 1;
                }

                localStorage.setItem('jobsAppliedData', JSON.stringify({ week: currentWeek, count }));

                // Optional: Show success message or trigger re-render
                alert('Application submitted successfully!');
              }}
            >
              Apply Now
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

// AllJobsList Component
const AllJobsList = ({ jobs, onJobSelect }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">All Available Jobs</h2>
        <p className="text-gray-600">Discover opportunities that match your skills</p>
      </div>

      <div className="divide-y divide-gray-100">
        {jobs.map((job, index) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <div
              className="p-4 cursor-pointer transition-all duration-200 hover:bg-gray-50/80"
              onClick={() => onJobSelect(index)}
            >
              <div className="flex items-start gap-3">
                {/* Company Logo */}
                <div
                  className={`w-10 h-10 ${job.logoColor} rounded-md flex items-center justify-center flex-shrink-0 text-white text-lg font-bold shadow-sm`}
                >
                  {job.logo}
                </div>

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-gray-900 mb-0.5 leading-tight">{job.title}</h3>
                      <div className="flex items-center gap-1.5">
                        <span className="text-gray-700 font-medium text-xs">{job.company}</span>
                        {job.verified && (
                          <div className="flex items-center gap-0.5">
                            <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                            </div>
                            <span className="text-xs text-blue-600 font-medium">Verified</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500 flex-shrink-0 ml-2">
                      <Clock className="w-3 h-3" />
                      <span className="text-xs">{job.posted}</span>
                    </div>
                  </div>

                  {/* Job Details Row */}
                  <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1 text-gray-600">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <span>{job.location}</span>
                    </div>

                    <div className="flex items-center gap-1 text-green-600 font-medium">
                      <DollarSign className="w-3 h-3" />
                      <span>{job.salary}</span>
                    </div>

                    <Badge variant="outline" className="text-xs px-1.5 py-0 border-gray-300 text-gray-700">
                      {job.type}
                    </Badge>

                    <Badge variant="secondary" className="text-xs px-1.5 py-0 bg-gray-100 text-gray-700">
                      {job.level}
                    </Badge>

                    <div className="flex items-center gap-1 text-gray-600">
                      <Building2 className="w-3 h-3 text-gray-400" />
                      <span>{job.workFrom}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export function MiddlePanel({ selectedJob, jobs, onJobSelect, setSelectedJob }) {
  // Conditional rendering based on selectedJob prop
  if (selectedJob !== null) {
    // selectedJob is an object containing job details
    return <JobDetail job={selectedJob} onBackClick={() => setSelectedJob(null)} />;
  } else {
    // selectedJob is null, show all jobs list
    return <AllJobsList jobs={jobs} onJobSelect={onJobSelect} />;
  }
}