import React, { useState } from 'react';

const Explorer = () => {
  const [genre, setGenre] = useState('');
  const [platform, setPlatform] = useState('');
  const [growthType, setGrowthType] = useState('');
  const [sortBy, setSortBy] = useState('boost');

  const artists = [
    {
      name: 'Nova Aura',
      genre: 'electronic',
      boost: '+1,200 listeners (7d)',
      platform: 'Spotify',
      icon: '🪐',
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

  const sortedArtists = [...artists].sort((a, b) => {
    if (sortBy === 'alphabetical') return a.name.localeCompare(b.name);
    if (sortBy === 'boost') return b.boost.length - a.boost.length; // mock logic
    return 0;
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">🔍 Explore Emerging Artists</h1>
      <p className="text-sm text-gray-700 mb-4">
        This is where Pulse detects fast-growing artists across Spotify, TikTok, and more — based on real-time surges in listeners, mentions, or followers.
      </p>

      <div className="flex gap-2 mb-4">
        <select className="border rounded px-2 py-1 text-sm" onChange={(e) => setGenre(e.target.value)}>
          <option>Genre</option>
          <option>Electronic</option>
          <option>Pop</option>
          <option>Trap</option>
        </select>

        <select className="border rounded px-2 py-1 text-sm" onChange={(e) => setPlatform(e.target.value)}>
          <option>Platform</option>
          <option>Spotify</option>
          <option>TikTok</option>
          <option>SoundCloud</option>
        </select>

        <select className="border rounded px-2 py-1 text-sm" onChange={(e) => setGrowthType(e.target.value)}>
          <option>Growth Type</option>
          <option>Listeners</option>
          <option>Mentions</option>
          <option>Followers</option>
        </select>

        <select className="border rounded px-2 py-1 text-sm" onChange={(e) => setSortBy(e.target.value)}>
          <option value="boost">Sort by Boost</option>
          <option value="alphabetical">Sort A–Z</option>
        </select>
      </div>

      <h2 className="text-xl font-semibold mb-3">📈 Trending Boosts</h2>

      <div className="grid gap-4">
        {sortedArtists.map((artist, idx) => (
          <div key={idx} className="border rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-bold mb-1">{artist.name}</h3>
            <p className="text-sm text-gray-700">{artist.genre}</p>
            <p className="text-sm text-green-600 mt-1">{artist.boost}</p>
            <div className="flex items-center mt-2">
              <span className="mr-2">{artist.icon}</span>
              <span className="text-xs text-gray-500">{artist.platform}</span>
            </div>
            <button className="mt-3 bg-black text-white px-3 py-1 rounded text-sm hover:bg-gray-800">
              + Save to Leads
            </button>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-500 italic mt-8">
        🎯 Soon, this page will be powered by real-time data from Spotify, TikTok, SoundCloud, and more.
      </p>
    </div>
  );
};

export default Explorer;
