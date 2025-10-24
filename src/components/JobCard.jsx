import { Bookmark } from "lucide-react";

export function JobCard({
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
  isActive = false,
  onClick,
  applicantsCount,
}) {
  return (
    <div
      onClick={onClick}
      className={`p-4 border rounded-xl cursor-pointer transition-all ${
        isActive ? "border-gray-300 bg-white" : "border-gray-200 hover:border-gray-300"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: logoColor }}
          >
            {logo}
          </div>
          <div>
            <div className="text-gray-600 text-sm">{companyName}</div>
            <h3 className="mt-0.5">{position}</h3>
            <div className="text-gray-500 text-sm mt-0.5">{location}</div>
          </div>
        </div>
        <button className="p-1 hover:bg-gray-100 rounded">
          <Bookmark className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center gap-4 mb-3">
        <span className="">{salary ? salary.replace('$', '₹') : 'Salary not specified'}</span>
        <span className="text-gray-600">{jobType}</span>
        <span className="text-gray-600">{level}</span>
      </div>

      <p className="text-gray-500 text-sm mb-3 line-clamp-2">{requirements}</p>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-1 text-gray-600">
          <span>{paymentInfo}</span>
          <span className="text-gray-400">•</span>
        </div>
        <span className="text-gray-400">{timeAgo}</span>
      </div>
    </div>
  );
}