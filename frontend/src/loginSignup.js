import React, { useState } from 'react';
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

    const handleLoginSubmit = (event) => {
        event.preventDefault();
        // SEND TO SERVER
    };

    const handleRegisterSubmit = (event) => {
        event.preventDefault();
        const passwordError = validatePassword(registerPassword);
        if (passwordError) {
            setRegistrationError(passwordError);
            return;
        }
        if (registerPassword !== confirmPassword) {
            setRegistrationError("Passwords do not match.");
            return;
        }
        setRegistrationError('');
        // SEND TO SERVER
    };

    return (
        <div>
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
