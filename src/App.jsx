import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import ProtectedLayout from './ProtectedLayout';

import Dashboard from './pages/Dashboard';
import Explorer from './pages/Explorer';
import Campaigns from './pages/Campaigns';
import CampaignDetails from './pages/CampaignDetails';
import LeadsLegacy from './pages/LeadsLegacy';
import ArtistProfile from './pages/ArtistProfile';
import ArtistSearch from './pages/ArtistSearch';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Callback from './Callback';
import Leads from './pages/Leads'; // ✅ new import

function App() {
  const accessToken = localStorage.getItem('spotify_access_token');

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/callback" element={<Callback />} />

      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/explorer" element={<Explorer />} />
        <Route path="/campaigns" element={<Campaigns />} />
        <Route path="/campaigns/:id" element={<CampaignDetails />} />
        <Route path="/leads" element={<Leads />} /> {/* ✅ new route */}
        <Route path="/artist/:id" element={<ArtistProfile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/search" element={<ArtistSearch token={accessToken} />} />
        <Route path="/leads-legacy" element={<LeadsLegacy />} />
      </Route>
    </Routes>
  );
}

export default App;
