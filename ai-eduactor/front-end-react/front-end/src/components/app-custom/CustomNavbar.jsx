import React, {useState, useEffect} from 'react';
import {Navbar, Container, Nav} from 'react-bootstrap';
import {useNavigate, Link, useLocation} from 'react-router-dom';
import './CustomNavbar.css';
import {logout} from "../../services/api";

const navLinks = [
    {to: "/", label: "Home"},
    {to: "/semester-planning", label: "Semesters"},
    {to: "/flashcards", label: "Flash Cards"},
    {to: "/subject-recommendation", label: "Subject Recommendation"},
    {to: "/course-reviews", label: "Course Hub"}
];

const CustomNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [name, setName] = useState(localStorage.getItem("name"));
    const [role, setRole] = useState(localStorage.getItem("role"));

    useEffect(() => {
        setName(localStorage.getItem("name"));
        setRole(localStorage.getItem("role"));
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            setName(null);
            setRole(null);
            navigate('/login');
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    return (
        <Navbar bg="light" expand="lg" className="ai-navbar-shadow" sticky="top">
            <Container>
                <Navbar.Brand as={Link} to="/"
                              style={{cursor: 'pointer', fontWeight: 700, fontSize: 22, letterSpacing: 1}}>
                    <span role="img" aria-label="AI">🤖</span> AI Educator
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="main-navbar-nav"/>
                <Navbar.Collapse id="main-navbar-nav">
                    <Nav className="me-auto align-items-center" style={{gap: '8px'}}>
                        {navLinks.map(link => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`nav-link ai-navbar-animated-link${location.pathname === link.to ? " ai-navbar-link-active" : ""}`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </Nav>
                    <Nav className="align-items-center" style={{gap: '8px'}}>
                        {name ? (
                            <>
                                <span className="ai-navbar-hello-msg">Hello, {name}!</span>
                                {role === "ADMIN" && (
                                    <Link
                                        to="/admin"
                                        className={`nav-link ai-navbar-admin-link ai-navbar-animated-link${location.pathname === "/admin" ? " ai-navbar-link-active" : ""}`}
                                    >
                                        Admin
                                    </Link>
                                )}
                                <button className="ai-navbar-auth-button ai-navbar-logout-btn" onClick={handleLogout}>
                                    Log Out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="ai-navbar-auth-button ai-navbar-login-btn">
                                    Log In
                                </Link>
                                <Link to="/register" className="ai-navbar-auth-button ai-navbar-register-btn">
                                    Register
                                </Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default CustomNavbar;

