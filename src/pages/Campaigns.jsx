// CampaignsDebug.jsx — adds hardcoded test data and debug logs
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const toKey = (title) => `leads_${title.trim().toLowerCase()}`;

const CampaignsDebug = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [leadCounts, setLeadCounts] = useState({});
  const navigate = useNavigate();

  // DEBUG: Inject test campaign and lead on load
  useEffect(() => {
    const testCampaigns = [
      { id: 'test-1', title: 'Berlin', createdAt: new Date().toISOString() }
    ];
    localStorage.setItem('campaigns', JSON.stringify(testCampaigns));
    localStorage.setItem('leads_berlin', JSON.stringify([
      { id: 'lead-1', name: 'Test Lead', status: 'New' }
    ]));
  }, []);

  useEffect(() => {
    const loadCampaigns = () => {
      const stored = localStorage.getItem('campaigns');
      if (stored) {
        try {
          setCampaigns(JSON.parse(stored));
        } catch (err) {
          console.warn('Failed to parse campaigns:', err);
          setCampaigns([]);
        }
      } else {
        setCampaigns([]);
      }
    };

    const loadCounts = () => {
      const counts = {};
      const stored = JSON.parse(localStorage.getItem('campaigns') || '[]');
      stored.forEach(c => {
        try {
          const raw = localStorage.getItem(toKey(c.title));
          const leads = JSON.parse(raw || '[]');
          counts[c.title] = leads.length;
        } catch (err) {
          console.warn('Failed to parse leads for campaign:', c.title, err);
          counts[c.title] = 0;
        }
      });
      setLeadCounts(counts);
    };

    loadCampaigns();
    loadCounts();
  }, []);

  const handleAddCampaign = () => {
    const title = newTitle.trim();
    if (!title || campaigns.some(c => c.title.toLowerCase() === title.toLowerCase())) return;
    const newCampaign = { id: uuidv4(), title, createdAt: new Date().toISOString() };
    localStorage.setItem(toKey(title), JSON.stringify([]));
    const updated = [...campaigns, newCampaign];
    setCampaigns(updated);
    setNewTitle('');
    localStorage.setItem('campaigns', JSON.stringify(updated));
  };

  const handleDelete = (id) => {
    const campaign = campaigns.find(c => c.id === id);
    if (!campaign) return;
    if (!confirm(`Delete campaign '${campaign.title}'?`)) return;
    const updated = campaigns.filter(c => c.id !== id);
    localStorage.removeItem(toKey(campaign.title));
    localStorage.setItem('campaigns', JSON.stringify(updated));
    setCampaigns(updated);
  };

  const goToCampaign = (id) => {
    navigate(`/campaigns/${id}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Campaigns (Debug)</h1>

      <div className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="New campaign title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddCampaign()}
          className="border rounded px-3 py-2 w-full"
        />
        <button
          onClick={handleAddCampaign}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Create
        </button>
      </div>

      {campaigns.length === 0 ? (
        <p className="text-gray-500">No campaigns yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {campaigns.map((c) => (
            <div
              key={c.id}
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition relative"
              onClick={() => goToCampaign(c.id)}
            >
              <div className="font-semibold text-lg mb-1">{c.title}</div>
              <div className="text-sm text-gray-600 mb-1">Created: {new Date(c.createdAt).toLocaleDateString()}</div>
              <div className="text-sm text-gray-800">🎯 {leadCounts[c.title] || 0} lead(s)</div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(c.id);
                }}
                className="absolute top-2 right-2 text-red-600 text-xs hover:underline"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CampaignsDebug;
