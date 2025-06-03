import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import CampaignManager from '../components/CampaignManager';
import SmartRecommendations from '../components/SmartRecommendations';
import CampaignSwitcher from '../components/CampaignSwitcher';
import LeadCard from '../components/LeadCard';
import { saveArtistProfile } from '../utils/artistUtils';

const CampaignDetails = () => {
  const { id: campaignId } = useParams();
  const [campaigns, setCampaigns] = useState([]);
  const [leads, setLeads] = useState([]);
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadStatus, setNewLeadStatus] = useState('New');
  const [newLeadGenre, setNewLeadGenre] = useState('');
  const [newLeadRegion, setNewLeadRegion] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const campaign = campaigns.find((c) => c.id === campaignId);
  const campaignKey = campaign ? `leads_${campaign.id}` : null;

  const enrichLeads = (raw) => {
    const profiles = JSON.parse(localStorage.getItem('artistProfiles') || '{}');
    return raw.map((lead) => {
      const profile = profiles[lead.artistId] || {};
      return {
        ...lead,
        name: profile.name || lead.name || 'Unknown',
        image: profile.image || 'https://placehold.co/48x48/eeeeee/777777?text=🎵',
        genres: profile.genres || [],
        monthlyListeners: profile.monthlyListeners || 0,
        preview_url: profile.preview_url || '',
        tier: profile.tier || 'Emerging',
      };
    });
  };

  const loadLeads = () => {
    if (!campaignKey) return;
    const raw = JSON.parse(localStorage.getItem(campaignKey) || '[]');
    setLeads(enrichLeads(raw));
  };

  useEffect(() => {
    const stored = localStorage.getItem('campaigns');
    if (stored) {
      try {
        setCampaigns(JSON.parse(stored));
      } catch (err) {
        console.warn('Invalid campaigns JSON:', err);
        setCampaigns([]);
      }
    }
  }, []);

  useEffect(() => {
    loadLeads();
    window.addEventListener('leadsUpdated', loadLeads);
    return () => window.removeEventListener('leadsUpdated', loadLeads);
  }, [campaignKey]);

  useEffect(() => {
    const profiles = JSON.parse(localStorage.getItem('artistProfiles') || '{}');
    const input = newLeadName.toLowerCase().trim();
    if (!input) return setSuggestions([]);
    const matches = Object.values(profiles).filter((p) =>
      p.name?.toLowerCase().includes(input)
    );
    setSuggestions(matches.slice(0, 5));
  }, [newLeadName]);

  const handleSuggestionClick = (profile) => {
    setNewLeadName(profile.name);
    setNewLeadGenre((profile.genres?.[0] || '').toLowerCase());
    setNewLeadRegion(profile.region || '');
    setSuggestions([]);
  };

  const addLead = () => {
    if (!newLeadName.trim() || !newLeadGenre || !campaignKey) return;

    const trimmedName = newLeadName.trim().toLowerCase();
    const existingProfiles = JSON.parse(localStorage.getItem('artistProfiles') || '{}');

    const existingId = Object.keys(existingProfiles).find((id) => {
      const storedName = (existingProfiles[id]?.name || '').toLowerCase().trim();
      return storedName === trimmedName;
    });

    const artistId = existingId || uuidv4();

    if (!existingId) {
      saveArtistProfile({
        id: artistId,
        name: newLeadName.trim(),
        image: 'https://placehold.co/48x48/eeeeee/777777?text=🎵',
        genres: [newLeadGenre],
        preview_url: null,
        followers: 0,
        region: newLeadRegion.trim() || 'Unknown',
        source: 'manual',
      });
    }

    const newLead = {
      id: uuidv4(),
      artistId,
      campaignId,
      status: newLeadStatus,
      createdAt: new Date().toISOString(),
    };

    const existing = JSON.parse(localStorage.getItem(campaignKey) || '[]');
    const updated = [...existing, newLead];
    localStorage.setItem(campaignKey, JSON.stringify(updated));
    window.dispatchEvent(new Event('leadsUpdated'));
    loadLeads();

    setNewLeadName('');
    setNewLeadStatus('New');
    setNewLeadGenre('');
    setNewLeadRegion('');
    setSuggestions([]);
  };

  const deleteLead = (id) => {
    if (!confirm('Delete this lead?')) return;
    const updated = leads.filter((l) => l.id !== id);
    localStorage.setItem(campaignKey, JSON.stringify(updated));
    setLeads(updated);
    window.dispatchEvent(new Event('lead-deleted'));
  };

  const updateLeadStatus = (id, status) => {
    const updated = leads.map((l) => (l.id === id ? { ...l, status } : l));
    localStorage.setItem(campaignKey, JSON.stringify(updated));
    setLeads(updated);
  };

  const updateLeadCampaign = (id, newId) => {
    const lead = leads.find((l) => l.id === id);
    if (!lead) return;
    const targetKey = `leads_${newId}`;
    const targetLeads = JSON.parse(localStorage.getItem(targetKey) || '[]');
    localStorage.setItem(targetKey, JSON.stringify([...targetLeads, lead]));
    deleteLead(id);
  };

  if (!campaign) return <div className="p-6">Campaign not found.</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="text-sm text-gray-500 mb-2">
        <a href="/campaigns" className="text-blue-600 hover:underline">Campaigns</a> › {campaign.title}
      </div>

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">🎯 {campaign.title}</h1>
        <CampaignSwitcher campaigns={campaigns} currentCampaignId={campaignId} />
      </div>

      <CampaignManager />
      <SmartRecommendations />

      <div className="my-6">
        <h2 className="text-lg font-semibold">📝 Add Lead Manually</h2>
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative">
            <input
              type="text"
              value={newLeadName}
              onChange={(e) => setNewLeadName(e.target.value)}
              onBlur={() => setTimeout(() => setSuggestions([]), 150)}
              className="border rounded px-3 py-2 flex-grow min-w-[120px]"
              placeholder="Name"
            />
            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 bg-white border w-full z-10 rounded shadow-md">
                {suggestions.map((s) => (
                  <div
                    key={s.id}
                    onMouseDown={() => handleSuggestionClick(s)}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    <div className="font-medium">{s.name}</div>
                    <div className="text-xs text-gray-500">
                      {s.genres?.[0] || 'Unknown Genre'} • {s.region || 'Unknown Region'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <input
            type="text"
            value={newLeadRegion}
            onChange={(e) => setNewLeadRegion(e.target.value)}
            className="border rounded px-3 py-2 flex-grow min-w-[120px]"
            placeholder="Region (e.g. UK, Berlin)"
          />
          <select
            value={newLeadGenre}
            onChange={(e) => setNewLeadGenre(e.target.value)}
            className="border rounded px-2 py-2"
          >
            <option value="">Genre</option>
            <option value="techno">Techno</option>
            <option value="afrobeat">Afrobeat</option>
            <option value="indie">Indie</option>
            <option value="house">House</option>
            <option value="rap">Rap</option>
          </select>
          <select
            value={newLeadStatus}
            onChange={(e) => setNewLeadStatus(e.target.value)}
            className="border rounded px-2 py-2"
          >
            <option>New</option>
            <option>Contacted</option>
            <option>Qualified</option>
            <option>Lost</option>
          </select>
          <button
            onClick={addLead}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Lead
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {leads.length === 0 ? (
          <p className="text-gray-500">No leads yet.</p>
        ) : (
          leads.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              campaigns={campaigns}
              onStatusChange={updateLeadStatus}
              onCampaignChange={updateLeadCampaign}
              onDelete={deleteLead}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CampaignDetails;
