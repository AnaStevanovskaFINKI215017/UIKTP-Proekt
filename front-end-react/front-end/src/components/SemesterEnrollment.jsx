import React, { useState, useEffect } from 'react';
import './SemesterEnrollment.css';

const SemesterEnrollment = () => {
    const [subjects, setSubjects] = useState([]);
    
    // Add placeholder subjects if API doesn't return data
    useEffect(() => {
        // Attempt to fetch from API first
        fetch('/api/courses')
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    setSubjects(data);
                } else {
                    // Fallback to placeholder data
                    setSubjects(Array(9).fill().map((_, index) => ({
                        id: index + 1,
                        name: "List item"
                    })));
                }
            })
            .catch(error => {
                console.error('Error fetching courses:', error);
                // Use placeholder data on error
                setSubjects(Array(9).fill().map((_, index) => ({
                    id: index + 1,
                    name: "List item"
                })));
            });
    }, []);

    return (
        <div className="app-container">
            {/* Navigation Bar */}
            <nav className="navbar">
                <div className="nav-links">
                    <a href="#">Home</a>
                    <a href="#">Semesters</a>
                    <a href="#">Flash cards</a>
                    <a href="#">Subject Recommendation</a>
                    <a href="#">Comments</a>
                </div>
                <button className="logout-button">Log out</button>
            </nav>
            
            {/* Main Content */}
            <div className="semester-enrollment">
                <h2>Semester Enrollment</h2>
                <div className="subject-list-container">
                    <div className="subject-list">
                        <p>Please provide a list of the subjects you wish to apply for</p>
                        <ul className="numbered-list">
                            {subjects.map((subject) => (
                                <li key={subject.id}>
                                    <div className="list-item">
                                        <div className="item-number">{subject.id}</div>
                                        <div className="item-content">{subject.name}</div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="actions">
                        <button className="btn recommendation-btn">Get Subject Recommendation</button>
                        <button className="btn enroll-btn">Enroll</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SemesterEnrollment;
