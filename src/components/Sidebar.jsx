import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleExplorerClick = (e) => {
    e.preventDefault();
    if (location.pathname === '/explorer') {
      console.log('🔁 Reloading Explorer...');
      window.location.reload();
    } else {
      navigate('/explorer');
    }
  };

  return (
    <nav className="flex flex-col space-y-4 p-4 border-r h-full">
      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          isActive ? 'font-bold text-black' : 'text-gray-600 hover:text-black'
        }
      >
        Dashboard
      </NavLink>

      <NavLink
        to="/explorer"
        onClick={handleExplorerClick}
        className={({ isActive }) =>
          isActive ? 'font-bold text-black' : 'text-gray-600 hover:text-black'
        }
      >
        Explore
      </NavLink>

      <NavLink
        to="/campaigns"
        className={({ isActive }) =>
          isActive ? 'font-bold text-black' : 'text-gray-600 hover:text-black'
        }
      >
        Campaigns
      </NavLink>

      <NavLink
        to="/leads"
        className={({ isActive }) =>
          isActive ? 'font-bold text-black' : 'text-gray-600 hover:text-black'
        }
      >
        Leads
      </NavLink>

      <NavLink
        to="/settings"
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
