import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchArtists } from '../api/Spotify';
import ArtistCard from '../components/ArtistCard';
import ExploreManager from '../components/ExploreManager';
import useRecentSearches from '../hooks/useRecentSearches';
import useTalentPool from '../hooks/useTalentPool';

const Explorer = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [savedCampaigns, setSavedCampaigns] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [campaignList, setCampaignList] = useState([]);
  const [editingQuery, setEditingQuery] = useState(null);
  const [labelInput, setLabelInput] = useState('');

  const { recent: recentSearches, addSearch, clearSearches, togglePin, renameSearch } = useRecentSearches();
  const navigate = useNavigate();

  const searchSuggestions = [
    'Techno artists under 10K listeners',
    'Unsigned female vocalists',
    'Rising Afrobeat acts in Europe',
    'Amsterdam-based DJs',
    'Recently dropped EPs',
  ];

  useEffect(() => {
    const storedToken = localStorage.getItem('spotify_access_token');
    if (!storedToken) {
      localStorage.removeItem('explorer_results');
      localStorage.removeItem('explorer_query');
      localStorage.removeItem('explorer_timestamp');
      navigate('/login');
      return;
    }

    setToken(storedToken);

    const cachedResults = localStorage.getItem('explorer_results');
    const cachedQuery = localStorage.getItem('explorer_query');
    const cachedTime = localStorage.getItem('explorer_timestamp');

    if (cachedResults && cachedQuery && cachedTime) {
      const age = Date.now() - parseInt(cachedTime, 10);
      if (age < 5 * 60 * 1000) {
        setResults(JSON.parse(cachedResults));
        setQuery(cachedQuery);
      } else {
        localStorage.removeItem('explorer_results');
        localStorage.removeItem('explorer_query');
        localStorage.removeItem('explorer_timestamp');
      }
    }

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
      localStorage.setItem('explorer_timestamp', Date.now().toString());
      addSearch(searchTerm);
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
    if (existing.find(l => l.id === artist.id)) return;

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

  const removeLead = (artistId, campaignTitle) => {
    const key = `leads_${campaignTitle.toLowerCase()}`;
    const existing = JSON.parse(localStorage.getItem(key)) || [];
    const updated = existing.filter(lead => lead.id !== artistId);
    localStorage.setItem(key, JSON.stringify(updated));
    window.dispatchEvent(new Event('leadsUpdated'));
    refreshSavedCampaigns();
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      <div className="flex-1 p-6 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6">🎧 Explore Artists</h2>

        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Suggestions</h3>
          <div className="flex flex-wrap gap-2">
            {searchSuggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => {
                  setQuery(s);
                  handleSearch(s);
                }}
                className="text-sm bg-white border border-gray-300 hover:bg-blue-50 px-3 py-1 rounded-full shadow-sm transition"
              >
                🔍 {s}
              </button>
            ))}
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex gap-2 mb-6"
        >
          <input
            type="text"
            placeholder="Search for an artist"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Search
          </button>
        </form>

        {loading && <p className="text-sm text-blue-500 mb-4">Searching...</p>}
        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

        <div className="flex flex-col gap-4">
          {results.map((artist) => (
            <ArtistCard
              key={artist.id}
              artist={artist}
              isOpen={dropdownOpen === artist.id}
              onToggleDropdown={(id) =>
                setDropdownOpen((prev) => (prev === id ? null : id))
              }
              onSaveLead={saveLead}
              campaignList={campaignList}
              isSavedTo={isSavedTo}
              assignedCampaigns={savedCampaigns[artist.id] || []}
              onRemoveFromCampaign={removeLead}
            />
          ))}
        </div>

        {/* 🔒 Force Tailwind to include dynamic styles */}
        <div className="hidden">
          <div className="text-blue-600 border-blue-600 hover:bg-blue-50"></div>
          <div className="text-green-600 border-green-600 hover:bg-green-50"></div>
          <div className="text-red-600 border-red-400 hover:bg-red-50"></div>
          <div className="text-gray-400 border-gray-300 hover:bg-gray-100"></div>
          <div className="text-black cursor-not-allowed"></div>
        </div>
      </div>

      <div className="w-80 border-l bg-white shadow-inner">
        <ExploreManager
          recentSearches={recentSearches}
          onSearch={(q) => {
            setQuery(q);
            handleSearch(q);
          }}
          onPin={togglePin}
          onRename={renameSearch}
          onClear={clearSearches}
          editingQuery={editingQuery}
          setEditingQuery={setEditingQuery}
          labelInput={labelInput}
          setLabelInput={setLabelInput}
        />
      </div>
    </div>
  );
};

export default Explorer;
