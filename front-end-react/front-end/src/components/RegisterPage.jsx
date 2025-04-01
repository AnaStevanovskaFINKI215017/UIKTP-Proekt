import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import "./RegisterPage.css";
import axios from "axios";
import { API_URL } from "../repository/api";
import Notification from "../components/Notification"; // Import the Notification component

const RegisterPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [notification, setNotification] = useState(null); // State for notification
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (password !== repeatPassword) {
            setNotification({ message: "Passwords do not match!", type: "error" });
            return;
        }
    
        try {
            const response = await axios.post(`${API_URL}/auth/register`, 
                { name, email, password }, 
                { headers: { "Content-Type": "application/json" } }
            );
            
            if (response.status === 200) {
                setNotification({ message: "Registration successful! Redirecting to Login Page...", type: "success" });
                setTimeout(() => navigate("/login"), 2000); // Redirect after 2 seconds
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 409) {
                    setNotification({ message: "Email is already taken. Please use a different email.", type: "error" });
                } else if (error.response.status === 400) {
                    setNotification({ message: "Invalid input data. Please check your information.", type: "error" });
                } else {
                    setNotification({ message: "Something went wrong. Please try again later.", type: "error" });
                }
            } else {
                setNotification({ message: "Network error. Please check your connection.", type: "error" });
            }
            console.error("Registration failed:", error);
        }
    };

    return (
        <div className="register-container">
            <div className="register-content">
                <div className="register-box">
                    <h1>Welcome Students! Register Here</h1>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Repeat Password"
                            value={repeatPassword}
                            onChange={(e) => setRepeatPassword(e.target.value)}
                            required
                        />
                        <button type="submit">Register</button>
                    </form>
                    <div className="login-link">
                        Already have an account? <Link to="/login">Login here</Link>
                    </div>
                </div>
                <div className="logo-container">
                    <h2>AI Educator</h2>
                    <GraduationCap size={400} strokeWidth={1.5} />
                </div>
            </div>

            {/* Show notification if there's a message */}
            {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
        </div>
    );
};

export default RegisterPage;
