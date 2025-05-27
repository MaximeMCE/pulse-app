import React, { useState, useEffect } from 'react';

const FilterBar = ({ onFilterChange }) => {
  const [minListeners, setMinListeners] = useState(0);
  const [maxListeners, setMaxListeners] = useState(100000);
  const [recentRelease, setRecentRelease] = useState('30');

  useEffect(() => {
    onFilterChange({
      minListeners,
      maxListeners,
      recentRelease, // 'off', '7', '30'
    });
  }, [minListeners, maxListeners, recentRelease]);

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6 space-y-4">
      <h2 className="text-lg font-semibold">🎛 Filters</h2>

      {/* Monthly Listeners */}
      <div>
        <label className="block text-sm font-medium mb-1">Monthly Listeners Range</label>
        <div className="flex items-center gap-4">
          <input
            type="number"
            min={0}
            max={200000}
            value={minListeners}
            onChange={(e) => setMinListeners(Number(e.target.value))}
            className="border rounded px-2 py-1 w-24"
            placeholder="Min"
          />
          <span className="text-gray-500">to</span>
          <input
            type="number"
            min={0}
            max={200000}
            value={maxListeners}
            onChange={(e) => setMaxListeners(Number(e.target.value))}
            className="border rounded px-2 py-1 w-24"
            placeholder="Max"
          />
        </div>
      </div>

      {/* Recent Release */}
      <div>
        <label className="block text-sm font-medium mb-1">Recent Release</label>
        <select
          value={recentRelease}
          onChange={(e) => setRecentRelease(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="off">Off</option>
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
        </select>
      </div>
    </div>
  );
};

export default FilterBar;

