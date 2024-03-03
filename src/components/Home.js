import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signOut } from 'firebase/auth'; // Import signOut from firebase auth

function Home({ user, onLogout }) {
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
      {user ? ( // If user is logged in
        <>
          <button onClick={handleLogout}>Logout</button> {/* Logout button */}
          <Link to='/ticket-list'>View Tickets</Link>
        </>
      ) : ( // If user is not logged in
        <Link to='/login'>Login</Link>
      )}
    </div>
  );
}

export default Home;
