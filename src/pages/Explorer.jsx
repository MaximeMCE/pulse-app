import React, { useState } from 'react';
import axios from 'axios';

function Explorer() {
  const [input, setInput] = useState('');
  const [artists, setArtists] = useState([]);
  const [error, setError] = useState('');

  const token = localStorage.getItem('spotify_access_token');

  const handleSearch = async () => {
    setError('');
    setArtists([]);

    let artistId;

    try {
      console.log("Using token for API call:", token);

      if (input.includes('spotify.com') || input.startsWith('spotify:artist:')) {
        const match = input.match(/artist\/([a-zA-Z0-9]+)|spotify:artist:([a-zA-Z0-9]+)/);
        artistId = match?.[1] || match?.[2];
      } else {
        const searchRes = await axios.get(`https://api.spotify.com/v1/search?q=${encodeURIComponent(input)}&type=artist&limit=1`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log('Search result artist object:', searchRes.data.artists.items[0]);
        artistId = searchRes.data.artists.items[0]?.id;
      }

      if (!artistId) {
        setError('Artist not found.');
        return;
      }

      // Step: Check if artist exists
      try {
        await axios.get(`https://api.spotify.com/v1/artists/${artistId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch {
        setError('Artist not found or invalid.');
        return;
      }

      // Fetch related artists
      const relatedRes = await axios.get(`https://api.spotify.com/v1/artists/${artistId}/related-artists`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setArtists(relatedRes.data.artists);
    } catch (err) {
      console.error(err);
      setError('Error fetching artists.');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Explore Artists</h1>

      <div className="flex items-center gap-2 mb-6">
        <input
          type="text"
          placeholder="Enter artist name or Spotify URI"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border border-gray-300 rounded p-2 w-full"
        />
        <button
          onClick={handleSearch}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {artists.map((artist) => (
          <div key={artist.id} className="border p-4 rounded shadow">
            <img
              src={artist.images[0]?.url || 'https://via.placeholder.com/150'}
              alt={artist.name}
              className="w-full h-48 object-cover rounded mb-2"
            />
            <h2 className="font-semibold">{artist.name}</h2>
            <p className="text-sm text-gray-600">
              {artist.followers.total.toLocaleString()} followers
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Explorer;
