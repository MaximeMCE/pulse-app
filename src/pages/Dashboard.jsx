import React from 'react';

const mockTrending = [
  {
    name: 'Nova Aura',
    genre: 'electronic / downtempo',
    followers: 4200,
    source: 'Spotify',
    img: 'https://dummyimage.com/150x150/000/fff&text=Nova+Aura',
  },
  {
    name: 'Rue Echo',
    genre: 'alt-pop',
    followers: 7300,
    source: 'TikTok',
    img: 'https://dummyimage.com/150x150/000/fff&text=Rue+Echo',
  },
  {
    name: 'Mati Drip',
    genre: 'trap / experimental',
    followers: 3100,
    source: 'SoundCloud',
    img: 'https://dummyimage.com/150x150/000/fff&text=Mati+Drip',
  },
];

const Dashboard = () => {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>🎧 Pulse Dashboard</h1>

      {/* 🔥 Trending Artists */}
      <section style={{ marginTop: '2rem' }}>
        <h2>🔥 Trending Artists</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {mockTrending.map((artist, index) => (
            <div
              key={index}
              style={{
                width: '160px',
                padding: '1rem',
                border: '1px solid #ddd',
                borderRadius: '10px',
                textAlign: 'center',
              }}
            >
              <img
                src={artist.img}
                alt={artist.name}
                style={{ width: '100%', borderRadius: '8px', marginBottom: '0.5rem' }}
              />
              <strong>{artist.name}</strong>
              <p style={{ fontSize: '0.8rem', color: '#666' }}>{artist.genre}</p>
              <p style={{ fontSize: '0.8rem' }}>{artist.followers} followers</p>
              <p style={{ fontSize: '0.7rem', color: '#888' }}>{artist.source}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 📁 Hot Leads */}
      <section style={{ marginTop: '3rem' }}>
        <h2>📁 Hot Leads</h2>
        <p>No leads yet. Start scouting or add manually.</p>
        <button
          onClick={() => alert('Coming soon: Lead creation form')}
          style={{
            marginTop: '1rem',
            padding: '10px 16px',
            fontSize: '1rem',
            backgroundColor: '#000',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          ➕ Add New Lead
        </button>
      </section>

      {/* 🎯 Scout Now */}
      <section style={{ marginTop: '3rem' }}>
        <h2>🎯 Scout Now</h2>
        <p>
          Coming soon: artist search engine to find leads by genre, growth, and followers.
        </p>
        <button
          style={{
            marginTop: '0.5rem',
            padding: '10px 20px',
            fontSize: '1rem',
            backgroundColor: '#1DB954',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
          }}
        >
          🔍 Open Search View
        </button>
      </section>
    </div>
  );
};

export default Dashboard;
