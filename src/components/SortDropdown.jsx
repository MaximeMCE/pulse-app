// SortDropdown.jsx
import React from 'react';

const SortDropdown = ({ sortBy, setSortBy }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-600 mb-1">Sort Results</label>
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      >
        <option value="">🔀 No Sorting</option>
        <option value="listeners_desc">📈 Most Listeners</option>
        <option value="listeners_asc">📉 Fewest Listeners</option>
        <option value="recent_desc">🔥 Most Recently Active</option>
        <option value="recent_asc">🕰️ Least Recently Active</option>
        <option value="alpha">🔤 A–Z</option>
      </select>
    </div>
  );
};

export default SortDropdown;
