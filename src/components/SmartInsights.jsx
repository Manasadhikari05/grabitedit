import { motion } from 'framer-motion';
import { Badge } from './ui/badge';
import { Sparkles, Target, TrendingUp, Brain, Zap, Award, Briefcase, MapPin, CheckCircle2, ArrowUpRight, Star, FileText, Code, Palette, Bookmark, BookOpen, Users, MessageSquare } from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { useState, useEffect } from 'react';

import { API_BASE_URL } from './client';

const recommendedJobs = [];

const careerTips = [
   {
     icon: BookOpen,
     title: 'Keep Learning New Skills',
     description: 'Stay ahead in your field by continuously learning new technologies and skills',
     impact: 'high',
     color: 'from-purple-500 to-pink-600'
   },
   {
     icon: Users,
     title: 'Build Professional Connections',
     description: 'Network actively and build strong professional relationships in your industry',
     impact: 'high',
     color: 'from-green-500 to-emerald-600'
   },
   {
     icon: MessageSquare,
     title: 'Seek Feedback and Improve',
     description: 'Regularly seek feedback and use it to improve your skills and performance',
     impact: 'medium',
     color: 'from-yellow-500 to-orange-600'
   },
   {
     icon: Target,
     title: 'Stay Consistent and Focused',
     description: 'Maintain consistency and focus on your long-term career goals',
     impact: 'medium',
     color: 'from-indigo-500 to-purple-600'
   },
 ];

const skillMatchData = [
  { skill: 'Technical Skills', percentage: 92, color: '#8B5CF6' },
  { skill: 'Experience Level', percentage: 85, color: '#3B82F6' },
  { skill: 'Industry Knowledge', percentage: 78, color: '#10B981' },
  { skill: 'Soft Skills', percentage: 88, color: '#F59E0B' },
];

function SkillMatchBar({ skill, percentage, color }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[13px] text-gray-600">{skill}</span>
        <span className="text-[13px] text-gray-900">{percentage}%</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>
    </div>
  );
}

export function SmartInsights({ onJobClick }) {
  const [highlyRecommendedJobs, setHighlyRecommendedJobs] = useState([]);
  const [userSkills, setUserSkills] = useState([]);

  // Load user skills and fetch highly recommended jobs
  useEffect(() => {
    const loadUserData = () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setUserSkills(userData.skills || []);
      }
    };

    const fetchHighlyRecommendedJobs = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) return;

        const userData = JSON.parse(storedUser);
        const userSkills = userData.skills || [];
        const userInterests = userData.interests || [];

        // Combine skills and interests for better matching
        const combinedKeywords = [...userSkills, ...userInterests];

        console.log('User skills:', userSkills);
        console.log('User interests:', userInterests);
        console.log('Combined keywords:', combinedKeywords);

        if (combinedKeywords.length > 0) {
          // Fetch jobs with skill matching
          const response = await fetch(`${API_BASE_URL}/api/jobs?skills=${encodeURIComponent(combinedKeywords.join(','))}`);
          console.log('API response status:', response.status);
          if (response.ok) {
            const data = await response.json();
            console.log('API response data:', data);
            // Filter jobs that are highly recommended (4+ skill matches)
            const highlyRecommended = data.jobs.filter(job => job.isHighlyRecommended).slice(0, 4);
            console.log('Highly recommended jobs:', highlyRecommended);
            setHighlyRecommendedJobs(highlyRecommended);
          } else {
            console.error('API response not ok:', response.statusText);
          }
        } else {
          console.log('No skills or interests found for user');
        }
      } catch (error) {
        console.error('Error fetching highly recommended jobs:', error);
      }
    };


    loadUserData();
    fetchHighlyRecommendedJobs();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-2.5 mb-2">
          <h2 className="text-[18px]">
            AI Smart Insights
          </h2>
        </div>
        <p className="text-[13px] text-gray-500">Personalized recommendations powered by AI to accelerate your job search</p>
      </motion.div>

      {/* Recommended Jobs Grid - Using same card style as JobCard */}
      <div className="grid grid-cols-1 gap-4">
        {highlyRecommendedJobs.length > 0 ? (
          highlyRecommendedJobs.map((job, index) => {
            // Get company logo/initial
            const getCompanyLogo = () => {
              if (job.company_id?.logo) {
                return <img src={job.company_id.logo} alt={job.company_id.name} className="w-full h-full object-cover rounded-full" />;
              }
              return job.company_id?.name?.charAt(0)?.toUpperCase() || 'C';
            };

            // Get logo color
            const getLogoColor = () => {
              if (job.company_id?.logo) {
                return 'bg-white border-2 border-gray-200';
              }
              const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500', 'bg-indigo-500'];
              return colors[index % colors.length];
            };

            const matchScore = Math.min(95, 75 + (job.skillMatchScore * 2));

            return (
              <motion.div
                key={job._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                className="p-4 border border-gray-200 rounded-xl cursor-pointer transition-all hover:border-gray-300 hover:shadow-md"
                onClick={() => onJobClick && onJobClick(job)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${getLogoColor()}`}
                    >
                      {getCompanyLogo()}
                    </div>
                    <div>
                      <div className="text-gray-600 text-sm">{job.company_id?.name || 'Unknown Company'}</div>
                      <h3 className="mt-0.5 text-gray-900 font-medium">{job.title}</h3>
                      <div className="text-gray-500 text-sm mt-0.5">{job.location?.address || 'Location not specified'}</div>
                    </div>
                  </div>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <Bookmark className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                <div className="flex items-center gap-4 mb-3">
                  <span className="text-gray-900 font-medium">{job.salary ? `${job.salary.replace('$', '₹')}/month` : 'Salary not specified'}</span>
                  <span className="text-gray-600">{job.job_type || 'Full Time'}</span>
                  <span className="text-gray-600">{job.experience_level || 'Entry Level'}</span>
                </div>

                <p className="text-gray-500 text-sm mb-3 line-clamp-2">{job.description}</p>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-gray-600">
                    <span>Match: {matchScore}%</span>
                    <span className="text-gray-400">•</span>
                  </div>
                  <span className="text-gray-400">{job.work_location || 'Office'}</span>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm">No job recommendations available yet</p>
            <p className="text-gray-400 text-xs mt-1">Add skills and interests to your profile to get personalized recommendations</p>
          </div>
        )}
      </div>



      {/* Career Growth Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <h3 className="text-[16px] text-gray-900">Personalized Career Growth Tips</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {careerTips.map((tip, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.45 + index * 0.05 }}
              className="bg-white border border-gray-200 hover:border-gray-300 rounded-xl p-4 transition-all hover:shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${tip.color} flex-shrink-0`}>
                  <tip.icon className="w-4.5 h-4.5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h4 className="text-[14px] text-gray-900">{tip.title}</h4>
                    <Badge
                      className={`text-[10px] px-1.5 py-0.5 ${
                        tip.impact === 'high'
                          ? 'bg-orange-100 text-orange-700 border-orange-200'
                          : 'bg-blue-100 text-blue-700 border-blue-200'
                      }`}
                    >
                      {tip.impact}
                    </Badge>
                  </div>
                  <p className="text-[12px] text-gray-600 leading-relaxed">{tip.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

    </div>
  );
}