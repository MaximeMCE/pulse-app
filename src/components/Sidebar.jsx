import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleReloadClick = (path) => (e) => {
    e.preventDefault();
    if (location.pathname === path) {
      console.log(`🔁 Reloading ${path}...`);
      window.location.reload();
    } else {
      navigate(path);
    }
  };

  return (
    <nav className="flex flex-col space-y-4 p-4 border-r h-full">
      <NavLink
        to="/dashboard"
        onClick={handleReloadClick('/dashboard')}
        className={({ isActive }) =>
          isActive ? 'font-bold text-black' : 'text-gray-600 hover:text-black'
        }
      >
        Dashboard
      </NavLink>

      <NavLink
        to="/explorer"
        onClick={handleReloadClick('/explorer')}
        className={({ isActive }) =>
          isActive ? 'font-bold text-black' : 'text-gray-600 hover:text-black'
        }
      >
        Explore
      </NavLink>

      <NavLink
        to="/campaigns"
        onClick={handleReloadClick('/campaigns')}
        className={({ isActive }) =>
          isActive ? 'font-bold text-black' : 'text-gray-600 hover:text-black'
        }
      >
        Campaigns
      </NavLink>

      <NavLink
        to="/leads"
        onClick={handleReloadClick('/leads')}
        className={({ isActive }) =>
          isActive ? 'font-bold text-black' : 'text-gray-600 hover:text-black'
        }
      >
        Leads
      </NavLink>

      <NavLink
        to="/settings"
        onClick={handleReloadClick('/settings')}
        className={({ isActive }) =>
          isActive ? 'font-bold text-black' : 'text-gray-600 hover:text-black'
        }
      >
        Settings
      </NavLink>
    </nav>
  );
};

export default Sidebar;
