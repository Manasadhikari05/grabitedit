import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Badge } from './ui/badge';
import { Sparkles, Target, TrendingUp, Brain, Zap, Award, Briefcase, MapPin, CheckCircle2, ArrowUpRight, Star } from 'lucide-react';
import { Button } from './ui/button';

export function SmartInsightsModal({ open, onOpenChange }) {
  const aiJobSuggestions = [
    {
      title: 'Senior Frontend Developer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      salary: '$120k - $160k',
      match: 92,
      skills: ['React', 'TypeScript', 'Next.js'],
      postedDays: 2,
      applicants: 23
    },
    {
      title: 'Full Stack Engineer',
      company: 'StartupXYZ',
      location: 'Remote',
      salary: '$110k - $150k',
      match: 88,
      skills: ['Node.js', 'React', 'PostgreSQL'],
      postedDays: 1,
      applicants: 15
    },
    {
      title: 'UI/UX Engineer',
      company: 'Design Studios',
      location: 'New York, NY',
      salary: '$100k - $140k',
      match: 85,
      skills: ['Figma', 'React', 'CSS'],
      postedDays: 3,
      applicants: 31
    },
  ];

  const careerTips = [
    {
      icon: Target,
      title: 'Learn React Hooks',
      description: 'Advanced React patterns can increase your match rate by 15%',
      impact: 'high',
      color: 'from-purple-500 to-indigo-600'
    },
    {
      icon: TrendingUp,
      title: 'Add TypeScript Projects',
      description: '78% of jobs you viewed require TypeScript experience',
      impact: 'high',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      icon: Brain,
      title: 'Optimize Resume Keywords',
      description: 'Use industry-standard terms to improve ATS compatibility',
      impact: 'medium',
      color: 'from-emerald-500 to-teal-600'
    },
    {
      icon: Zap,
      title: 'Build Portfolio Projects',
      description: 'Candidates with portfolios get 40% more interview requests',
      impact: 'medium',
      color: 'from-orange-500 to-amber-600'
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto border-gray-200/50 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2.5">
            <div className="p-2.5 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl shadow-lg shadow-purple-500/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">
              AI Smart Insights
            </span>
          </DialogTitle>
          <DialogDescription className="text-[13px]">
            Personalized recommendations powered by AI to accelerate your job search
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-2">
          {/* Resume Analysis - Hero Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 text-white"
          >
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -ml-24 -mb-24" />

            <div className="relative z-10">
              <div className="flex items-start gap-4">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                  <Brain className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-[17px] mb-2 text-white">Resume Analysis Result</h3>
                  <p className="text-[14px] text-white/90 mb-4 leading-relaxed">
                    Your profile shows strong alignment with <span className="font-medium">Frontend Development</span> roles.
                    Based on your skills and experience, you're best suited for senior-level positions.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30">
                      <Award className="w-3 h-3 mr-1" />
                      Frontend: 85% match
                    </Badge>
                    <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30">
                      Full Stack: 72% match
                    </Badge>
                    <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30">
                      UI/UX: 68% match
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Skill Match Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white border border-gray-200 rounded-2xl p-6"
          >
            <div className="flex items-center gap-2 mb-5">
              <Star className="w-5 h-5 text-purple-600" />
              <h3 className="text-[16px] text-gray-900">Your Skill Match Analysis</h3>
            </div>
            <div className="space-y-4">
              {skillMatchData.map((item, index) => (
                <SkillMatchBar key={index} {...item} />
              ))}
            </div>
            <div className="mt-5 pt-5 border-t border-gray-100">
              <p className="text-[13px] text-gray-600">
                <span className="text-gray-900">Overall Match Score: </span>
                <span className="text-purple-600">86%</span> — You're in the top 15% of candidates
              </p>
            </div>
          </motion.div>

          {/* AI Job Suggestions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <h3 className="text-[16px] text-gray-900">Top Recommended Jobs for You</h3>
            </div>
            <div className="space-y-3">
              {aiJobSuggestions.map((job, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + index * 0.05 }}
                  className="group bg-white border border-gray-200 hover:border-purple-200 rounded-xl p-5 transition-all hover:shadow-md cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    {/* Company Logo Placeholder */}
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-6 h-6 text-purple-600" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-[15px] text-gray-900">{job.title}</h4>
                            <Badge className="bg-green-100 text-green-700 border-0 text-[11px] px-2 py-0.5">
                              {job.match}% match
                            </Badge>
                          </div>
                          <p className="text-[13px] text-gray-600 mb-2">{job.company}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mb-3 text-[12px] text-gray-500">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {job.location}
                        </div>
                        <div className="text-gray-900">{job.salary}</div>
                        <div className="text-gray-500">{job.postedDays}d ago</div>
                        <div className="text-gray-500">{job.applicants} applicants</div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1.5">
                          {job.skills.map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-[11px]"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                        <Button
                          size="sm"
                          className="bg-purple-600 hover:bg-purple-700 text-white text-[12px] h-8 px-3 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          View Job
                          <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Match Indicator Bar */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] text-gray-500">Skill Match</span>
                      <span className="text-[11px] text-gray-900">{job.match}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${job.match}%` }}
                        transition={{ duration: 0.8, delay: 0.3 + index * 0.1, ease: [0.4, 0, 0.2, 1] }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Career Growth Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <h3 className="text-[16px] text-gray-900">Personalized Career Growth Tips</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {careerTips.map((tip, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.35 + index * 0.05 }}
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

          {/* Quick Action Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <h3 className="text-[16px] text-gray-900">Quick Wins to Boost Your Profile</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                'Complete your "Projects" section',
                'Add React & TypeScript certifications',
                'Write a compelling summary',
                'Connect your GitHub profile'
              ].map((action, index) => (
                <div key={index} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4.5 h-4.5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-[13px] text-gray-700">{action}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}