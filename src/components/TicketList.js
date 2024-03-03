import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import Logout from './Logout';

function TicketList() {
  const { currentUser } = useAuth();
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const db = getFirestore();
        const q = query(
          collection(db, "tickets"),
          where("userEmail", "==", currentUser.email)
        );
        const querySnapshot = await getDocs(q);
        const ticketList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTickets(ticketList);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };

    if (currentUser) {
      fetchTickets();
    }
  }, [currentUser]);

  const markAsClosed = async (ticketId) => {
    try {
      const db = getFirestore();
      const ticketRef = doc(db, "tickets", ticketId);
      await updateDoc(ticketRef, {
        status: "closed", 
            });
      setTickets(prevTickets =>
        prevTickets.map(ticket =>
          ticket.id === ticketId ? { ...ticket, status: "closed" } : ticket
        )
      );
    } catch (error) {
      console.error("Error marking ticket as closed:", error);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-end mb-3">
        <div className="col-auto">
          <Logout />
        </div>
      </div>
      <h2 className="text-center mb-3">Your Query List</h2>
      <div className="row justify-content-center">
        <div className="col-md-8">
          {tickets.map((ticket) => (
            <div className="form card mb-3" key={ticket.id}>
              <div className="card-body">
                <h3 className="card-title">Subject : {ticket.subject}</h3>
                <p className="card-text">Description : {ticket.description}</p>
                {ticket.imageUrl && (
                  <p className="card-text">
                    Attachment : {" "}
                    <a
                      href={ticket.imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Download Attached snap
                    </a>
                  </p>
                )}
                {ticket.status === "closed" ? (
                  <p className="text-success">Status: Closed</p>
                ) : (
                  <button
                    className="btn btn-danger"
                    onClick={() => markAsClosed(ticket.id)}
                  >
                  Close This Ticket
                  </button>
                )}
                {ticket.answer && (
                  <div className="text-end text-success">Reply By Tech Support : {ticket.answer}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TicketList;
