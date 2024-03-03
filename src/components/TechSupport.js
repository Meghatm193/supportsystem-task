import React, { useState, useEffect } from 'react';
import './style.css';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import Logout from './Logout';

function TechSupport() {
  const { currentUser } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const db = getFirestore();
        const ticketsRef = collection(db, 'tickets');
        const querySnapshot = await getDocs(ticketsRef);
        const ticketList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTickets(ticketList);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      }
    };

    if (currentUser) {
      fetchTickets();
    }
  }, [currentUser]);

  const handleTicketClick = (ticket) => {
    setSelectedTicket(ticket.id === selectedTicket?.id ? null : ticket);
    setAnswer('');
    setError('');
  };

  const handleAnswerChange = (e) => {
    setAnswer(e.target.value);
  };

  const handleAnswerSubmit = async () => {
    try {
      const db = getFirestore();
      const ticketRef = doc(db, 'tickets', selectedTicket.id);
      await updateDoc(ticketRef, {
        answer: answer,
        answeredBy: currentUser.email,
      });
    } catch (error) {
      setError('Error submitting answer: ' + error.message);
    }
  };

  const handleTextareaClick = (e) => {
    e.stopPropagation(); // Prevent the click event from reaching the parent div
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-end mb-3">
        <div className="col-auto">
          <Logout />
        </div>
      </div>
      <h2 className="text-center mb-3">All Tickets</h2>
      <div className="row justify-content-center">
        <div className="col-md-8">
          {tickets.map((ticket) => (
            <div className="card mb-3" key={ticket.id}>
              <div className="card-body" onClick={() => handleTicketClick(ticket)}>
                <h3 className="card-title">Subject : {ticket.subject}</h3>
                <p className="card-text">Description : {ticket.description}</p>
                {ticket.answer && (
                  <div>
                    <h4>Answer:</h4>
                    <p>{ticket.answer}</p>
                  </div>
                )}
                {selectedTicket && selectedTicket.id === ticket.id && (
                  <div>
                    <h3>Reply To Query Raised</h3>
                    <textarea className="form-control mb-3" value={answer} onClick={handleTextareaClick} onChange={handleAnswerChange}></textarea>
                    <button className="btn btn-primary" onClick={handleAnswerSubmit}>Submit</button>
                    {error && <p className="text-danger mt-2">{error}</p>}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TechSupport;
