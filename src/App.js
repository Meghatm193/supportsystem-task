import React from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth'; // Import signOut from firebase auth

function App() {
  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      // Redirect to login page after logout
      window.location.href = '/login'; // You can also use useHistory hook to navigate
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home onLogout={handleLogout} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;