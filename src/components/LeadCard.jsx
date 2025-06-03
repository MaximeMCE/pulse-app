import React, { useEffect, useState } from 'react';

const LeadCard = ({ lead, campaigns, onStatusChange, onDelete }) => {
  const [profile, setProfile] = useState(null);
  const campaign = campaigns.find((c) => c.id === lead.campaignId);

  // Real tier logic
  let tier = 'Early';
  if (lead.followers > 100_000) tier = 'Top';
  else if (lead.followers > 10_000) tier = 'Mid';
  else if (lead.followers > 1_000) tier = 'Emerging';

  const tierColors = {
    Top: 'bg-yellow-200 text-yellow-800',
    Mid: 'bg-purple-200 text-purple-800',
    Emerging: 'bg-green-200 text-green-800',
    Early: 'bg-gray-200 text-gray-800'
  };

  const badgeColor = tierColors[tier];

  const campaignGenre = campaign?.genre?.toLowerCase();
  const campaignRegion = campaign?.region?.toLowerCase();
  const artistGenres = lead.genres?.map((g) => g.toLowerCase()) || [];
  const artistRegion = lead.region?.toLowerCase();

  const matches = [];
  if (campaignGenre && artistGenres.includes(campaignGenre)) matches.push('genre');
  if (campaignRegion && artistRegion === campaignRegion) matches.push('location');

  const matchLabel = matches.length > 0 ? `Matched by ${matches.join(' + ')}` : null;

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
    <div className="flex justify-between items-center p-4 border rounded-lg mb-3 bg-white shadow-sm min-h-[96px] w-full">
      {/* Left side */}
      <div className="flex items-center gap-4 w-[60%] min-w-[280px]">
        <img
          src={profile?.image || lead.image || 'https://placehold.co/48x48/eeeeee/777777?text=🎵'}
          alt={lead.name}
          className="w-14 h-14 rounded object-cover"
        />
        <div>
          <div className="font-semibold text-base">{lead.name}</div>
          <div className="text-sm text-gray-500 capitalize">{lead.genres?.[0] || 'unknown genre'}</div>
          {matchLabel && (
            <div className="text-xs mt-1 bg-pink-100 text-pink-700 px-2 py-0.5 inline-block rounded">
              {matchLabel}
            </div>
          )}
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3 w-[40%] justify-end">
        <span className={`text-xs px-2 py-0.5 rounded font-medium whitespace-nowrap ${badgeColor}`}>
          Tier: {tier}
        </span>

        <select
          value={lead.status}
          onChange={(e) => onStatusChange(lead.id, e.target.value)}
          className="border px-2 py-1 text-sm rounded w-[110px]"
        >
          <option>New</option>
          <option>Contacted</option>
          <option>Qualified</option>
          <option>Rejected</option>
        </select>

        <select
          defaultValue=""
          onChange={(e) => handleMove(e.target.value)}
          className="border px-2 py-1 text-sm rounded w-[110px]"
        >
          <option value="">Move</option>
          {campaigns
            .filter((c) => c.id !== lead.campaignId)
            .map((campaign) => (
              <option key={campaign.id} value={campaign.id}>
                {campaign.title}
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
  );
};

export default LeadCard;
