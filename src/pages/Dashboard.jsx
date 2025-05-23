import React, { useEffect } from 'react';

const Dashboard = () => {
  useEffect(() => {
    console.log("✅ Dashboard component mounted");
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-4">Dashboard</h2>
      <p className="text-lg text-gray-700">Welcome to your Pulse dashboard.</p>
    </div>
  );
};

export default Dashboard;
