import React, { useState } from 'react';

const sampleArtists = [
  {
    name: 'Nova Aura',
    genre: 'electronic',
    boost: '+1,200 listeners (7d)',
    platform: 'Spotify',
    icon: '🎧',
  },
  {
    name: 'Rue Echo',
    genre: 'alt-pop',
    boost: '+3.5K TikTok mentions',
    platform: 'TikTok',
    icon: '🎵',
  },
  {
    name: 'Mati Drip',
    genre: 'trap',
    boost: '+900 followers (5d)',
    platform: 'SoundCloud',
    icon: '🌊',
  },
];

const Explorer = () => {
  const [sortBy, setSortBy] = useState('boost');

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-2">🔍 Explore Emerging Artists</h1>
      <p className="text-gray-700 mb-6">
        This is where Pulse detects fast-growing artists across Spotify, TikTok, and more —
        based on real-time surges in listeners, mentions, or followers.
      </p>

      <div className="flex gap-4 mb-6">
        <select className="border rounded px-2 py-1 text-sm">
          <option>Genre</option>
        </select>
        <select className="border rounded px-2 py-1 text-sm">
          <option>Platform</option>
        </select>
        <select className="border rounded px-2 py-1 text-sm">
          <option>Growth Type</option>
        </select>
        <select
          className="border rounded px-2 py-1 text-sm"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="boost">Sort by Boost</option>
          <option value="recent">Most Recent</option>
          <option value="alpha">Alphabetical</option>
        </select>
      </div>

      <h2 className="text-xl font-semibold mb-4">📈 Trending Boosts</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sampleArtists.map((artist, index) => (
          <div key={index} className="border rounded-lg p-4 shadow bg-white">
            <h3 className="text-lg font-bold mb-1">{artist.name}</h3>
            <p className="text-sm text-gray-600 mb-1">{artist.genre}</p>
            <p className="text-green-600 font-medium mb-2">{artist.boost}</p>
            <div className="flex items-center text-gray-700 text-sm mb-2">
              <span className="mr-1">{artist.icon}</span> {artist.platform}
            </div>
            <button className="bg-black text-white text-sm px-3 py-1 rounded hover:bg-gray-800">
              + Save to Leads
            </button>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-500 mt-8 italic">
        🎯 Soon, this page will be powered by real-time data from Spotify, TikTok, SoundCloud, and more.
      </p>
    </div>
  );
};

export default Explorer;
