import React, { useState } from 'react';

const Leads = () => {
  const [leads, setLeads] = useState([
    {
      id: 1,
      name: 'Nova Aura',
      monthlyListeners: 4200,
      genres: ['electronic', 'downtempo'],
      status: 'new',
      image: 'https://placehold.co/80x80?text=IMG',
    },
    {
      id: 2,
      name: 'Rue Echo',
      monthlyListeners: 7300,
      genres: ['alt-pop'],
      status: 'contacted',
      image: 'https://placehold.co/80x80?text=IMG',
    },
    {
      id: 3,
      name: 'Mati Drip',
      monthlyListeners: 3100,
      genres: ['trap', 'experimental'],
      status: 'qualified',
      image: 'https://placehold.co/80x80?text=IMG',
    },
  ]);

  const handleDelete = (id) => {
    const updatedLeads = leads.filter((lead) => lead.id !== id);
    setLeads(updatedLeads);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">🎯 My Artist Leads</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['new', 'contacted', 'qualified'].map((status) => (
          <div key={status}>
            <h2 className="text-xl font-semibold mb-4 capitalize">{status}</h2>
            {leads
              .filter((lead) => lead.status === status)
              .map((lead) => (
                <div
                  key={lead.id}
                  className="bg-white rounded-xl shadow p-4 mb-4 border border-gray-200"
                >
                  <div className="flex items-center space-x-4 mb-4">
                    <img
                      src={lead.image}
                      alt={lead.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-lg font-semibold">{lead.name}</h3>
                      <p className="text-sm text-gray-600">
                        {lead.genres.join(', ')}
                      </p>
                      <p className="text-sm text-gray-700">
                        {lead.monthlyListeners.toLocaleString()} listeners
                      </p>
                    </div>
                  </div>

                  {/* Status Dropdown */}
                  <select
                    value={lead.status}
                    onChange={(e) => {
                      const updatedLeads = leads.map((l) =>
                        l.id === lead.id ? { ...l, status: e.target.value } : l
                      );
                      setLeads(updatedLeads);
                    }}
                    className="block w-full px-3 py-1 mb-2 border border-gray-300 rounded-md text-sm capitalize"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                  </select>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(lead.id)}
                    className="w-full bg-red-100 text-red-700 hover:bg-red-200 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leads;
