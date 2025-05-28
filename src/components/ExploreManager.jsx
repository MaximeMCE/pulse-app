// ExploreManager.jsx — Right-side panel for scouting tools
import React from 'react';

const ExploreManager = ({
  recentSearches = [],
  onSearch,
  onPin,
  onRename,
  onClear,
  editingQuery,
  setEditingQuery,
  labelInput,
  setLabelInput,
}) => {
  const safeRecent = Array.isArray(recentSearches) ? recentSearches : [];

  return (
    <div className="w-80 border-l bg-gray-50 p-4 overflow-y-auto h-full">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-md font-bold text-gray-700">Explore Manager</h2>
        <button
          onClick={onClear}
          className="text-xs text-red-500 hover:underline"
        >
          🗑️ Clear
        </button>
      </div>

      <div className="space-y-2">
        {safeRecent.map(({ query, pinned, label }, i) => (
          <div
            key={i}
            className="flex items-center bg-yellow-100 rounded-full px-3 py-1"
          >
            {editingQuery === query ? (
              <input
                value={labelInput}
                autoFocus
                onChange={(e) => setLabelInput(e.target.value)}
                onBlur={() => {
                  onRename(query, labelInput.trim());
                  setEditingQuery(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onRename(query, labelInput.trim());
                    setEditingQuery(null);
                  }
                }}
                className="text-sm px-1 bg-yellow-100 focus:outline-none"
              />
            ) : (
              <button
                onClick={() => onSearch(query)}
                className="text-sm mr-2"
              >
                🔁 {label || query}
              </button>
            )}

            <button
              onClick={() => onPin(query)}
              className="text-yellow-700 text-xs mr-1"
            >
              {pinned ? '⭐' : '☆'}
            </button>

            <button
              onClick={() => {
                setEditingQuery(query);
                setLabelInput(label || query);
              }}
              className="text-xs text-gray-500 hover:text-black"
            >
              ✏️
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExploreManager;
