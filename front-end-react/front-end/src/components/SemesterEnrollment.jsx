import React, { useState, useEffect } from 'react';
import './SemesterEnrollment.css';

const SemesterEnrollment = () => {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        // Fetch courses from backend API
        fetch('/api/courses') // Replace with your actual API endpoint
            .then(response => response.json())
            .then(data => setCourses(data))
            .catch(error => console.error('Error fetching courses:', error));
    }, []);

    return (
        <div className="semester-enrollment">
            <h2>Semester Enrollment</h2>
            <div className="subject-list">
                <p>Please provide a list of the subjects you wish to apply for:</p>
                <ul>
                    {courses.map((course) => (
                        <li key={course.id}>
                            <button className="subject-button">{course.name}</button>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="actions">
                <button className="btn">Get Subject Recommendation</button>
                <button className="btn">Enroll</button>
            </div>
        </div>
    );
};

export default SemesterEnrollment;
