import React, { useEffect, useState } from 'react';

const Dashboard = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('spotify_access_token');
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch("https://api.spotify.com/v1/me", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await res.json();
        setProfile(data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div>
      <h2 className="text-3xl font-bold mb-4">Dashboard</h2>
      {profile ? (
        <div className="space-y-2">
          <p><strong>Name:</strong> {profile.display_name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Spotify ID:</strong> {profile.id}</p>
          {profile.images?.[0] && (
            <img
              src={profile.images[0].url}
              alt="Profile"
              className="w-24 h-24 rounded-full mt-4"
            />
          )}
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default Dashboard;
