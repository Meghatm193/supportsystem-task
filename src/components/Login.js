import './style.css';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); 

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password);
  
      const techSupportUsers = {
        'techmember1@gmail.com': 'TechSupport1',
        'techmember2@gmail.com': 'TechSupport2'
      };
  
      if (techSupportUsers.hasOwnProperty(email) && techSupportUsers[email] === password) {
        navigate('/tech-support'); 
      } else {
        navigate('/ticket-form');
      }
    } catch (error) {
      setError(error.message);
    }
  };
  
  return (
    <div className="container mt-5">
      <div className="row justify-content-center mt-5">
        <div className="col-md-6 mt-5">
          <div className="form card">
            <div className="card-body">
              <h1 className="card-title text-center mb-4">Login Form</h1>
              {error && <p className="text-danger">Incorrect login credentials. Please try again</p>}
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter Your Email Id"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter Your Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="text-center">
                  <button type="submit" className="btn btn-primary px-4">Login</button>
                </div>
              </form>
              <p className="mt-3 text-center">Don't have an account? <Link to="/register">Register</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
