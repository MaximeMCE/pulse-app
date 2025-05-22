import React, { useState, useEffect } from 'react';
import './App.css';

const CLIENT_ID = '43d52d0d3774470688a3fec0bc7e3378'; // Replace this!
const REDIRECT_URI = 'https://d09146a5-33b1-4824-94db-f1a469c64709-00-2x4h9hl0iw10c.picard.replit.dev'; // Replace with your actual Replit app URL
const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
const RESPONSE_TYPE = 'token';

function App() {
  const [token, setToken] = useState('');
  const [searchKey, setSearchKey] = useState('');
  const [artists, setArtists] = useState([]);

  const handleLogin = () => {
    window.location = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`;
  };

  const logout = () => {
    setToken('');
    window.localStorage.removeItem('token');
  };

  useEffect(() => {
    const hash = window.location.hash;
    let token = window.localStorage.getItem('token');

    if (!token && hash) {
      token = hash.substring(1).split('&').find(elem => elem.startsWith('access_token')).split('=')[1];
      window.location.hash = '';
      window.localStorage.setItem('token', token);
    }

    setToken(token);
  }, []);

  const searchArtists = async (e) => {
    e.preventDefault();
    const response = await fetch(`https://api.spotify.com/v1/search?q=${searchKey}&type=artist`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = await response.json();
    setArtists(data.artists.items);
  };

  return (
    <div className="App">
      <h1>Pulse – Spotify Artist Tracker</h1>

      {!token ? (
        <button onClick={handleLogin}>Login to Spotify</button>
      ) : (
        <button onClick={logout}>Logout</button>
      )}

      {token ? (
        <form onSubmit={searchArtists}>
          <input
            type="text"
            onChange={e => setSearchKey(e.target.value)}
            placeholder="Search for an artist"
          />
          <button type="submit">Search</button>
        </form>
      ) : (
        <h2>Please log in to search.</h2>
      )}

      <div className="artist-list">
        {artists.map(artist => (
          <div key={artist.id} className="artist">
            {artist.images.length ? (
              <img width={100} src={artist.images[0].url} alt="" />
            ) : (
              <div>No image</div>
            )}
            <h3>{artist.name}</h3>
            <p>Followers: {artist.followers.total.toLocaleString()}</p>
            <a href={artist.external_urls.spotify} target="_blank" rel="noreferrer">
              Open in Spotify
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
