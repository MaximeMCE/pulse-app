// ✅ Final Explorer.jsx with 'No results' message restored
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
  const [filters, setFilters] = useState(null);
  const [savedCampaigns, setSavedCampaigns] = useState({});
  const [campaignList, setCampaignList] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [editingQuery, setEditingQuery] = useState(null);
  const [labelInput, setLabelInput] = useState('');

  const { recent: recentSearches, addSearch, clearSearches, togglePin, renameSearch } = useRecentSearches();
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('spotify_access_token');
    if (!storedToken) return navigate('/login');
    setToken(storedToken);
    refreshCampaignList();
    refreshSavedCampaigns();
    window.addEventListener('leadsUpdated', refreshSavedCampaigns);
    return () => window.removeEventListener('leadsUpdated', refreshSavedCampaigns);
  }, []);

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
    if (!token || !filters) return;
    const searchTerm = overrideQuery || query;
    setLoading(true);
    setError('');

    try {
      let artists;
      if (searchTerm.trim().length > 0) {
        artists = await searchArtists(token, searchTerm, filters);
        addSearch(searchTerm);
      } else {
        artists = await crawlArtistsByGenre(token, filters);
      }

      const filtered = artists.filter((artist) => {
        const listeners = artist?.monthlyListeners ?? artist?.listeners ?? 0;
        const releaseDays = artist?.releaseDaysAgo ?? null;

        const listenerCheck = listeners >= filters.minListeners && listeners <= filters.maxListeners;
        const releaseCheck =
          filters.recentRelease === 'off' ||
          (releaseDays !== null && releaseDays <= parseInt(filters.recentRelease));

        let genreCheck = true;
        if (filters.genres.length > 0) {
          if (filters.genreSource === 'spotify') {
            const artistGenres = (artist?.genres || []).map((g) => g.toLowerCase());
            genreCheck = filters.genres.some((g) => artistGenres.includes(g.toLowerCase()));
          } else if (filters.genreSource === 'custom') {
            const customGenres = (artist?.customGenres || []).map((g) => g.toLowerCase());
            genreCheck = filters.genres.some((g) => customGenres.includes(g.toLowerCase()));
          }
        }

        const passed = artist && artist.id && artist.name && listenerCheck && releaseCheck && genreCheck;
        if (!passed) {
          console.log('⛔ Skipped Artist:', {
            name: artist?.name,
            id: artist?.id,
            listeners,
            releaseDays,
            genres: artist?.genres,
            checks: { listenerCheck, releaseCheck, genreCheck }
          });
        }

        return passed;
      });

      setResults(filtered);
    } catch (err) {
      console.error(err);
      setError('Search failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterSubmit = (newFilters) => {
    setFilters(newFilters);
    handleSearch();
  };

  const saveLead = (artist, campaign) => {
    const key = `leads_${campaign.toLowerCase()}`;
    const existing = JSON.parse(localStorage.getItem(key)) || [];
    if (existing.find(l => l.id === artist.id)) return;
    const newLead = { id: artist.id, name: artist.name, image: artist.images?.[0]?.url || '', status: 'New', campaign };
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

        <FilterBlock onSubmitFilters={handleFilterSubmit} />
        <SearchBlock
          query={query}
          setQuery={setQuery}
          onSearch={handleSearch}
          suggestions={['Techno artists under 10K listeners', 'Unsigned female vocalists', 'Rising Afrobeat acts in Europe', 'Amsterdam-based DJs', 'Recently dropped EPs']}
        />

        {loading && <p className="text-sm text-blue-500 mb-4">Searching...</p>}
        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
        {!loading && results.length === 0 && (
          <p className="text-sm text-gray-500 italic">No artists found. Try adjusting your filters or search terms.</p>
        )}

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
