import React from 'react';
import { generateCodeVerifier, generateCodeChallenge } from '../pkce';

const Login = () => {
  const handleLogin = async () => {
    const redirectUri = `${window.location.origin}/callback`; // 🔁 Redirect to /callback now
    const scopes = [
      'user-read-recently-played',
      'playlist-read-private',
      'playlist-read-collaborative'
    ].join(' ');

    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    localStorage.setItem('spotify_code_verifier', codeVerifier);

    const res = await fetch('/.netlify/functions/getSpotifyClientId');
    const { clientId } = await res.json();

    const authUrl =
      `https://accounts.spotify.com/authorize?` +
      `client_id=${clientId}` +
      `&response_type=code` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&scope=${encodeURIComponent(scopes)}` +
      `&code_challenge_method=S256` +
      `&code_challenge=${codeChallenge}`;

    window.location.href = authUrl;
  };


