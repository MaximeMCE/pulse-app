import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import CampaignManager from '../components/CampaignManager';
import MockRecommendations from '../components/MockRecommendations';

const CampaignDetails = () => {
  const { id: campaignId } = useParams();
  const [campaigns, setCampaigns] = useState([]);
  const [leads, setLeads] = useState([]);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadStatus, setNewLeadStatus] = useState('New');

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
    setLeads(prev =>
      prev.map(l => (l.id === id ? { ...l, status } : l))
    );
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

  const bulkDelete = () => {
    if (window.confirm(`Delete ${selectedLeads.length} selected leads?`)) {
      setLeads(prev => prev.filter(l => !selectedLeads.includes(l.id)));
      setSelectedLeads([]);
      window.dispatchEvent(new Event('lead-deleted'));
    }
  };

  const bulkUpdateStatus = (status) => {
    setLeads(prev =>
      prev.map(l => selectedLeads.includes(l.id) ? { ...l, status } : l)
    );
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="text-sm text-gray-500 mb-2">
        <a href="/campaigns" className="text-blue-600 hover:underline">Campaigns</a>
        <span className="mx-1">›</span>
        <span>{campaign.title}</span>
      </div>

      <h1 className="text-3xl font-bold mb-4">{campaign.title} - Leads</h1>

      <CampaignManager />

      <div className="mt-8 p-4 border rounded shadow-sm bg-white">
        <h2 className="text-lg font-semibold mb-4">Need new leads?</h2>

        <div className="mb-6">
          <p className="text-sm font-medium mb-1">🎯 Get suggestions based on your campaign</p>
          <MockRecommendations />
        </div>

        <div className="mb-6">
          <p className="text-sm font-medium mb-2">🔍 Explore artists manually</p>
          <a
            href="/explorer"
            className="inline-block bg-black text-white text-sm px-4 py-2 rounded hover:bg-gray-800"
          >
            Go to Explorer
          </a>
        </div>

        <div>
          <p className="text-sm font-medium mb-2">📝 Add an artist manually</p>
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
              className="bg-black text-white px-4 py-2 rounded"
            >
              Add Lead
            </button>
          </div>
        </div>
      </div>

      {/* 🔁 Bulk Actions */}
      {selectedLeads.length > 0 && (
        <div className="mt-6 p-4 bg-yellow-50 border rounded shadow-sm flex justify-between items-center">
          <span className="text-sm">{selectedLeads.length} selected</span>
          <div className="flex items-center gap-4">
            <select
              onChange={(e) => bulkUpdateStatus(e.target.value)}
              className="border rounded px-2 py-1"
            >
              <option value="">Change status</option>
              <option>New</option>
              <option>Contacted</option>
              <option>Qualified</option>
              <option>Lost</option>
            </select>
            <button
              onClick={bulkDelete}
              className="text-red-600 hover:underline text-sm"
            >
              Delete selected
            </button>
          </div>
        </div>
      )}

      {/* Lead List */}
      <div className="mt-8">
        {leads.length === 0 ? (
          <p>No leads yet.</p>
        ) : (
          <ul className="space-y-3">
            <li className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedLeads.length === leads.length}
                onChange={toggleSelectAll}
              />
              <span className="text-sm font-medium">Select all</span>
            </li>
            {leads.map((lead) => (
              <li
                key={lead.id}
                className="border rounded p-4 flex justify-between items-center"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedLeads.includes(lead.id)}
                    onChange={() => toggleSelectLead(lead.id)}
                  />
                  <span>{lead.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <select
                    value={lead.status}
                    onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                    className="border rounded px-2 py-1"
                  >
                    <option>New</option>
                    <option>Contacted</option>
                    <option>Qualified</option>
                    <option>Lost</option>
                  </select>
                  <button
                    onClick={() => deleteLead(lead.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CampaignDetails;
