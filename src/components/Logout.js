import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { getAuth } from 'firebase/auth';
function Logout({ redirectPath = '/' }) { 
  const navigate = useNavigate();
  
  const auth = getAuth();
  const handleLogout = async () => {
    try {
      await signOut(auth); 
      navigate(redirectPath); 
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
  );
}

export default Logout;
