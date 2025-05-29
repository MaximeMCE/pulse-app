// ✅ Updated FilterBlock.jsx with release filters matching badge logic
import React, { useState } from 'react';
import GenrePicker from './GenrePicker';

const FilterBlock = ({ onSubmitFilters }) => {
  const [listenerTier, setListenerTier] = useState('');
  const [recentRelease, setRecentRelease] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [genreSource, setGenreSource] = useState('spotify');

  const handleSubmit = () => {
    const ranges = {
      nano: [0, 5000],
      micro: [5000, 25000],
      mid: [25000, 100000],
      indie: [100000, 500000],
      any: [0, 1000000],
    };
    const [minListeners, maxListeners] = ranges[listenerTier] || [0, 1000000];
    onSubmitFilters({
      minListeners,
      maxListeners,
      recentRelease,
      genres: selectedGenres,
      genreSource,
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6 space-y-6 border border-gray-200">
      <h2 className="text-lg font-semibold">🎛 Discovery Filters</h2>

      <div>
        <label className="block text-sm font-medium mb-1">Audience Tier</label>
        <select
          value={listenerTier}
          onChange={(e) => setListenerTier(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Select audience...</option>
          <option value="micro">🎯 Micro (5K–25K)</option>
          <option value="nano">🧪 Nano (0–5K)</option>
          <option value="mid">📈 Mid (25K–100K)</option>
          <option value="indie">🔥 Upper Indie (100K–500K)</option>
          <option value="any">🌍 Any</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Recent Release</label>
        <select
          value={recentRelease}
          onChange={(e) => setRecentRelease(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Select activity window...</option>
          <option value="3">🔥 Just Dropped (≤ 3 days)</option>
          <option value="14">⚡ Actively Promoting (≤ 14 days)</option>
          <option value="45">🌀 Recently Active (≤ 45 days)</option>
          <option value="off">❄️ No activity filter</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Genre Source</label>
        <select
          value={genreSource}
          onChange={(e) => setGenreSource(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="spotify">🎵 Spotify Genres</option>
          <option value="custom">🧠 Scora AI Genres</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Genres</label>
        <GenrePicker
          selectedGenres={selectedGenres}
          onChange={setSelectedGenres}
        />
      </div>

      <button
        onClick={handleSubmit}
        className="mt-4 bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
      >
        🔍 Search
      </button>
    </div>
  );
};

export default FilterBlock;
