import React, { useEffect, useState } from 'react';

const Leads = () => {
  const [unassigned, setUnassigned] = useState([]);
  const [campaigns, setCampaigns] = useState({}); // { campaignId: [leads] }

  useEffect(() => {
    const storage = { ...localStorage };
    const foundCampaigns = {};

    for (const key in storage) {
      if (!key.startsWith('leads_')) continue;

      const raw = localStorage.getItem(key);
      if (!raw) continue;

      const parsed = JSON.parse(raw);
      const campaignId = key.replace('leads_', '');

      if (campaignId === 'unassigned') {
        setUnassigned(parsed);
      } else if (campaignId !== 'inbox') {
        foundCampaigns[campaignId] = parsed;
      }
    }

    setCampaigns(foundCampaigns);
  }, []);

  const renderLeads = (leads) => {
    return leads.length === 0 ? (
      <p className="text-sm text-gray-500 italic">No leads here yet.</p>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {leads.map((artist) => (
          <div
            key={artist.id}
            className="border p-4 flex items-center rounded shadow-sm"
          >
            {artist.images?.[0]?.url && (
              <img
                src={artist.images[0].url}
                alt={artist.name}
                className="w-[80px] h-[80px] rounded-full mr-4 object-cover"
              />
            )}
            <div>
              <div className="font-semibold">{artist.name}</div>
              <div className="text-sm text-gray-600">
                Followers: {artist.followers?.total?.toLocaleString() || 'N/A'}
              </div>
              <div className="text-sm text-gray-400">
                Genres: {artist.genres?.slice(0, 2).join(', ') || 'N/A'}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">All Saved Leads</h2>

      <section className="mb-10">
        <h3 className="text-xl font-semibold mb-2">Unassigned Leads</h3>
        {renderLeads(unassigned)}
      </section>

      {Object.entries(campaigns).map(([id, leads]) => (
        <section key={id} className="mb-10">
          <h3 className="text-xl font-semibold mb-2">
            Campaign: {id}
          </h3>
          {renderLeads(leads)}
        </section>
      ))}
    </div>
  );
};

export default Leads;
