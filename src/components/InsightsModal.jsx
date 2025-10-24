import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card } from './ui/card';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function InsightsModal({ open, onOpenChange }) {
  const jobsAppliedData = [
    { month: 'Jan', applications: 12, responses: 4, interviews: 2 },
    { month: 'Feb', applications: 18, responses: 7, interviews: 3 },
    { month: 'Mar', applications: 25, responses: 10, interviews: 5 },
    { month: 'Apr', applications: 30, responses: 14, interviews: 7 },
    { month: 'May', applications: 22, responses: 11, interviews: 6 },
    { month: 'Jun', applications: 28, responses: 15, interviews: 8 },
  ];

  const performanceData = [
    { week: 'Week 1', score: 65 },
    { week: 'Week 2', score: 72 },
    { week: 'Week 3', score: 78 },
    { week: 'Week 4', score: 85 },
  ];

  const categoryData = [
    { category: 'Frontend', count: 45 },
    { category: 'Backend', count: 32 },
    { category: 'Full Stack', count: 28 },
    { category: 'DevOps', count: 15 },
    { category: 'Mobile', count: 10 },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border-gray-200/50 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">My Insights</DialogTitle>
          <DialogDescription>
            Track your job application performance with detailed analytics and insights.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="applications" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="space-y-4">
            <Card className="p-6">
              <h3 className="mb-4">Application Activity</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={jobsAppliedData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="applications" stroke="#3b82f6" strokeWidth={2} name="Applications" />
                  <Line type="monotone" dataKey="responses" stroke="#10b981" strokeWidth={2} name="Responses" />
                  <Line type="monotone" dataKey="interviews" stroke="#8b5cf6" strokeWidth={2} name="Interviews" />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4">
                <p className="text-gray-600 text-sm mb-1">Total Applications</p>
                <p className="text-gray-900">135</p>
              </Card>
              <Card className="p-4">
                <p className="text-gray-600 text-sm mb-1">Response Rate</p>
                <p className="text-gray-900">45.2%</p>
              </Card>
              <Card className="p-4">
                <p className="text-gray-600 text-sm mb-1">Interview Rate</p>
                <p className="text-gray-900">23.0%</p>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <Card className="p-6">
              <h3 className="mb-4">Performance Score</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="mb-4">Key Metrics</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Profile Completeness</span>
                    <span className="text-gray-900">92%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Application Quality</span>
                    <span className="text-gray-900">85%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Engagement Score</span>
                    <span className="text-gray-900">78%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <Card className="p-6">
              <h3 className="mb-4">Jobs by Category</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-6">
              <h3 className="mb-4">Top Applied Categories</h3>
              <div className="space-y-3">
                {categoryData.map((item, index) => (
                  <div key={item.category} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-gray-500">#{index + 1}</span>
                      <span className="text-gray-900">{item.category}</span>
                    </div>
                    <span className="text-gray-600">{item.count} jobs</span>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}