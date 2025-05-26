import { useState } from 'react';

const useLeads = () => {
  const [unassigned, setUnassigned] = useState([]);
  const [campaigns, setCampaigns] = useState({});

  const loadLeads = () => {
    const storedUnassigned = localStorage.getItem('leads_unassigned');
    const parsedUnassigned = storedUnassigned ? JSON.parse(storedUnassigned) : [];
    setUnassigned(parsedUnassigned);

    const campaignMap = {};

    for (const key in localStorage) {
      if (key.startsWith('leads_') && key !== 'leads_unassigned') {
        const id = key.replace('leads_', '');
        try {
          const leads = JSON.parse(localStorage.getItem(key));
          if (Array.isArray(leads) && leads.length > 0) {
            campaignMap[id] = leads;
          }
        } catch (e) {
          console.error(`Failed to parse leads for ${id}`);
        }
      }
    }

    setCampaigns(campaignMap);
  };

  return {
    unassigned,
    setUnassigned,
    campaigns,
    setCampaigns,
    loadLeads,
  };
};

export default useLeads;
