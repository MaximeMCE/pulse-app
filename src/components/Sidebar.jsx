import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (path) => {
    if (location.pathname === path) {
      // ⚠️ Only reload if user is already on the same route
      window.location.reload();
    } else {
      setTimeout(() => {
        // If navigate fails silently (React Router quirk), fallback:
        const watchdog = setTimeout(() => {
          window.location.href = path; // 🔁 Last resort
        }, 300);

        navigate(path);
        clearTimeout(watchdog); // cancel fallback if it worked
      }, 0);
    }
  };

  const links = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Explore', path: '/explorer' },
    { label: 'Campaigns', path: '/campaigns' },
    { label: 'Leads', path: '/leads' },
    { label: 'Settings', path: '/settings' },
  ];

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
