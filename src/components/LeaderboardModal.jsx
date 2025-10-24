import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Trophy, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export function LeaderboardModal({ open, onOpenChange }) {
  const leaderboardData = [
    { rank: 1, name: 'Sarah Johnson', score: 9850, change: 'up', applications: 145, responseRate: 58 },
    { rank: 2, name: 'Michael Chen', score: 9720, change: 'down', applications: 138, responseRate: 55 },
    { rank: 3, name: 'Emily Davis', score: 9580, change: 'up', applications: 142, responseRate: 52 },
    { rank: 4, name: 'You (Emma Smith)', score: 9420, change: 'up', applications: 135, responseRate: 45, isUser: true },
    { rank: 5, name: 'James Wilson', score: 9280, change: 'same', applications: 130, responseRate: 48 },
    { rank: 6, name: 'Lisa Anderson', score: 9150, change: 'down', applications: 125, responseRate: 42 },
    { rank: 7, name: 'David Martinez', score: 9020, change: 'up', applications: 128, responseRate: 46 },
    { rank: 8, name: 'Anna Thompson', score: 8890, change: 'up', applications: 120, responseRate: 44 },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border-gray-200/50 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">Job Seeker Leaderboard</DialogTitle>
          <DialogDescription>
            See how you rank among other job seekers based on activity and performance.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100">
              <p className="text-gray-600 text-sm mb-1">Your Rank</p>
              <p className="text-gray-900">#4</p>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100">
              <p className="text-gray-600 text-sm mb-1">Your Score</p>
              <p className="text-gray-900">9,420</p>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100">
              <p className="text-gray-600 text-sm mb-1">Top 10%</p>
              <p className="text-gray-900">Active Users</p>
            </Card>
          </div>

          <Card className="p-6">
            <div className="space-y-1">
              {leaderboardData.map((user) => (
                <div
                  key={user.rank}
                  className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                    user.isUser ? 'bg-blue-50 border-2 border-blue-500' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex items-center justify-center w-8">
                      {user.rank <= 3 ? (
                        <Trophy className={`w-5 h-5 ${
                          user.rank === 1 ? 'text-yellow-500' :
                          user.rank === 2 ? 'text-gray-400' :
                          'text-orange-400'
                        }`} />
                      ) : (
                        <span className="text-gray-500">#{user.rank}</span>
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={user.isUser ? 'text-gray-900' : 'text-gray-900'}>
                          {user.name}
                        </span>
                        {user.isUser && (
                          <Badge className="bg-blue-600">You</Badge>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm">
                        {user.applications} applications • {user.responseRate}% response rate
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-gray-900">{user.score.toLocaleString()} pts</span>
                      {user.change === 'up' && <TrendingUp className="w-5 h-5 text-green-500" />}
                      {user.change === 'down' && <TrendingDown className="w-5 h-5 text-red-500" />}
                      {user.change === 'same' && <Minus className="w-5 h-5 text-gray-400" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50">
            <h3 className="mb-3">How to Climb the Leaderboard</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-purple-600">•</span>
                <span>Apply to more jobs consistently to earn points</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600">•</span>
                <span>Complete your profile and keep it updated</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600">•</span>
                <span>High response rates boost your score significantly</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600">•</span>
                <span>Engage daily to maintain your streak bonus</span>
              </li>
            </ul>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}