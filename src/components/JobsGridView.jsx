import { JobListItem } from "./JobListItem";

export function JobsGridView({ jobs, onJobClick }) {
  return (
    <div className="bg-gray-50 rounded-2xl p-6 h-full overflow-auto border border-gray-200">
      <h2 className="mb-6">Bookmarked Jobs</h2>
      <div className="space-y-0">
        {jobs.map((job) => (
          <JobListItem
            key={job._id}
            companyName={job.company_id?.name || 'Unknown Company'}
            position={job.title}
            location={`${typeof job.location === 'object' ? job.location.address : job.location} - ${job.work_location}`}
            salary={job.salary ? `${job.salary.replace('$', '₹')}/month` : 'Salary not specified'}
            jobType={job.job_type}
            level={job.experience_level}
            requirements={job.requirements}
            paymentInfo=""
            timeAgo={job.last_date ? new Date(job.last_date).toLocaleDateString() : 'No deadline'}
            logo={
              <img
                src={job.company_id?.logo || "https://images.unsplash.com/photo-1637489981573-e45e9297cb21?w=100&h=100&fit=crop"}
                alt={job.company_id?.name || 'Company'}
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1637489981573-e45e9297cb21?w=100&h=100&fit=crop";
                }}
              />
            }
            logoColor="#4DB8FF"
            onClick={() => onJobClick(job._id)}
            jobId={job._id}
          />
        ))}
      </div>
    </div>
  );
}