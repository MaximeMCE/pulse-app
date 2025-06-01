// src/utils/getRecommendedArtists.js

import sampleArtists from '../data/sampleArtists.json';

export function getRecommendedArtists({ campaign, existingLeads }) {
  if (!campaign) return [];

  const campaignGenres = (campaign.goal || '').toLowerCase().split(/\s+/);
  const campaignRegion = (campaign.region || '').toLowerCase();

  const existingIds = new Set(existingLeads.map((lead) => lead.id));

  const recommendations = sampleArtists.filter((artist) => {
    const artistGenres = artist.genres.map((g) => g.toLowerCase());
    const genreMatch = campaignGenres.some((g) => artistGenres.includes(g));
    const regionMatch = campaignRegion && artist.region.toLowerCase().includes(campaignRegion);
    const notAlreadyAdded = !existingIds.has(artist.id);

    return (genreMatch || regionMatch) && notAlreadyAdded;
  });

  return recommendations.slice(0, 5); // limit to 5 for now
}
