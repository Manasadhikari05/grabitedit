import { Search, User, Heart, Bell } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-[#3D2645] text-white">
      <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#FF6B55] rounded-lg flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 4L16 16M4 16L16 4" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-lg" style={{ fontWeight: 600 }}>skillsphere</span>
          </div>
          <nav className="flex gap-6">
            <a href="#" className="text-white/70 hover:text-white transition-colors" style={{ fontSize: '14px' }}>Overview</a>
            <a href="#" className="text-white/70 hover:text-white transition-colors" style={{ fontSize: '14px' }}>Courses</a>
            <a href="#" className="text-white/70 hover:text-white transition-colors" style={{ fontSize: '14px' }}>Assignment</a>
            <a href="#" className="text-white/70 hover:text-white transition-colors" style={{ fontSize: '14px' }}>Classmate</a>
            <a href="#" className="text-white/70 hover:text-white transition-colors" style={{ fontSize: '14px' }}>Schedule</a>
            <a href="#" className="text-white border-b-2 border-[#FF6B55] pb-[22px]" style={{ fontSize: '14px' }}>Community</a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors">
            <User size={18} />
          </button>
          <button className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors">
            <Heart size={18} />
          </button>
          <button className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors">
            <Bell size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}