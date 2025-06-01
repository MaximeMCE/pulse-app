import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import CampaignManager from '../components/CampaignManager';
import SmartRecommendations from '../components/SmartRecommendations';
import CampaignSwitcher from '../components/CampaignSwitcher';

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
  const campaignKey = campaign ? `leads_${campaign.title.toLowerCase()}` : null;

  useEffect(() => {
    if (campaignKey) {
      const storedLeads = JSON.parse(localStorage.getItem(campaignKey) || '[]');
      setLeads(storedLeads);
    }
  }, [campaignKey]);

  useEffect(() => {
    if (campaignKey) {
      localStorage.setItem(campaignKey, JSON.stringify(leads));
      window.dispatchEvent(new Event('leadsUpdated'));
    }
  }, [leads, campaignKey]);

  useEffect(() => {
    const handleUpdate = () => {
      if (!campaignKey) return;
      const updatedLeads = JSON.parse(localStorage.getItem(campaignKey) || '[]');
      setLeads(updatedLeads);
    };

    window.addEventListener('leadsUpdated', handleUpdate);
    return () => window.removeEventListener('leadsUpdated', handleUpdate);
  }, [campaignKey]);

  if (!campaign) return <div className="p-6">Campaign not found.</div>;

  const addLead = () => {
    if (!newLeadName.trim()) return;
    const newLead = {
      id: uuidv4(),
      name: newLeadName.trim(),
      status: newLeadStatus,
      createdAt: new Date().toISOString(),
    };
    setLeads(prev => [...prev, newLead]);
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

  const toggleSelectLead = (id) => {
    setSelectedLeads(prev =>
      prev.includes(id) ? prev.filter(lid => lid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedLeads.length === leads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(leads.map(l => l.id));
    }
  };

  const applyStatusChange = () => {
    if (!pendingStatusChange) return;
    setLeads(prev =>
      prev.map(l =>
        selectedLeads.includes(l.id) ? { ...l, status: pendingStatusChange } : l
      )
    );
    setPendingStatusChange('');
  };

  const applyMoveToCampaign = () => {
    if (!pendingCampaignMove) return;

    const targetCampaign = campaigns.find(c => c.title === pendingCampaignMove);
    if (!targetCampaign) return;

    const targetKey = `leads_${pendingCampaignMove.toLowerCase()}`;
    const targetLeads = JSON.parse(localStorage.getItem(targetKey) || '[]');

    const leadsToMove = leads.filter(l => {
      const alreadyExists = targetLeads.some(t => t.id === l.id);
      return selectedLeads.includes(l.id) && !alreadyExists;
    });

    if (leadsToMove.length === 0) {
      setPendingCampaignMove('');
      return;
    }

    localStorage.setItem(
      targetKey,
      JSON.stringify([...targetLeads, ...leadsToMove])
    );

    const updatedLeads = leads.filter(l => !selectedLeads.includes(l.id));
    setLeads(updatedLeads);
    setSelectedLeads([]);
    setPendingCampaignMove('');
    window.dispatchEvent(new Event('lead-deleted'));
    window.dispatchEvent(new Event('leadsUpdated'));
  };

  const bulkDelete = () => {
    if (window.confirm(`Delete ${selectedLeads.length} selected leads?`)) {
      setLeads(prev => prev.filter(l => !selectedLeads.includes(l.id)));
      setSelectedLeads([]);
      window.dispatchEvent(new Event('lead-deleted'));
    }
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

      {/* All other sections remain unchanged */}
      {/* Add lead manually, bulk bar, leads list... (unchanged) */}
      {/* You already pasted this above, so we didn’t repeat for brevity */}
    </div>
  );
};

export default CampaignDetails;
