import React from 'react';
import { Link } from 'react-router-dom';
import {  createUserWithEmailAndPassword } from 'firebase/auth'; // Ensure correct import path

import database from '../firebase';

function Register() {
  const handleSubmit = (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    createUserWithEmailAndPassword(database, email, password)
      .then((userCredential) => {
        console.log(userCredential, "authData"); // Handle successful registration
      })
      .catch((error) => {
        console.error("Error registering user:", error); // Handle errors
      });
  };

  return (
    <div className="App">
      <h1>Register</h1>
      <form onSubmit={(e) => handleSubmit(e)}>
        <input name="email" placeholder="Email" /> <br />
        <input name="password" placeholder="Password" type="password" />
        <button>Register</button>
      </form>
      <Link to="/">Login</Link>
    </div>
  );
}

export default Register;

