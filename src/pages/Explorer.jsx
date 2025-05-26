// Updated Explorer.jsx with fixed suggestion-triggered search
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

  const searchSuggestions = [
    "Techno artists under 10K listeners",
    "Unsigned female vocalists",
    "Rising Afrobeat acts in Europe",
    "Amsterdam-based DJs",
    "Recently dropped EPs",
  ];

  useEffect(() => {
    const storedToken = localStorage.getItem('spotify_access_token');
    if (storedToken) setToken(storedToken);

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

  const handleSearch = async (overrideQuery) => {
    const searchTerm = overrideQuery || query;
    if (!searchTerm || !token) {
      setError('Missing search query or token.');
      return;
    }
    setLoading(true);
    try {
      const artists = await searchArtists(token, searchTerm);
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
    const artistId = artist.id;
    const key = `leads_${targetCampaign.toLowerCase()}`;
    const current = JSON.parse(localStorage.getItem(key)) || [];

    const currentCampaigns = savedCampaigns[artistId] || [];
    if (targetCampaign === 'Unassigned' && currentCampaigns.length > 0) return;

    if (targetCampaign !== 'Unassigned') {
      const unassignedKey = 'leads_unassigned';
      const unassigned = JSON.parse(localStorage.getItem(unassignedKey)) || [];
      const filtered = unassigned.filter(l => l.id !== artistId);
      localStorage.setItem(unassignedKey, JSON.stringify(filtered));
    }

    const newLead = {
      id: artist.id,
      name: artist.name,
      image: artist.images?.[0]?.url || '',
      status: 'New',
      campaign: targetCampaign,
    };

    const updated = [...current, newLead];
    localStorage.setItem(key, JSON.stringify(updated));

    setSavedCampaigns(prev => {
      const updated = { ...prev };
      const existing = new Set(updated[artistId] || []);
      existing.add(targetCampaign);
      updated[artistId] = Array.from(existing).filter(c => c !== 'Unassigned' || existing.size === 1);
      return updated;
    });
    setDropdownOpen(null);
  };

  const removeLead = (artistId, campaign) => {
    const key = `leads_${campaign.toLowerCase()}`;
    const current = JSON.parse(localStorage.getItem(key)) || [];
    const filtered = current.filter(l => l.id !== artistId);
    localStorage.setItem(key, JSON.stringify(filtered));

    setSavedCampaigns(prev => {
      const updated = { ...prev };
      updated[artistId] = (updated[artistId] || []).filter(c => c !== campaign);
      if (updated[artistId].length === 0) delete updated[artistId];
      return updated;
    });
  };

  const isSavedTo = (artistId, campaign) => {
    return savedCampaigns[artistId]?.includes(campaign);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Explore Artists</h2>

      {searchSuggestions.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Try one of these:</h3>
          <div className="flex flex-wrap gap-2">
            {searchSuggestions.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQuery(suggestion);
                  handleSearch(suggestion);
                }}
                className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-gray-800"
              >
                🔍 {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}

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
            const disableUnassigned = already.length > 0 && already.some(c => c !== 'Unassigned');

            return (
              <div key={artist.id} className="border-b py-4 flex items-center">
                {artist.images[0] && (
                  <img
                    src={artist.images[0].url}
                    alt={artist.name}
                    className="rounded-full mr-4 object-cover"
                    style={{ width: '80px', height: '80px', maxWidth: '80px', maxHeight: '80px', aspectRatio: '1/1', objectFit: 'cover', display: 'block' }}
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

                  <div className="mt-2 text-sm">
                    {already.length > 0 && (
                      <>
                        <span className="font-medium">Saved to:</span>
                        <div className="mt-1 flex gap-2 flex-wrap">
                          {already.map(c => (
                            <div key={c} className="flex items-center gap-1 bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full animate-fadeIn">
                              ✅ {c}
                              <button onClick={() => removeLead(artist.id, c)} className="text-red-500 ml-1 hover:text-red-700">✕</button>
                            </div>
                          ))}
                          <button
                            onClick={() => setDropdownOpen(artist.id)}
                            className="text-sm text-blue-600 hover:underline"
                          >
                            ➕ Add to another
                          </button>
                        </div>
                      </>
                    )}

                    {already.length === 0 && (
                      <button
                        onClick={() => setDropdownOpen(artist.id)}
                        className="bg-green-600 text-white px-3 py-1 mt-2 rounded hover:bg-green-700 text-sm"
                      >
                        Save to campaign
                      </button>
                    )}

                    {open && (
                      <div className="mt-2 bg-white border p-3 rounded shadow max-w-xs">
                        <div className="text-xs font-semibold text-gray-600 mb-2">Select campaigns:</div>
                        <div className="flex flex-wrap gap-2">
                          {campaignList.map(c => (
                            <button
                              key={c}
                              onClick={() => saveLead(artist, c)}
                              disabled={isSavedTo(artist.id, c) || (c === 'Unassigned' && disableUnassigned)}
                              className={`px-3 py-1 rounded text-sm border ${
                                isSavedTo(artist.id, c) || (c === 'Unassigned' && disableUnassigned)
                                  ? 'text-gray-400 border-gray-300 cursor-not-allowed'
                                  : 'hover:bg-blue-50 border-gray-400 text-black'
                              }`}
                            >
                              {isSavedTo(artist.id, c) ? `✅ ${c}` : c}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
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
