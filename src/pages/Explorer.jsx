import React, { useState } from 'react';

const mockArtists = [
  {
    name: 'Nova Aura',
    genre: 'electronic',
    growth: '+1,200 listeners (7d)',
    platform: 'Spotify',
  },
  {
    name: 'Rue Echo',
    genre: 'alt-pop',
    growth: '+3.5K TikTok mentions',
    platform: 'TikTok',
  },
  {
    name: 'Mati Drip',
    genre: 'trap',
    growth: '+900 followers (5d)',
    platform: 'SoundCloud',
  },
];

const Explore = () => {
  const [genre, setGenre] = useState('');
  const [platform, setPlatform] = useState('');
  const [growth, setGrowth] = useState('');

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>🔍 Explore Emerging Artists</h1>
      <p style={{ marginBottom: '2rem', maxWidth: 500 }}>
        This is where Pulse detects fast-growing artists across Spotify, TikTok,
        and more — based on real-time surges in listeners, mentions, or followers.
      </p>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        <select onChange={(e) => setGenre(e.target.value)} value={genre}>
          <option value=''>Genre</option>
          <option value='electronic'>Electronic</option>
          <option value='alt-pop'>Alt-pop</option>
          <option value='trap'>Trap</option>
        </select>

        <select onChange={(e) => setPlatform(e.target.value)} value={platform}>
          <option value=''>Platform</option>
          <option value='Spotify'>Spotify</option>
          <option value='TikTok'>TikTok</option>
          <option value='SoundCloud'>SoundCloud</option>
        </select>

        <select onChange={(e) => setGrowth(e.target.value)} value={growth}>
          <option value=''>Growth Type</option>
          <option value='listeners'>+ Listeners</option>
          <option value='mentions'>+ Mentions</option>
          <option value='followers'>+ Followers</option>
        </select>

        <button disabled style={{ cursor: 'not-allowed' }}>
          🚧 Filter (Coming Soon)
        </button>
      </div>

      {/* Trending Boosted Artists */}
      <h2>📈 Trending Boosts</h2>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {mockArtists.map((artist, i) => (
          <div key={i} style={{
            border: '1px solid #ddd',
            borderRadius: 8,
            padding: '1rem',
            width: 200
          }}>
            <h3 style={{ marginBottom: 4 }}>{artist.name}</h3>
            <p style={{ margin: 0 }}>{artist.genre}</p>
            <p style={{ fontWeight: 'bold', color: '#1DB954' }}>{artist.growth}</p>
            <p style={{ fontSize: '0.8rem', color: '#888' }}>{artist.platform}</p>
          </div>
        ))}
      </div>

      {/* Coming Soon Banner */}
      <p style={{ marginTop: '3rem', fontStyle: 'italic', color: '#666' }}>
        🎯 Soon, this page will be powered by real-time data from Spotify, TikTok, SoundCloud, and more.
      </p>
    </div>
  );
};

export default Explore;
