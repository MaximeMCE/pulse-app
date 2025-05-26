// Explorer.jsx — Dynamic Campaign Sync + UI Fixes
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
  const [confirmRemove, setConfirmRemove] = useState(null);
  const [campaignList, setCampaignList] = useState([]);

  const searchSuggestions = [
    'Techno artists under 10K listeners',
    'Unsigned female vocalists',
    'Rising Afrobeat acts in Europe',
    'Amsterdam-based DJs',
    'Recently dropped EPs',
  ];

  useEffect(() => {
    const storedToken = localStorage.getItem('spotify_access_token');
    if (storedToken) setToken(storedToken);

    refreshCampaignList();
    refreshSavedCampaigns();
    window.addEventListener('leadsUpdated', refreshSavedCampaigns);
    return () => window.removeEventListener('leadsUpdated', refreshSavedCampaigns);
  }, []);

  const refreshCampaignList = () => {
    const all = Object.keys(localStorage)
      .filter(k => k.startsWith('leads_'))
      .map(k => k.replace('leads_', ''))
      .map(k => k.charAt(0).toUpperCase() + k.slice(1));
    const unique = Array.from(new Set(all));
    setCampaignList(unique);
  };

  const refreshSavedCampaigns = () => {
    const saved = {};
    const all = Object.keys(localStorage).filter(k => k.startsWith('leads_'));
    all.forEach(key => {
      const raw = JSON.parse(localStorage.getItem(key) || '[]');
      const campaign = key.replace('leads_', '').charAt(0).toUpperCase() + key.replace('leads_', '').slice(1);
      raw.forEach(lead => {
        if (!saved[lead.id]) saved[lead.id] = [];
        saved[lead.id].push(campaign);
      });
    });
    setSavedCampaigns(saved);
    refreshCampaignList();
  };

  const handleSearch = async (overrideQuery) => {
    const searchTerm = overrideQuery || query;
    if (!searchTerm || !token) {
      setError('Missing search query or token.');
      return;
    }
    setLoading(true);
    try {
      const artists = await searchArtists(token, searchTerm);
      setResults(artists);
      setError(artists.length ? '' : 'No artists found.');
      localStorage.setItem('explorer_results', JSON.stringify(artists));
      localStorage.setItem('explorer_query', searchTerm);
    } catch (err) {
      setError('Search failed.');
    } finally {
      setLoading(false);
    }
  };

  const saveLead = (artist, campaign) => {
    const key = `leads_${campaign.toLowerCase()}`;
    const current = JSON.parse(localStorage.getItem(key) || '[]');

    if (campaign === 'Unassigned' && savedCampaigns[artist.id]?.length > 0) return;

    if (campaign !== 'Unassigned') {
      const unassigned = JSON.parse(localStorage.getItem('leads_unassigned') || '[]');
      const filtered = unassigned.filter(l => l.id !== artist.id);
      localStorage.setItem('leads_unassigned', JSON.stringify(filtered));
    }

    current.push({
      id: artist.id,
      name: artist.name,
      image: artist.images?.[0]?.url || '',
      status: 'New',
      campaign,
    });
    localStorage.setItem(key, JSON.stringify(current));
    window.dispatchEvent(new Event('leadsUpdated'));
    refreshSavedCampaigns();
    setRecentlySaved({ id: artist.id, campaign });
    setTimeout(() => setRecentlySaved({}), 1500);
    setDropdownOpen(null);
  };

  const removeLead = (id, campaign) => {
    const key = `leads_${campaign.toLowerCase()}`;
    const current = JSON.parse(localStorage.getItem(key) || '[]');
    const updated = current.filter(l => l.id !== id);
    localStorage.setItem(key, JSON.stringify(updated));
    window.dispatchEvent(new Event('leadsUpdated'));
    refreshSavedCampaigns();
  };

  const removeAllCampaigns = (id) => {
    campaignList.forEach(c => removeLead(id, c));
    setConfirmRemove(null);
  };

  const isSavedTo = (id, campaign) => savedCampaigns[id]?.includes(campaign);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Explore Artists</h2>

      <div className="mb-4">
        <div className="text-sm text-gray-600 mb-1">Try one of these:</div>
        <div className="flex flex-wrap gap-2">
          {searchSuggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => { setQuery(s); handleSearch(s); }}
              className="bg-gray-100 px-3 py-1 text-sm rounded hover:bg-gray-200"
            >🔍 {s}</button>
          ))}
        </div>
      </div>

      <form
        onSubmit={e => { e.preventDefault(); handleSearch(); }}
        className="flex gap-2 mb-4"
      >
        <input
          type="text"
          className="border px-3 py-2 rounded w-full"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >Search</button>
      </form>

      {loading && <div className="text-sm text-gray-600">Loading...</div>}
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {results.map(artist => {
        const already = savedCampaigns[artist.id] || [];
        const showDropdown = dropdownOpen === artist.id;

        return (
          <div key={artist.id} className="border-b py-4 flex gap-4 items-start">
            {artist.images[0] && (
              <img
                src={artist.images[0].url}
                alt={artist.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            )}
            <div className="flex-1">
              <div className="font-semibold text-lg">{artist.name}</div>
              <div className="text-sm text-gray-500">Followers: {artist.followers.total.toLocaleString()}</div>
              <div className="text-sm text-gray-400">Genres: {artist.genres.slice(0, 2).join(', ') || 'N/A'}</div>

              {already.length > 0 ? (
                <div className="mt-2 text-sm">
                  <span className="font-medium">Saved to:</span>
                  <div className="flex gap-2 mt-1 flex-wrap">
                    {already.map(c => (
                      <span key={c} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        ✅ {c}
                        <button
                          className="text-red-500 ml-1"
                          onClick={() => removeLead(artist.id, c)}
                        >✕</button>
                      </span>
                    ))}
                    <button
                      onClick={() => setDropdownOpen(artist.id)}
                      className="text-sm text-blue-600 hover:underline"
                    >➕ Add to another</button>
                    <button
                      onClick={() => setConfirmRemove(artist.id)}
                      className="text-sm text-red-600 hover:underline"
                    >Remove from all</button>
                  </div>

                  {confirmRemove === artist.id && (
                    <div className="mt-2 text-red-600 text-sm">
                      Confirm removal of this artist from all campaigns?<br />
                      <button
                        onClick={() => removeAllCampaigns(artist.id)}
                        className="mt-1 text-white bg-red-600 px-3 py-1 rounded"
                      >Yes, Remove All</button>
                      <button
                        onClick={() => setConfirmRemove(null)}
                        className="ml-4 text-sm underline"
                      >Cancel</button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setDropdownOpen(artist.id)}
                  className="bg-green-600 text-white px-3 py-1 mt-2 rounded"
                >Save</button>
              )}

              {showDropdown && (
                <div className="mt-2 flex gap-2 flex-wrap">
                  {campaignList.map(c => (
                    <button
                      key={c}
                      onClick={() => saveLead(artist, c)}
                      disabled={isSavedTo(artist.id, c)}
                      className={`px-3 py-1 rounded text-sm border ${isSavedTo(artist.id, c) ? 'text-gray-400 border-gray-300 cursor-not-allowed' : 'text-black border-gray-400 hover:bg-gray-100'}`}
                    >{isSavedTo(artist.id, c) ? `✅ ${c}` : c}</button>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Explorer;
