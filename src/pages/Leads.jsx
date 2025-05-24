import React, { useState } from 'react';

const Leads = () => {
  const [leads, setLeads] = useState([
    {
      id: 1,
      name: 'Nova Aura',
      genre: 'electronic / downtempo',
      followers: 4200,
      platform: 'Spotify',
      status: 'New lead',
    },
    {
      id: 2,
      name: 'Rue Echo',
      genre: 'alt-pop',
      followers: 7300,
      platform: 'TikTok',
      status: 'Contacted',
    },
    {
      id: 3,
      name: 'Mati Drip',
      genre: 'trap / experimental',
      followers: 3100,
      platform: 'SoundCloud',
      status: 'To contact',
    },
  ]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">🎯 My Artist Leads</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {leads.map((lead) => (
          <div
            key={lead.id}
            className="bg-white rounded-xl shadow p-4 border border-gray-200"
          >
            <h2 className="text-xl font-semibold mb-1">{lead.name}</h2>
            <p className="text-sm text-gray-600">{lead.genre}</p>
            <p className="text-sm text-gray-700">{lead.followers} followers</p>
            <p className="text-sm text-gray-500 italic">{lead.platform}</p>
            <div className="mt-4">
              <span className="inline-block px-3 py-1 text-sm bg-gray-100 border rounded-full">
                {lead.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leads;
