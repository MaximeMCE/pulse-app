// Updated Explorer.jsx with multi-campaign visual + animation feedback
import React, { useState, useEffect } from 'react';
import { searchArtists } from '../api/Spotify';

const Explorer = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [savedCampaigns, setSavedCampaigns] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const campaignList = ['Madrid', 'Paris', 'Berlin', 'Unassigned'];

  useEffect(() => {
    const storedToken = localStorage.getItem('spotify_access_token');
    if (storedToken) setToken(storedToken);

    // Init from all localStorage leads_
    const saved = {};
    campaignList.forEach(title => {
      const raw = JSON.parse(localStorage.getItem(`leads_${title.toLowerCase()}`)) || [];
      raw.forEach(lead => {
        if (!saved[lead.id]) saved[lead.id] = [];
        saved[lead.id].push(title);
      });
    });
    setSavedCampaigns(saved);
  }, []);

  const handleSearch = async () => {
    if (!query || !token) {
      setError('Missing search query or token.');
      return;
    }
    setLoading(true);
    try {
      const artists = await searchArtists(token, query);
      if (!artists.length) {
        setError('No artists found.');
        setResults([]);
      } else {
        setError('');
        setResults(artists);
      }
    } catch (err) {
      console.error('Search failed:', err);
      setError('Search failed. Check console.');
    } finally {
      setLoading(false);
    }
  };

  const saveLead = (artist, targetCampaign) => {
    const newLead = {
      id: artist.id,
      name: artist.name,
      image: artist.images?.[0]?.url || '',
      status: 'New',
      campaign: targetCampaign,
    };

    const key = `leads_${targetCampaign.toLowerCase()}`;
    const current = JSON.parse(localStorage.getItem(key)) || [];
    const updated = [...current, newLead];
    localStorage.setItem(key, JSON.stringify(updated));

    setSavedCampaigns(prev => {
      const updated = { ...prev };
      if (!updated[artist.id]) updated[artist.id] = [];
      updated[artist.id].push(targetCampaign);
      return updated;
    });
    setDropdownOpen(null);
  };

  const isSavedTo = (artistId, campaign) => {
    return savedCampaigns[artistId]?.includes(campaign);
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

      {loading ? (
        <div className="text-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900 mx-auto" />
          <p className="mt-2 text-sm text-gray-600">Searching...</p>
        </div>
      ) : (
        <div>
          {results.map((artist) => {
            const already = savedCampaigns[artist.id] || [];
            const open = dropdownOpen === artist.id;

            return (
              <div key={artist.id} className="border-b py-4 flex items-center">
                {artist.images[0] && (
                  <img
                    src={artist.images[0].url}
                    alt={artist.name}
                    className="w-[80px] h-[80px] rounded-full mr-4 object-cover"
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

                  {already.length > 0 && (
                    <div className="mt-2 text-sm">
                      <span className="font-medium">Saved to:</span>
                      <div className="mt-1 flex gap-2 flex-wrap">
                        {already.map(c => (
                          <span
                            key={c}
                            className="animate-fadeIn bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full"
                          >
                            ✅ {c}
                          </span>
                        ))}
                        <button
                          onClick={() => setDropdownOpen(artist.id)}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          ➕ Add to another
                        </button>
                      </div>
                    </div>
                  )}

                  {already.length === 0 && (
                    <div className="relative mt-2 group">
                      <button
                        onClick={() => setDropdownOpen((p) => (p === artist.id ? null : artist.id))}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                      >
                        Save ▼
                      </button>
                      {open && (
                        <div className="absolute z-10 mt-1 bg-white border shadow rounded text-sm w-56">
                          {campaignList.map((c) => (
                            <button
                              key={c}
                              onClick={() => saveLead(artist, c)}
                              disabled={isSavedTo(artist.id, c)}
                              className={`block w-full text-left px-4 py-2 hover:bg-gray-100 ${
                                isSavedTo(artist.id, c) ? 'text-gray-400 cursor-not-allowed' : ''
                              }`}
                            >
                              {isSavedTo(artist.id, c) ? `✅ Already in ${c}` : `Save to ${c}`}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Explorer;
