import React, { useState } from 'react';
import './SemesterPage.css';
import CustomNavbar from './CustomNavbar';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const SemesterPage = () => {
    const navigate = useNavigate();
    // Using state to manage semesters for the delete functionality
    const [semesterList, setSemesterList] = useState([
        'First semester', 
        'Second semester', 
        'Third semester', 
        'Fourth semester'
    ]);

    // Navigate to edit semester page
    const handleEdit = (index) => {
        navigate(`/semester-planning/edit/${index}`);
    };

    // Handle semester deletion
    const handleDelete = (index) => {
        if (window.confirm(`Are you sure you want to delete "${semesterList[index]}"?`)) {
            // In a real application, you would make an API call here
            // Example: axios.delete(`/api/semesters/${index}`)
            
            // For now, we'll just update the local state
            const updatedSemesters = [...semesterList];
            updatedSemesters.splice(index, 1);
            setSemesterList(updatedSemesters);
            
            // Optional: Show success notification
            alert("Semester deleted successfully");
        }
    };

    return (
        <>
            <CustomNavbar />
            <div className="semester-container">
                <div className="semester-list">
                    <h1 className="semester-title">Semester Planning</h1>
                    {semesterList.map((sem, index) => (
                        <div key={index} className="semester-item">
                            <span className="semester-name">{sem}</span>
                            <span className="icon-buttons">
                                <FaEdit 
                                    className="icon-btn" 
                                    onClick={() => handleEdit(index)}
                                />
                                <FaTrash 
                                    className="icon-btn" 
                                    onClick={() => handleDelete(index)}
                                />
                            </span>
                        </div>
                    ))}
                </div>
                <div className="create-box">
                    <button
                        className="btn-create"
                        onClick={() => navigate('/subject-recommendation')}
                    >
                        Create new semester
                    </button>
                </div>
            </div>
        </>
    );
};

export default SemesterPage;
