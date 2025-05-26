import { useState } from 'react';

export default function useLeads() {
  const [unassigned, setUnassigned] = useState([]);
  const [campaigns, setCampaigns] = useState({});

  const loadLeads = () => {
    const storage = { ...localStorage };
    const foundCampaigns = {};
    const unassignedRaw = localStorage.getItem('leads_unassigned');
    if (unassignedRaw) setUnassigned(JSON.parse(unassignedRaw));
    else setUnassigned([]);

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

  return {
    unassigned,
    setUnassigned,
    campaigns,
    setCampaigns,
    loadLeads
  };
}
