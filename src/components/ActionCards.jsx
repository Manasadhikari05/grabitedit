import { TrendingUp, Trophy, Sparkles, ArrowRight, FileText } from 'lucide-react';
import { Card } from './ui/card';
import { useState } from 'react';
import { InsightsModal } from './InsightsModal';
import { LeaderboardModal } from './LeaderboardModal';
import { SmartInsightsModal } from './SmartInsightsModal';

export function ActionCards({ onInsightsClick, onLeaderboardClick, onSmartInsightsClick }) {
  const [insightsModalOpen, setInsightsModalOpen] = useState(false);
  const [leaderboardModalOpen, setLeaderboardModalOpen] = useState(false);
  const [smartInsightsModalOpen, setSmartInsightsModalOpen] = useState(false);
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card
        className="p-6 cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 border-2 hover:border-blue-500"
        onClick={() => setInsightsModalOpen(true)}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="bg-blue-100 p-3 rounded-xl">
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </div>
          <ArrowRight className="w-5 h-5 text-blue-600" />
        </div>
        <h3 className="text-gray-900 mb-2">My Insights</h3>
        <p className="text-gray-600 text-sm">
          Track your job application performance and analytics.
        </p>
      </Card>

      <Card
        className="p-6 cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 border-2 hover:border-purple-500"
        onClick={() => setLeaderboardModalOpen(true)}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="bg-purple-100 p-3 rounded-xl">
            <Trophy className="w-6 h-6 text-purple-600" />
          </div>
          <ArrowRight className="w-5 h-5 text-purple-600" />
        </div>
        <h3 className="text-gray-900 mb-2">Leaderboard</h3>
        <p className="text-gray-600 text-sm">
          See how you rank among other job seekers.
        </p>
      </Card>

      <Card
        className="p-6 cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 border-2 hover:border-green-500"
        onClick={() => setSmartInsightsModalOpen(true)}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="bg-green-100 p-3 rounded-xl">
            <Sparkles className="w-6 h-6 text-green-600" />
          </div>
          <ArrowRight className="w-5 h-5 text-green-600" />
        </div>
        <h3 className="text-gray-900 mb-2">Smart Insights</h3>
        <p className="text-gray-600 text-sm">
          AI-powered recommendations tailored for you.
        </p>
      </Card>

      <InsightsModal
        open={insightsModalOpen}
        onOpenChange={setInsightsModalOpen}
      />

      <LeaderboardModal
        open={leaderboardModalOpen}
        onOpenChange={setLeaderboardModalOpen}
      />

      <SmartInsightsModal
        open={smartInsightsModalOpen}
        onOpenChange={setSmartInsightsModalOpen}
      />

      <Card
        className="p-6 cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 border-2 hover:border-orange-500"
        onClick={() => window.location.href = '/discussions'}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="bg-orange-100 p-3 rounded-xl">
            <FileText className="w-6 h-6 text-orange-600" />
          </div>
          <ArrowRight className="w-5 h-5 text-orange-600" />
        </div>
        <h3 className="text-gray-900 mb-2">My Posts</h3>
        <p className="text-gray-600 text-sm">
          View and manage your community posts.
        </p>
      </Card>
    </div>
  );
}