import React, { useState } from "react";
import "./RegisterPage.css";
import { Link } from "react-router-dom";
const RegisterPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!name || !email || !password || !confirmPassword) {
            setError("All fields are required.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setIsLoading(true);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            console.log("Registering with:", { name, email });
        } catch (err) {
            setError("Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-box">
                <h1 className="register-title">Create an Account</h1>
                <p className="register-subtitle">Sign up to get started</p>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit} className="register-form">
                    <label>Full Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <label>Email Address</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <label>Confirm Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <button type="submit" disabled={isLoading}>
                        {isLoading ? "Registering..." : "Register"}
                    </button>
                    <p>
                        Already have an account? <Link to="/">Login here</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;
