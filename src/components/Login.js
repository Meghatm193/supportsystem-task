import React from 'react'
import { Link } from 'react-router-dom'
import Register from './Register'

function Login() {
  return (
    <div><h1>Login</h1>
    <Link to="/register">Register</Link>
    </div>
   
  )
}

export default Login