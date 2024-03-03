import React, { useState } from 'react';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Logout from './Logout';

function TicketForm() {
  const { currentUser } = useAuth();
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = null;

      if (file) {
        const storage = getStorage();
        const storageRef = ref(storage, `images/${file.name}`);
        await uploadBytes(storageRef, file);
        imageUrl = await getDownloadURL(storageRef);
      }

      const db = getFirestore();
      await addDoc(collection(db, 'tickets'), {
        subject,
        description,
        imageUrl,
        userEmail: currentUser.email 
      });

      setSubject('');
      setDescription('');
      setFile(null);

      navigate('/ticket-list');
    } catch (error) {
      console.error('Error adding ticket to Firestore:', error);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div className="container mt-4"> 
      <div className="row justify-content-end mb-3">
        <div className="col-auto">
          <Logout />
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="form card">
            <div className="card-body">
              <h1 className="card-title text-center mb-4">Submit Your Query </h1>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="subject" className="form-label">Subject:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Description:</label>
                  <textarea
                    className="form-control"
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label htmlFor="file" className="form-label">Image:</label>
                  <input
                    type="file"
                    className="form-control"
                    id="file"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </div>
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">Submit</button>
                </div>
              </form>
              <div className="text-center mt-3">
                <Link to='/ticket-list' className="btn btn-success">Show old tickets</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TicketForm;
