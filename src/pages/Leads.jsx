import React, { useEffect, useState } from 'react';

const Leads = () => {
  const [leadsData, setLeadsData] = useState({});
  const [campaigns, setCampaigns] = useState([]);
  const [selected, setSelected] = useState({});
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    const storedCampaigns = JSON.parse(localStorage.getItem('campaigns')) || [];
    const titles = storedCampaigns.map((c) => c.title);
    setCampaigns(['Unassigned', ...titles]);

    const data = {};
    const sel = {};
    Object.keys(localStorage)
      .filter((k) => k.startsWith('leads_'))
      .forEach((k) => {
        const name = k.replace('leads_', '');
        const arr = JSON.parse(localStorage.getItem(k)) || [];
        if (arr.length) {
          data[name] = arr;
          sel[name] = [];
        }
      });
    setLeadsData(data);
    setSelected(sel);
  }, []);

  const updateLS = (upd) => {
    Object.entries(upd).forEach(([camp, arr]) =>
      localStorage.setItem(`leads_${camp}`, JSON.stringify(arr))
    );
  };

  const getColor = (s) =>
    ({
      New: 'bg-blue-200 text-blue-800',
      Contacted: 'bg-yellow-200 text-yellow-800',
      Qualified: 'bg-green-200 text-green-800',
      Rejected: 'bg-red-200 text-red-800',
    }[s] || 'bg-gray-200 text-gray-800');

  const changeStatus = (camp, i, s) => {
    const d = { ...leadsData };
    d[camp][i].status = s;
    setLeadsData(d);
    updateLS(d);
  };

  const moveCampaign = (camp, i, to) => {
    const d = { ...leadsData };
    const item = d[camp][i];
    d[camp].splice(i, 1);
    if (!d[to]) d[to] = [];
    d[to].push(item);
    if (d[camp].length === 0) delete d[camp];
    setLeadsData(d);
    updateLS(d);
  };

  const deleteLead = (camp, i) => {
    const d = { ...leadsData };
    d[camp].splice(i, 1);
    if (!d[camp].length) delete d[camp];
    setLeadsData(d);
    updateLS(d);
  };

  const toggle = (camp, i) => {
    const sel = { ...selected };
    const idx = sel[camp].indexOf(i);
    idx > -1 ? sel[camp].splice(idx, 1) : sel[camp].push(i);
    setSelected(sel);
  };

  const selectAll = () => {
    const sel = {};
    Object.entries(leadsData).forEach(([camp, arr]) => {
      sel[camp] = arr.map((_, i) => i);
    });
    setSelected(sel);
  };

  const clearAll = () => {
    const sel = {};
    Object.keys(leadsData).forEach((c) => (sel[c] = []));
    setSelected(sel);
  };

  const filtered = (arr) =>
    arr.filter(
      (l) =>
        (statusFilter === 'All' || l.status === statusFilter) &&
        l.name.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">All Saved Leads</h1>

      {/* Global controls */}
      <div className="flex flex-wrap gap-2 items-center mb-4">
        {['All', 'New', 'Contacted', 'Qualified', 'Rejected'].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1 border rounded text-sm ${
              statusFilter === s ? 'bg-black text-white' : ''
            }`}
          >
            {s}
          </button>
        ))}
        <input
          type="text"
          placeholder="Search artist..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-2 py-1 ml-4 flex-1 min-w-[200px]"
        />
        <button onClick={selectAll} className="ml-4 text-blue-600 text-sm">
          Select All
        </button>
        <button onClick={clearAll} className="ml-2 text-gray-600 text-sm">
          Clear
        </button>
      </div>

      {/* Campaign sections */}
      {Object.entries(leadsData).map(([camp, arr]) => {
        const vis = filtered(arr);
        return (
          <div key={camp} className="mb-8">
            <h2 className="text-xl font-semibold mb-2">{camp}</h2>
            {vis.length === 0 ? (
              <p className="text-gray-500">No leads matching this filter.</p>
            ) : (
              <div className="space-y-4">
                {vis.map((lead, idx) => (
                  <div
                    key={lead.id}
                    className="flex items-center justify-between border p-4 rounded-lg shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        checked={selected[camp]?.includes(idx)}
                        onChange={() => toggle(camp, idx)}
                      />
                      <img
                        src={lead.image || 'https://via.placeholder.com/48?text=🎵'}
                        alt={lead.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-medium">{lead.name}</h3>
                        <span
                          className={`inline-block px-2 py-1 rounded text-sm ${getColor(
                            lead.status
                          )}`}
                        >
                          {lead.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center">
                      <select
                        className="border rounded px-2 py-1 text-sm"
                        value={lead.status}
                        onChange={(e) => changeStatus(camp, idx, e.target.value)}
                      >
                        <option>New</option>
                        <option>Contacted</option>
                        <option>Qualified</option>
                        <option>Rejected</option>
                      </select>
                      <select
                        className="border rounded px-2 py-1 text-sm"
                        value={camp}
                        onChange={(e) => moveCampaign(camp, idx, e.target.value)}
                      >
                        {campaigns.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => deleteLead(camp, idx)}
                        className="text-red-600 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Leads;
