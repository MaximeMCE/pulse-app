import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import CampaignManager from '../components/CampaignManager';

const CampaignDetails = () => {
  const { id: campaignId } = useParams();
  const [campaigns, setCampaigns] = useState([]);
  const [leads, setLeads] = useState([]);
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
      const storedLeads = JSON.parse(localStorage.getItem(campaignKey)) || [];
      setLeads(storedLeads);
    }
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
    }
  };

  const updateLeadStatus = (id, status) => {
    setLeads(prev =>
      prev.map(l => (l.id === id ? { ...l, status } : l))
    );
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-2">
        <a href="/campaigns" className="text-blue-600 hover:underline">Campaigns</a>
        <span className="mx-1">›</span>
        <span>{campaign.title}</span>
      </div>

      <h1 className="text-3xl font-bold mb-4">{campaign.title} - Leads</h1>

      <CampaignManager />

      {/* 🔍 Need More Leads Section */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Need more leads?</h2>
        <p className="text-sm text-gray-600 mb-4">
          Based on your campaign, we’ll suggest relevant artists here — or you can explore manually.
        </p>

        {/* Placeholder for future recommendations */}
        <div className="bg-gray-100 p-4 rounded mb-4">
          <p className="text-sm text-gray-500">🎯 Smart recommendations coming soon...</p>
        </div>

        <a
          href="/explorer"
          className="inline-block bg-black text-white text-sm px-4 py-2 rounded hover:bg-gray-800"
        >
          Go to Explorer
        </a>
      </div>

      {/* Lead Input + List */}
      <div className="flex gap-2 my-6">
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

      {leads.length === 0 ? (
        <p>No leads yet.</p>
      ) : (
        <ul className="space-y-3">
          {leads.map((lead) => (
            <li
              key={lead.id}
              className="border rounded p-4 flex justify-between items-center"
            >
              <div>{lead.name}</div>
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
  );
};

export default CampaignDetails;
