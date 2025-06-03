export const getSmartRecommendations = ({ campaign, existingLeads = [] }) => {
  const profiles = JSON.parse(localStorage.getItem('artistProfiles') || '{}');
  const existingIds = new Set(existingLeads.map((l) => l.artistId));
  const results = [];

  const campaignGenres = (campaign.goal || '').toLowerCase().split(/\s+/);
  const campaignRegion = (campaign.region || '').toLowerCase();

  for (const profile of Object.values(profiles)) {
    if (existingIds.has(profile.id)) continue;

    const profileGenres = (profile.genres || []).map((g) => g.toLowerCase());
    const genreMatch = campaignGenres.some((g) => profileGenres.includes(g));

    const regionMatch =
      profile.region?.toLowerCase().includes(campaignRegion) || false;

    if (genreMatch || regionMatch) {
      results.push({
        ...profile,
        reason: genreMatch
          ? `Matched genre: ${campaignGenres.find((g) =>
              profileGenres.includes(g)
            )}`
          : `Matched region: ${campaign.region}`,
      });
    }
  }

  return results;
};
