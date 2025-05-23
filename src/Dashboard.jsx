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
      <p>Email: {profile.email}</p>
      <p>Country: {profile.country}</p>
    </div>
  );
};

export default Dashboard;
