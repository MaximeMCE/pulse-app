import React, { useState, useEffect } from 'react';
import { searchArtists } from '../api/Spotify';

const ArtistSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [token, setToken] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('spotify_access_token');
    if (storedToken) {
      console.log('✅ Token loaded in ArtistSearch:', storedToken);
      setToken(storedToken);
    } else {
      console.warn('❌ No token found in localStorage');
    }
  }, []);

  const handleSearch = async () => {
    console.log('🔍 Searching for:', query);
    console.log('🎟️ Token used:', token);

    if (!query || !token) {
      setError('Missing search query or token.');
      return;
    }

    try {
      const artists = await searchArtists(token, query);
      console.log('🎯 API results:', artists);

      if (artists.length === 0) {
        setError('No artists found.');
        setResults([]);
      } else {
        setError('');
        setResults(artists);
      }
    } catch (err) {
      console.error('🚨 Search failed:', err);
      setError('Search failed. Check console for details.');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Search Artists</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search for an artist"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border px-4 py-2 rounded-md w-full"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Search
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div>
        {results.map((artist) => {
          if (!artist || !artist.id || !artist.name) return null;

          const image = artist.images?.[0]?.url || '';
          const genres = Array.isArray(artist.genres) ? artist.genres.slice(0, 2).join(', ') : 'N/A';
          const followers =
            typeof artist.followers?.total === 'number'
              ? artist.followers.total.toLocaleString()
              : 'N/A';

          return (
            <div key={artist.id} className="border-b py-2 flex items-center">
              {image && (
                <img
                  src={image}
                  alt={artist.name}
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
              )}
              <div>
                <div className="font-semibold">{artist.name}</div>
                <div className="text-sm text-gray-500">Followers: {followers}</div>
                <div className="text-sm text-gray-400">Genres: {genres}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ArtistSearch;
