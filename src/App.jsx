import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Callback from './Callback';
import Dashboard from './Dashboard';
import { generateCodeVerifier, generateCodeChallenge } from './pkce';

const CLIENT_ID = '43d52d0d3774470688a3fec0bc7e3378';
const REDIRECT_URI = 'https://celebrated-hotteok-20bdf2.netlify.app/callback';
const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
const SCOPES = [
  'user-read-email',
  'user-top-read',
  'playlist-read-private',
  'user-library-read',
].join('%20');

async function handleLogin() {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  localStorage.setItem('code_verifier', codeVerifier);

  const loginUrl = `${AUTH_ENDPOINT}?response_type=code&client_id=${CLIENT_ID}&scope=${SCOPES}&redirect_uri=${REDIRECT_URI}&code_challenge_method=S256&code_challenge=${codeChallenge}`;

  window.location.href = loginUrl;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div style={{ padding: '2rem' }}>
              <h1>🎧 Pulse App</h1>
              <button onClick={handleLogin} style={{ fontSize: '1.2rem', padding: '1rem' }}>
                Login with Spotify
              </button>
            </div>
          }
        />
        <Route path="/callback" element={<Callback />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
