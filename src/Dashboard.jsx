import React, { useEffect, useState } from 'react';

const Dashboard = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('spotifyAccessToken');
    if (!token) return;

    fetch('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        console.log('🎧 Profile in dashboard:', data);
        setProfile(data);
      });
  }, []);

  if (!profile) return <div>Loading dashboard...</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Welcome, {profile.display_name} 👋</h1>

      {profile.images && profile.images.length > 0 && (
        <img
          src={profile.images[0].url}
          alt="Spotify profile"
          width="120"
          style={{ borderRadius: '60px', marginTop: '1rem' }}
        />
      )}

      <p>Email: {profile.email}</p>
      <p>Country: {profile.country || 'Not specified'}</p>

      <button
        onClick={() => {
          localStorage.clear();
          window.location.href = '/';
        }}
        style={{
          marginTop: '2rem',
          padding: '10px 20px',
          fontSize: '1rem',
          backgroundColor: 'black',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
