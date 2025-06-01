import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getRecommendedArtists } from '../utils/getRecommendedArtists';

function getMatchReason(artist, campaign) {
  const genres = (campaign.goal || '').toLowerCase().split(/\s+/);
  const region = (campaign.region || '').toLowerCase();
  const artistGenres = (artist.genres || []).map(g => g.toLowerCase());

  const genreMatch = genres.find(g => artistGenres.includes(g));
  const regionMatch = (artist.region || '').toLowerCase().includes(region);

  if (genreMatch) return `Matched genre: ${genreMatch}`;
  if (regionMatch) return `Matched region: ${artist.region}`;
  return null;
}

const SmartRecommendations = () => {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [suggested, setSuggested] = useState([]);
  const [assignedIds, setAssignedIds] = useState([]);

  const refreshAssignedLeads = (campaignTitle) => {
    const key = `leads_${campaignTitle.toLowerCase()}`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    setAssignedIds(existing.map((l) => l.artistId || l.id));
  };

  useEffect(() => {
    const storedCampaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');
    const found = storedCampaigns.find((c) => c.id === id);
    if (!found) return;
    setCampaign(found);

    const key = `leads_${found.title.toLowerCase()}`;
    const leadsInCampaign = JSON.parse(localStorage.getItem(key) || '[]');

    const recs = getRecommendedArtists({
      campaign: found,
      existingLeads: leadsInCampaign,
    });

    setSuggested(recs);
    refreshAssignedLeads(found.title);
  }, [id]);

  useEffect(() => {
    if (!campaign) return;

    const sync = () => refreshAssignedLeads(campaign.title);
    window.addEventListener('leadsUpdated', sync);
    window.addEventListener('lead-deleted', sync);

    return () => {
      window.removeEventListener('leadsUpdated', sync);
      window.removeEventListener('lead-deleted', sync);
    };
  }, [campaign]);

  const addToCampaign = (artist) => {
    if (!campaign) return;

    const key = `leads_${campaign.title.toLowerCase()}`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    const artistProfiles = JSON.parse(localStorage.getItem('artistProfiles') || '{}');

    if (existing.some((l) => l.artistId === artist.id || l.id === artist.id)) return;

    // Save artist profile
    artistProfiles[artist.id] = artist;
    localStorage.setItem('artistProfiles', JSON.stringify(artistProfiles));

    const newLead = {
      id: crypto.randomUUID(),
      artistId: artist.id,
      status: 'New',
      campaignId: campaign.id,
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
              <div>
                <div>
                  <strong>{artist.name}</strong> — {artist.genres.join(', ')} ({artist.region})
                </div>
                <div className="text-xs text-gray-500 italic">
                  🧠 {getMatchReason(artist, campaign)}
                </div>
              </div>
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

export default SmartRecommendations;
