// File: src/pages/Explorer.jsx

import React, { useState } from 'react';

const artists = [
  {
    name: 'Nova Aura',
    genre: 'electronic',
    platform: 'Spotify',
    growthType: 'listeners',
    growthValue: '+1,200 listeners (7d)',
  },
  {
    name: 'Rue Echo',
    genre: 'alt-pop',
    platform: 'TikTok',
    growthType: 'mentions',
    growthValue: '+3.5K TikTok mentions',
  },
  {
    name: 'Mati Drip',
    genre: 'trap',
    platform: 'SoundCloud',
    growthType: 'followers',
    growthValue: '+900 followers (5d)',
  },
];

const Explorer = () => {
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [selectedGrowth, setSelectedGrowth] = useState('');

  const filteredArtists = artists.filter((artist) => {
    return (
      (!selectedGenre || artist.genre === selectedGenre) &&
      (!selectedPlatform || artist.platform === selectedPlatform) &&
      (!selectedGrowth || artist.growthType === selectedGrowth)
    );
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">🔍 Explore Emerging Artists</h1>
      <p className="mb-4 text-sm max-w-xl">
        This is where Pulse detects fast-growing artists across Spotify, TikTok, and more — based on real-time surges in listeners, mentions, or followers.
      </p>

      <div className="flex gap-4 mb-6">
        <select
          value={selectedGenre}
          onChange={(e) => setSelectedGenre(e.target.value)}
          className="border px-2 py-1"
        >
          <option value="">Genre</option>
          <option value="electronic">Electronic</option>
          <option value="alt-pop">Alt-pop</option>
          <option value="trap">Trap</option>
        </select>

        <select
          value={selectedPlatform}
          onChange={(e) => setSelectedPlatform(e.target.value)}
          className="border px-2 py-1"
        >
          <option value="">Platform</option>
          <option value="Spotify">Spotify</option>
          <option value="TikTok">TikTok</option>
          <option value="SoundCloud">SoundCloud</option>
        </select>

        <select
          value={selectedGrowth}
          onChange={(e) => setSelectedGrowth(e.target.value)}
          className="border px-2 py-1"
        >
          <option value="">Growth Type</option>
          <option value="listeners">Listeners</option>
          <option value="mentions">Mentions</option>
          <option value="followers">Followers</option>
        </select>
      </div>

      <h2 className="text-xl font-semibold mb-4">📈 Trending Boosts</h2>
      <div className="grid gap-4">
        {filteredArtists.map((artist, i) => (
          <div key={i} className="border p-4 rounded">
            <h3 className="font-bold text-lg">{artist.name}</h3>
            <p className="text-sm">{artist.genre}</p>
            <p className="text-green-600 font-semibold text-sm">{artist.growthValue}</p>
            <p className="text-xs text-gray-500">{artist.platform}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Explorer;
