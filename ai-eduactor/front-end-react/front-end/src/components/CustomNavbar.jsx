import React, { useState, useEffect } from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom'; // useLocation to detect route change
import './CustomNavbar.css';

const CustomNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [name, setName] = useState(localStorage.getItem("name"));

    useEffect(() => {
        const storedName = localStorage.getItem("name");
        setName(storedName);
    }, [location]);

    const handleNavigate = (path) => {
        const isLoggedIn = localStorage.getItem("email");
    
        if (isLoggedIn || path === "/") {
            navigate(path);
        }
        else {
            navigate("/login");
        }
    };
    

    const handleLogout = async () => {
        try {
            await fetch('http://localhost:8080/auth/logout', {
                method: 'POST',
                credentials: 'include',
            });
    
            localStorage.clear(); 
            setName(null); 
            navigate('/login'); 
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };
    

    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand onClick={() => handleNavigate('/')} style={{ cursor: 'pointer' }}>
                    AI Educator
                </Navbar.Brand>

                <Nav className="me-auto">
                    <Nav.Link onClick={() => handleNavigate('/')}>Home</Nav.Link>
                    <Nav.Link onClick={() => handleNavigate('/semester-planning')}>Semesters</Nav.Link>
                    <Nav.Link onClick={() => handleNavigate('/flashcards')}>Flash Cards</Nav.Link>
                    <Nav.Link onClick={() => handleNavigate('/subject-recommendation')}>Subject Recommendation</Nav.Link>
                    <Nav.Link onClick={() => handleNavigate('/course-reviews')}>Reviews</Nav.Link>
                </Nav>

                <Nav>
                    {name ? (
                        <>
                            <span className="nav-hello-msg">Hello, {name}!</span>
                            <button className="nav-auth-button nav-logout-btn" onClick={handleLogout}>
                                Log Out
                            </button>
                        </>
                    ) : (
                        <>
                            <button className="nav-auth-button nav-login-btn" onClick={() => handleNavigate('/login')}>
                                Log In
                            </button>
                            <button className="nav-auth-button nav-register-btn" onClick={() => handleNavigate('/register')}>
                                Register
                            </button>
                        </>
                    )}
                </Nav>
            </Container>
        </Navbar>
    );
};

export default CustomNavbar;
