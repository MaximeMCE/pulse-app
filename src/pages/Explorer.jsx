// Final Explorer.jsx — now dispatches 'leadsUpdated' for global sync
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
        localStorage.setItem('explorer_results', JSON.stringify([]));
      } else {
        setError('');
        setResults(artists);
        localStorage.setItem('explorer_results', JSON.stringify(artists));
      }
      localStorage.setItem('explorer_query', searchTerm);
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
    window.dispatchEvent(new Event('leadsUpdated'));

    setSavedCampaigns(prev => {
      const updated = { ...prev };
      const existing = new Set(updated[artistId] || []);
      existing.add(targetCampaign);
      updated[artistId] = Array.from(existing).filter(c => c !== 'Unassigned' || existing.size === 1);
      return updated;
    });

    setRecentlySaved({ id: artistId, campaign: targetCampaign });
    setTimeout(() => setRecentlySaved({}), 1500);
    setDropdownOpen(null);
  };

  const removeLead = (artistId, campaign) => {
    const key = `leads_${campaign.toLowerCase()}`;
    const current = JSON.parse(localStorage.getItem(key)) || [];
    const filtered = current.filter(l => l.id !== artistId);
    localStorage.setItem(key, JSON.stringify(filtered));
    window.dispatchEvent(new Event('leadsUpdated'));

    setSavedCampaigns(prev => {
      const updated = { ...prev };
      updated[artistId] = (updated[artistId] || []).filter(c => c !== campaign);
      if (updated[artistId].length === 0) delete updated[artistId];
      return updated;
    });

    if (dropdownOpen === artistId && campaignList.every(c => !isSavedTo(artistId, c))) {
      setDropdownOpen(null);
    }
  };

  const isSavedTo = (artistId, campaign) => {
    return savedCampaigns[artistId]?.includes(campaign);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Explore Artists</h2>
      {/* ... UI unchanged, omitted for brevity ... */}
    </div>
  );
};

export default Explorer;
