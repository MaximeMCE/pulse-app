// src/pages/Callback.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchToken = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const verifier = localStorage.getItem('spotify_code_verifier');

      if (!code || !verifier) {
        console.error("Missing code or verifier");
        return;
      }

      try {
        const res = await fetch('/.netlify/functions/getSpotifyToken', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            code,
            verifier,
            redirectUri: window.location.origin + '/callback'
          })
        });

        const data = await res.json();
        if (data.access_token) {
          localStorage.setItem('spotify_access_token', data.access_token);
          navigate('/dashboard'); // ✅ Redirect to dashboard instead of campaigns
        } else {
          console.error("Failed to get token:", data);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchToken();
  }, [navigate]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <p>Connecting to Spotify...</p>
    </div>
  );
};

export default Callback;
