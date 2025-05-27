// CampaignsPolished.jsx — now safely handles empty storage + deletes by ID
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const toKey = (title) => `leads_${title.trim().toLowerCase()}`;

const CampaignsPolished = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [leadCounts, setLeadCounts] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadCampaigns = () => {
      const stored = localStorage.getItem('campaigns');
      if (stored) {
        setCampaigns(JSON.parse(stored));
      } else {
        setCampaigns([]); // fallback for first-time or cleared storage
      }
    };

    const loadCounts = () => {
      const counts = {};
      const stored = JSON.parse(localStorage.getItem('campaigns') || '[]');
      stored.forEach(c => {
        const leads = JSON.parse(localStorage.getItem(toKey(c.title)) || '[]');
        counts[c.title] = leads.length;
      });
      setLeadCounts(counts);
    };

    const handleUpdate = () => {
      loadCampaigns();
      loadCounts();
    };

    loadCampaigns();
    loadCounts();

    window.addEventListener('campaignsUpdated', handleUpdate);
    window.addEventListener('leadsUpdated', handleUpdate);
    return () => {
      window.removeEventListener('campaignsUpdated', handleUpdate);
      window.removeEventListener('leadsUpdated', handleUpdate);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('campaigns', JSON.stringify(campaigns));
  }, [campaigns]);

  const handleAddCampaign = () => {
    const title = newTitle.trim();
    if (!title || campaigns.some(c => c.title.toLowerCase() === title.toLowerCase())) return;
    const newCampaign = { id: uuidv4(), title, createdAt: new Date().toISOString() };
    localStorage.setItem(toKey(title), JSON.stringify([]));
    setCampaigns(prev => [...prev, newCampaign]);
    setNewTitle('');
    window.dispatchEvent(new Event('campaignsUpdated'));
  };

  const handleDeleteById = (id) => {
    const campaign = campaigns.find(c => c.id === id);
    if (!campaign) return;
    const confirmed = confirm(`Delete campaign '${campaign.title}' and all its leads?`);
    if (!confirmed) return;

    const key = toKey(campaign.title);
    localStorage.removeItem(key);
    setCampaigns(prev => prev.filter(c => c.id !== id));
    window.dispatchEvent(new Event('campaignsUpdated'));
  };

  const handleRename = (id, newTitleTrimmed) => {
    const existing = campaigns.find(c => c.id === id);
    if (!existing || !newTitleTrimmed) return;
    const oldKey = toKey(existing.title);
    const newKey = toKey(newTitleTrimmed);
    const leads = localStorage.getItem(oldKey);
    if (leads) {
      localStorage.setItem(newKey, leads);
      localStorage.removeItem(oldKey);
    }
    const updated = campaigns.map(c =>
      c.id === id ? { ...c, title: newTitleTrimmed } : c
    );
    setCampaigns(updated);
    setEditingId(null);
    setEditedTitle('');
    window.dispatchEvent(new Event('campaignsUpdated'));
  };

  const goToCampaign = (id) => {
    navigate(`/campaigns/${id}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Campaigns</h1>

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
          className="bg-black text-white px-4 py-2 rounded disabled:opacity-40"
          disabled={!newTitle.trim() || campaigns.some(c => c.title.toLowerCase() === newTitle.trim().toLowerCase())}
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
              {editingId === c.id ? (
                <input
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  onBlur={() => handleRename(c.id, editedTitle.trim())}
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleRename(c.id, editedTitle.trim());
                  }}
                  className="font-semibold text-lg mb-1 w-full border px-2 py-1 rounded"
                  autoFocus
                />
              ) : (
                <div
                  className="font-semibold text-lg mb-1"
                  onDoubleClick={(e) => {
                    e.stopPropagation();
                    setEditingId(c.id);
                    setEditedTitle(c.title);
                  }}
                >
                  {c.title}
                </div>
              )}
              <div className="text-sm text-gray-600 mb-1">Created: {new Date(c.createdAt).toLocaleDateString()}</div>
              <div className="text-sm text-gray-800">🎯 {leadCounts[c.title] || 0} lead(s)</div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteById(c.id);
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

export default CampaignsPolished;
