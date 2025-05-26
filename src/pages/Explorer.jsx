// Explorer.jsx — Fixed Image Size + Visible +Pool Button
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
    ensureCampaignMetadata();
    refreshCampaignList();
    refreshSavedCampaigns();
    window.addEventListener('leadsUpdated', refreshSavedCampaigns);
    return () => window.removeEventListener('leadsUpdated', refreshSavedCampaigns);
  }, []);

  const ensureCampaignMetadata = () => {
    const allCampaigns = Object.keys(localStorage)
      .filter(k => k.startsWith('leads_'))
      .map(k => k.replace('leads_', ''));
    const existingMeta = JSON.parse(localStorage.getItem('campaigns') || '[]');
    const metaTitles = existingMeta.map(c => c.title.toLowerCase());
    const updated = [...existingMeta];
    allCampaigns.forEach(c => {
      if (!metaTitles.includes(c)) {
        updated.push({
          id: `auto-${c}`,
          title: c.charAt(0).toUpperCase() + c.slice(1),
          createdAt: new Date().toISOString(),
        });
      }
    });
    localStorage.setItem('campaigns', JSON.stringify(updated));
    window.dispatchEvent(new Event('campaignsUpdated'));
  };

  const refreshCampaignList = () => {
    const stored = JSON.parse(localStorage.getItem('campaigns') || '[]');
    const sorted = ['Talent Pool', ...stored.map(c => c.title).filter(c => c.toLowerCase() !== 'unassigned')];
    setCampaignList(sorted);
  };

  const refreshSavedCampaigns = () => {
    const saved = {};
    Object.keys(localStorage).filter(k => k.startsWith('leads_')).forEach(key => {
      const camp = key.replace('leads_', '');
      const leads = JSON.parse(localStorage.getItem(key)) || [];
      leads.forEach(lead => {
        if (!saved[lead.id]) saved[lead.id] = [];
        if (!saved[lead.id].includes(camp)) saved[lead.id].push(camp);
      });
    });
    setSavedCampaigns(saved);
  };

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
    const existing = JSON.parse(localStorage.getItem(key)) || [];
    const newLead = {
      id: artist.id,
      name: artist.name,
      image: artist.images?.[0]?.url || '',
      status: 'New',
      campaign,
    };
    localStorage.setItem(key, JSON.stringify([...existing, newLead]));
    window.dispatchEvent(new Event('leadsUpdated'));
    setDropdownOpen(null);
  };

  const isSavedTo = (id, campaign) => savedCampaigns[id]?.includes(campaign);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Explore Artists</h2>
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-600 mb-2">Try one of these:</h3>
        <div className="flex flex-wrap gap-2">
          {searchSuggestions.map((s, i) => (
            <button key={i} onClick={() => { setQuery(s); handleSearch(s); }} className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full">
              🔍 {s}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search for an artist"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border px-4 py-2 rounded-md w-full"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Search
        </button>
      </form>

      {results.map((artist) => {
        const saved = savedCampaigns[artist.id] || [];
        const open = dropdownOpen === artist.id;
        return (
          <div key={artist.id} className="border-b py-4 flex items-center">
            {artist.images[0] && (
              <img src={artist.images[0].url} alt={artist.name} className="w-16 h-16 rounded-full mr-4 object-cover" />
            )}
            <div className="flex-1">
              <div className="font-semibold">{artist.name}</div>
              <div className="text-sm text-gray-500">Followers: {artist.followers.total.toLocaleString()}</div>
              <div className="text-sm text-gray-400">Genres: {artist.genres.slice(0, 2).join(', ') || 'N/A'}</div>

              <div className="mt-2 flex gap-2 flex-wrap">
                <button onClick={() => saveLead(artist, 'Talent Pool')} className="bg-gray-700 text-white text-xs px-3 py-1 rounded hover:bg-gray-900">
                  + Pool
                </button>
                <button onClick={() => setDropdownOpen(artist.id)} className="bg-blue-600 text-white text-xs px-3 py-1 rounded hover:bg-blue-700">
                  + Campaign
                </button>
              </div>

              {open && (
                <div className="mt-2 bg-white border p-3 rounded shadow max-w-xs">
                  <div className="text-xs font-semibold text-gray-600 mb-2">Choose campaign:</div>
                  <div className="flex flex-wrap gap-2">
                    {campaignList.filter(c => c !== 'Talent Pool').map(c => (
                      <button
                        key={c}
                        onClick={() => saveLead(artist, c)}
                        disabled={isSavedTo(artist.id, c)}
                        className={`px-3 py-1 rounded text-sm border ${
                          isSavedTo(artist.id, c) ? 'text-gray-400 border-gray-300 cursor-not-allowed' : 'hover:bg-blue-50 border-gray-400 text-black'
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
        );
      })}
    </div>
  );
};

export default Explorer;
