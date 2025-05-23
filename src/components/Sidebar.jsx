import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => (
  <div className="w-60 bg-gray-900 text-white min-h-screen p-6 space-y-4">
    <h1 className="text-2xl font-bold mb-8">Pulse</h1>
    <nav className="flex flex-col space-y-2">
      <Link to="/dashboard" className="hover:text-green-400">Dashboard</Link>
      <Link to="/explore" className="hover:text-green-400">Explore</Link>
      <Link to="/leads" className="hover:text-green-400">Leads</Link>
      <Link to="/settings" className="hover:text-green-400">Settings</Link>
    </nav>
  </div>
);

export default Sidebar;
