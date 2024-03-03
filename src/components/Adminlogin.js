import React, { useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import { getAuth } from 'firebase/auth';


function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const adminEmail = 'admin@gmail.com'; // Predefined admin email
  const adminPassword = 'Admin123'; // Predefined admin password

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Check if provided credentials match the predefined admin credentials
      if (email === adminEmail && password === adminPassword) {
        // Log in the admin user using Firebase Authentication
        await firebase.auth().signInWithEmailAndPassword(email, password);
        // Admin logged in successfully
      } else {
        throw new Error('Invalid admin credentials');
      }
    } catch (error) {
      console.error("Error logging in:", error.message);
    }
  };

  return (
    <div>
      <h2>Admin Login</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default AdminLogin;
