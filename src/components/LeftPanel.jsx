import { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Search, SlidersHorizontal } from 'lucide-react';
import { JobCard } from './JobCard';

export function LeftPanel({ selectedJob, onJobSelect, searchPerformed, searchQuery, setSearchQuery, onSearch }) {
  const [jobs] = useState([
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
      description: "You will play a crucial role in creating engaging and visually appealing user interfaces...",
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
      description: "We are currently growing our community of highly qualified UI Designers...",
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
      description: "We are looking for a strong UI Designer or senior UI Designer...",
      posted: "Posted 3 hours ago",
      address: "2972 Westheimer Rd. Santa Ana, London BS486",
      officeImage: "https://images.unsplash.com/photo-1692133211836-52846376d66f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvZmZpY2UlMjBidWlsZGluZyUyMGV4dGVyaW9yfGVufDF8fHx8MTc2MDg2MDcxMXww&ixlib=rb-4.1.0&q=80&w=1080",
    },
  ]);

  return (
    <div className="bg-white rounded-lg p-6 h-full flex flex-col">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="flex gap-2">
          <div className="flex-1 bg-gray-100 rounded-lg p-3 flex items-center">
            <Search className="w-4 h-4 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search for jobs, companies, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-sm placeholder-gray-400"
              onKeyPress={(e) => e.key === 'Enter' && onSearch()}
            />
          </div>
          <button className="bg-gray-100 rounded-lg p-3 flex items-center justify-center">
            <SlidersHorizontal className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-900">Search Result</h2>
        <span className="text-sm text-gray-500">28 jobs found</span>
      </div>

      {/* Job List */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-3">
          <JobCard
            job={jobs[0]}
            isActive={true}
            onClick={() => onJobSelect(0)}
            applicantsCount={jobs[0].applicantsCount || 0}
          />
          <JobCard
            job={jobs[1]}
            isActive={false}
            onClick={() => onJobSelect(1)}
            applicantsCount={jobs[1].applicantsCount || 0}
          />
          <JobCard
            job={jobs[2]}
            isActive={false}
            onClick={() => onJobSelect(2)}
            applicantsCount={jobs[2].applicantsCount || 0}
          />
        </div>
      </div>
    </div>
  );
}