import React, { useState, useEffect } from 'react';
import { searchArtists } from '../api/Spotify';

const Explorer = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [unassignedLeads, setUnassignedLeads] = useState([]);
  const [campaignLeads, setCampaignLeads] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const campaignId = 'demo-campaign-001';

  useEffect(() => {
    const storedToken = localStorage.getItem('spotify_access_token');
    if (storedToken) setToken(storedToken);

    const unassigned = JSON.parse(localStorage.getItem('leads_unassigned')) || [];
    const campaign = JSON.parse(localStorage.getItem(`leads_${campaignId}`)) || [];
    setUnassignedLeads(unassigned);
    setCampaignLeads(campaign);
  }, []);

  const handleSearch = async () => {
    if (!query || !token) {
      setError('Missing search query or token.');
      return;
    }

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
      setError('Search failed. Check console.');
    }
  };

  const saveLead = (artist, target) => {
    if (target === 'unassigned') {
      const updated = [...unassignedLeads, artist];
      setUnassignedLeads(updated);
      localStorage.setItem('leads_unassigned', JSON.stringify(updated));
    } else if (target === 'campaign') {
      const updated = [...campaignLeads, artist];
      setCampaignLeads(updated);
      localStorage.setItem(`leads_${campaignId}`, JSON.stringify(updated));
    }

    setDropdownOpen(null);
  };

  const isAlreadySaved = (artistId) => {
    return (
      unassignedLeads.some((a) => a.id === artistId) ||
      campaignLeads.some((a) => a.id === artistId)
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Explore Artists</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
        className="flex gap-2 mb-4"
      >
        <input
          type="text"
          placeholder="Search for an artist"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border px-4 py-2 rounded-md w-full"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Search
        </button>
      </form>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div>
        {results.map((artist) => {
          const alreadySaved = isAlreadySaved(artist.id);
          const open = dropdownOpen === artist.id;

          return (
            <div key={artist.id} className="border-b py-4 flex items-center relative">
              {artist.images[0] && (
                <img
                  src={artist.images[0].url}
                  alt={artist.name}
                  className="w-[100px] h-[100px] rounded-full mr-4 object-cover"
                />
              )}
              <div className="flex-1">
                <div className="font-semibold">{artist.name}</div>
                <div className="text-sm text-gray-500">
                  Followers: {artist.followers.total.toLocaleString()}
                </div>
                <div className="text-sm text-gray-400">
                  Genres: {artist.genres.slice(0, 2).join(', ') || 'N/A'}
                </div>

                {!alreadySaved && (
                  <div className="relative mt-2">
                    <button
                      onClick={() =>
                        setDropdownOpen((prev) => (prev === artist.id ? null : artist.id))
                      }
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                    >
                      Save
                    </button>

                    {open && (
                      <div className="absolute z-10 mt-1 bg-white border shadow rounded text-sm">
                        <button
                          onClick={() => saveLead(artist, 'unassigned')}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          Save to Unassigned
                        </button>
                        <button
                          onClick={() => saveLead(artist, 'campaign')}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          Save to Campaign: {campaignId}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {alreadySaved && (
                  <div className="mt-2 text-xs text-green-700 font-medium">
                    ✅ Already Saved
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Explorer;
