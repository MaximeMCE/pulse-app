import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchArtists } from '../api/Spotify';
import ArtistCard from '../components/ArtistCard';
import ExploreManager from '../components/ExploreManager';
import useRecentSearches from '../hooks/useRecentSearches';

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

  const {
    recent: recentSearches,
    addSearch,
    clearSearches,
    togglePin,
    renameSearch,
  } = useRecentSearches();

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
      navigate('/login');
      return;
    }

    setToken(storedToken);

    const cachedResults = localStorage.getItem('explorer_results');
    const cachedQuery = localStorage.getItem('explorer_query');
    if (cachedResults && cachedQuery) {
      setResults(JSON.parse(cachedResults));
      setQuery(cachedQuery);
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
    <div className="flex h-screen">
      <div className="flex-1 p-6 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Explore Artists</h2>

        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-600 mb-2">Try one of these:</h3>
          <div className="flex flex-wrap gap-2">
            {searchSuggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => {
                  setQuery(s);
                  handleSearch(s);
                }}
                className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full"
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
          className="flex gap-2 mb-4"
        >
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
          />
        ))}
      </div>

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
  );
};

export default Explorer;