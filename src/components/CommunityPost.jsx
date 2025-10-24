import { Search, X, Smile, Image, Paperclip } from 'lucide-react';

export function CommunityPost() {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400"></div>
            <div>
              <h2 className="text-lg" style={{ fontWeight: 600 }}>Sarah Mitchell</h2>
              <p className="text-gray-500" style={{ fontSize: '13px' }}>@sarahmitchell</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
              <Search size={18} className="text-gray-600" />
            </button>
            <button className="w-10 h-10 rounded-full bg-[#FF6B55] flex items-center justify-center hover:bg-[#FF5542] transition-colors">
              <X size={18} className="text-white" />
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-gray-700">
            <span>Hey everyone! 🎉</span>
          </p>
          <p className="text-gray-700">
            I'm thrilled to share some exciting news with you all. Starting next week, we'll be launching a brand new series on our blog focusing on [your topic of interest]. 🚀
          </p>
          <p className="text-gray-700">
            Get ready for insightful articles, expert interviews, and valuable tips that will [mention the benefits]. 🤓💡
          </p>
          <p className="text-gray-700">
            Your feedback has always been our driving force, so feel free to drop your thoughts and suggestions in the comments. Let's make this journey together! 🖊️
          </p>
          <p className="text-gray-700">
            Stay tuned for more updates! 🎬
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="text-gray-500" style={{ fontSize: '14px' }}>Add tags:</span>
          <span className="px-3 py-1 bg-gray-100 rounded-full text-gray-700" style={{ fontSize: '13px' }}>study-group</span>
          <span className="px-3 py-1 bg-gray-100 rounded-full text-gray-700" style={{ fontSize: '13px' }}>share-insight</span>
          <span className="px-3 py-1 bg-gray-100 rounded-full text-gray-700" style={{ fontSize: '13px' }}>help-question</span>
          <button className="px-3 py-1 border border-[#FF6B55] text-[#FF6B55] rounded-full hover:bg-[#FF6B55] hover:text-white transition-colors" style={{ fontSize: '13px' }}>
            + Add Tags
          </button>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex gap-4">
            <button className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
              <Smile size={18} className="text-gray-600" />
            </button>
            <button className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
              <Image size={18} className="text-gray-600" />
            </button>
            <button className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
              <Paperclip size={18} className="text-gray-600" />
            </button>
          </div>
          <button className="px-6 py-2 bg-[#FF6B55] text-white rounded-lg hover:bg-[#FF5542] transition-colors" style={{ fontWeight: 500 }}>
            Post
          </button>
        </div>
      </div>

      <div className="flex border-b border-gray-200">
        <button className="px-6 py-3 flex items-center gap-2 border-b-2 border-[#FF6B55] text-gray-900" style={{ fontSize: '14px', fontWeight: 500 }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="3" y="4" width="10" height="8" rx="1" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M6 4V3C6 2.44772 6.44772 2 7 2H9C9.55228 2 10 2.44772 10 3V4" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
          Post
        </button>
        <button className="px-6 py-3 flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors" style={{ fontSize: '14px', fontWeight: 500 }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 6C3 4.89543 3.89543 4 5 4H11C12.1046 4 13 4.89543 13 6V10C13 11.1046 12.1046 12 11 12H8L5 14V12H5C3.89543 12 3 11.1046 3 10V6Z" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
          Discussion
        </button>
      </div>
    </div>
  );
}