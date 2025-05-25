import React, { useState } from 'react';
import { searchArtists } from '../api/Spotify'; // ✅ Corrected import path

const ArtistSearch = ({ token }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    if (!query || !token) return;

    try {
      const artists = await searchArtists(token, query);
      setResults(artists);
    } catch (err) {
      console.error('Search failed:', err);
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

export default ArtistSearch;
