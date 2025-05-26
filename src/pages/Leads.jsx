import React, { useEffect, useState } from 'react';

const Leads = () => {
  const [leadsData, setLeadsData] = useState({});
  const [campaigns, setCampaigns] = useState([]);
  const [selectedLeads, setSelectedLeads] = useState({});
  const [searchTerms, setSearchTerms] = useState({});
  const [statusFilters, setStatusFilters] = useState({});

  useEffect(() => {
    const storedCampaigns = JSON.parse(localStorage.getItem('campaigns')) || [];
    const campaignTitles = storedCampaigns.map((c) => c.title);
    setCampaigns(['Unassigned', ...campaignTitles]);

    const allLeads = {};
    const selected = {};
    const terms = {};
    const filters = {};

    const keys = Object.keys(localStorage).filter((k) => k.startsWith('leads_'));
    keys.forEach((key) => {
      const leads = JSON.parse(localStorage.getItem(key)) || [];
      const campaignName = key.replace('leads_', '');
      allLeads[campaignName] = leads;
      selected[campaignName] = [];
      terms[campaignName] = '';
      filters[campaignName] = 'All';
    });

    setLeadsData(allLeads);
    setSelectedLeads(selected);
    setSearchTerms(terms);
    setStatusFilters(filters);
  }, []);

  const updateLocalStorage = (updated) => {
    Object.entries(updated).forEach(([campaign, leads]) => {
      localStorage.setItem(`leads_${campaign}`, JSON.stringify(leads));
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'New': return 'bg-blue-200 text-blue-800';
      case 'Contacted': return 'bg-yellow-200 text-yellow-800';
      case 'Qualified': return 'bg-green-200 text-green-800';
      case 'Rejected': return 'bg-red-200 text-red-800';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  const handleStatusChange = (campaign, index, newStatus) => {
    const updated = { ...leadsData };
    updated[campaign][index].status = newStatus;
    setLeadsData(updated);
    updateLocalStorage(updated);
  };

  const handleCampaignChange = (currentCampaign, index, newCampaign) => {
    const lead = leadsData[currentCampaign][index];
    const updated = { ...leadsData };
    updated[currentCampaign].splice(index, 1);
    if (!updated[newCampaign]) updated[newCampaign] = [];
    updated[newCampaign].push(lead);
    setLeadsData(updated);
    updateLocalStorage(updated);
  };

  const handleDelete = (campaign, index) => {
    const updated = { ...leadsData };
    updated[campaign].splice(index, 1);
    setLeadsData(updated);
    updateLocalStorage(updated);
  };

  const toggleSelect = (campaign, index) => {
    const selected = [...(selectedLeads[campaign] || [])];
    const i = selected.indexOf(index);
    if (i > -1) {
      selected.splice(i, 1);
    } else {
      selected.push(index);
    }
    setSelectedLeads({ ...selectedLeads, [campaign]: selected });
  };

  const selectAll = (campaign) => {
    const allIndexes = leadsData[campaign].map((_, i) => i);
    setSelectedLeads({ ...selectedLeads, [campaign]: allIndexes });
  };

  const clearSelection = (campaign) => {
    setSelectedLeads({ ...selectedLeads, [campaign]: [] });
  };

  const filteredLeads = (leads, search, status) => {
    return leads.filter(lead => {
      const matchName = lead.name.toLowerCase().includes(search.toLowerCase());
      const matchStatus = status === 'All' || lead.status === status;
      return matchName && matchStatus;
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">All Saved Leads</h1>

      {Object.entries(leadsData).map(([campaign, leads]) => {
        const search = searchTerms[campaign] || '';
        const statusFilter = statusFilters[campaign] || 'All';
        const visibleLeads = filteredLeads(leads, search, statusFilter);

        return (
          <div key={campaign} className="mb-10">
            <h2 className="text-xl font-semibold mb-2">Campaign: {campaign}</h2>

            <div className="flex gap-2 mb-2 flex-wrap">
              {['All', 'New', 'Contacted', 'Qualified', 'Rejected'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilters({ ...statusFilters, [campaign]: status })}
                  className={`px-2 py-1 text-sm border rounded ${statusFilter === status ? 'bg-black text-white' : 'text-black'}`}
                >
                  {status}
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder="Search artist..."
              value={search}
              onChange={(e) => setSearchTerms({ ...searchTerms, [campaign]: e.target.value })}
              className="border px-2 py-1 mb-2 w-full md:w-1/3"
            />

            <div className="text-sm mb-2">
              {visibleLeads.length} total
              <button onClick={() => selectAll(campaign)} className="ml-4 text-blue-600">Select All</button>
              <button onClick={() => clearSelection(campaign)} className="ml-2 text-gray-600">Clear</button>
            </div>

            {visibleLeads.length === 0 ? (
              <p className="text-gray-500">No leads matching this filter.</p>
            ) : (
              <div className="space-y-4">
                {visibleLeads.map((lead, index) => (
                  <div key={lead.id} className="border p-4 rounded-lg shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={(selectedLeads[campaign] || []).includes(index)}
                        onChange={() => toggleSelect(campaign, index)}
                      />
                      <img
                        src={lead.image || 'https://via.placeholder.com/48?text=🎵'}
                        alt={lead.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="text-lg font-medium">{lead.name}</h3>
                        <p className={`inline-block px-2 py-1 mt-1 rounded text-sm ${getStatusColor(lead.status)}`}>
                          {lead.status}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      <select
                        className="border rounded px-2 py-1 text-sm"
                        value={lead.status}
                        onChange={(e) => handleStatusChange(campaign, index, e.target.value)}
                      >
                        <option>New</option>
                        <option>Contacted</option>
                        <option>Qualified</option>
                        <option>Rejected</option>
                      </select>

                      <select
                        className="border rounded px-2 py-1 text-sm"
                        value={campaign}
                        onChange={(e) => handleCampaignChange(campaign, index, e.target.value)}
                      >
                        {campaigns.map((title) => (
                          <option key={title} value={title}>{title}</option>
                        ))}
                      </select>

                      <button
                        onClick={() => handleDelete(campaign, index)}
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
