import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx';

import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Explorer from './pages/Explorer.jsx';
import ArtistProfile from './pages/ArtistProfile.jsx';
import Leads from './pages/Leads.jsx';
import Settings from './pages/Settings.jsx';
import Callback from './Callback.jsx'; // 👈 this is the new piece

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/callback" element={<Callback />} />
      <Route
        path="/*"
        element={
          <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 p-4">
              <Routes>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="explore" element={<Explorer />} />
                <Route path="artist/:id" element={<ArtistProfile />} />
                <Route path="leads" element={<Leads />} />
                <Route path="settings" element={<Settings />} />
              </Routes>
            </div>
          </div>
        }
      />
    </Routes>
  );
};

export default App;
