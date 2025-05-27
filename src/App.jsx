import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import ProtectedLayout from './ProtectedLayout';

import Dashboard from './pages/Dashboard';
import Explorer from './pages/Explorer';
import CampaignsDebug from './pages/CampaignsDebug';
import CampaignDetails from './pages/CampaignDetails';
import LeadsLegacy from './pages/LeadsLegacy';
import ArtistProfile from './pages/ArtistProfile';
import ArtistSearch from './pages/ArtistSearch';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Callback from './Callback';
import Leads from './pages/Leads';

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/callback" element={<Callback />} />

      {/* Protected routes */}
      <Route element={<ProtectedLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/explorer" element={<Explorer />} />
        <Route path="/campaigns" element={<CampaignsDebug />} />
        <Route path="/campaigns/:id" element={<CampaignDetails />} />
        <Route path="/leads" element={<Leads />} />
        <Route path="/artist/:id" element={<ArtistProfile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/search" element={<ArtistSearch />} />
        <Route path="/leads-legacy" element={<LeadsLegacy />} />
      </Route>
    </Routes>
  );
}

export default App;
