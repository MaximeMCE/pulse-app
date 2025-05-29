import React from 'react';
import useTalentPool from '../hooks/useTalentPool';

const fallbackImage = 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg';

const ArtistCard = ({
  artist,
  isOpen,
  onToggleDropdown,
  onSaveLead,
  campaignList,
  isSavedTo,
  assignedCampaigns = [],
  onRemoveFromCampaign
}) => {
  if (!artist || typeof artist !== 'object' || !artist.id || !artist.name) return null;

  const {
    addToPool,
    removeFromPool,
    isInPool
  } = useTalentPool();

  const id = artist.id;
  const name = artist.name || 'Unknown Artist';
  const image = artist.image || fallbackImage;
  const genres = Array.isArray(artist.genres) ? artist.genres : [];
  const listeners = typeof artist.followers === 'number'
    ? artist.followers
    : (typeof artist.monthlyListeners === 'number' ? artist.monthlyListeners : 0);
  const previewUrl = artist.preview_url || '';

  const handlePoolToggle = () => {
    const baseArtist = {
      id,
      name,
      image,
      genres,
      monthlyListeners: listeners,
      preview_url: previewUrl,
      platforms: ['spotify']
    };
    isInPool(id) ? removeFromPool(id) : addToPool(baseArtist);
  };

  return (
    <div className="border rounded p-4 mb-4 bg-white shadow">
      <div className="mb-4">
        <div className="flex items-center">
          <img
            src={image}
            alt={name}
            className="rounded-full mr-4 object-cover"
            style={{ width: 80, height: 80 }}
          />
          <div className="flex-1">
            <div className="font-semibold">{name}</div>
            <div className="text-sm text-gray-500">
              Monthly Listeners: {listeners.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">
              Genres: {genres.length > 0 ? genres.slice(0, 2).join(', ') : 'N/A'}
            </div>
          </div>
        </div>

        {previewUrl && (
          <div className="mt-2">
            <audio controls src={previewUrl} className="w-full" />
          </div>
        )}

        {assignedCampaigns.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {assignedCampaigns.map((camp) => (
              <div
                key={camp}
                className="flex items-center bg-gray-100 text-xs text-gray-700 border border-gray-300 px-2 py-1 rounded"
              >
                {camp}
                <button
                  onClick={() => onRemoveFromCampaign(id, camp)}
                  className="ml-2 text-red-500 hover:text-red-700"
                  title={`Remove from ${camp}`}
                >
                  ❌
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="pt-4 border-t mt-4 flex gap-3 flex-wrap">
        <button
          onClick={handlePoolToggle}
          className={`text-xs px-3 py-1 rounded border ${
            isInPool(id)
              ? 'border-red-400 text-red-600 hover:bg-red-50'
              : 'border-blue-600 text-blue-600 hover:bg-blue-50'
          }`}
        >
          {isInPool(id) ? '❌ Pool' : '+ Pool'}
        </button>

        <button
          onClick={() => onToggleDropdown(id)}
          className="text-xs px-3 py-1 rounded border border-green-600 text-green-600 hover:bg-green-50"
        >
          + Campaign
        </button>
      </div>

      {isOpen && (
        <div className="mt-2">
          <div className="bg-white border p-3 rounded shadow max-w-xs">
            <div className="text-xs font-semibold text-gray-600 mb-2">Choose campaign:</div>
            <div className="flex flex-wrap gap-2">
              {campaignList
                .filter((c) => c !== 'Talent Pool')
                .map((c) => (
                  <button
                    key={c}
                    onClick={() => onSaveLead(artist, c)}
                    disabled={isSavedTo(id, c)}
                    className={`px-3 py-1 rounded text-sm border ${
                      isSavedTo(id, c)
                        ? 'text-gray-400 border-gray-300 cursor-not-allowed'
                        : 'hover:bg-blue-50 border-gray-400 text-black'
                    }`}
                  >
                    {isSavedTo(id, c) ? `✅ ${c}` : c}
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtistCard;
