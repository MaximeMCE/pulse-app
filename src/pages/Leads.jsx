import React, { useEffect, useState } from 'react';

const STATUS_OPTIONS = ['New', 'Contacted', 'Qualified', 'Rejected'];
const STATUS_EMOJIS = {
  New: '👀',
  Contacted: '📬',
  Qualified: '✅',
  Rejected: '❌',
};

const Leads = () => {
  const [unassigned, setUnassigned] = useState([]);
  const [campaigns, setCampaigns] = useState({});
  const [statuses, setStatuses] = useState({});
  const [selected, setSelected] = useState({});
  const [statusFilters, setStatusFilters] = useState({}); // e.g. { unassigned: 'All', campaignId: 'New' }

  useEffect(() => {
    loadLeads();
    loadStatuses();
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

  const loadStatuses = () => {
    const newStatuses = {};
    for (const key in localStorage) {
      if (key.startsWith('leadStatus_')) {
        const artistId = key.replace('leadStatus_', '');
        newStatuses[artistId] = localStorage.getItem(key);
      }
    }
    setStatuses(newStatuses);
  };

  const updateStatus = (artistId, status) => {
    localStorage.setItem(`leadStatus_${artistId}`, status);
    setStatuses((prev) => ({ ...prev, [artistId]: status }));
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

    localStorage.removeItem(`leadStatus_${artistId}`);
    setStatuses((prev) => {
      const updated = { ...prev };
      delete updated[artistId];
      return updated;
    });

    setSelected((prev) => {
      const updated = { ...prev };
      delete updated[artistId];
      return updated;
    });
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

  const toggleSelect = (artistId) => {
    setSelected((prev) => ({
      ...prev,
      [artistId]: !prev[artistId],
    }));
  };

  const renderStatusFilterBar = (groupId) => {
    const current = statusFilters[groupId] || 'All';

    return (
      <div className="flex gap-2 mb-2 text-sm">
        {['All', ...STATUS_OPTIONS].map((status) => (
          <button
            key={status}
            onClick={() =>
              setStatusFilters((prev) => ({ ...prev, [groupId]: status }))
            }
            className={`px-2 py-1 rounded ${
              current === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {status}
          </button>
        ))}
      </div>
    );
  };

  const renderLeads = (leads, source) => {
    const filter = statusFilters[source] || 'All';
    const visible = filter === 'All'
      ? leads
      : leads.filter((a) => (statuses[a.id] || 'New') === filter);

    return (
      <>
        {renderStatusFilterBar(source)}

        {visible.length === 0 ? (
          <p className="text-sm text-gray-500 italic mb-4">No leads matching this filter.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            {visible.map((artist) => {
              const status = statuses[artist.id] || 'New';
              const emoji = STATUS_EMOJIS[status];

              return (
                <div
                  key={artist.id}
                  className="border p-4 rounded shadow-sm flex flex-col justify-between h-full"
                >
                  <div className="flex items-center mb-2">
                    {artist.images?.[0]?.url && (
                      <div className="flex flex-col items-center mr-4">
                        <img
                          src={artist.images[0].url}
                          alt={artist.name}
                          className="w-[80px] h-[80px] rounded-full object-cover"
                        />
                        <div className="text-xs mt-1 text-gray-700">
                          {emoji} {status}
                        </div>
                      </div>
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

                  <div className="flex justify-between items-center mt-auto">
                    <select
                      value={status}
                      onChange={(e) => updateStatus(artist.id, e.target.value)}
                      className="text-sm border rounded px-2 py-1"
                    >
                      {STATUS_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleDelete(artist.id, source)}
                      className="text-sm text-red-600 hover:text-red-800 ml-2"
                    >
                      ✕ Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </>
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
          <h3 className="text-xl font-semibold mb-2">Campaign: {id}</h3>
          {renderLeads(leads, id)}
        </section>
      ))}
    </div>
  );
};

export default Leads;
