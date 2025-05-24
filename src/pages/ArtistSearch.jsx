import React, { useState } from 'react';
import { searchArtists } from '../Spotify';

const ArtistSearch = ({ token }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    if (!query) return;
    const artists = await searchArtists(token, query);
    setResults(artists);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Search Artists</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search for an artist"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border rounded-md px-4 py-2 w-full"
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
                className="w-10 h-10 rounded-full mr-4"
              />
            )}
            <div>
              <div className="font-semibold">{artist.name}</div>
              <div className="text-sm text-gray-500">
                Followers: {artist.followers.total.toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArtistSearch;
