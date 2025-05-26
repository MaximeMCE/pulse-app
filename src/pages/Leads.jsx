// Final fixed Leads.jsx with campaign tracking per lead
import React, { useEffect, useState } from 'react';

const Leads = () => {
  const [leadsData, setLeadsData] = useState({});
  const [campaigns, setCampaigns] = useState([]);
  const [selected, setSelected] = useState({});
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const normalizeKey = (str) => str.toLowerCase();
  const displayName = (key) => key === 'unassigned' ? 'Unassigned' : key;

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('campaigns')) || [];
    const allCampaigns = ['Unassigned', ...stored.map(c => c.title)];
    setCampaigns(allCampaigns);

    const allLeads = {};
    const selectedInit = {};
    Object.keys(localStorage)
      .filter(k => k.startsWith('leads_'))
      .forEach(k => {
        const rawCamp = k.replace('leads_', '');
        const normCamp = normalizeKey(rawCamp);
        const arr = JSON.parse(localStorage.getItem(k)) || [];

        arr.forEach(lead => {
          if (!lead.campaign) lead.campaign = displayName(normCamp);
        });

        allLeads[normCamp] = arr;
        selectedInit[normCamp] = [];
      });
    setLeadsData(allLeads);
    setSelected(selectedInit);
  }, []);

  const updateLS = (updatedData) => {
    Object.entries(updatedData).forEach(([key, leads]) => {
      localStorage.setItem(`leads_${normalizeKey(key)}`, JSON.stringify(leads));
    });
  };

  const statusEmoji = {
    New: '👀 New',
    Contacted: '📞 Contacted',
    Qualified: '✅ Qualified',
    Rejected: '❌ Rejected'
  };

  const getColor = (status) => ({
    New: 'bg-blue-200 text-blue-800',
    Contacted: 'bg-yellow-200 text-yellow-800',
    Qualified: 'bg-green-200 text-green-800',
    Rejected: 'bg-red-200 text-red-800'
  }[status] || 'bg-gray-200 text-gray-800');

  const changeStatus = (campKey, index, newStatus) => {
    const copy = { ...leadsData };
    copy[campKey][index].status = newStatus;
    setLeadsData(copy);
    updateLS(copy);
  };

  const moveCampaign = (fromKey, index, toCampaignLabel) => {
    const toKey = normalizeKey(toCampaignLabel);
    const copy = { ...leadsData };
    const lead = copy[fromKey][index];

    lead.campaign = toCampaignLabel;

    copy[fromKey].splice(index, 1);
    if (!copy[toKey]) copy[toKey] = [];
    copy[toKey].push(lead);

    if (!copy[fromKey].length) {
      delete copy[fromKey];
      localStorage.removeItem(`leads_${normalizeKey(fromKey)}`);
    }

    setLeadsData(copy);
    updateLS(copy);
  };

  const deleteLead = (campKey, index) => {
    const copy = { ...leadsData };
    copy[campKey].splice(index, 1);
    if (!copy[campKey].length) {
      delete copy[campKey];
      localStorage.removeItem(`leads_${normalizeKey(campKey)}`);
    }
    setLeadsData(copy);
    updateLS(copy);
  };

  const toggle = (c, i) => {
    const sel = { ...selected };
    const idx = sel[c].indexOf(i);
    idx > -1 ? sel[c].splice(idx, 1) : sel[c].push(i);
    setSelected(sel);
  };

  const selectAll = () => {
    const sel = {};
    Object.entries(leadsData).forEach(([c, arr]) => sel[c] = arr.map((_, i) => i));
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
        localStorage.removeItem(`leads_${normalizeKey(c)}`);
      }
    });
    setLeadsData(d);
    updateLS(d);
    clearAll();
  };

  const filtered = arr =>
    arr.filter(l =>
      (statusFilter === 'All' || l.status === statusFilter) &&
      l.name.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Leads</h1>
      <div className="mb-6 flex items-center">
        <input
          type="text"
          placeholder="Search lead..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border px-3 py-1 w-full md:w-1/3 rounded"
        />
        <button
          onClick={() => {}}
          className="ml-2 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
        >Search</button>
      </div>

      <div className="mb-4">
        <h2 className="font-semibold mb-2">Filters</h2>
        <div className="flex gap-2 flex-wrap">
          {['All', 'New', 'Contacted', 'Qualified', 'Rejected'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1 border rounded text-sm ${statusFilter === s ? 'bg-black text-white' : ''}`}
            >{s}</button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="font-semibold mb-2">Actions</h2>
        <div className="flex gap-4">
          <button onClick={selectAll} className="text-blue-600 text-sm">Select All</button>
          <button onClick={clearAll} className="text-gray-600 text-sm">Clear</button>
          <button onClick={bulkDelete} className="text-red-600 text-sm">Delete Selected</button>
        </div>
      </div>

      {Object.entries(leadsData).map(([campKey, arr]) => {
        const vis = filtered(arr);
        if (!vis.length) return null;
        return (
          <div key={campKey} className="mb-8">
            <h2 className="text-xl font-semibold mb-2">{displayName(campKey)}</h2>
            <div className="space-y-4">
              {vis.map((lead, i) => (
                <div key={lead.id} className="flex items-center justify-between border p-4 rounded-lg shadow-sm">
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={selected[campKey]?.includes(i)}
                      onChange={() => toggle(campKey, i)}
                    />
                    <img
                      src={lead.image || 'https://placehold.co/48x48/eeeeee/777777?text=🎵'}
                      alt={lead.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-medium">{lead.name}</h3>
                      <span className={`inline-block px-2 py-1 mt-1 rounded text-sm ${getColor(lead.status)}`}>{statusEmoji[lead.status]}</span>
                    </div>
                  </div>
                  <div className="flex gap-4 items-center">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-600">Status</span>
                      <select
                        className="border rounded px-2 py-1 text-sm"
                        value={lead.status}
                        onChange={e => changeStatus(campKey, i, e.target.value)}
                      >
                        <option>New</option>
                        <option>Contacted</option>
                        <option>Qualified</option>
                        <option>Rejected</option>
                      </select>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-600">Campaign</span>
                      <select
                        className="border rounded px-2 py-1 text-sm"
                        value={lead.campaign}
                        onChange={e => moveCampaign(campKey, i, e.target.value)}
                      >
                        {campaigns.map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={() => deleteLead(campKey, i)}
                      className="text-red-600 text-sm ml-4"
                    >Delete</button>
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