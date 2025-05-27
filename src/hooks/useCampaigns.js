import { useState, useEffect } from 'react';

export default function useCampaigns() {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('campaigns') || '[]');
    setCampaigns(stored);

    const refresh = () => {
      const updated = JSON.parse(localStorage.getItem('campaigns') || '[]');
      setCampaigns(updated);
    };

    window.addEventListener('campaignsUpdated', refresh);
    return () => window.removeEventListener('campaignsUpdated', refresh);
  }, []);

  const moveLeadToCampaign = (artist, campaignId) => {
    const key = `leads_${campaignId.toLowerCase()}`;
    const existing = JSON.parse(localStorage.getItem(key)) || [];

    if (!existing.find((l) => l.id === artist.id)) {
      const newLead = {
        id: artist.id,
        name: artist.name,
        image: artist.image,
        status: 'New',
        campaign: campaignId,
      };
      localStorage.setItem(key, JSON.stringify([...existing, newLead]));
      window.dispatchEvent(new Event('leadsUpdated'));
    }
  };

  return { campaigns, moveLeadToCampaign };
}
