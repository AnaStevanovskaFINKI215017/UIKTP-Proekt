import React, { useState } from "react";
import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";
import "./RegisterPage.css";

const RegisterPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add registration logic here
        console.log("Registration submitted", { name, email, password });
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
                    <GraduationCap
                        size={400}
                        strokeWidth={1.5}
                    />
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;