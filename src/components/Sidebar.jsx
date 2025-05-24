import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
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
        className={({ isActive }) =>
          isActive ? 'font-bold text-black' : 'text-gray-600 hover:text-black'
        }
      >
        Explore
      </NavLink>

      {/* Replaced Leads with Campaigns */}
      <NavLink
        to="/campaigns"
        className={({ isActive }) =>
          isActive ? 'font-bold text-black' : 'text-gray-600 hover:text-black'
        }
      >
        Campaigns
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
