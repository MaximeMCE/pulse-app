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
  const [suggestions, setSuggestions] = useState([]);
  const [selectedArtistId, setSelectedArtistId] = useState(null);
  const [selectedLeadIds, setSelectedLeadIds] = useState([]);

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
    setSelectedArtistId(profile.id);
    setSuggestions([]);
  };

  const addLead = () => {
    if (!newLeadName.trim() || !campaignKey) return;

    const trimmedName = newLeadName.trim().toLowerCase();
    const profiles = JSON.parse(localStorage.getItem('artistProfiles') || '{}');

    const matchedId = selectedArtistId ||
      Object.keys(profiles).find((id) => {
        const storedName = (profiles[id]?.name || '').toLowerCase().trim();
        return storedName === trimmedName;
      });

    const artistId = matchedId || uuidv4();

    const existingLeads = JSON.parse(localStorage.getItem(campaignKey) || '[]');
    if (existingLeads.some((l) => l.artistId === artistId)) {
      alert('This artist is already in this campaign.');
      return;
    }

    if (!matchedId) {
      saveArtistProfile({
        id: artistId,
        name: newLeadName.trim(),
        image: 'https://placehold.co/48x48/eeeeee/777777?text=🎵',
        genres: [],
        preview_url: null,
        followers: 0,
        region: 'Unknown',
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

    const updated = [...existingLeads, newLead];
    localStorage.setItem(campaignKey, JSON.stringify(updated));
    window.dispatchEvent(new Event('leadsUpdated'));
    loadLeads();

    setNewLeadName('');
    setNewLeadStatus('New');
    setSelectedArtistId(null);
    setSuggestions([]);
  };

  const deleteLead = (id) => {
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
    if (targetLeads.some((l) => l.artistId === lead.artistId)) return;
    localStorage.setItem(targetKey, JSON.stringify([...targetLeads, lead]));
    deleteLead(id);
  };

  const handleSelectLead = (id) => {
    setSelectedLeadIds((prev) =>
      prev.includes(id) ? prev.filter((lid) => lid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedLeadIds.length === leads.length) {
      setSelectedLeadIds([]);
    } else {
      setSelectedLeadIds(leads.map((l) => l.id));
    }
  };

  const handleBulkDelete = () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedLeadIds.length} selected leads?`)) return;
    const updated = leads.filter((l) => !selectedLeadIds.includes(l.id));
    localStorage.setItem(campaignKey, JSON.stringify(updated));
    setLeads(updated);
    setSelectedLeadIds([]);
  };

  const handleBulkStatusChange = (status) => {
    const updated = leads.map((l) =>
      selectedLeadIds.includes(l.id) ? { ...l, status } : l
    );
    localStorage.setItem(campaignKey, JSON.stringify(updated));
    setLeads(updated);
    setSelectedLeadIds([]);
  };

  const handleBulkMove = (targetCampaignId) => {
    if (!window.confirm(`Move ${selectedLeadIds.length} leads to another campaign?`)) return;
    const targetKey = `leads_${targetCampaignId}`;
    const current = JSON.parse(localStorage.getItem(targetKey) || '[]');
    const toMove = leads.filter((l) =>
      selectedLeadIds.includes(l.id) && !current.some((cl) => cl.artistId === l.artistId)
    );
    const skipped = leads.filter((l) =>
      selectedLeadIds.includes(l.id) && current.some((cl) => cl.artistId === l.artistId)
    );
    localStorage.setItem(targetKey, JSON.stringify([...current, ...toMove]));
    handleBulkDelete();
    alert(`✅ ${toMove.length} leads moved.\n${skipped.length > 0 ? `⚠️ Skipped (already in target): ${skipped.map((s) => s.name).join(', ')}` : ''}`);
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

      {/* Additional controls and lead list would go here */}
    </div>
  );
};

export default CampaignDetails;
