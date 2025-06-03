import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getRecommendedArtists } from '../utils/getRecommendedArtists';
import { saveArtistProfile } from '../utils/artistUtils';

function getMatchReason(artist, campaign) {
  const campaignGenres = (campaign.goal || '').toLowerCase().split(/\s+/);
  const region = (campaign.region || '').toLowerCase();
  const artistGenres = (artist.genres || []).map((g) => g.toLowerCase());

  const genreMatch = campaignGenres.find((g) => artistGenres.includes(g));
  const regionMatch = (artist.region || '').toLowerCase().includes(region);

  if (genreMatch) return `Matched genre: ${genreMatch}`;
  if (regionMatch) return `Matched region: ${artist.region}`;
  return null;
}

const SmartRecommendations = () => {
  const { id: campaignId } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [suggested, setSuggested] = useState([]);
  const [assignedIds, setAssignedIds] = useState([]);

  const refreshAssignedLeads = (id) => {
    const key = `leads_${id}`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    setAssignedIds(existing.map((l) => l.artistId || l.id));
  };

  useEffect(() => {
    const storedCampaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');
    const found = storedCampaigns.find((c) => c.id === campaignId);
    if (!found) return;
    setCampaign(found);

    const key = `leads_${found.id}`;
    const leadsInCampaign = JSON.parse(localStorage.getItem(key) || '[]');

    const recs = getRecommendedArtists({
      campaign: found,
      existingLeads: leadsInCampaign,
    });

    setSuggested(recs);
    refreshAssignedLeads(found.id);
  }, [campaignId]);

  useEffect(() => {
    if (!campaign) return;

    const sync = () => refreshAssignedLeads(campaign.id);
    window.addEventListener('leadsUpdated', sync);
    window.addEventListener('lead-deleted', sync);

    return () => {
      window.removeEventListener('leadsUpdated', sync);
      window.removeEventListener('lead-deleted', sync);
    };
  }, [campaign?.id]);

  const addToCampaign = (artist) => {
    if (!campaign) return;

    const key = `leads_${campaign.id}`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');

    if (existing.some((l) => l.artistId === artist.id || l.id === artist.id)) return;

    saveArtistProfile({
      id: artist.id,
      name: artist.name,
      image: artist.image || '',
      genre: artist.genres?.[0] || 'unknown',
      preview_url: artist.preview_url || null,
      followers: artist.followers || 0,
      source: 'recommendation',
    });

    const newLead = {
      id: crypto.randomUUID(),
      artistId: artist.id,
      status: 'New',
      campaignId: campaign.id,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(key, JSON.stringify([...existing, newLead]));
    window.dispatchEvent(new Event('leadsUpdated'));
    refreshAssignedLeads(campaign.id); // ✅ Update status live
  };

  if (!campaign) return null;

  return (
    <div className="mt-4">
      <h2 className="text-lg font-semibold mb-2">🎯 Smart Recommendations</h2>
      {suggested.length > 0 ? (
        <ul className="space-y-2">
          {suggested.map((artist) => (
            <li
              key={artist.id}
              className="border rounded px-3 py-2 bg-gray-50 flex justify-between items-center"
            >
              <div>
                <div>
                  <strong>{artist.name}</strong>{' '}
                  <span className="text-gray-600 text-sm">
                    — {artist.genres.join(', ') || 'No genres'} ({artist.region || 'Unknown region'})
                  </span>
                </div>
                <div className="text-xs text-gray-500 italic">
                  🧠 {getMatchReason(artist, campaign) || 'No match reason'}
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
