import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const HomePage = () => {
    const navigate = useNavigate(); // Initialize navigate function
    const name = localStorage.getItem("name");

    const handleNavigate = (path) => {
        navigate(path); // Navigate to the provided path
    };

    return (
        <div className="homepage-container">
            <header>
                <h1>Welcome to Our Website {name}!</h1>
            </header>

            <div className="homepage-buttons">
                <button onClick={() => handleNavigate('/login')} className="btn">
                    Login
                </button>
                <button onClick={() => handleNavigate('/register')} className="btn">
                    Register
                </button>
                <button onClick={() => handleNavigate('/admin')} className="btn">
                    Admin
                </button>
            </div>

            <footer>
                <p>&copy; 2025 Our Website</p>
            </footer>
        </div>
    );
};

export default HomePage;
