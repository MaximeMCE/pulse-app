import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Login from './pages/Login.jsx';
import Callback from './Callback.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Explorer from './pages/Explorer.jsx';
import ArtistProfile from './pages/ArtistProfile.jsx';
import Leads from './pages/Leads.jsx';
import Settings from './pages/Settings.jsx';

import Sidebar from './components/Sidebar.jsx';
import ProtectedLayout from './ProtectedLayout.jsx';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/callback" element={<Callback />} />

      {/* Protected area */}
      <Route element={<ProtectedLayout />}>
        <Route
          element={
            <>
              <Sidebar />
              <div className="flex-1 p-4">
                <Outlet />
              </div>
            </>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/explore" element={<Explorer />} />
          <Route path="/artist/:id" element={<ArtistProfile />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
