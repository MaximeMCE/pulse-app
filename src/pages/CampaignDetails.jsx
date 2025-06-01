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
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadStatus, setNewLeadStatus] = useState('New');
  const [pendingStatusChange, setPendingStatusChange] = useState('');
  const [pendingCampaignMove, setPendingCampaignMove] = useState('');

  useEffect(() => {
    const storedCampaigns = JSON.parse(localStorage.getItem('campaigns')) || [];
    setCampaigns(storedCampaigns);
  }, []);

  const campaign = campaigns.find(c => c.id === campaignId);
  const fallbackKey = campaign ? `leads_${campaign.title?.toLowerCase()}` : null;
  const campaignKey = campaign ? `leads_${campaign.id}` : fallbackKey;

  const loadLeads = () => {
    if (!campaignKey) return;
    const storedLeads = JSON.parse(localStorage.getItem(campaignKey) || '[]');
    const profiles = JSON.parse(localStorage.getItem('artistProfiles') || '{}');

    const enriched = storedLeads.map(lead => {
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

    setLeads(enriched);
  };

  useEffect(() => {
    loadLeads();
    window.addEventListener('leadsUpdated', loadLeads);
    return () => window.removeEventListener('leadsUpdated', loadLeads);
  }, [campaignKey]);

  useEffect(() => {
    if (campaignKey) {
      localStorage.setItem(campaignKey, JSON.stringify(leads));
      window.dispatchEvent(new Event('leadsUpdated'));
    }
  }, [leads, campaignKey]);

  if (!campaign) return <div className="p-6">Campaign not found.</div>;

  const addLead = () => {
    if (!newLeadName.trim()) return;

    const artistId = uuidv4();
    saveArtistProfile({
      id: artistId,
      name: newLeadName.trim(),
      image: 'https://placehold.co/48x48/eeeeee/777777?text=🎵',
      genre: 'unknown',
      preview_url: null,
      followers: 0,
      source: 'manual'
    });

    const newLead = {
      id: uuidv4(),
      artistId,
      campaignId,
      status: newLeadStatus,
      createdAt: new Date().toISOString()
    };

    setLeads(prev => [...prev, {
      ...newLead,
      name: newLead.name,
      image: 'https://placehold.co/48x48/eeeeee/777777?text=🎵',
    }]);

    setNewLeadName('');
    setNewLeadStatus('New');
  };

  const deleteLead = (id) => {
    if (window.confirm('Delete this lead?')) {
      setLeads(prev => prev.filter(l => l.id !== id));
      setSelectedLeads(prev => prev.filter(sid => sid !== id));
      window.dispatchEvent(new Event('lead-deleted'));
    }
  };

  const updateLeadStatus = (id, status) => {
    setLeads(prev => prev.map(l => (l.id === id ? { ...l, status } : l)));
  };

  const updateLeadCampaign = (id, newCampaignId) => {
    const targetCampaign = campaigns.find(c => c.id === newCampaignId);
    if (!targetCampaign) return;

    const targetKey = `leads_${targetCampaign.id}`;
    const targetLeads = JSON.parse(localStorage.getItem(targetKey) || '[]');

    const leadToMove = leads.find(l => l.id === id);
    if (!leadToMove || targetLeads.some(t => t.id === id)) return;

    localStorage.setItem(targetKey, JSON.stringify([...targetLeads, leadToMove]));
    setLeads(prev => prev.filter(l => l.id !== id));
    window.dispatchEvent(new Event('leadsUpdated'));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen text-gray-800">
      <div className="text-sm text-gray-500 mb-2">
        <a href="/campaigns" className="text-blue-600 hover:underline">Campaigns</a>
        <span className="mx-1">›</span>
        <span>{campaign.title}</span>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">🎯 {campaign.title} - Leads</h1>
        <CampaignSwitcher campaigns={campaigns} currentCampaignId={campaignId} />
      </div>

      <div className="mb-6">
        <CampaignManager />
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">🧠 Smart Recommendations</h2>
        <SmartRecommendations />
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">📝 Add Lead Manually</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="New lead name"
            value={newLeadName}
            onChange={(e) => setNewLeadName(e.target.value)}
            className="border rounded px-3 py-2 flex-grow"
          />
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
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
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

