// Updated Explorer.jsx with logic to enforce either Unassigned OR campaign(s)
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

  const saveLead = (artist, targetCampaign) => {
    const artistId = artist.id;
    const key = `leads_${targetCampaign.toLowerCase()}`;
    const current = JSON.parse(localStorage.getItem(key)) || [];

    // Prevent saving to Unassigned if saved elsewhere
    const currentCampaigns = savedCampaigns[artistId] || [];
    if (targetCampaign === 'Unassigned' && currentCampaigns.length > 0) return;

    // Remove from Unassigned if saving to a real campaign
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
            const disableUnassigned = already.length > 0 && already.some(c => c !== 'Unassigned');

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

                  <div className="mt-2 text-sm">
                    {already.length > 0 && (
                      <>
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
