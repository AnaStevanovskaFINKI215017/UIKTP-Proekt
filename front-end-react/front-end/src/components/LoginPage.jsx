import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import "./LoginPage.css";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate(); // ✅ Define navigate

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Please enter both email and password");
            return;
        }

        try {
            setIsLoading(true);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            console.log("Login attempt with:", { email });
        } catch (err) {
            setError("Invalid email or password. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <h1>Welcome back!</h1>
            <div className="login-box">
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit} className="login-form">
                    <label>Email</label>
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
                    <button type="submit" className="btn" disabled={isLoading}>
                        {isLoading ? "Logging in..." : "Log In"}
                    </button>
                </form>
                <button className="btn" onClick={() => navigate("/register")}>
                    New User? Register Now
                </button>
            </div>
        </div>
    );
};

export default LoginPage;
