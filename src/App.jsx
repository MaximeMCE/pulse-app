import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Callback from './Callback';

const CLIENT_ID = '43d52d0d3774470688a3fec0bc7e3378';
const REDIRECT_URI = 'https://celebrated-hotteok-20bdf2.netlify.app/callback';
const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
const RESPONSE_TYPE = 'token';

const SCOPES = [
  'user-read-email',
  'user-top-read',
  'playlist-read-private',
  'user-library-read',
].join('%20');

const loginUrl = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPES}`;

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div style={{ padding: '2rem' }}>
              <h1>🎧 Pulse App</h1>
              <a href={loginUrl}>
                <button style={{ fontSize: '1.2rem', padding: '1rem' }}>
                  Login with Spotify
                </button>
              </a>
            </div>
          }
        />
        <Route path="/callback" element={<Callback />} />
      </Routes>
    </Router>
  );
}

export default App;
