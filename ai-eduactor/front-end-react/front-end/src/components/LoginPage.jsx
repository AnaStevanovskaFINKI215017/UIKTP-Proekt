import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import axios from "axios";
//axios.defaults.withCredentials = true;


const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Please enter both email and password");
            return;
        }

        try {
            setIsLoading(true);

            const response = await axios.post("http://localhost:8080/auth/login", {
                email,
                password,
            });

            if (response.status === 200) {
                const { token, email, name } = response.data;

                localStorage.setItem("token", token);
                localStorage.setItem("email", email);
                localStorage.setItem("name", name);
                navigate("/");
            }
        } catch (err) {
            console.error(err);
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
                    <div className="buttons"></div>
                    <button type="submit">Log In</button>
                    <button className="btn" onClick={() => navigate("/register")}>
                        New User? Register Now
                    </button>
                </form>
                <div className='footer'></div>
            </div>
        </div>
    );
};

export default LoginPage;
