import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Leads = () => {
  const navigate = useNavigate();
  const [leadsData, setLeadsData] = useState({});
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const storedCampaigns = JSON.parse(localStorage.getItem('campaigns')) || [];
    const campaignTitles = storedCampaigns.map((c) => c.title);
    setCampaigns(['Unassigned', ...campaignTitles]);

    const allLeads = {};
    const keys = Object.keys(localStorage).filter((k) => k.startsWith('leads_'));
    keys.forEach((key) => {
      const leads = JSON.parse(localStorage.getItem(key)) || [];
      const campaignName = key.replace('leads_', '');
      allLeads[campaignName] = leads;
    });

    setLeadsData(allLeads);
  }, []);

  const updateLocalStorage = (updatedData) => {
    Object.entries(updatedData).forEach(([campaign, leads]) => {
      localStorage.setItem(`leads_${campaign}`, JSON.stringify(leads));
    });
  };

  const handleStatusChange = (campaign, index, newStatus) => {
    const updated = { ...leadsData };
    updated[campaign][index].status = newStatus;
    setLeadsData(updated);
    updateLocalStorage(updated);
  };

  const handleCampaignChange = (currentCampaign, index, newCampaign) => {
    const leadToMove = leadsData[currentCampaign][index];
    const updated = { ...leadsData };

    // Remove from old
    updated[currentCampaign].splice(index, 1);

    // If empty after removal, delete key
    if (updated[currentCampaign].length === 0) {
      delete updated[currentCampaign];
      localStorage.removeItem(`leads_${currentCampaign}`);
    }

    // Add to new
    if (!updated[newCampaign]) updated[newCampaign] = [];
    updated[newCampaign].push(leadToMove);

    setLeadsData(updated);
    updateLocalStorage(updated);
  };

  const handleDelete = (campaign, index) => {
    const updated = { ...leadsData };
    updated[campaign].splice(index, 1);
    if (updated[campaign].length === 0) {
      delete updated[campaign];
      localStorage.removeItem(`leads_${campaign}`);
    }
    setLeadsData(updated);
    updateLocalStorage(updated);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'New':
        return 'bg-blue-200 text-blue-800';
      case 'Contacted':
        return 'bg-yellow-200 text-yellow-800';
      case 'Qualified':
        return 'bg-green-200 text-green-800';
      case 'Rejected':
        return 'bg-red-200 text-red-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Leads</h1>

      {Object.entries(leadsData).map(([campaign, leads]) => (
        <div key={campaign} className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {campaign === 'inbox' ? 'Inbox' : campaign}
          </h2>
          {leads.length === 0 ? (
            <p className="text-gray-500">No leads.</p>
          ) : (
            <div className="space-y-4">
              {leads.map((lead, index) => (
                <div
                  key={lead.id}
                  className="border p-4 rounded-lg shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                >
                  <div>
                    <h3 className="text-lg font-medium">{lead.name}</h3>
                    <p className={`inline-block px-2 py-1 mt-1 rounded text-sm ${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </p>
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
                        <option key={title} value={title}>
                          {title}
                        </option>
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
      ))}
    </div>
  );
};

export default Leads;
