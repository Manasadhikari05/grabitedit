import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import { Slider } from "./ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { motion } from "motion/react";
import {
  MapPin,
  Briefcase,
  DollarSign,
  Users,
  CheckCircle2,
  Share2,
  Heart,
  Plus,
  Minus,
  ChevronDown,
  Building2,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import headerImage from "figma:asset/67eb77477518270b24b43d282420b7404191ca95.png";

export function JobSearchPage() {
  const [selectedJob, setSelectedJob] = useState(0);
  const [salaryRange, setSalaryRange] = useState([1000, 10000]);

  const [filters, setFilters] = useState({
    jobType: {
      fullTime: true,
      partTime: false,
      freelance: false,
      volunteer: false,
      internship: false,
    },
    experienceLevel: {
      earlyLevel: true,
      seniorLevel: false,
      intermediate: false,
      managerial: false,
      expertLevel: false,
    },
    onLocation: {
      office: true,
      wfa: false,
      remote: false,
    },
  });

  const jobs = [
    {
      id: 1,
      title: "UI/UX Designer",
      company: "Pinterest",
      verified: true,
      logo: "P",
      logoColor: "bg-red-500",
      location: "Liverpool, UK",
      salary: "$4,000/month",
      type: "Full - Time",
      level: "Early level",
      workFrom: "Work from office",
      description:
        "You will play a crucial role in creating engaging and visually appealing user interfaces for our job posting platform. Your primary responsibility will be to design and optimize the user experience of our job posting interface, ensurin...",
      posted: "Posted 3 hours ago",
      address: "2972 Westheimer Rd. Santa Ana, London BS486",
      officeImage: "https://images.unsplash.com/photo-1692133211836-52846376d66f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvZmZpY2UlMjBidWlsZGluZyUyMGV4dGVyaW9yfGVufDF8fHx8MTc2MDg2MDcxMXww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: 2,
      title: "UI Designer",
      company: "Spotify",
      verified: true,
      logo: "S",
      logoColor: "bg-black",
      location: "Liverpool, UK",
      salary: "$3,000/month",
      type: "Full - Time",
      level: "Early level",
      workFrom: "Work from office",
      description:
        "We are currently growing our community of highly qualified UI Designers. Important note: we aim to make a long term collaboration with our Graphic Designers Partners hence your enthusiasm and availability will be much appre...",
      posted: "Posted 3 hours ago",
      address: "2972 Westheimer Rd. Santa Ana, London BS486",
      officeImage: "https://images.unsplash.com/photo-1692133211836-52846376d66f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvZmZpY2UlMjBidWlsZGluZyUyMGV4dGVyaW9yfGVufDF8fHx8MTc2MDg2MDcxMXww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: 3,
      title: "UI Designer",
      company: "Mailchimps",
      verified: true,
      logo: "M",
      logoColor: "bg-yellow-400",
      location: "Liverpool, UK",
      salary: "$4,000/month",
      type: "Full - Time",
      level: "Early level",
      workFrom: "Work from office",
      description:
        "We are looking for a strong UI Designer or senior UI Designer who has experience building a responsive UI/UX user website with Figma, Webflow and advance Framer.",
      posted: "Posted 3 hours ago",
      address: "2972 Westheimer Rd. Santa Ana, London BS486",
      officeImage: "https://images.unsplash.com/photo-1692133211836-52846376d66f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvZmZpY2UlMjBidWlsZGluZyUyMGV4dGVyaW9yfGVufDF8fHx8MTc2MDg2MDcxMXww&ixlib=rb-4.1.0&q=80&w=1080",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1800px] mx-auto px-6 py-6">
        <div className="flex gap-6">
          {/* Left Sidebar - Filters */}
          <aside className="w-72 flex-shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-6">
              {/* Filters Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-gray-900">Filters</h3>
                <button className="text-red-500 text-sm hover:text-red-600 transition-colors">
                  Reset filter
                </button>
              </div>

              {/* Job Type */}
              <div className="mb-6">
                <h4 className="text-gray-900 mb-4">Job type</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <Checkbox
                      id="fullTime"
                      checked={filters.jobType.fullTime}
                      onCheckedChange={(checked) =>
                        setFilters({
                          ...filters,
                          jobType: { ...filters.jobType, fullTime: !!checked },
                        })
                      }
                    />
                    <label htmlFor="fullTime" className="text-gray-700 text-sm cursor-pointer">
                      Full - Time
                    </label>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Checkbox
                      id="partTime"
                      checked={filters.jobType.partTime}
                      onCheckedChange={(checked) =>
                        setFilters({
                          ...filters,
                          jobType: { ...filters.jobType, partTime: !!checked },
                        })
                      }
                    />
                    <label htmlFor="partTime" className="text-gray-700 text-sm cursor-pointer">
                      Part - Time
                    </label>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Checkbox
                      id="freelance"
                      checked={filters.jobType.freelance}
                      onCheckedChange={(checked) =>
                        setFilters({
                          ...filters,
                          jobType: { ...filters.jobType, freelance: !!checked },
                        })
                      }
                    />
                    <label htmlFor="freelance" className="text-gray-700 text-sm cursor-pointer">
                      Freelance
                    </label>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Checkbox
                      id="volunteer"
                      checked={filters.jobType.volunteer}
                      onCheckedChange={(checked) =>
                        setFilters({
                          ...filters,
                          jobType: { ...filters.jobType, volunteer: !!checked },
                        })
                      }
                    />
                    <label htmlFor="volunteer" className="text-gray-700 text-sm cursor-pointer">
                      Volunteer
                    </label>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Checkbox
                      id="internship"
                      checked={filters.jobType.internship}
                      onCheckedChange={(checked) =>
                        setFilters({
                          ...filters,
                          jobType: { ...filters.jobType, internship: !!checked },
                        })
                      }
                    />
                    <label htmlFor="internship" className="text-gray-700 text-sm cursor-pointer">
                      Internship
                    </label>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="mb-6">
                <h4 className="text-gray-900 mb-4">Location</h4>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    value="Liverpool, UK"
                    className="pl-10 bg-white border-gray-300 h-10 rounded-lg text-sm"
                  />
                </div>
              </div>

              {/* Experience Level */}
              <div className="mb-6">
                <h4 className="text-gray-900 mb-4">Experience level</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <Checkbox
                      id="earlyLevel"
                      checked={filters.experienceLevel.earlyLevel}
                      onCheckedChange={(checked) =>
                        setFilters({
                          ...filters,
                          experienceLevel: { ...filters.experienceLevel, earlyLevel: !!checked },
                        })
                      }
                    />
                    <label htmlFor="earlyLevel" className="text-gray-700 text-sm cursor-pointer">
                      Early level
                    </label>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Checkbox
                      id="seniorLevel"
                      checked={filters.experienceLevel.seniorLevel}
                      onCheckedChange={(checked) =>
                        setFilters({
                          ...filters,
                          experienceLevel: { ...filters.experienceLevel, seniorLevel: !!checked },
                        })
                      }
                    />
                    <label htmlFor="seniorLevel" className="text-gray-700 text-sm cursor-pointer">
                      Senior level
                    </label>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Checkbox
                      id="intermediate"
                      checked={filters.experienceLevel.intermediate}
                      onCheckedChange={(checked) =>
                        setFilters({
                          ...filters,
                          experienceLevel: { ...filters.experienceLevel, intermediate: !!checked },
                        })
                      }
                    />
                    <label htmlFor="intermediate" className="text-gray-700 text-sm cursor-pointer">
                      Intermediate
                    </label>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Checkbox
                      id="managerial"
                      checked={filters.experienceLevel.managerial}
                      onCheckedChange={(checked) =>
                        setFilters({
                          ...filters,
                          experienceLevel: { ...filters.experienceLevel, managerial: !!checked },
                        })
                      }
                    />
                    <label htmlFor="managerial" className="text-gray-700 text-sm cursor-pointer">
                      Managerial
                    </label>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Checkbox
                      id="expertLevel"
                      checked={filters.experienceLevel.expertLevel}
                      onCheckedChange={(checked) =>
                        setFilters({
                          ...filters,
                          experienceLevel: { ...filters.experienceLevel, expertLevel: !!checked },
                        })
                      }
                    />
                    <label htmlFor="expertLevel" className="text-gray-700 text-sm cursor-pointer">
                      Expert level
                    </label>
                  </div>
                </div>
              </div>

              {/* Salary Range */}
              <div className="mb-6">
                <h4 className="text-gray-900 mb-4">Range salary</h4>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <Input
                    value={`$${salaryRange[0].toLocaleString()}`}
                    className="w-[90px] h-9 text-center border-gray-300 text-sm"
                    readOnly
                  />
                  <span className="text-gray-400">-</span>
                  <Input
                    value={`$${salaryRange[1].toLocaleString()}`}
                    className="w-[90px] h-9 text-center border-gray-300 text-sm"
                    readOnly
                  />
                </div>
                <Slider
                  value={salaryRange}
                  onValueChange={setSalaryRange}
                  min={1000}
                  max={10000}
                  step={100}
                  className="my-4"
                />
              </div>

              {/* On Location */}
              <div>
                <h4 className="text-gray-900 mb-4">On location</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <Checkbox
                      id="office"
                      checked={filters.onLocation.office}
                      onCheckedChange={(checked) =>
                        setFilters({
                          ...filters,
                          onLocation: { ...filters.onLocation, office: !!checked },
                        })
                      }
                    />
                    <label htmlFor="office" className="text-gray-700 text-sm cursor-pointer">
                      Office
                    </label>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Checkbox
                      id="wfa"
                      checked={filters.onLocation.wfa}
                      onCheckedChange={(checked) =>
                        setFilters({
                          ...filters,
                          onLocation: { ...filters.onLocation, wfa: !!checked },
                        })
                      }
                    />
                    <label htmlFor="wfa" className="text-gray-700 text-sm cursor-pointer">
                      WFA
                    </label>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Checkbox
                      id="remote"
                      checked={filters.onLocation.remote}
                      onCheckedChange={(checked) =>
                        setFilters({
                          ...filters,
                          onLocation: { ...filters.onLocation, remote: !!checked },
                        })
                      }
                    />
                    <label htmlFor="remote" className="text-gray-700 text-sm cursor-pointer">
                      Remote
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Job Listings */}
          <main className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600 text-sm">
                Showing <span className="text-gray-900">273</span> total jobs for "
                <span className="text-gray-900">UI Designer</span>"
              </p>
              <Button variant="outline" size="sm" className="gap-2 h-9 border-gray-300">
                <ChevronDown className="w-4 h-4" />
                Sort by
              </Button>
            </div>

            {/* Job Cards */}
            <div className="space-y-4">
              {jobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card
                    className={`p-6 cursor-pointer transition-all hover:shadow-md border ${
                      selectedJob === index
                        ? "border-blue-200 bg-blue-50/30"
                        : "border-gray-200 bg-white"
                    }`}
                    onClick={() => setSelectedJob(index)}
                  >
                    {/* Job Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-12 h-12 ${job.logoColor} rounded-lg flex items-center justify-center flex-shrink-0 text-white text-xl shadow-sm`}
                        >
                          {job.logo}
                        </div>
                        <div>
                          <h3 className="text-gray-900 text-lg mb-1">{job.title}</h3>
                          <div className="flex items-center gap-1.5">
                            <p className="text-gray-600 text-sm">{job.company}</p>
                            {job.verified && (
                              <CheckCircle2 className="w-4 h-4 text-blue-500 fill-current" />
                            )}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-400 text-xs">{job.posted}</p>
                    </div>

                    {/* Job Description */}
                    <p className="text-gray-600 text-sm mb-5 leading-relaxed">{job.description}</p>

                    {/* Job Details Grid */}
                    <div className="grid grid-cols-2 gap-x-8 gap-y-3 mb-5">
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm">{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Briefcase className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm">{job.type}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Building2 className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm">{job.workFrom}</span>
                      </div>
                    </div>

                    {/* Job Footer */}
                    <div className="flex items-center gap-6 pt-5 border-t border-gray-100">
                      <div className="flex items-center gap-1.5 text-green-600">
                        <DollarSign className="w-4 h-4" />
                        <span className="text-sm">{job.salary}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Users className="w-4 h-4" />
                        <span className="text-sm">{job.level}</span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </main>

          {/* Right Sidebar - Job Details */}
          <aside className="w-[400px] flex-shrink-0">
            <div className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm sticky top-6">
              {/* Header Image */}
              <div className="relative h-48">
                <img
                  src={headerImage}
                  alt="Job header"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-10 w-10 rounded-full bg-white/95 backdrop-blur-sm hover:bg-white shadow-sm"
                  >
                    <Share2 className="w-5 h-5 text-gray-700" />
                  </Button>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-10 w-10 rounded-full bg-white/95 backdrop-blur-sm hover:bg-white shadow-sm"
                  >
                    <Heart className="w-5 h-5 text-gray-700" />
                  </Button>
                </div>
              </div>

              <div className="p-6">
                {/* Job Header */}
                <div className="flex items-start gap-3 mb-2">
                  <div
                    className={`w-14 h-14 ${jobs[selectedJob].logoColor} rounded-xl flex items-center justify-center flex-shrink-0 text-white text-2xl shadow-sm`}
                  >
                    {jobs[selectedJob].logo}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-gray-900 text-lg mb-1">Senior UI Designer</h3>
                    <div className="flex items-center gap-1.5">
                      <p className="text-gray-600 text-sm">{jobs[selectedJob].company}</p>
                      {jobs[selectedJob].verified && (
                        <CheckCircle2 className="w-4 h-4 text-blue-500 fill-current" />
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-gray-400 text-xs mb-6">{jobs[selectedJob].posted}</p>

                {/* Tabs */}
                <Tabs defaultValue="maps" className="mb-6">
                  <TabsList className="grid w-full grid-cols-4 h-10 bg-gray-100 mb-6">
                    <TabsTrigger value="details" className="text-sm">
                      Details
                    </TabsTrigger>
                    <TabsTrigger value="maps" className="text-sm">
                      Maps
                    </TabsTrigger>
                    <TabsTrigger value="company" className="text-sm">
                      Company
                    </TabsTrigger>
                    <TabsTrigger value="jobs" className="text-sm">
                      Jobs
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="details" className="mt-0">
                    <div className="space-y-3 text-gray-600 text-sm">
                      <p>{jobs[selectedJob].description}</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="maps" className="mt-0">
                    {/* Map View */}
                    <div className="relative h-64 bg-gray-100 rounded-xl overflow-hidden mb-4">
                      <div className="absolute inset-0">
                        {/* Simple map with roads */}
                        <svg className="w-full h-full" viewBox="0 0 400 256">
                          <defs>
                            <pattern
                              id="map-grid"
                              width="20"
                              height="20"
                              patternUnits="userSpaceOnUse"
                            >
                              <rect width="20" height="20" fill="#f3f4f6" />
                              <path
                                d="M 20 0 L 0 0 0 20"
                                fill="none"
                                stroke="#e5e7eb"
                                strokeWidth="0.5"
                              />
                            </pattern>
                          </defs>
                          <rect width="400" height="256" fill="url(#map-grid)" />

                          {/* Roads */}
                          <line
                            x1="0"
                            y1="180"
                            x2="400"
                            y2="180"
                            stroke="#fbbf24"
                            strokeWidth="8"
                          />
                          <line
                            x1="0"
                            y1="120"
                            x2="400"
                            y2="120"
                            stroke="#d1d5db"
                            strokeWidth="5"
                          />
                          <line
                            x1="0"
                            y1="70"
                            x2="400"
                            y2="70"
                            stroke="#d1d5db"
                            strokeWidth="4"
                          />
                          <line
                            x1="200"
                            y1="0"
                            x2="200"
                            y2="256"
                            stroke="#d1d5db"
                            strokeWidth="5"
                          />
                          <line
                            x1="290"
                            y1="0"
                            x2="290"
                            y2="256"
                            stroke="#d1d5db"
                            strokeWidth="4"
                          />

                          {/* Green park areas */}
                          <rect
                            x="210"
                            y="15"
                            width="75"
                            height="50"
                            fill="#86efac"
                            opacity="0.7"
                            rx="3"
                          />
                          <rect
                            x="300"
                            y="130"
                            width="90"
                            height="40"
                            fill="#86efac"
                            opacity="0.7"
                            rx="3"
                          />
                        </svg>

                        {/* Location Pin */}
                        <div className="absolute" style={{ top: "62%", left: "52%" }}>
                          <motion.div
                            initial={{ scale: 0, y: -20 }}
                            animate={{ scale: 1, y: 0 }}
                            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                            className="relative"
                          >
                            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-xl border-4 border-white">
                              <MapPin className="w-6 h-6 text-white fill-white" />
                            </div>
                            {/* Pulse effect */}
                            <motion.div
                              className="absolute inset-0 bg-blue-400 rounded-full"
                              animate={{
                                scale: [1, 1.8, 1],
                                opacity: [0.6, 0, 0.6],
                              }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                          </motion.div>
                        </div>

                        {/* Zoom controls */}
                        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                          <button className="w-9 h-9 flex items-center justify-center border-b border-gray-200 hover:bg-gray-50 transition-colors">
                            <Plus className="w-4 h-4 text-gray-700" />
                          </button>
                          <button className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 transition-colors">
                            <Minus className="w-4 h-4 text-gray-700" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Location Info Card */}
                    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                      <div className="flex items-start gap-3">
                        <ImageWithFallback
                          src={jobs[selectedJob].officeImage}
                          alt="Office"
                          className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-900 text-sm mb-1 leading-tight">
                            {jobs[selectedJob].address}
                          </p>
                          <p className="text-pink-600 text-sm">
                            {jobs[selectedJob].company}'s office
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="company" className="mt-0">
                    <p className="text-gray-600 text-sm">Company information coming soon...</p>
                  </TabsContent>

                  <TabsContent value="jobs" className="mt-0">
                    <p className="text-gray-600 text-sm">More jobs from this company...</p>
                  </TabsContent>
                </Tabs>

                {/* Apply Button */}
                <Button className="w-full bg-blue-600 hover:bg-blue-700 h-11 rounded-xl text-base">
                  Apply now
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
