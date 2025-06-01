import React, { useEffect, useState } from 'react';

const LeadCard = ({ lead, campaigns, onStatusChange, onDelete }) => {
  const [profile, setProfile] = useState(null);

  const matchReason = lead.source === 'manual'
    ? 'Added manually'
    : 'Matched by genre + location';

  const tier = lead.followers > 100_000 ? 'Top' :
               lead.followers > 10_000 ? 'Mid' :
               'Emerging';

  useEffect(() => {
    const allProfiles = JSON.parse(localStorage.getItem('artistProfiles') || '{}');
    setProfile(allProfiles[lead.artistId] || null);
  }, [lead.artistId]);

  const handleMove = (newCampaignId) => {
    if (!newCampaignId || newCampaignId === lead.campaignId) return;

    const currentKey = `leads_${lead.campaignId}`;
    const newKey = `leads_${newCampaignId}`;

    const currentLeads = JSON.parse(localStorage.getItem(currentKey) || '[]');
    const updatedCurrentLeads = currentLeads.filter((l) => l.id !== lead.id);
    localStorage.setItem(currentKey, JSON.stringify(updatedCurrentLeads));

    const newLeads = JSON.parse(localStorage.getItem(newKey) || '[]');
    const newLead = { ...lead, campaignId: newCampaignId };
    localStorage.setItem(newKey, JSON.stringify([...newLeads, newLead]));

    window.dispatchEvent(new Event('leadsUpdated'));
  };

  return (
    <div className="flex justify-between items-start p-4 border rounded mb-2 bg-white shadow-sm">
      <div className="flex gap-3">
        <img
          src={profile?.image || lead.image || 'https://placehold.co/48x48/eeeeee/777777?text=🎵'}
          alt={lead.name}
          className="w-12 h-12 rounded object-cover"
        />
        <div className="flex flex-col justify-center">
          <div className="font-semibold text-base">{lead.name}</div>
          <div className="text-sm text-gray-500 capitalize">{lead.genres?.[0] || 'unknown genre'}</div>
          <div className="text-xs mt-1 bg-pink-100 text-pink-700 px-2 py-0.5 inline-block rounded">
            {matchReason}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <div className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-medium">
          Tier: {tier}
        </div>

        <div className="flex gap-2">
          <select
            value={lead.status}
            onChange={(e) => onStatusChange(lead.id, e.target.value)}
            className="border px-2 py-1 text-sm rounded"
          >
            <option>New</option>
            <option>Contacted</option>
            <option>Qualified</option>
            <option>Rejected</option>
          </select>

          <select
            defaultValue=""
            onChange={(e) => handleMove(e.target.value)}
            className="border px-2 py-1 text-sm rounded"
          >
            <option value="">Move</option>
            {campaigns
              .filter(c => c.id !== lead.campaignId)
              .map((campaign) => (
                <option key={campaign.id} value={campaign.id}>
                  {campaign.name}
                </option>
              ))}
            <option value="unassigned">Unassigned</option>
          </select>

          <button
            onClick={() => onDelete(lead.id)}
            className="text-red-500 text-lg px-2"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeadCard;

