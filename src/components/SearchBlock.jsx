import React from 'react';

const SearchBlock = ({
  query,
  setQuery,
  onSearch,
  suggestions = [],
}) => {
  return (
    <div className="mt-8">
      <h3 className="text-sm font-semibold text-gray-600 mb-2">Suggestions</h3>
      <div className="flex flex-wrap gap-2 mb-6">
        {suggestions.map((s, i) => (
          <button
            key={i}
            onClick={() => onSearch(s)}
            className="text-sm bg-white border border-gray-300 hover:bg-blue-50 px-3 py-1 rounded-full shadow-sm transition"
          >
            🔍 {s}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSearch(query);
        }}
        className="flex gap-2 mb-6"
      >
        <input
          type="text"
          placeholder="Search for an artist"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchBlock;
