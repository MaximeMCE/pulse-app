import React, { useEffect, useState } from 'react';
import useLeads from '../hooks/useLeads';

const STATUS_OPTIONS = ['New', 'Contacted', 'Qualified', 'Rejected'];
const STATUS_EMOJIS = {
  New: '👀',
  Contacted: '📬',
  Qualified: '✅',
  Rejected: '❌',
};

const Leads = () => {
  const {
    unassigned,
    setUnassigned,
    campaigns,
    setCampaigns,
    loadLeads
  } = useLeads();

  const [statuses, setStatuses] = useState({});
  const [selected, setSelected] = useState({});
  const [statusFilters, setStatusFilters] = useState({});
  const [searchTerms, setSearchTerms] = useState({}); // ← search bar logic

  useEffect(() => {
    loadLeads();
    loadStatuses();
  }, []);

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
      const updated = unassigned.filter((a) => a.id !== artist.id);
      setUnassigned(updated);
      localStorage.setItem('leads_unassigned', JSON.stringify(updated));
    } else {
      const updated = campaigns[from].filter((a) => a.id !== artist.id);
      const updatedCampaigns = { ...campaigns, [from]: updated };
      setCampaigns(updatedCampaigns);
      localStorage.setItem(`leads_${from}`, JSON.stringify(updated));
    }

    if (to === 'unassigned') {
      const updated = [...unassigned, artist];
      setUnassigned(updated);
      localStorage.setItem('leads_unassigned', JSON.stringify(updated));
    } else {
      const destination = campaigns[to] || [];
      const updated = [...destination, artist];
      const updatedCampaigns = { ...campaigns, [to]: updated };
      setCampaigns(updatedCampaigns);
      localStorage.setItem(`leads_${to}`, JSON.stringify(updated));
    }  // ✅ ADD THIS BLOCK:
    setSelected({});
    loadLeads();
  };

  const bulkDelete = (leads, source) => {
    leads.forEach((a) => handleDelete(a.id, source));
  };

  const bulkMove = (leads, source, target) => {
    leads.forEach((a) => handleMove(a, source, target));
  };

  const bulkStatus = (leads, status) => {
    leads.forEach((a) => updateStatus(a.id, status));
  };

  const toggleSelect = (artistId) => {
    setSelected((prev) => ({
      ...prev,
      [artistId]: !prev[artistId],
    }));
  };

  const selectAll = (leads) => {
    const update = {};
    leads.forEach((a) => (update[a.id] = true));
    setSelected((prev) => ({ ...prev, ...update }));
  };

  const clearAll = (leads) => {
    const update = { ...selected };
    leads.forEach((a) => delete update[a.id]);
    setSelected(update);
  };
  const renderStatusFilterBar = (groupId) => {
    const current = statusFilters[groupId] || 'All';

    return (
      <div className="flex flex-wrap gap-2 mb-2 text-sm">
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

  const renderSearchInput = (groupId) => {
    return (
      <input
        type="text"
        placeholder="Search artist..."
        className="w-full mb-2 p-2 border rounded"
        value={searchTerms[groupId] || ''}
        onChange={(e) =>
          setSearchTerms((prev) => ({ ...prev, [groupId]: e.target.value }))
        }
      />
    );
  };

  const renderLeads = (leads, source) => {
    const filter = statusFilters[source] || 'All';
    const search = (searchTerms[source] || '').toLowerCase();

    const visible = leads.filter((a) => {
      const matchesStatus =
        filter === 'All' || (statuses[a.id] || 'New') === filter;
      const matchesSearch = a.name.toLowerCase().includes(search);
      return matchesStatus && matchesSearch;
    });

    const selectedLeads = visible.filter((a) => selected[a.id]);

    return (
      <>
        {renderStatusFilterBar(source)}
        {renderSearchInput(source)}
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm text-gray-600">
            {selectedLeads.length > 0 ? (
              <span>{selectedLeads.length} selected</span>
            ) : (
              <span>{visible.length} total</span>
            )}
          </div>

          <div className="flex gap-2 text-sm">
            {selectedLeads.length > 0 ? (
              <>
                <button
                  onClick={() => bulkDelete(selectedLeads, source)}
                  className="bg-red-100 text-red-700 px-2 py-1 rounded"
                >
                  Delete
                </button>

                <select
                  onChange={(e) =>
                    bulkMove(selectedLeads, source, e.target.value)
                  }
                  defaultValue=""
                  className="border px-2 py-1 rounded"
                >
                  <option value="" disabled>Move</option>
                  <option value="unassigned">Unassigned</option>
                  {Object.keys(campaigns)
                    .filter((id) => id !== source)
                    .map((id) => (
                      <option key={id} value={id}>
                        {id}
                      </option>
                    ))}
                </select>

                <select
                  onChange={(e) => bulkStatus(selectedLeads, e.target.value)}
                  defaultValue=""
                  className="border px-2 py-1 rounded"
                >
                  <option value="" disabled>Status</option>
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </>
            ) : (
              <>
                <button
                  onClick={() => selectAll(visible)}
                  className="text-blue-600 hover:underline"
                >
                  Select All
                </button>
                <button
                  onClick={() => clearAll(visible)}
                  className="text-gray-500 hover:underline"
                >
                  Clear
                </button>
              </>
            )}
          </div>
        </div>

        {visible.length === 0 ? (
          <p className="text-sm text-gray-500 italic mb-4">
            No leads matching this filter.
          </p>
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
                    <input
                      type="checkbox"
                      checked={!!selected[artist.id]}
                      onChange={() => toggleSelect(artist.id)}
                      className="mr-2"
                    />
                    {artist.images?.[0]?.url && (
                      <div className="flex flex-col items-center mr-4">
                        <img
                          src={artist.images[0].url}
                          alt={artist.name}
                          className="w-[80px] h-[80px] rounded-full object-cover"
                        />
                        <div className={`text-xs mt-1 inline-block px-2 py-1 rounded-full font-medium
                          ${
                            status === 'New' ? 'bg-blue-200 text-blue-800' :
                            status === 'Contacted' ? 'bg-yellow-200 text-yellow-800' :
                            status === 'Qualified' ? 'bg-green-200 text-green-800' :
                            status === 'Rejected' ? 'bg-gray-200 text-gray-800' :
                            ''
                          }
                        `}>
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

                  <div className="flex justify-end items-center gap-2 mt-auto">
                    <select
                      onChange={(e) => updateStatus(artist.id, e.target.value)}
                      defaultValue=""
                      className="text-sm border rounded px-2 py-1"
                    >
                      <option value="" disabled>Status</option>
                      {STATUS_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>

                    <select
                      className="text-sm border rounded px-2 py-1"
                      defaultValue=""
                      onChange={(e) => handleMove(artist, source, e.target.value)}
                    >
                      <option value="" disabled>Move</option>
                      <option value="unassigned">Unassigned</option>
                      {Object.keys(campaigns)
                        .filter((id) => id !== source)
                        .map((id) => (
                          <option key={id} value={id}>
                            {id}
                          </option>
                        ))}
                    </select>

                    <button
                      onClick={() => handleDelete(artist.id, source)}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      ✕
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
