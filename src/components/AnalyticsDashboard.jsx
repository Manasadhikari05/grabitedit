import React from 'react';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Briefcase, Bookmark, TrendingUp, Target, Flame, Calendar, CheckCircle2 } from 'lucide-react';
import { Progress } from './ui/progress';

export function AnalyticsDashboard() {
  const weeklyData = [
    { day: 'Mon', applications: 3 },
    { day: 'Tue', applications: 5 },
    { day: 'Wed', applications: 2 },
    { day: 'Thu', applications: 7 },
    { day: 'Fri', applications: 4 },
    { day: 'Sat', applications: 1 },
    { day: 'Sun', applications: 3 },
  ];

  const monthlyData = [
    { week: 'Week 1', applications: 15 },
    { week: 'Week 2', applications: 22 },
    { week: 'Week 3', applications: 18 },
    { week: 'Week 4', applications: 25 },
  ];

  const stats = [
    {
      icon: Briefcase,
      label: 'Total Applied',
      value: '65',
      change: '+12 this week',
      color: 'bg-blue-500',
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      icon: Bookmark,
      label: 'Saved Jobs',
      value: '24',
      change: '8 new today',
      color: 'bg-purple-500',
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      icon: CheckCircle2,
      label: 'Responses',
      value: '12',
      change: '18% success rate',
      color: 'bg-emerald-500',
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    },
    {
      icon: Target,
      label: 'Interviews',
      value: '5',
      change: '2 scheduled',
      color: 'bg-orange-500',
      iconBg: 'bg-orange-50',
      iconColor: 'text-orange-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-5 hover:shadow-lg transition-shadow bg-card border-border">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-foreground mb-2">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.change}</p>
                </div>
                <div className={`${stat.iconBg} p-3 rounded-xl`}>
                  <Icon className={`size-6 ${stat.iconColor}`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Application Success Rate */}
      <Card className="p-6 bg-card border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="flex items-center gap-2 text-lg font-bold text-foreground">
            <TrendingUp className="size-5 text-emerald-600" />
            Application Success Rate
          </h3>
          <span className="text-sm text-muted-foreground">12 out of 65 applied</span>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-foreground">
            <span>Reply Rate</span>
            <span className="font-semibold">18%</span>
          </div>
          <Progress value={18} className="h-2" />
          <div className="grid grid-cols-3 gap-4 pt-2">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">Applied</div>
              <div className="text-xl font-bold text-foreground">65</div>
            </div>
            <div className="text-center p-3 bg-emerald-50 rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">Replied</div>
              <div className="text-xl font-bold text-emerald-600">12</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-xs text-muted-foreground mb-1">Interviews</div>
              <div className="text-xl font-bold text-orange-600">5</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Active Streak */}
      <Card className="p-6 bg-gradient-to-br from-orange-50 to-red-50 border-orange-100">
        <div className="flex items-center gap-4">
          <div className="bg-white p-4 rounded-full shadow-sm">
            <Flame className="size-8 text-orange-500" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-foreground mb-1">5-Day Application Streak! 🔥</h3>
            <p className="text-sm text-muted-foreground">
              You've applied to jobs for 5 days in a row. Keep it going!
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-orange-600">5</div>
            <div className="text-xs text-muted-foreground">days</div>
          </div>
        </div>
      </Card>

      {/* Application Graph */}
      <Card className="p-6 bg-card border-border">
        <Tabs defaultValue="weekly" className="w-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="flex items-center gap-2 text-lg font-bold text-foreground">
              <Calendar className="size-5 text-blue-600" />
              Application Activity
            </h3>
            <TabsList className="bg-muted">
              <TabsTrigger value="weekly" className="data-[state=active]:bg-background data-[state=active]:text-foreground">Weekly</TabsTrigger>
              <TabsTrigger value="monthly" className="data-[state=active]:bg-background data-[state=active]:text-foreground">Monthly</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="weekly" className="mt-4">
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="colorApplications" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="applications"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fill="url(#colorApplications)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="monthly" className="mt-4">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="week" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Bar dataKey="applications" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Last Job Applied */}
      <Card className="p-6 border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-white">
        <h3 className="text-lg font-bold text-foreground mb-4">Last Job Applied</h3>
        <div className="flex items-start gap-4">
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <img
              src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%234285f4'%3E%3Cpath d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'/%3E%3Cpath d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'/%3E%3Cpath d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'/%3E%3Cpath d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'/%3E%3C/svg%3E"
              alt="Google"
              className="size-8"
            />
          </div>
          <div className="flex-1">
            <h4 className="text-base font-semibold text-foreground mb-1">Senior Frontend Developer</h4>
            <p className="text-sm text-muted-foreground mb-2">Google • Mountain View, CA</p>
            <div className="flex items-center gap-2 text-xs">
              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">Applied</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">2 days ago</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">Awaiting response</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}