import { MessageCircle, Eye } from 'lucide-react';

export function DiscussionCard() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400"></div>
          <div>
            <p className="text-gray-600" style={{ fontSize: '13px' }}>By: Mikey Jonah</p>
          </div>
        </div>
        <span className="text-gray-400" style={{ fontSize: '13px' }}>2d ago</span>
      </div>

      <h3 className="text-gray-900 mb-2" style={{ fontSize: '16px', fontWeight: 600 }}>
        Title of the discussion will be placed ver here
      </h3>

      <p className="text-gray-600 mb-4" style={{ fontSize: '14px', lineHeight: '1.6' }}>
        That ipo will be a game-changer land it in region keep it lean this proposal is a win-win situation which will cause a stellar paradigm shift and produce a multi-fold increase in deliverables
      </p>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="px-3 py-1 bg-gray-100 rounded-full text-gray-700" style={{ fontSize: '12px' }}>study-group</span>
        <span className="px-3 py-1 bg-gray-100 rounded-full text-gray-700" style={{ fontSize: '12px' }}>share-insight</span>
        <span className="px-3 py-1 bg-gray-100 rounded-full text-gray-700" style={{ fontSize: '12px' }}>help-question</span>
        <span className="text-gray-500" style={{ fontSize: '12px' }}>+ 2 more tags →</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-gray-500" style={{ fontSize: '13px' }}>
          <div className="flex items-center gap-1">
            <MessageCircle size={16} />
            <span>28 replies</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye size={16} />
            <span>875 views</span>
          </div>
        </div>

        <div className="flex items-center">
          <span className="text-gray-500 mr-2" style={{ fontSize: '12px' }}>Replied by:</span>
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 border-2 border-white"></div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-400 border-2 border-white"></div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-400 border-2 border-white"></div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400 border-2 border-white"></div>
            <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
              <span className="text-gray-600" style={{ fontSize: '11px', fontWeight: 600 }}>+24</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}