import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Transactions from './features/transactions';

// A placeholder for your upcoming Dashboard
const Dashboard = () => (
  <div style={{ textAlign: 'center', padding: '50px' }}>
    <h2>Welcome to your Dashboard</h2>
    <p>Financial summaries and charts will appear here.</p>
  </div>
);

function App() {
  return (
    <div className="app-wrapper" style={{ minHeight: '100vh', backgroundColor: '#fdfdfd' }}>
      {/* 1. Global Navigation Bar - Stays at the top on all pages */}
      <Navbar /> 

      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        <header style={{ marginBottom: '30px' }}>
          <h1 style={{ color: '#2c3e50', fontSize: '2.5rem' }}>Monthly Budget App</h1>
          <p style={{ color: '#7f8c8d' }}>Manage your finances with precision.</p>
        </header>

        <main>
          {/* 2. Routes - This decides which "page" to show based on the URL */}
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;