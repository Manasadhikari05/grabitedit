import { Menu, Plus, Star, Clock, Settings, Sparkles, MessageSquare } from "lucide-react";

export function ChatSidebar({ chatHistory, onNewChat }) {
  const todayChats = chatHistory.filter(chat => chat.date.includes('Today'));
  const yesterdayChats = chatHistory.filter(chat => chat.date.includes('Yesterday'));
  const olderChats = chatHistory.filter(chat => !chat.date.includes('Today') && !chat.date.includes('Yesterday'));

  return (
    <div className="w-[380px] bg-black/20 backdrop-blur-xl border-r border-white/10 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-white">Grab It AI</h2>
            <p className="text-gray-400 text-sm">Job Search Assistant</p>
          </div>
          <button className="hover:bg-white/10 p-2 rounded-xl transition-all duration-300">
            <Menu className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* New Chat Button */}
      <div className="px-6 py-4">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          <span>New Chat</span>
        </button>
      </div>

      {/* Quick Actions */}
      <div className="px-6 py-2 flex gap-2">
        <button className="flex-1 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/5 hover:scale-105">
          <Star className="w-5 h-5 text-yellow-400 mx-auto" />
        </button>
        <button className="flex-1 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/5 hover:scale-105">
          <Clock className="w-5 h-5 text-blue-400 mx-auto" />
        </button>
        <button className="flex-1 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 border border-white/5 hover:scale-105">
          <MessageSquare className="w-5 h-5 text-purple-400 mx-auto" />
        </button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {todayChats.length > 0 && (
          <div>
            <h3 className="mb-3 text-gray-400 text-sm">Today</h3>
            <div className="space-y-2">
              {todayChats.map((chat, index) => (
                <button
                  key={chat.id}
                  className="w-full p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 text-left border border-white/5 group hover:scale-105"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="mb-1 truncate text-white group-hover:text-blue-400 transition-colors">{chat.title}</div>
                      <div className="text-gray-400 text-sm truncate">{chat.preview}</div>
                    </div>
                  </div>
                  <div className="text-gray-500 text-xs mt-2">{chat.date}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {yesterdayChats.length > 0 && (
          <div>
            <h3 className="mb-3 text-gray-400 text-sm">Yesterday</h3>
            <div className="space-y-2">
              {yesterdayChats.map((chat, index) => (
                <button
                  key={chat.id}
                  className="w-full p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 text-left border border-white/5 group hover:scale-105"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="mb-1 truncate text-white group-hover:text-blue-400 transition-colors">{chat.title}</div>
                      <div className="text-gray-400 text-sm truncate">{chat.preview}</div>
                    </div>
                  </div>
                  <div className="text-gray-500 text-xs mt-2">{chat.date}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {olderChats.length > 0 && (
          <div>
            <h3 className="mb-3 text-gray-400 text-sm">Older</h3>
            <div className="space-y-2">
              {olderChats.map((chat, index) => (
                <button
                  key={chat.id}
                  className="w-full p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 text-left border border-white/5 group hover:scale-105"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="mb-1 truncate text-white group-hover:text-blue-400 transition-colors">{chat.title}</div>
                      <div className="text-gray-400 text-sm truncate">{chat.preview}</div>
                    </div>
                  </div>
                  <div className="text-gray-500 text-xs mt-2">{chat.date}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Section */}
      <div className="p-6 border-t border-white/10 space-y-3">
        <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-all duration-300 border border-white/5 hover:scale-105">
          <Settings className="w-5 h-5 text-gray-400" />
          <span className="text-gray-300">Settings</span>
        </button>

        <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 transition-all duration-300 cursor-pointer border border-white/5 hover:scale-105">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-2 border-blue-500/50">
            <span className="text-white font-semibold text-sm">U</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="truncate text-white">User</div>
            <div className="text-gray-400 text-sm truncate">user@grabit.com</div>
          </div>
        </div>
      </div>
    </div>
  );
}