// CampaignsPolished.jsx — fixed localStorage key casing for lead counts
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const CampaignsPolished = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [leadCounts, setLeadCounts] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const loadCampaigns = () => {
      const stored = localStorage.getItem('campaigns');
      if (stored) setCampaigns(JSON.parse(stored));
    };

    const loadCounts = () => {
      const counts = {};
      const stored = JSON.parse(localStorage.getItem('campaigns') || '[]');
      stored.forEach(c => {
        const leads = JSON.parse(localStorage.getItem(`leads_${c.title.toLowerCase()}`) || '[]');
        counts[c.title] = leads.length;
      });
      setLeadCounts(counts);
    };

    loadCampaigns();
    loadCounts();

    const handleUpdate = () => {
      loadCampaigns();
      loadCounts();
    };

    window.addEventListener('campaignsUpdated', handleUpdate);
    return () => window.removeEventListener('campaignsUpdated', handleUpdate);
  }, []);

  useEffect(() => {
    localStorage.setItem('campaigns', JSON.stringify(campaigns));
  }, [campaigns]);

  const handleAddCampaign = () => {
    const title = newTitle.trim();
    if (!title || campaigns.some(c => c.title.toLowerCase() === title.toLowerCase())) return;

    const newCampaign = {
      id: uuidv4(),
      title,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(`leads_${title.toLowerCase()}`, JSON.stringify([]));
    setCampaigns(prev => [...prev, newCampaign]);
    setNewTitle('');
    window.dispatchEvent(new Event('campaignsUpdated'));
  };

  const handleDelete = (title) => {
    if (!confirm(`Delete campaign '${title}' and all its leads?`)) return;
    setCampaigns(prev => prev.filter(c => c.title !== title));
    localStorage.removeItem(`leads_${title.toLowerCase()}`);
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
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleAddCampaign();
          }}
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
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition cursor-pointer relative"
              onClick={() => goToCampaign(c.id)}
            >
              <div className="font-semibold text-lg mb-1">{c.title}</div>
              <div className="text-sm text-gray-600 mb-1">Created: {new Date(c.createdAt).toLocaleDateString()}</div>
              <div className="text-sm text-gray-800">🎯 {leadCounts[c.title] || 0} lead(s)</div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(c.title);
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
