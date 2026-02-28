import React from 'react';
import { Link } from 'react-router-dom'; // Import the Link component

const Navbar = () => {
  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center', // Keeps text and buttons aligned vertically
      padding: '1rem 2rem',
      backgroundColor: '#2c3e50',
      color: 'white',
      marginBottom: '20px'
    }}>
      <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>ProBudget</div>
      
      <div style={{ display: 'flex', gap: '15px' }}>
        {/* Change 1: Use <Link> instead of <button> with location.href */}
        <Link 
          to="/" 
          style={{
            backgroundColor: '#3498db',
            color: 'white',
            textDecoration: 'none', // Removes the blue underline
            padding: '8px 16px',
            borderRadius: '4px',
            fontSize: '0.9rem'
          }}
        >
          Home
        </Link>

        {/* Change 2: Add a link to the Transactions page */}
        <Link 
          to="/transactions" 
          style={{
            backgroundColor: 'transparent',
            color: 'white',
            textDecoration: 'none',
            border: '1px solid white',
            padding: '8px 16px',
            borderRadius: '4px',
            fontSize: '0.9rem'
          }}
        >
          Transactions
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;