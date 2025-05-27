import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const links = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Explore', path: '/explorer' },
    { label: 'Campaigns', path: '/campaigns' },
    { label: 'Leads', path: '/leads' },
    { label: 'Talent Pool', path: '/pool' }, // ✅ NEW
    { label: 'Settings', path: '/settings' },
  ];

  const handleClick = (path) => {
    const currentPath = location.pathname;
    const isInCampaignDetail = currentPath.startsWith('/campaigns/') && currentPath.split('/').length > 2;

    if (currentPath === path) {
      window.location.reload(); // 🌀 Refresh same route
    } else if (isInCampaignDetail) {
      window.location.href = path; // 🔁 Escape dynamic route
    } else {
      navigate(path); // ⚡ Smooth SPA nav
    }
  };

  return (
    <nav className="flex flex-col space-y-4 p-4 border-r h-full">
      {links.map(({ label, path }) => (
        <button
          key={path}
          onClick={() => handleClick(path)}
          className={`text-left ${
            location.pathname === path
              ? 'font-bold text-black'
              : 'text-gray-600 hover:text-black'
          }`}
        >
          {label}
        </button>
      ))}
    </nav>
  );
};

export default Sidebar;
