import React, { useState } from 'react';
import { searchArtists } from '../api/Spotify'; // Make sure this path is correct

const Explorer = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const token = localStorage.getItem('access_token'); // or your token name

  const handleSearch = async () => {
    if (!query || !token) return;

    try {
      const artists = await searchArtists(token, query);
      if (artists.length === 0) {
        setError('No artists found.');
        setResults([]);
      } else {
        setError('');
        setResults(artists);
      }
    } catch (err) {
      console.error('Search failed:', err);
      setError('Something went wrong while searching.');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Explore Artists</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Type artist name..."
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
        {results.map((artist) => (
          <div key={artist.id} className="border-b py-2 flex items-center">
            {artist.images[0] && (
              <img
                src={artist.images[0].url}
                alt={artist.name}
                className="w-12 h-12 rounded-full mr-4 object-cover"
              />
            )}
            <div>
              <div className="font-semibold">{artist.name}</div>
              <div className="text-sm text-gray-500">
                Followers: {artist.followers.total.toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">
                Genres: {artist.genres.slice(0, 2).join(', ')}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Explorer;
