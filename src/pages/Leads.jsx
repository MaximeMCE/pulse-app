import React, { useEffect, useState } from 'react';

const Leads = () => {
  const [unassigned, setUnassigned] = useState([]);
  const [campaigns, setCampaigns] = useState({});

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = () => {
    const storage = { ...localStorage };
    const foundCampaigns = {};
    const unassignedRaw = localStorage.getItem('leads_unassigned');
    if (unassignedRaw) setUnassigned(JSON.parse(unassignedRaw));

    for (const key in storage) {
      if (!key.startsWith('leads_')) continue;
      const raw = localStorage.getItem(key);
      if (!raw) continue;

      const campaignId = key.replace('leads_', '');
      if (campaignId === 'unassigned' || campaignId === 'inbox') continue;

      foundCampaigns[campaignId] = JSON.parse(raw);
    }

    setCampaigns(foundCampaigns);
  };

  const handleDelete = (artistId, source) => {
    if (source === 'unassigned') {
      const updated = unassigned.filter((a) => a.id !== artistId);
      setUnassigned(updated);
      localStorage.setItem('leads_unassigned', JSON.stringify(updated));
    } else {
      const updated = campaigns[source].filter((a) => a.id !== artistId);
      const updatedCampaigns = { ...campaigns, [source]: updated };
      setCampaigns(updatedCampaigns);
      localStorage.setItem(`leads_${source}`, JSON.stringify(updated));
    }
  };

  const handleMove = (artist, from, to) => {
    if (from === to) return;

    if (from === 'unassigned') {
      const updatedUnassigned = unassigned.filter((a) => a.id !== artist.id);
      setUnassigned(updatedUnassigned);
      localStorage.setItem('leads_unassigned', JSON.stringify(updatedUnassigned));
    } else {
      const updatedSource = campaigns[from].filter((a) => a.id !== artist.id);
      const updatedCampaigns = { ...campaigns, [from]: updatedSource };
      setCampaigns(updatedCampaigns);
      localStorage.setItem(`leads_${from}`, JSON.stringify(updatedSource));
    }

    const destination = campaigns[to] || [];
    const updatedDestination = [...destination, artist];
    const updatedCampaigns = { ...campaigns, [to]: updatedDestination };
    setCampaigns(updatedCampaigns);
    localStorage.setItem(`leads_${to}`, JSON.stringify(updatedDestination));
  };

  const renderLeads = (leads, source) => {
    return leads.length === 0 ? (
      <p className="text-sm text-gray-500 italic">No leads here yet.</p>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {leads.map((artist) => (
          <div
            key={artist.id}
            className="border p-4 rounded shadow-sm flex flex-col justify-between h-full"
          >
            <div className="flex items-center mb-4">
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

            <div className="flex justify-end gap-2 mt-auto">
              <button
                onClick={() => handleDelete(artist.id, source)}
                className="text-sm text-red-600 hover:text-red-800"
              >
                ✕ Delete
              </button>

              <select
                className="text-sm border rounded px-2 py-1"
                defaultValue=""
                onChange={(e) => handleMove(artist, source, e.target.value)}
              >
                <option value="" disabled>
                  Move to campaign...
                </option>
                {Object.keys(campaigns)
                  .filter((id) => id !== source)
                  .map((id) => (
                    <option key={id} value={id}>
                      {id}
                    </option>
                  ))}
              </select>
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
        {renderLeads(unassigned, 'unassigned')}
      </section>

      {Object.entries(campaigns).map(([id, leads]) => (
        <section key={id} className="mb-10">
          <h3 className="text-xl font-semibold mb-2">
            Campaign: {id}
          </h3>
          {renderLeads(leads, id)}
        </section>
      ))}
    </div>
  );
};

export default Leads;
