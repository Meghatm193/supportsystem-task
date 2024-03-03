import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext'; // Import your authentication context
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';


function TicketList() {

  const { user } = useAuth();

  const { currentUser } = useAuth(); // Access current user from authentication context
  const [userTickets, setUserTickets] = useState([]);

  useEffect(() => {
    const fetchUserTickets = async () => {
      if (!currentUser) return; // If no user is logged in, return
      const db = getFirestore();
      const q = query(collection(db, 'tickets'), where('userId', '==', currentUser.uid)); // Query tickets based on user ID
      const querySnapshot = await getDocs(q);
      const userTicketsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUserTickets(userTicketsData);
    };

    fetchUserTickets();
  }, [currentUser]);

  return (
    <div>
      <h2>Your Ticket List</h2>
      {userTickets.map((ticket) => (
        <div key={ticket.id}>
          <h3>{ticket.subject}</h3>
          <p>{ticket.description}</p>
          {ticket.file && (
            <p>Attachment: <a href={ticket.fileUrl} target="_blank" rel="noopener noreferrer">Download Attachment</a></p>
          )}
          <p>Status: {ticket.status}</p>
        </div>
      ))}
    </div>
  );
}

export default TicketList;
