import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const mockArtists = [
  { id: 'a1', name: 'DJ Aurora', genre: 'House', region: 'Amsterdam' },
  { id: 'a2', name: 'Bassline Syndicate', genre: 'Techno', region: 'Berlin' },
  { id: 'a3', name: 'Luna Fade', genre: 'Electropop', region: 'Paris' },
  { id: 'a4', name: 'Night Drip', genre: 'Trap', region: 'Rotterdam' },
  { id: 'a5', name: 'Sonic Bloom', genre: 'Ambient', region: 'London' },
];

const MockRecommendations = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [suggested, setSuggested] = useState([]);
  const [assignedIds, setAssignedIds] = useState([]);

  const refreshAssignedLeads = (campaignTitle) => {
    const key = `leads_${campaignTitle.toLowerCase()}`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    setAssignedIds(existing.map((l) => l.id));
  };

  useEffect(() => {
    const storedCampaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');
    const found = storedCampaigns.find((c) => c.id === id);
    if (!found) return;
    setCampaign(found);

    const keywords = (found.goal || '').toLowerCase();
    const region = (found.region || '').toLowerCase();
    const genreWords = keywords.split(/\s+/);

    const matched = mockArtists.filter((artist) => {
      const genreMatch = genreWords.some((word) =>
        artist.genre.toLowerCase().includes(word)
      );
      const regionMatch = region && artist.region.toLowerCase().includes(region);
      return genreMatch || regionMatch;
    });

    setSuggested(matched.slice(0, 3));
    refreshAssignedLeads(found.title);
  }, [id]);

  // 🔁 Listen for deletions
  useEffect(() => {
    if (!campaign) return;

    const handler = () => {
      refreshAssignedLeads(campaign.title);
    };

    window.addEventListener('lead-deleted', handler);
    return () => window.removeEventListener('lead-deleted', handler);
  }, [campaign]);

  const addToCampaign = (artist) => {
    if (!campaign) return;
    const key = `leads_${campaign.title.toLowerCase()}`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');

    if (existing.some((l) => l.id === artist.id)) return;

    const newLead = {
      id: artist.id,
      name: artist.name,
      status: 'New',
      image: '',
      campaign: campaign.title,
    };

    localStorage.setItem(key, JSON.stringify([...existing, newLead]));
    setAssignedIds((prev) => [...prev, artist.id]);
    window.dispatchEvent(new Event('leadsUpdated'));
  };

  if (!campaign) return null;

  return (
    <div>
      {suggested.length > 0 ? (
        <ul className="space-y-2">
          {suggested.map((artist) => (
            <li
              key={artist.id}
              className="border rounded px-3 py-2 bg-gray-50 flex justify-between items-center"
            >
              <span>
                <strong>{artist.name}</strong> — {artist.genre} ({artist.region})
              </span>
              {assignedIds.includes(artist.id) ? (
                <span className="text-xs text-green-600 font-medium">✅ Added</span>
              ) : (
                <button
                  onClick={() => addToCampaign(artist)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  + Add to campaign
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">No relevant suggestions found yet.</p>
      )}
    </div>
  );
};

export default MockRecommendations;
