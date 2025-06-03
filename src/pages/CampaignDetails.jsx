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

  const campaign = campaigns.find(c => c.id === campaignId);
  const campaignKey = campaign ? `leads_${campaign.id}` : null;

  const enrichLeads = (raw) => {
    const profiles = JSON.parse(localStorage.getItem('artistProfiles') || '{}');
    return raw.map(lead => {
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
    loadLeads();
    window.addEventListener('leadsUpdated', loadLeads);
    return () => window.removeEventListener('leadsUpdated', loadLeads);
  }, [campaignKey]);

  const addLead = () => {
    if (!newLeadName.trim() || !campaignKey) return;

    const artistId = uuidv4();
    const newLead = {
      id: uuidv4(),
      artistId,
      campaignId,
      status: newLeadStatus,
      createdAt: new Date().toISOString(),
    };

    saveArtistProfile({
      id: artistId,
      name: newLeadName.trim(),
      image: 'https://placehold.co/48x48/eeeeee/777777?text=🎵',
      genre: 'unknown',
      preview_url: null,
      followers: 0,
      source: 'manual'
    });

    const existing = JSON.parse(localStorage.getItem(campaignKey) || '[]');
    const updated = [...existing, newLead];
    localStorage.setItem(campaignKey, JSON.stringify(updated));
    window.dispatchEvent(new Event('leadsUpdated'));
    loadLeads(); // ✅ refresh visible leads

    setNewLeadName('');
    setNewLeadStatus('New');
  };

  const deleteLead = (id) => {
    if (!confirm('Delete this lead?')) return;
    const updated = leads.filter(l => l.id !== id);
    localStorage.setItem(campaignKey, JSON.stringify(updated));
    setLeads(updated);
  };

  const updateLeadStatus = (id, status) => {
    const updated = leads.map(l => l.id === id ? { ...l, status } : l);
    localStorage.setItem(campaignKey, JSON.stringify(updated));
    setLeads(updated);
  };

  const updateLeadCampaign = (id, newId) => {
    const lead = leads.find(l => l.id === id);
    if (!lead) return;
    const targetLeads = JSON.parse(localStorage.getItem(`leads_${newId}`) || '[]');
    localStorage.setItem(`leads_${newId}`, JSON.stringify([...targetLeads, lead]));
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
      <div className="my-6">
        <h2 className="text-lg font-semibold">🧠 Smart Recommendations</h2>
        <SmartRecommendations />
      </div>
      <div className="my-6">
        <h2 className="text-lg font-semibold">📝 Add Lead Manually</h2>
        <div className="flex gap-2">
          <input type="text" value={newLeadName} onChange={e => setNewLeadName(e.target.value)} className="border rounded px-3 py-2 flex-grow" placeholder="Name" />
          <select value={newLeadStatus} onChange={e => setNewLeadStatus(e.target.value)} className="border rounded px-2 py-2">
            <option>New</option>
            <option>Contacted</option>
            <option>Qualified</option>
            <option>Lost</option>
          </select>
          <button onClick={addLead} className="bg-blue-600 text-white px-4 py-2 rounded">Add Lead</button>
        </div>
      </div>
      <div className="space-y-4">
        {leads.length === 0 ? <p className="text-gray-500">No leads yet.</p> : leads.map(lead => (
          <LeadCard
            key={lead.id}
            lead={lead}
            campaigns={campaigns}
            onStatusChange={updateLeadStatus}
            onCampaignChange={updateLeadCampaign}
            onDelete={deleteLead}
          />
        ))}
      </div>
    </div>
  );
};

export default CampaignDetails;
