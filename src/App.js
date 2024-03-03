import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'; 
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Login from './components/Login';
import Register from './components/Register';
import TicketList from './components/TicketList';
import TicketForm from './components/TicketForm';
import { AuthProvider } from './contexts/AuthContext';
import Logout from './components/Logout';
import TechSupport from './components/TechSupport';

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
        const storageRef = ref(storage, `files/${ticketData.file.name}`);
        await uploadBytes(storageRef, ticketData.file);
        fileUrl = await getDownloadURL(storageRef);
      }

      const ticketWithoutFile = { ...ticketData };
      delete ticketWithoutFile.file;

      const ticketDataWithFileUrl = { ...ticketWithoutFile, fileUrl };

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
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/register" element={<Register />} />
          <Route path="/ticket-form" element={<TicketForm onSubmit={handleTicketSubmission} />} />
          <Route path="/ticket-list" element={<TicketList tickets={tickets} />} />
          <Route path='/tech-support' element={<TechSupport/>} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
