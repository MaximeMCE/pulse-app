import React, { useEffect, useState } from 'react';

const Leads = () => {
  const [leadsData, setLeadsData] = useState({});
  const [campaigns, setCampaigns] = useState([]);
  const [selected, setSelected] = useState({});
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Load campaigns & leads from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('campaigns')) || [];
    setCampaigns(['Unassigned', ...stored.map(c => c.title)]);

    const data = {}, sel = {};
    Object.keys(localStorage)
      .filter(k => k.startsWith('leads_'))
      .forEach(k => {
        const camp = k.replace('leads_', '');
        const arr  = JSON.parse(localStorage.getItem(k)) || [];
        if (arr.length) {
          data[camp] = arr;
          sel[camp]  = [];
        }
      });

    setLeadsData(data);
    setSelected(sel);
  }, []);

  // Persist to storage
  const updateLS = upd =>
    Object.entries(upd).forEach(([c, arr]) =>
      localStorage.setItem(`leads_${c}`, JSON.stringify(arr))
    );

  // Status badge text & colors
  const statusEmoji = {
    New: '👀 New',
    Contacted: '📞 Contacted',
    Qualified: '✅ Qualified',
    Rejected: '❌ Rejected',
  };
  const getColor = s =>
    ({
      New: 'bg-blue-200 text-blue-800',
      Contacted: 'bg-yellow-200 text-yellow-800',
      Qualified: 'bg-green-200 text-green-800',
      Rejected: 'bg-red-200 text-red-800',
    }[s] || 'bg-gray-200 text-gray-800');

  // Single-lead actions
  const changeStatus = (c, i, s) => {
    const d = { ...leadsData };
    d[c][i].status = s;
    setLeadsData(d);
    updateLS(d);
  };
  const moveCampaign = (c, i, to) => {
    const d = { ...leadsData };
    const item = d[c][i];
    d[c].splice(i, 1);
    if (!d[to]) d[to] = [];
    d[to].push(item);
    if (!d[c].length) {
      delete d[c];
      localStorage.removeItem(`leads_${c}`);
    }
    setLeadsData(d);
    updateLS(d);
  };
  const deleteLead = (c, i) => {
    const d = { ...leadsData };
    d[c].splice(i, 1);
    if (!d[c].length) {
      delete d[c];
      localStorage.removeItem(`leads_${c}`);
    }
    setLeadsData(d);
    updateLS(d);
  };

  // Bulk selection & actions
  const toggle = (c, i) => {
    const sel = { ...selected };
    const idx = sel[c].indexOf(i);
    if (idx > -1) sel[c].splice(idx, 1);
    else sel[c].push(i);
    setSelected(sel);
  };
  const selectAll = () => {
    const sel = {};
    Object.entries(leadsData).forEach(([c, arr]) =>
      sel[c] = arr.map((_, i) => i)
    );
    setSelected(sel);
  };
  const clearAll = () => {
    const sel = {};
    Object.keys(leadsData).forEach(c => sel[c] = []);
    setSelected(sel);
  };
  const bulkDelete = () => {
    const d = { ...leadsData };
    Object.entries(selected).forEach(([c, idxs]) => {
      idxs.sort((a, b) => b - a).forEach(i => d[c].splice(i, 1));
      if (!d[c].length) {
        delete d[c];
        localStorage.removeItem(`leads_${c}`);
      }
    });
    setLeadsData(d);
    updateLS(d);
    clearAll();
  };

  // Filtering logic
  const filtered = arr =>
    arr.filter(l =>
      (statusFilter === 'All' || l.status === statusFilter)
      && l.name.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">All Saved Leads</h1>

      {/* Search bar */}
      <div className="mb-2">
        <input
          type="text"
          placeholder="Search lead..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border px-3 py-1 w-full md:w-1/3 rounded"
        />
      </div>

      {/* Status filters */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {['All','New','Contacted','Qualified','Rejected'].map(s => (
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
      </div>

      {/* Bulk actions */}
      <div className="flex gap-4 mb-6">
        <button onClick={selectAll} className="text-blue-600 text-sm">Select All</button>
        <button onClick={clearAll}  className="text-gray-600 text-sm">Clear</button>
        <button onClick={bulkDelete} className="text-red-600 text-sm">Delete Selected</button>
      </div>

      {/* Campaign sections */}
      {Object.entries(leadsData).map(([camp, arr]) => {
        const vis = filtered(arr);
        if (!vis.length) return null;
        return (
          <div key={camp} className="mb-8">
            <h2 className="text-xl font-semibold mb-2">{camp}</h2>
            <div className="space-y-4">
              {vis.map((lead, i) => (
                <div
                  key={lead.id}
                  className="flex items-center justify-between border p-4 rounded-lg shadow-sm"
                >
                  {/* Lead info */}
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={selected[camp]?.includes(i)}
                      onChange={() => toggle(camp, i)}
                    />
                    <img
                      src={lead.image || 'https://placehold.co/48x48/eeeeee/777777?text=🎵'}
                      alt={lead.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-medium">{lead.name}</h3>
                      <span className={`inline-block px-2 py-1 mt-1 rounded text-sm ${getColor(lead.status)}`}>
                        {statusEmoji[lead.status] || lead.status}
                      </span>
                    </div>
                  </div>

                  {/* Per-lead actions */}
                  <div className="flex gap-4 items-center">
                    <label className="text-sm font-medium">Status:</label>
                    <select
                      className="border rounded px-2 py-1 text-sm"
                      value={lead.status}
                      onChange={e => changeStatus(camp, i, e.target.value)}
                    >
                      <option>New</option>
                      <option>Contacted</option>
                      <option>Qualified</option>
                      <option>Rejected</option>
                    </select>

                    <label className="text-sm font-medium">Campaign:</label>
                    <select
                      className="border rounded px-2 py-1 text-sm"
                      value={camp}
                      onChange={e => moveCampaign(camp, i, e.target.value)}
                    >
                      {campaigns.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>

                    <button
                      onClick={() => deleteLead(camp, i)}
                      className="text-red-600 text-sm ml-4"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Leads;
