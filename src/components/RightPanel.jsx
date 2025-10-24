import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { User, Eye, FileText, TrendingUp, Briefcase } from 'lucide-react';

export function RightPanel() {
  const initialDays = [
    { name: 'Mon', applied: 0 },
    { name: 'Tue', applied: 0 },
    { name: 'Wed', applied: 0 },
    { name: 'Thu', applied: 0 },
    { name: 'Fri', applied: 0 },
    { name: 'Sat', applied: 0 },
    { name: 'Sun', applied: 0 },
  ];

  const [appliedJobsData, setAppliedJobsData] = useState(initialDays);
  const [currentDay, setCurrentDay] = useState(0); // tracks which day to update

  const [stats, setStats] = useState([
    {
      label: 'Search Results',
      value: '247',
      icon: Eye,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Applied Jobs',
      value: '0',
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Post Views',
      value: '1.2K',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      label: 'Experience',
      value: '3 Years',
      icon: Briefcase,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setAppliedJobsData(prevData => {
        const newData = [...prevData];

        // simulate applied jobs for the current day with more variation
        const randomJobs = Math.floor(Math.random() * 8) + 1; // 1 to 8 jobs
        newData[currentDay].applied += randomJobs;

        return newData;
      });

      setCurrentDay(prevDay => {
        const nextDay = (prevDay + 1) % 7;
        // Reset when we complete a full week
        if (nextDay === 0) {
          setTimeout(() => setAppliedJobsData(initialDays), 100);
        }
        return nextDay;
      });
    }, 2000); // every 2 seconds for better visibility

    return () => clearInterval(interval);
  }, [currentDay]);

  // Update total applied jobs count
  useEffect(() => {
    const totalApplied = appliedJobsData.reduce((sum, day) => sum + day.applied, 0);
    setStats(prevStats => prevStats.map(stat =>
      stat.label === 'Applied Jobs'
        ? { ...stat, value: totalApplied.toString() }
        : stat
    ));
  }, [appliedJobsData]);

  return (
    <div className="space-y-4">
      {/* Profile Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full mx-auto mb-3 flex items-center justify-center shadow-md">
          <User className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-base font-semibold text-gray-900 mb-0.5">Revaldo</h3>
        <p className="text-xs text-gray-600">Surakarta, Central Java, ID</p>
      </div>

      {/* Profile Actions */}
      <div className="space-y-2">
        <Button variant="outline" className="w-full justify-start gap-2 h-9 border-gray-300 hover:bg-gray-50 text-sm">
          <User className="w-3.5 h-3.5" />
          <span>Edit Profile</span>
        </Button>
      </div>

      {/* Applied Jobs Chart */}
      <div className="h-64 bg-white p-3 rounded-lg border border-gray-200">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Applied Jobs (This Week)</h4>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={appliedJobsData}>
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip
              cursor={{ strokeDasharray: '5 5', stroke: '#10b981', strokeWidth: 2 }}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-[200px]">
                      <div className="text-lg font-semibold text-gray-900 mb-2">
                        📊 {label} - Job Activity
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Applications:</span>
                          <span className="text-lg font-bold text-green-600">
                            {payload[0].value} job{payload[0].value !== 1 ? 's' : ''}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Day:</span>
                          <span className="text-sm font-medium text-gray-900">{label}</span>
                        </div>
                        <div className="pt-2 border-t border-gray-100">
                          <div className="text-xs text-gray-500">
                            Click to view details
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line
              type="monotone"
              dataKey="applied"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ r: 3, fill: '#10b981' }}
              activeDot={{ r: 6, fill: '#10b981', stroke: '#ffffff', strokeWidth: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Stats Cards */}
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="p-3 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-600 mb-0.5">{stat.label}</p>
                <p className="text-lg font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}