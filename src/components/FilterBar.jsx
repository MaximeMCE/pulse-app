import React, { useEffect, useState } from 'react';

const FilterBar = ({ onFilterChange }) => {
  const [listenerTier, setListenerTier] = useState('micro'); // 🎯 Default tier
  const [recentRelease, setRecentRelease] = useState('30');   // ⚡ Default: last 30 days

  useEffect(() => {
    const ranges = {
      nano: [0, 5000],
      micro: [5000, 25000],
      mid: [25000, 100000],
      indie: [100000, 500000],
      any: [0, 1000000],
    };
    const [min, max] = ranges[listenerTier];
    onFilterChange({
      minListeners: min,
      maxListeners: max,
      recentRelease, // 'off', '7', '30'
    });
  }, [listenerTier, recentRelease]);

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6 space-y-4 border border-gray-200">
      <h2 className="text-lg font-semibold">🎛 Filters</h2>

      {/* Audience Tier */}
      <div>
        <label className="block text-sm font-medium mb-1">Audience Tier</label>
        <select
          value={listenerTier}
          onChange={(e) => setListenerTier(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="micro">🎯 Micro (5K–25K)</option>
          <option value="nano">🧪 Nano (0–5K)</option>
          <option value="mid">📈 Mid (25K–100K)</option>
          <option value="indie">🔥 Upper Indie (100K–500K)</option>
          <option value="any">🌍 Any</option>
        </select>
      </div>

      {/* Recent Release */}
      <div>
        <label className="block text-sm font-medium mb-1">Recent Release</label>
        <select
          value={recentRelease}
          onChange={(e) => setRecentRelease(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="7">🔥 Fresh Drop (Last 7 days)</option>
          <option value="30">⚡ Recent Activity (Last 30 days)</option>
          <option value="off">🔍 Ignore release date</option>
        </select>
      </div>
    </div>
  );
};

export default FilterBar;
