import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const toKey = (title) => `leads_${title.trim().toLowerCase()}`;

const CampaignManager = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [title, setTitle] = useState('');
  const [goal, setGoal] = useState('');
  const [region, setRegion] = useState('');
  const [deadline, setDeadline] = useState('');
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('campaigns');
    if (!stored) return;

    const all = JSON.parse(stored);
    const found = all.find((c) => c.id === id);
    if (!found) return;

    setCampaign(found);
    setTitle(found.title);
    setGoal(found.goal || '');
    setRegion(found.region || '');
    setDeadline(found.deadline ? found.deadline.split('T')[0] : '');
  }, [id]);

  const handleSave = () => {
    if (!campaign) return;

    const updatedCampaign = {
      ...campaign,
      title: title.trim(),
      goal: goal.trim(),
      region: region.trim(),
      deadline: deadline ? new Date(deadline).toISOString() : null,
    };

    const stored = JSON.parse(localStorage.getItem('campaigns') || '[]');

    if (campaign.title !== updatedCampaign.title) {
      const oldKey = toKey(campaign.title);
      const newKey = toKey(updatedCampaign.title);
      const leads = localStorage.getItem(oldKey);
      localStorage.setItem(newKey, leads || '[]');
      localStorage.removeItem(oldKey);
    }

    const updatedList = stored.map((c) =>
      c.id === campaign.id ? updatedCampaign : c
    );

    localStorage.setItem('campaigns', JSON.stringify(updatedList));
    setCampaign(updatedCampaign);
    setEditMode(false);
    alert('Campaign updated!');
    window.location.reload();
  };

  const handleCancel = () => {
    if (!campaign) return;
    setTitle(campaign.title);
    setGoal(campaign.goal || '');
    setRegion(campaign.region || '');
    setDeadline(campaign.deadline ? campaign.deadline.split('T')[0] : '');
    setEditMode(false);
  };

  const handleDelete = () => {
    if (!campaign) return;
    if (!confirm(`Delete campaign "${campaign.title}"?`)) return;

    const stored = JSON.parse(localStorage.getItem('campaigns') || '[]');
    const updatedList = stored.filter((c) => c.id !== campaign.id);
    localStorage.setItem('campaigns', JSON.stringify(updatedList));
    localStorage.removeItem(toKey(campaign.title));
    navigate('/campaigns');
  };

  if (!campaign) return null;

  return (
    <div className="mb-6 p-4 border rounded bg-white shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Manage Campaign</h2>
        {!editMode && (
          <button
            onClick={() => setEditMode(true)}
            className="text-blue-600 hover:underline text-sm"
          >
            Edit
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <input
          type="text"
          value={title}
          disabled={!editMode}
          onChange={(e) => setTitle(e.target.value)}
          className={`border rounded px-3 py-2 ${!editMode && 'bg-gray-100'}`}
          placeholder="Campaign Title"
        />
        <input
          type="text"
          value={goal}
          disabled={!editMode}
          onChange={(e) => setGoal(e.target.value)}
          className={`border rounded px-3 py-2 ${!editMode && 'bg-gray-100'}`}
          placeholder="Goal"
        />
        <input
          type="text"
          value={region}
          disabled={!editMode}
          onChange={(e) => setRegion(e.target.value)}
          className={`border rounded px-3 py-2 ${!editMode && 'bg-gray-100'}`}
          placeholder="Region"
        />
        <input
          type="date"
          value={deadline}
          disabled={!editMode}
          onChange={(e) => setDeadline(e.target.value)}
          className={`border rounded px-3 py-2 ${!editMode && 'bg-gray-100'}`}
        />
      </div>

      {editMode && (
        <div className="flex gap-4">
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Save Changes
          </button>
          <button
            onClick={handleCancel}
            className="text-gray-600 hover:underline text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="text-red-600 hover:underline text-sm ml-auto"
          >
            Delete Campaign
          </button>
        </div>
      )}
    </div>
  );
};

export default CampaignManager;
