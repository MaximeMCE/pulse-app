import React, { useState } from 'react';

const mockSearchResults = [
  { id: 1, name: 'Artist One' },
  { id: 2, name: 'Artist Two' },
  { id: 3, name: 'Artist Three' },
];

const Explorer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    setResults([]); // Clear previous results
    try {
      // Simulate async API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      const filtered = mockSearchResults.filter(artist =>
        artist.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setResults(filtered);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Explore Artists</h1>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search for an artist..."
          className="border p-2 rounded w-full"
        />
        <button
          onClick={handleSearch}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      {loading ? (
        <div className="text-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900 mx-auto" />
          <p className="mt-2 text-sm text-gray-600">Searching...</p>
        </div>
      ) : (
        <div className="space-y-2">
          {results.length === 0 ? (
            <p className="text-gray-500">No results yet. Try searching.</p>
          ) : (
            results.map(artist => (
              <div
                key={artist.id}
                className="border p-4 rounded flex justify-between items-center"
              >
                <span>{artist.name}</span>
                <button className="text-green-600 hover:underline">
                  ✅ Save
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Explorer;
