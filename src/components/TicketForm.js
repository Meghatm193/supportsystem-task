import React, { useState } from 'react';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate,Link } from 'react-router-dom'; // Import useNavigate hook

function TicketForm({ onSubmit }) {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const navigate = useNavigate(); // Initialize the useNavigate hook

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
      const docRef = await addDoc(collection(db, 'tickets'), {
        subject,
        description,
        imageUrl
      });

      onSubmit({
        subject,
        description,
        imageUrl
      });

      setSubject('');
      setDescription('');
      setFile(null);

      // Navigate to the ticket list page after successful submission
      navigate('/ticket-list');
    } catch (error) {
      console.error('Error adding ticket to Firestore:', error);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div>
      
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="subject">Subject:</label>
        <input
          type="text"
          id="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>
      </div>
      <div>
        <label htmlFor="file">Image:</label>
        <input
          type="file"
          id="file"
          onChange={handleFileChange}
          accept="image/*" // Only allow image files
        />
      </div>
      <button type="submit">Submit</button>
    </form>

    <Link to='/ticket-list'>Show ticket list</Link>
    </div>
  );
}

export default TicketForm;
