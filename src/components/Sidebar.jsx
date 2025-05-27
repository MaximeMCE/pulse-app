import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const links = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Explore', path: '/explorer' },
    { label: 'Campaigns', path: '/campaigns' },
    { label: 'Leads', path: '/leads' },
    { label: 'Settings', path: '/settings' },
  ];

  const handleClick = (path) => {
    if (location.pathname === path) {
      // Only reload if already on the same page
      window.location.reload();
    } else {
      navigate(path); // Smooth single-page navigation
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
