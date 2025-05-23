import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Callback from './Callback';

const CLIENT_ID = '43d52d0d3774470688a3fec0bc7e3378';
const REDIRECT_URI = 'https://pulse-app-maxime111.replit.app/callback';
const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
const RESPONSE_TYPE = 'code';
const SCOPES = [
  'user-read-email',
  'user-top-read',
  'playlist-read-private',
  'user-library-read'
].join('%20');

function Home() {
  const loginUrl = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${SCOPES}&show_dialog=true`;

  return (
    <div className="App">
      <h1>Pulse – Spotify Artist Tracker</h1>
      <a href={loginUrl}>
        <button>Login with Spotify</button>
      </a>
      <h2>Please log in to start tracking artists.</h2>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/callback" element={<Callback />} />
      </Routes>
    </Router>
  );
}

export default App;
