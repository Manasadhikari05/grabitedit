import React from 'react';
import { Card } from './ui/card';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';

export function LeaderboardCard() {
  const leaderboardData = [
    { rank: 1, name: 'Sarah Chen', jobsApplied: 87, successRate: 23 },
    { rank: 2, name: 'Alex Kumar', jobsApplied: 76, successRate: 19 },
    { rank: 3, name: 'You', jobsApplied: 65, successRate: 18, isCurrentUser: true },
    { rank: 4, name: 'Maya Singh', jobsApplied: 54, successRate: 15 },
    { rank: 5, name: 'James Wilson', jobsApplied: 48, successRate: 12 },
    { rank: 6, name: 'Emma Davis', jobsApplied: 42, successRate: 10 },
    { rank: 7, name: 'Ryan Foster', jobsApplied: 38, successRate: 9 },
  ];

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy className="size-5 text-yellow-500" />;
      case 2:
        return <Medal className="size-5 text-gray-400" />;
      case 3:
        return <Award className="size-5 text-amber-600" />;
      default:
        return <span className="size-5 flex items-center justify-center opacity-50">#{rank}</span>;
    }
  };

  return (
    <Card className="p-6 bg-card border-border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="flex items-center gap-2 text-lg font-bold text-foreground">
          <TrendingUp className="size-5 text-emerald-600" />
          Top Job Seekers
        </h3>
        <span className="text-xs text-muted-foreground">This Month</span>
      </div>

      <div className="space-y-3">
        {leaderboardData.map((user) => (
          <div
            key={user.rank}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
              user.isCurrentUser
                ? 'bg-emerald-50 border-2 border-emerald-200 shadow-sm'
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            <div className="flex items-center justify-center w-8">
              {getRankIcon(user.rank)}
            </div>

            <Avatar className="size-9">
              <AvatarFallback className={user.isCurrentUser ? 'bg-emerald-600 text-white' : ''}>
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={`text-sm ${user.isCurrentUser ? 'font-semibold text-foreground' : 'text-foreground'}`}>
                  {user.name}
                </span>
                {user.isCurrentUser && (
                  <span className="text-xs bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                    You
                  </span>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                {user.jobsApplied} applications • {user.successRate}% success
              </div>
            </div>

            {user.rank <= 3 && !user.isCurrentUser && (
              <div className="text-xs opacity-40">🔥</div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
        <p className="text-xs text-blue-900">
          💡 <span className="opacity-80">Apply to 5 more jobs to reach 2nd place!</span>
        </p>
      </div>
    </Card>
  );
}