import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const navigate = useNavigate();

  // Load campaigns from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('campaigns');
    if (stored) {
      setCampaigns(JSON.parse(stored));
    }
  }, []);

  // Save campaigns to localStorage
  useEffect(() => {
    localStorage.setItem('campaigns', JSON.stringify(campaigns));
    window.dispatchEvent(new Event("campaignsUpdated"));
  }, [campaigns]);

  const handleAddCampaign = () => {
    if (!newTitle.trim()) return;
    const newCampaign = {
      id: uuidv4(),
      title: newTitle.trim(),
      createdAt: new Date().toISOString(),
    };
    setCampaigns(prev => [...prev, newCampaign]);
    setNewTitle('');
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
        <p>No campaigns yet.</p>
      ) : (
        <ul className="space-y-3">
          {campaigns.map((c) => (
            <li
              key={c.id}
              className="border rounded p-4 cursor-pointer hover:bg-gray-100"
              onClick={() => goToCampaign(c.id)}
            >
              <div className="font-semibold">{c.title}</div>
              <div className="text-sm text-gray-500">
                Created: {new Date(c.createdAt).toLocaleDateString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Campaigns;
