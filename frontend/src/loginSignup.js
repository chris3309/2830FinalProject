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
import { useNavigate } from 'react-router-dom';

function Login() {
    const [loginUsername, setLoginUsername] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [registerUsername, setRegisterUsername] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [registrationError, setRegistrationError] = useState('');
    const [registrationSuccess, setRegistrationSuccess] = useState('');
    const [loginFailure, setLoginFailure] = useState('');
    const navigate = useNavigate();

    const validatePassword = (password) => {
        if (password.length < 4 || password.length > 12) {
            return "Password must be between 4 and 12 characters.";
        }
        if (!/^[a-zA-Z0-9]+$/.test(password)) {
            return "Password can contain only letters and numbers.";
        }
        return "";
    };

    const validateUsername = (username) => {
      if (username.length < 1 || username.length > 15) {
        return "Username must be between 1 and 15 characters.";
      }
      if (!/^[a-zA-Z0-9]+$/.test(username)) {
        return "Username can contain only letters and numbers";
      }
      return "";
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

            //Navigate to correct dashboard
            if(response.data.role==='admin'){
              navigate('/adminDashboard');
            }
            else {
              navigate('/Dashboard');
            }

        } catch (error) {
            console.error('Login failed:', error);
            setLoginFailure('Login failed. Username or Password is incorrect.');
        }
    };
   

    const handleRegisterSubmit = async (event) => {
        event.preventDefault();
        const passwordError = validatePassword(registerPassword);
        const usernameError = validateUsername(registerUsername);

        //Check to see if username and password are valid
        if (registerPassword !== confirmPassword) {
            setRegistrationError('Passwords do not match.');
            return;
        }
        
        if (passwordError !== '') {
          setRegistrationError(passwordError);
          return;
        }
      
        if (usernameError !== '') {
          setRegistrationError(usernameError);
          return;
        }

        //Send to server if valid
        try {
            const response = await axios.post('http://localhost:3001/register', {
                username: registerUsername,
                password: registerPassword,
            });

            console.log(response.data); // Handle registration success
            setRegistrationSuccess('Registration success. Please log in.')
        } catch (error) {
            console.error('Registration failed:', error);
            setRegistrationError("Registration failed.");
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
                        {loginFailure && <div className='error-message'>{loginFailure}</div>}
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
                        {registrationSuccess && <div className="success">{registrationSuccess}</div>}
                        <button type='submit'>Register</button>
                    </form>
                </section>
            </main>
        </div>
    );
}

export default Login;
