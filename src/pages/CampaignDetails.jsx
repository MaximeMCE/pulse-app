import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const CampaignDetails = () => {
  const { id: campaignId } = useParams();

  const [campaigns, setCampaigns] = useState([]);
  const [leads, setLeads] = useState([]);
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadStatus, setNewLeadStatus] = useState('New');

  // Load campaigns and leads from localStorage
  useEffect(() => {
    const storedCampaigns = JSON.parse(localStorage.getItem('campaigns')) || [];
    setCampaigns(storedCampaigns);

    const storedLeads = JSON.parse(localStorage.getItem('leads')) || [];
    setLeads(storedLeads);
  }, []);

  // Save leads when updated
  useEffect(() => {
    localStorage.setItem('leads', JSON.stringify(leads));
  }, [leads]);

  // Find current campaign
  const campaign = campaigns.find(c => c.id === campaignId);
  if (!campaign) return <div className="p-6">Campaign not found.</div>;

  // Filter leads for this campaign
  const filteredLeads = leads.filter(lead => lead.campaignId === campaignId);

  // Add new lead
  const addLead = () => {
    if (!newLeadName.trim()) return;
    const newLead = {
      id: uuidv4(),
      name: newLeadName.trim(),
      status: newLeadStatus,
      campaignId,
      createdAt: new Date().toISOString(),
    };
    setLeads(prev => [...prev, newLead]);
    setNewLeadName('');
    setNewLeadStatus('New');
  };

  // Delete lead
  const deleteLead = (id) => {
    if (window.confirm('Delete this lead?')) {
      setLeads(prev => prev.filter(l => l.id !== id));
    }
  };

  // Update lead status
  const updateLeadStatus = (id, status) => {
    setLeads(prev =>
      prev.map(l => (l.id === id ? { ...l, status } : l))
    );
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{campaign.title} - Leads</h1>

      {/* Add New Lead */}
      <div className="flex gap-2 mb-6">
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

      {/* Leads List */}
      {filteredLeads.length === 0 ? (
        <p>No leads yet.</p>
      ) : (
        <ul className="space-y-3">
          {filteredLeads.map((lead) => (
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
