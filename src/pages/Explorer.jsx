import React, { useState } from 'react';

const mockArtists = [
  {
    name: 'Nova Aura',
    genre: 'electronic',
    growthType: 'listeners',
    growthValue: '+1,200 listeners (7d)',
    platform: 'Spotify',
    platformIcon: '🎧',
  },
  {
    name: 'Rue Echo',
    genre: 'alt-pop',
    growthType: 'mentions',
    growthValue: '+3.5K TikTok mentions',
    platform: 'TikTok',
    platformIcon: '🎵',
  },
  {
    name: 'Mati Drip',
    genre: 'trap',
    growthType: 'followers',
    growthValue: '+900 followers (5d)',
    platform: 'SoundCloud',
    platformIcon: '🌊',
  },
];

const Explorer = () => {
  const [genreFilter, setGenreFilter] = useState('');
  const [platformFilter, setPlatformFilter] = useState('');
  const [growthTypeFilter, setGrowthTypeFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('boost');

  const filteredArtists = mockArtists
    .filter(artist => {
      return (
        (!genreFilter || artist.genre === genreFilter) &&
        (!platformFilter || artist.platform === platformFilter) &&
        (!growthTypeFilter || artist.growthType === growthTypeFilter)
      );
    })
    .sort((a, b) => {
      if (sortOrder === 'alphabetical') {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

  const handleSave = (artist) => {
    console.log('Saved to leads:', artist.name);
    alert(`✅ ${artist.name} added to your leads!`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">🔍 Explore Emerging Artists</h1>
      <p className="mb-4 text-sm text-gray-700 max-w-xl">
        This is where Pulse detects fast-growing artists across Spotify, TikTok, and more — based on real-time surges in listeners, mentions, or followers.
      </p>

      <div className="flex gap-4 mb-4">
        <select value={genreFilter} onChange={e => setGenreFilter(e.target.value)}>
          <option value="">Genre</option>
          <option value="electronic">Electronic</option>
          <option value="alt-pop">Alt-Pop</option>
          <option value="trap">Trap</option>
        </select>
        <select value={platformFilter} onChange={e => setPlatformFilter(e.target.value)}>
          <option value="">Platform</option>
          <option value="Spotify">Spotify</option>
          <option value="TikTok">TikTok</option>
          <option value="SoundCloud">SoundCloud</option>
        </select>
        <select value={growthTypeFilter} onChange={e => setGrowthTypeFilter(e.target.value)}>
          <option value="">Growth Type</option>
          <option value="listeners">Listeners</option>
          <option value="mentions">Mentions</option>
          <option value="followers">Followers</option>
        </select>
        <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
          <option value="boost">Sort by Boost</option>
          <option value="alphabetical">Sort A-Z</option>
        </select>
      </div>

      <h2 className="text-xl font-semibold mb-3">📈 Trending Boosts</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredArtists.map((artist, index) => (
          <div key={index} className="border p-4 rounded shadow-sm hover:shadow-md transition bg-white">
            <h3 className="text-lg font-bold">{artist.name}</h3>
            <p className="text-sm text-gray-600">{artist.genre}</p>
            <p className="text-green-600 font-semibold mt-1" title={`Boost Type: ${artist.growthType}`}>
              {artist.growthValue}
            </p>
            <p className="text-xs text-gray-500">{artist.platformIcon} {artist.platform}</p>
            <button
              onClick={() => handleSave(artist)}
              className="mt-2 text-sm text-white bg-black px-3 py-1 rounded hover:bg-gray-800"
            >
              + Save to Leads
            </button>
          </div>
        ))}
      </div>

      <p className="text-sm text-gray-400 mt-6 italic">
        🎯 Soon, this page will be powered by real-time data from Spotify, TikTok, SoundCloud, and more.
      </p>
    </div>
  );
};

export default Explorer;
