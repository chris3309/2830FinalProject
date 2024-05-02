//LOGIN PAGE

/*
TODO:
- Finish login function and redirect to dashboard or admindashboard
if user is admin
- Finish register submit
*/

import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function Login() {
    const [loginUsername, setLoginUsername] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [registerUsername, setRegisterUsername] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [registrationError, setRegistrationError] = useState('');

    const validatePassword = (password) => {
        if (password.length < 4 || password.length > 12) {
            return "Password must be between 4 and 12 characters.";
        }
        if (!/^[a-zA-Z0-9]+$/.test(password)) {
            return "Password contains invalid characters.";
        }
        return "";
    };

    const validateUsername = (username) => {
      if (!/^[a-zA-Z0-9]+$/.test(username)) {
        return "Username contains invalid characters.";
    }
    }

    const handleLoginSubmit = async (event) => {
        event.preventDefault();

        // SEND TO SERVER
        try {
            const response = await axios.post('http://localhost:3001/login', {
                username: loginUsername,
                password: loginPassword,
            });

            console.log(response.data); // Handle login success
        } catch (error) {
            console.error('Login failed:', error);
        }
    };
   

    const handleRegisterSubmit = async (event) => {
        event.preventDefault();
        if (registerPassword !== confirmPassword) {
            setRegistrationError('Passwords do not match.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3001/register', {
                username: registerUsername,
                password: registerPassword,
            });

            console.log(response.data); // Handle registration success
        } catch (error) {
            console.error('Registration failed:', error);
        }
    };

    return (
        <div>
            <header><h1>Scheduling System</h1></header>
            <main>
                <section id="login">
                    <h2>LOGIN</h2>
                    <form onSubmit={handleLoginSubmit}>
                        <label htmlFor="username">Username:</label>
                        <input type='text' id='username' name='username' value={loginUsername} onChange={e => setLoginUsername(e.target.value)} />
                        <label htmlFor="password">Password:</label>
                        <input type='password' id='password' name='password' value={loginPassword} onChange={e => setLoginPassword(e.target.value)} />
                        <button type='submit'>Login</button>
                    </form>
                </section>

                <section id='register'>
                    <h2>REGISTER</h2>
                    <form onSubmit={handleRegisterSubmit}>
                        <label htmlFor='new-username'>Username:</label>
                        <input type='text' id='new-username' name='new-username' value={registerUsername} onChange={e => setRegisterUsername(e.target.value)} />
                        <label htmlFor="new-password">Password:</label>
                        <input type='password' id='new-password' name='new-password' value={registerPassword} onChange={e => setRegisterPassword(e.target.value)} />
                        <label htmlFor="confirm-password">Confirm Password:</label>
                        <input type='password' id='confirm-password' name='confirm-password' value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                        {registrationError && <div className="error-message">{registrationError}</div>}
                        <button type='submit'>Register</button>
                    </form>
                </section>
            </main>
        </div>
    );
}

export default Login;
