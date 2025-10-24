import { Search, SlidersHorizontal } from 'lucide-react';

export function SearchBar({ onSearch, searchQuery, setSearchQuery }) {
  return (
    <div className="flex gap-3">
      {/* Search Input */}
      <div className="flex-1 bg-gray-100 rounded-lg p-3 flex items-center gap-3">
        <Search className="w-5 h-5 text-gray-500" />
        <input
          type="text"
          placeholder="UI Designer"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onSearch()}
          className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder-gray-500"
        />
      </div>

      {/* Filter Button */}
      <button className="bg-gray-100 rounded-lg p-3 flex items-center justify-center">
        <SlidersHorizontal className="w-5 h-5 text-gray-600" />
      </button>
    </div>
  );
}