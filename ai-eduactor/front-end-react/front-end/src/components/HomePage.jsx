import React from 'react';
import './HomePage.css';
import CustomNavbar from './CustomNavbar';
import { useNavigate } from 'react-router-dom';
import gradCap from '../assets/grad-cap.png';
import aiImage from '../assets/books.png';


const HomePage = () => {
    const navigate = useNavigate();
    const name = localStorage.getItem("name");

    const handleNavigate = (path) => {
        navigate(path);
    };

    return (
        <>
            <CustomNavbar />
            <div className="homepage-container">
                <header className="hero-header">
                    <div className="hero-title">
                        <h1>
                            AI Educator
                            <img src={gradCap} alt="Graduation Cap" className="grad-cap-img" />
                        </h1>
                        <p>
                            Your AI-powered academic consultant—guiding you in subject selection,
                            <br />
                            exam prep, and smarter studying.
                        </p>
                    </div>
                </header>

                {/* <div className="homepage-buttons">
                    <button onClick={() => handleNavigate('/login')} className="btn">Login</button>
                    <button onClick={() => handleNavigate('/register')} className="btn">Register</button>
                    <button onClick={() => handleNavigate('/admin')} className="btn">Admin</button>
                </div> */}
                <div className="info-section">
    <img src={aiImage} alt="AI helping students" className="info-image" />
    <div className="info-text">
        <p>
            AI Educator helps students find the perfect subject to apply for, chat with an AI tutor, 
            and generate smart flashcards from their notes and learning materials—all in one powerful platform.
        </p>
        <button onClick={() => handleNavigate('/subject-recommendation')} className="btn">
            Ask AI for Subject Recommendation
        </button>
    </div>
</div>
<div className="feature-buttons">
    <button onClick={() => handleNavigate('/semester-planning')} className="btn feature-btn">Semester Planning</button>
    <button onClick={() => handleNavigate('/flashcards')} className="btn feature-btn">Flash Cards AI Generator</button>
    <button onClick={() => handleNavigate('/course-reviews')} className="btn feature-btn">Subjects Comments and Ratings</button>
</div>


                <footer>
                    <p>&copy; 2025 AI Educator</p>
                </footer>
                </div>
        </>
    );
};

export default HomePage;
