import React, { useState } from 'react';
import './App.css'



function Login() {
    const [loginUsername, setLoginUsername] = useState('');
    const [loginpPassword, setLoginPassword] = useState('');
    const [registerUsername, setRegisterUsername] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
  
    const handleLoginSubmit = (event) => {
        event.preventDefault();
        // SEND TO SEVER
    }
  
    const handleRegisterSubmit = (event) => {
        event.preventDefault();
        if (registerPassword!==confirmPassword){
        alert("Passwords do not match");
        return;
        }
        // SEND TO SERVER
    }
  
    return (
      <div>
        <main>
        <section id="login">
          <h2>LOGIN</h2>
          <form onSubmit={handleLoginSubmit}>
            <label htmlFor="username">Username:</label>
            <input type='text' id='username' name='username' value={loginUsername} onChange={e=>setLoginUsername(e.target.value)}></input>
            <label htmlFor="password">Password:</label>
            <input type='password' id='password' name='password' value={loginpPassword} onChange={e=>setLoginPassword(e.target.value)}></input>
            <button type='submit'>Login</button>
          </form>
        </section>
  
        <section id='register'>
          <h2>REGISTER</h2>
          <form onSubmit={handleRegisterSubmit}>
            <label htmlFor='new-username'>Username:</label>
            <input type='text' id='new-username' name='new-username' value={registerUsername} onChange={e=>setRegisterUsername(e.target.value)}></input>
            <label htmlFor="new-password">Password:</label>
            <input type='password' id='new-password' name='new-password' value={registerPassword} onChange={e=>setRegisterPassword(e.target.value)}></input>
            <label htmlFor="confirm-password">Password:</label>
            <input type='password' id='confirm-password' name='confirm-password' value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)}></input>
            <button type='submit'>Register</button>
          </form>
        </section>
        </main>
      </div>
    );
  }
  
  export default Login;
  