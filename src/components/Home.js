import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth'; // Import signOut from firebase auth

function Home({ onLogout }) {
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleLogout = async () => {
    try {
      await onLogout(); // Call the logout function passed as a prop
      // Redirect to login page after logout
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div>
      <h1>Home</h1>
      <button onClick={handleLogout}>Logout</button> {/* Logout button */}
    </div>
  );
}

export default Home;