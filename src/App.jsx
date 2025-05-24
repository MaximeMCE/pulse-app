import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedLayout from './ProtectedLayout';

import Dashboard from './pages/Dashboard';
import Explorer from './pages/Explorer';
import Login from './pages/Login';
import Settings from './pages/Settings';
import ArtistProfile from './pages/ArtistProfile';

import Campaigns from './pages/Campaigns'; // ✅ NEW
import CampaignDetails from './pages/CampaignDetails'; // ✅ NEW

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />
        <Route path="/callback" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedLayout>
              <Dashboard />
            </ProtectedLayout>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedLayout>
              <Dashboard />
            </ProtectedLayout>
          }
        />
        <Route
          path="/explorer"
          element={
            <ProtectedLayout>
              <Explorer />
            </ProtectedLayout>
          }
        />
        {/* Removed Leads route */}
        {/* <Route
          path="/leads"
          element={
            <ProtectedLayout>
              <Leads />
            </ProtectedLayout>
          }
        /> */}
        <Route
          path="/settings"
          element={
            <ProtectedLayout>
              <Settings />
            </ProtectedLayout>
          }
        />
        <Route
          path="/artist/:id"
          element={
            <ProtectedLayout>
              <ArtistProfile />
            </ProtectedLayout>
          }
        />

        {/* ✅ Campaign Routes */}
        <Route
          path="/campaigns"
          element={
            <ProtectedLayout>
              <Campaigns />
            </ProtectedLayout>
          }
        />
        <Route
          path="/campaigns/:id"
          element={
            <ProtectedLayout>
              <CampaignDetails />
            </ProtectedLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

