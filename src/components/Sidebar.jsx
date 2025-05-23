import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-60 bg-gray-900 text-white min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-8">Pulse</h1>
      <nav className="space-y-4">
        <Link to="/" className="block hover:text-yellow-400">Dashboard</Link>
        <Link to="/explore" className="block hover:text-yellow-400">Explore</Link>
        <Link to="/leads" className="block hover:text-yellow-400">Leads</Link>
        <Link to="/settings" className="block hover:text-yellow-400">Settings</Link>
      </nav>
    </div>
  );
};

export default Sidebar;
