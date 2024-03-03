import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'; // Import signOut
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Login from './components/Login';
import Register from './components/Register';
import TicketList from './components/TicketList';
import TicketForm from './components/TicketForm';
import Home from './components/Home';

function App() {
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleTicketSubmission = async (ticketData) => {
    try {
      const storage = getStorage();
      let fileUrl = null;

      if (ticketData.file) {
        // Upload file to Firebase Storage
        const storageRef = ref(storage, `files/${ticketData.file.name}`);
        await uploadBytes(storageRef, ticketData.file);

        // Get download URL for the uploaded file
        fileUrl = await getDownloadURL(storageRef);
      }

      // Create ticket object without file
      const ticketWithoutFile = { ...ticketData };
      delete ticketWithoutFile.file;

      // Add file URL to ticket data
      const ticketDataWithFileUrl = { ...ticketWithoutFile, fileUrl };

      // Add ticket data to Firestore
      const db = getFirestore();
      const docRef = await addDoc(collection(db, 'tickets'), ticketDataWithFileUrl);
      console.log('Ticket added with ID: ', docRef.id);
      setTickets([...tickets, { ...ticketDataWithFileUrl, id: docRef.id }]);
    } catch (error) {
      console.error('Error adding ticket: ', error);
    }
  };

  const handleLogout = async () => {
    try {
      const auth = getAuth();
      await signOut(auth); // Corrected to use signOut instead of logout
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <BrowserRouter>
      <Routes>
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/ticket-form" element={<TicketForm onSubmit={handleTicketSubmission} />} />
  <Route path="/ticket-list" element={<TicketList tickets={tickets} />} />
  <Route path="/home" element={<Home onLogout={handleLogout} />} />
  <Route path="*" element={<Navigate to="/login" />} /> {/* Redirect to login for unmatched routes */}
</Routes>
    </BrowserRouter>
  );
}

export default App;
