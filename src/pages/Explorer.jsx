import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchArtists } from '../api/Spotify';
import { crawlArtistsByGenre } from '../api/crawlArtistsByGenre';
import ArtistCard from '../components/ArtistCard';
import ExploreManager from '../components/ExploreManager';
import FilterBlock from '../components/FilterBlock';
import SearchBlock from '../components/SearchBlock';
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
  const [hasMounted, setHasMounted] = useState(false);
  const [filters, setFilters] = useState({
    minListeners: 0,
    maxListeners: 100000,
    recentRelease: '30',
    genres: [],
    genreSource: 'spotify',
  });

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

  useEffect(() => {
    if (!hasMounted) {
      setHasMounted(true);
      return;
    }

    if (query.trim() === '' && token && filters.genres.length > 0) {
      handleSearch('');
    }
  }, [filters]);

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
    if (!token) return;
    setLoading(true);

    try {
      let artists;

      if (searchTerm.trim() === '') {
        if (!filters.genres.length) {
          setError('Please select at least one genre to explore artists.');
          setLoading(false);
          return;
        }
        artists = await crawlArtistsByGenre(token, filters);
      } else {
        artists = await searchArtists(token, searchTerm, filters);
      }

      // 🧪 DEBUGGING
      console.log('RAW_ARTISTS:', artists);

      const filtered = artists.filter((artist) => {
        const listeners = artist?.listeners ?? 0;
        const listenerCheck = listeners >= filters.minListeners && listeners <= filters.maxListeners;
        const releaseCheck = filters.recentRelease === 'off' || (artist?.releaseDaysAgo !== undefined && artist.releaseDaysAgo <= parseInt(filters.recentRelease));

        let genreCheck = true;
        if (filters.genres.length > 0) {
          if (filters.genreSource === 'spotify') {
            const artistGenres = (artist?.genres || []).map(g => g.toLowerCase());
            genreCheck = filters.genres.some(g => artistGenres.includes(g.toLowerCase()));
          } else if (filters.genreSource === 'custom') {
            const customGenres = (artist?.customGenres || []).map(g => g.toLowerCase());
            genreCheck = filters.genres.some(g => customGenres.includes(g.toLowerCase()));
          }
        }

        return artist && artist.id && artist.name && listenerCheck && releaseCheck && genreCheck;
      });

      console.log('FILTERED:', filtered);
      console.log('FIRST_INVALID:', filtered.find(a => !a || typeof a !== 'object' || !a.id));

      setResults(filtered);
      localStorage.setItem('explorer_results', JSON.stringify(filtered));
      localStorage.setItem('explorer_query', searchTerm);
      localStorage.setItem('explorer_timestamp', Date.now().toString());
      if (searchTerm) addSearch(searchTerm);
      setError(filtered.length ? '' : 'No artists found.');
    } catch (err) {
      console.error(err);
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

        <FilterBlock filters={filters} onFilterChange={setFilters} />
        <SearchBlock
          query={query}
          setQuery={setQuery}
          onSearch={handleSearch}
          suggestions={searchSuggestions}
        />

        {loading && <p className="text-sm text-blue-500 mb-4">Searching...</p>}
        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

        <div className="flex flex-col gap-4">
          {results
            .filter((artist) => artist && typeof artist === 'object' && artist.id && artist.name)
            .map((artist) => (
              <ArtistCard
                key={artist.id}
                artist={artist}
                isOpen={dropdownOpen === artist.id}
                onToggleDropdown={(id) => setDropdownOpen((prev) => (prev === id ? null : id))}
                onSaveLead={saveLead}
                campaignList={campaignList}
                isSavedTo={isSavedTo}
                assignedCampaigns={savedCampaigns[artist.id] || []}
                onRemoveFromCampaign={removeLead}
              />
            ))}
        </div>
      </div>

      <div className="w-64 border-l bg-white shadow-inner">
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
