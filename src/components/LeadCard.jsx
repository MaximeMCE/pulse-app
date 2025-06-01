import React from 'react';

const LeadCard = ({ lead, campaigns, onStatusChange, onCampaignChange, onDelete }) => {
  const artistProfiles = JSON.parse(localStorage.getItem('artistProfiles')) || {};
  const artist = artistProfiles[lead.artistId];

  if (!artist) return null; // Don't render if artist data is missing

  return (
    <div className="flex items-center justify-between p-4 border rounded mb-2 bg-white shadow">
      <div className="flex items-center gap-3">
        <img
          src={artist.image || '/placeholder.png'}
          alt={artist.name}
          className="w-12 h-12 rounded object-cover"
        />
        <div>
          <div className="font-semibold">{artist.name}</div>
          <div className="text-sm text-gray-500">Status: {lead.status}</div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <select
          value={lead.status}
          onChange={(e) => onStatusChange(lead.id, e.target.value)}
          className="border p-1 rounded"
        >
          <option>New</option>
          <option>Contacted</option>
          <option>Qualified</option>
          <option>Rejected</option>
        </select>

        <select
          value={lead.campaignId}
          onChange={(e) => onCampaignChange(lead.id, e.target.value)}
          className="border p-1 rounded"
        >
          {campaigns.map((campaign) => (
            <option key={campaign.id} value={campaign.id}>
              {campaign.name}
            </option>
          ))}
          <option value="">Unassigned</option>
        </select>

        <button
          onClick={() => onDelete(lead.id)}
          className="text-red-500 text-lg"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default LeadCard;
