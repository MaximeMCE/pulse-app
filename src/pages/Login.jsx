// /pages/Login.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateCodeVerifier, generateCodeChallenge } from '../pkce';

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (code) {
      const codeVerifier = localStorage.getItem('spotify_code_verifier');

      fetch('/.netlify/functions/getSpotifyToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, codeVerifier }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.access_token) {
            localStorage.setItem('spotify_access_token', data.access_token);
            window.history.replaceState({}, document.title, '/');
            navigate('/campaigns');
          } else {
            console.error("Failed to get token:", data);
          }
        })
        .catch(err => {
          console.error("Fetch error:", err);
        });
    }
  }, [navigate]);

  const handleLogin = async () => {
    const redirectUri = `${window.location.origin}/login`;
    const scopes = ["user-read-recently-played"].join(' ');

    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    localStorage.setItem("spotify_code_verifier", codeVerifier);

    // ⬇️ Fetch client ID from Netlify function
    const res = await fetch('/.netlify/functions/getSpotifyClientId');
    const { clientId } = await res.json();

    const authUrl = `https://accounts.spotify.com/authorize?` +
      `client_id=${clientId}` +
      `&response_type=code` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=${encodeURIComponent(scopes)}` +
      `&code_challenge_method=S256` +
      `&code_challenge=${codeChallenge}`;

    window.location.href = authUrl;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-6">Welcome to Scora</h1>
        <p className="mb-4 text-gray-300">Track emerging artists before they blow up.</p>
        <button
          onClick={handleLogin}
          className="bg-green-500 hover:bg-green-400 px-6 py-3 rounded-full font-semibold"
        >
          Connect with Spotify
        </button>
      </div>
    </div>
  );
};

export default Login;
