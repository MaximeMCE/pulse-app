// /pages/Login.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateCodeVerifier, generateCodeChallenge } from '../pkce';

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('spotify_access_token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleLogin = async () => {
    const redirectUri = `${window.location.origin}/callback`;
    const scopes = [
      "user-read-recently-played",
      "playlist-read-private",
      "playlist-read-collaborative"
    ].join(' ');

    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    localStorage.setItem("spotify_code_verifier", codeVerifier);

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
