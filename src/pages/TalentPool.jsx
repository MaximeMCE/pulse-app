import React from 'react';
import useTalentPool from '../hooks/useTalentPool';
import useCampaigns from '../hooks/useCampaigns';
import ArtistCard from '../components/ArtistCard';

const TalentPool = () => {
  const { pool, removeFromPool } = useTalentPool();
  const { campaigns, moveLeadToCampaign } = useCampaigns();

  const handleMove = (artist, campaignId) => {
    moveLeadToCampaign(artist, campaignId);
    removeFromPool(artist.id);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">🎯 Talent Pool</h2>

      {pool.length === 0 ? (
        <p className="text-gray-500">Your pool is empty. Add artists from Explorer.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {pool.map((artist) => (
            <div key={artist.id} className="bg-white rounded-xl shadow p-4">
              <ArtistCard artist={artist} />
              <div className="flex justify-between mt-2">
                <select
                  onChange={(e) => handleMove(artist, e.target.value)}
                  defaultValue=""
                  className="border rounded p-1 text-sm"
                >
                  <option value="" disabled>
                    Move to Campaign
                  </option>
                  {campaigns.map((c) => (
                    <option key={c.id} value={c.title}>
                      {c.title}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => removeFromPool(artist.id)}
                  className="text-red-600 text-sm"
                >
                  ❌ Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TalentPool;
