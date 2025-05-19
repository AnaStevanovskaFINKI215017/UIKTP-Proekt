import React, {useEffect, useState} from "react";
import "./HomePage.css";
import CustomNavbar from "../app-custom/CustomNavbar";
import {useNavigate} from "react-router-dom";
import gradCap from "../../assets/grad-cap.png";

const HomePage = () => {
    const navigate = useNavigate();
    const name = localStorage.getItem("name");

    const [userRole, setUserRole] = useState("");

    useEffect(() => {
        const role = localStorage.getItem("role");
        setUserRole(role);
    }, []);

    const handleNavigate = (path) => {
        const isLoggedIn = localStorage.getItem("email");

        if (!isLoggedIn) {
            navigate("/login");
        } else {
            navigate(path);
        }
    };

    return (
        <>
            <CustomNavbar/>
            <div className="homepage-container">
                <section className="hero-section">
                    <div className="hero-content">
                        <h1>
                            AI Educator
                            <img
                                src={gradCap}
                                alt="Graduation Cap"
                                className="grad-cap-img"
                            />
                        </h1>
                        <p>
                            Your AI-powered academic consultant—guiding you in subject
                            selection, exam prep, and smarter studying.
                        </p>
                        <button
                            onClick={() => handleNavigate("/subject-recommendation")}
                            className="btn-primary"
                        >
                            Get Started
                        </button>
                    </div>
                </section>

                <section className="feature-section">
                    <h2>Subject Recommendation</h2>
                    <div className="feature-content">
                        <img
                            src="https://images.unsplash.com/photo-1517520287167-4bbf64a00d66?auto=format&fit=crop&w=600&q=80"
                            alt="Student choosing subjects with AI assistance"
                            className="feature-image feature-animate"
                        />
                        <div className="feature-text">
                            <p>
                                Struggling to choose the right subjects for your academic path?
                                Our AI can help you find the perfect subjects to apply for based on your preferences,
                                strengths, and
                                career goals.
                                Just provide some basic details, and AI Educator will suggest the best subject options
                                for you.
                            </p>
                            <button
                                onClick={() => handleNavigate("/subject-recommendation")}
                                className="btn-secondary"
                            >
                                Explore Subject Recommendations
                            </button>
                        </div>
                    </div>
                </section>

                <section className="feature-section">
                    <h2>Semester Planning</h2>
                    <div className="feature-content reverse-row">
                        <div className="feature-text">
                            <p>
                                Structure your academic term with ease. Our Semester Planning tool allows you to create
                                semesters, add
                                subjects, and organize learning materials. Upload documents directly within subjects and
                                automatically
                                generate AI-powered flashcards from your content—making your study sessions more focused
                                and
                                productive.
                            </p>
                            <button
                                onClick={() => handleNavigate("/semester-planning")}
                                className="btn-secondary"
                            >
                                Start Planning Your Semester
                            </button>
                        </div>
                        <img
                            src="https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=600&q=80"
                            alt="Student organizing semester schedule"
                            className="feature-image feature-animate"
                        />
                    </div>
                </section>

                <section className="feature-section">
                    <h2>Flashcards AI Generator</h2>
                    <div className="feature-content">
                        <img
                            src="https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=600&q=80"
                            alt="Student using flashcards for studying"
                            className="feature-image feature-animate"
                        />
                        <div className="feature-text">
                            <p>
                                Make studying more efficient with AI-generated flashcards!
                                Simply upload your notes or learning materials, and our AI will create smart, targeted
                                flashcards to
                                help you revise quickly and effectively.
                                Perfect for exam preparation and active recall.
                            </p>
                            <button
                                onClick={() => handleNavigate("/flashcards")}
                                className="btn-secondary"
                            >
                                Generate Flashcards Now
                            </button>
                        </div>
                    </div>
                </section>

                <section className="feature-section">
                    <h2>AI Chatbot Assistant</h2>
                    <div className="feature-content reverse-row">
                        <div className="feature-text">
                            <p>
                                Have questions about your study material? Our intelligent chatbot is here to help! After
                                uploading
                                documents to your subjects, you can chat with our AI assistant to get answers,
                                summaries,
                                clarifications, or explanations—instantly and contextually.
                                It's like having a tutor available 24/7 for every piece of content you upload.
                            </p>
                        </div>
                        <img
                            src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80"
                            alt="Student chatting with AI assistant"
                            className="feature-image feature-animate"
                        />
                    </div>
                </section>

                <section className="feature-section">
                    <h2>Course Hub</h2>
                    <div className="feature-content">
                        <img
                            src="https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?auto=format&fit=crop&w=600&q=80"
                            alt="Students giving feedback and reviews"
                            className="feature-image feature-animate"
                        />
                        <div className="feature-text">
                            <p>
                                Unsure about which courses or subjects to choose?
                                Our Course Hub lets you view ratings and comments from other students, helping you make
                                informed decisions before you commit to any subject or course.
                            </p>
                            <button
                                onClick={() => handleNavigate("/course-reviews")}
                                className="btn-secondary"
                            >
                                Browse Course Reviews
                            </button>
                        </div>
                    </div>
                </section>

                <footer>
                    <p>&copy; 2025 AI Educator</p>
                </footer>
            </div>
        </>
    );
};

export default HomePage;

