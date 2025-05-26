// Explorer.jsx with "Remove from all campaigns" and confirmation modal
import React, { useState, useEffect } from 'react';
import { searchArtists } from '../api/Spotify';

const Explorer = () => {
  const [query, setQuery] = useState(localStorage.getItem('explorer_query') || '');
  const [results, setResults] = useState(JSON.parse(localStorage.getItem('explorer_results') || '[]'));
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [savedCampaigns, setSavedCampaigns] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [recentlySaved, setRecentlySaved] = useState({});
  const [confirmRemoveAll, setConfirmRemoveAll] = useState(null);

  const campaignList = ['Madrid', 'Paris', 'Berlin', 'Unassigned'];

  useEffect(() => {
    const storedToken = localStorage.getItem('spotify_access_token');
    if (storedToken) setToken(storedToken);

    const saved = {};
    campaignList.forEach(title => {
      const raw = JSON.parse(localStorage.getItem(`leads_${title.toLowerCase()}`) || '[]');
      raw.forEach(lead => {
        if (!saved[lead.id]) saved[lead.id] = [];
        saved[lead.id].push(title);
      });
    });
    setSavedCampaigns(saved);
  }, []);

  const handleSearch = async (overrideQuery) => {
    const searchTerm = overrideQuery || query;
    if (!searchTerm || !token) return;
    setLoading(true);
    try {
      const artists = await searchArtists(token, searchTerm);
      setResults(artists);
      localStorage.setItem('explorer_results', JSON.stringify(artists));
      localStorage.setItem('explorer_query', searchTerm);
      setError(artists.length ? '' : 'No artists found.');
    } catch (err) {
      setError('Search failed.');
    } finally {
      setLoading(false);
    }
  };

  const saveLead = (artist, campaign) => {
    const key = `leads_${campaign.toLowerCase()}`;
    const leads = JSON.parse(localStorage.getItem(key)) || [];
    const updated = [...leads, {
      id: artist.id,
      name: artist.name,
      image: artist.images?.[0]?.url || '',
      status: 'New',
      campaign,
    }];
    localStorage.setItem(key, JSON.stringify(updated));
    window.dispatchEvent(new Event('leadsUpdated'));
    setSavedCampaigns(prev => ({
      ...prev,
      [artist.id]: [...new Set([...(prev[artist.id] || []), campaign])]
    }));
    setRecentlySaved({ id: artist.id, campaign });
    setTimeout(() => setRecentlySaved({}), 1500);
    setDropdownOpen(null);
  };

  const removeLead = (artistId, campaign) => {
    const key = `leads_${campaign.toLowerCase()}`;
    const updated = (JSON.parse(localStorage.getItem(key)) || []).filter(l => l.id !== artistId);
    localStorage.setItem(key, JSON.stringify(updated));
    setSavedCampaigns(prev => {
      const updated = { ...prev };
      updated[artistId] = (updated[artistId] || []).filter(c => c !== campaign);
      if (!updated[artistId].length) delete updated[artistId];
      return updated;
    });
    window.dispatchEvent(new Event('leadsUpdated'));
  };

  const removeAllCampaigns = (artistId) => {
    campaignList.forEach(c => removeLead(artistId, c));
    setConfirmRemoveAll(null);
  };

  const isSavedTo = (id, c) => savedCampaigns[id]?.includes(c);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Explore Artists</h2>
      <form onSubmit={e => { e.preventDefault(); handleSearch(); }} className="flex gap-2 mb-4">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search for an artist"
          className="border px-4 py-2 rounded-md w-full"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md">Search</button>
      </form>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {results.map((artist) => {
        const campaigns = savedCampaigns[artist.id] || [];
        const isOpen = dropdownOpen === artist.id;
        return (
          <div key={artist.id} className="border-b py-4">
            <div className="font-semibold">{artist.name}</div>
            <div className="text-sm text-gray-500">Followers: {artist.followers.total.toLocaleString()}</div>
            {campaigns.length > 0 ? (
              <div className="mt-2 text-sm">
                <span className="font-medium">Saved to:</span>
                <div className="mt-1 flex gap-2 flex-wrap">
                  {campaigns.map(c => (
                    <div key={c} className="flex items-center gap-1 bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                      ✅ {c}
                      <button onClick={() => removeLead(artist.id, c)} className="text-red-500 ml-1">✕</button>
                    </div>
                  ))}
                  <button onClick={() => setDropdownOpen(artist.id)} className="text-sm text-blue-600">➕ Add to another</button>
                  <button onClick={() => setConfirmRemoveAll(artist.id)} className="text-sm text-red-600">🗑 Remove from all</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setDropdownOpen(artist.id)} className="bg-green-600 text-white px-3 py-1 mt-2 rounded-md">Save</button>
            )}

            {isOpen && (
              <div className="mt-2 bg-white border p-3 rounded shadow max-w-xs">
                <div className="text-xs font-semibold text-gray-600 mb-2">Select campaigns:</div>
                <div className="flex flex-wrap gap-2">
                  {campaignList.map(c => (
                    <button
                      key={c}
                      onClick={() => saveLead(artist, c)}
                      disabled={isSavedTo(artist.id, c)}
                      className={`px-3 py-1 rounded text-sm border ${isSavedTo(artist.id, c) ? 'text-gray-400 border-gray-300' : 'hover:bg-blue-50 border-gray-400 text-black'}`}
                    >
                      {isSavedTo(artist.id, c) ? `✅ ${c}` : c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {confirmRemoveAll === artist.id && (
              <div className="mt-4 bg-red-50 border border-red-200 p-4 rounded">
                <p className="text-sm text-red-800">Confirm removal of this artist from all campaigns?</p>
                <div className="mt-2 flex gap-3">
                  <button onClick={() => removeAllCampaigns(artist.id)} className="bg-red-600 text-white px-3 py-1 rounded text-sm">Yes, Remove All</button>
                  <button onClick={() => setConfirmRemoveAll(null)} className="text-sm text-gray-600">Cancel</button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Explorer;
