import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [goal, setGoal] = useState('');
  const [region, setRegion] = useState('');
  const [deadline, setDeadline] = useState('');
  const [leadCounts, setLeadCounts] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('campaigns');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setCampaigns(parsed);

        const counts = {};
        parsed.forEach(c => {
          const key = `leads_${c.id}`;
          try {
            const leads = JSON.parse(localStorage.getItem(key) || '[]');
            counts[c.id] = leads.length;
          } catch (err) {
            console.warn('Failed to parse leads for campaign:', c.id, err);
            counts[c.id] = 0;
          }
        });
        setLeadCounts(counts);
      } catch (err) {
        console.warn('Failed to parse campaigns:', err);
        setCampaigns([]);
      }
    } else {
      setCampaigns([]);
    }
  }, []);

  const handleAddCampaign = () => {
    const title = newTitle.trim();
    if (!title || campaigns.some(c => c.title.toLowerCase() === title.toLowerCase())) return;

    const newCampaign = {
      id: uuidv4(),
      title,
      goal: goal.trim(),
      region: region.trim(),
      deadline: deadline ? new Date(deadline).toISOString() : null,
      createdAt: new Date().toISOString(),
    };

    const updated = [...campaigns, newCampaign];
    setCampaigns(updated);
    setNewTitle('');
    setGoal('');
    setRegion('');
    setDeadline('');
    localStorage.setItem('campaigns', JSON.stringify(updated));
    localStorage.setItem(`leads_${newCampaign.id}`, JSON.stringify([]));
    setLeadCounts(prev => ({ ...prev, [newCampaign.id]: 0 }));
  };

  const handleDelete = (id) => {
    const campaign = campaigns.find(c => c.id === id);
    if (!campaign) return;
    if (!confirm(`Delete campaign '${campaign.title}'?`)) return;

    const updated = campaigns.filter(c => c.id !== id);
    localStorage.removeItem(`leads_${campaign.id}`);
    localStorage.setItem('campaigns', JSON.stringify(updated));
    setCampaigns(updated);
  };

  const goToCampaign = (id) => {
    navigate(`/campaigns/${id}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Campaigns</h1>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
        <input
          type="text"
          placeholder="New campaign title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="border rounded px-3 py-2 w-full"
        />
        <input
          type="text"
          placeholder="Goal (optional)"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          className="border rounded px-3 py-2 w-full"
        />
        <input
          type="text"
          placeholder="Region (optional)"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="border rounded px-3 py-2 w-full"
        />
        <div className="flex flex-col w-full">
          <label className="text-sm text-gray-600 mb-1">Deadline (optional)</label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />
        </div>
        <button
          onClick={handleAddCampaign}
          className="bg-black text-white px-4 py-2 rounded mt-2 md:mt-0"
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
              {c.goal && <div className="text-sm text-gray-700 mb-1">🎯 {c.goal}</div>}
              {c.region && <div className="text-sm text-gray-700 mb-1">📍 {c.region}</div>}
              {c.deadline && (
                <div className="text-sm text-gray-700 mb-1">⏳ Deadline: {new Date(c.deadline).toLocaleDateString()}</div>
              )}
              <div className="text-sm text-gray-800 mt-2">📦 {leadCounts[c.id] || 0} lead(s)</div>
              <hr className="my-2 border-t border-gray-200" />
              <div className="text-sm text-gray-500">🗓 Created: {new Date(c.createdAt).toLocaleDateString()}</div>
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

export default Campaigns;
