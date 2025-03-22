import React, { useState } from 'react';
import './LoginPage.css';
// Test
const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please enter both email and password');
            return;
        }

        try {
            setIsLoading(true);
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('Login attempt with:', { email, rememberMe });
        } catch (err) {
            setError('Invalid email or password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h1 className="login-title">Welcome Back</h1>
                <p className="login-subtitle">Please sign in to your account</p>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit} className="login-form">
                    <label>Email Address</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <label>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <div className="remember-me">
                        <input type="checkbox" id="remember" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                        <label htmlFor="remember">Remember me</label>
                    </div>
                    <button type="submit" disabled={isLoading}>{isLoading ? 'Logging in...' : 'Login'}</button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
