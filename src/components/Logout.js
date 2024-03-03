import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';

function Logout({ onLogout, redirectPath = '/' }) { // Accept redirectPath prop
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await onLogout();
      navigate(redirectPath); // Redirect to the specified path after logout
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
}

export default Logout;
