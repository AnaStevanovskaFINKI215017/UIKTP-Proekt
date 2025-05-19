import React, {useEffect, useState} from 'react';
import {Modal} from 'react-bootstrap';
import CustomNavbar from '../app-custom/CustomNavbar';
import '../home/HomePage.css';
import './SemesterPage.css';
import {createSemester, deleteSemester, getCourses, getSemesters} from '../../services/api';
import {useNavigate} from 'react-router-dom';
import Notification from '../app-custom/Notification';

const SemesterPage = () => {
    const MAX_CHOSEN_COURSES = 5;

    const [semesters, setSemesters] = useState([]);

    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);

    const [semesterName, setSemesterName] = useState('');
    const [availableSubjects, setAvailableSubjects] = useState([]);
    const [chosenSubjects, setChosenSubjects] = useState([]);
    const [selectedAvailable, setSelectedAvailable] = useState([]);
    const [selectedChosen, setSelectedChosen] = useState([]);

    const [notification, setNotification] = useState({message: '', type: ''});

    const [editingSemesterId, setEditingSemesterId] = useState(null);
    const [subjectLimitReached, setSubjectLimitReached] = useState(false);


    const fetchCourses = async () => {
        try {
            const response = await getCourses();
            console.log("Fetched courses:", response);
            if (Array.isArray(response)) {
                setAvailableSubjects(response);
            } else {
                console.error('Fetched courses is not an array:', response);
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const handleCreate = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSemesterName('');
        setChosenSubjects([]);
        setEditingSemesterId(null);
        fetchCourses(); // To reset availableSubjects
    };


    const moveToChosen = () => {
        const newSelections = availableSubjects.filter(course =>
            selectedAvailable.includes(course.id.toString()) &&
            !chosenSubjects.find(c => c.id === course.id)
        );
        const totalSelected = chosenSubjects.length + newSelections.length;

        if (totalSelected <= MAX_CHOSEN_COURSES) {
            setAvailableSubjects(prev =>
                prev.filter(course => !selectedAvailable.includes(course.id.toString()))
            );
            setChosenSubjects(prev => [...prev, ...newSelections]);
            setSelectedAvailable([]);
            setSubjectLimitReached(false);
        } else {
            setSubjectLimitReached(true);
        }
    };

    const moveToAvailable = () => {
        const movedCourses = chosenSubjects.filter(course =>
            selectedChosen.includes(course.id.toString())
        );

        setChosenSubjects(prev =>
            prev.filter(course => !selectedChosen.includes(course.id.toString()))
        );

        setAvailableSubjects(prev => [...prev, ...movedCourses]);
        setSelectedChosen([]);
    };


    const fetchSemesters = async () => {
        try {
            const email = localStorage.getItem('email');
            const token = localStorage.getItem('token');

            const response = await getSemesters(email, token);
            console.log("Fetched semesters:", response);

            if (Array.isArray(response)) {
                setSemesters(response);
            } else {
                console.error('Response is not an array:', response);
            }
        } catch (error) {
            console.error('Failed to fetch semesters:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSemesters();
        fetchCourses();
    }, []);


    const handleEdit = (id) => {
        const semesterToEdit = semesters.find(s => s.id === id);
        if (semesterToEdit) {
            setEditingSemesterId(semesterToEdit.id);
            setSemesterName(semesterToEdit.name);
            setChosenSubjects(semesterToEdit.courses || []);
            const chosenIds = semesterToEdit.courses.map(c => c.id);
            const remainingSubjects = availableSubjects.filter(
                course => !chosenIds.includes(course.id)
            );
            setAvailableSubjects(remainingSubjects);
            setShowModal(true);
        }
    };


    const handleDelete = async (id) => {
        try {

            await deleteSemester(id);
            await fetchSemesters();
            setNotification({
                message: 'Semester deleted successfully.',
                type: 'success',
            });
        } catch (error) {

            setNotification({
                message: 'Failed to delete semester. Please try again.',
                type: 'error',
            });
        }
    };

    return (
        <>
            <CustomNavbar/>
            {notification.message && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification({message: '', type: ''})}
                />
            )}
            <div className="homepage-container">
                <header className="hero-header">
                    <div className="hero-title">
                        <h1>Semester Planning</h1>
                        <p>
                            Organize your academic journey efficiently by planning
                            <br/>
                            each semester with your selected subjects.
                        </p>
                    </div>
                </header>

                <div className="semester-page-create-btn-wrapper">
                    <button className="btn semester-page-create-btn" onClick={handleCreate}>
                        Create Semester
                    </button>
                </div>

                <div className="semester-page-cards-container">
                    {loading ? (
                        <p>Loading semesters...</p>
                    ) : semesters.length > 0 ? (
                        semesters.map((semester) => (
                            <div key={semester.id} className="semester-page-card">
                                <h3>{semester.name}</h3>
                                <ul>
                                    {semester.courses && semester.courses.length > 0 ? (
                                        semester.courses.map((course, index) => (
                                            <li key={index}>
                                                <button
                                                    className="semester-page-course-btn"
                                                    onClick={() => navigate(`/course/${course.title}`)}
                                                >
                                                    {course.title}
                                                </button>
                                            </li>
                                        ))
                                    ) : (
                                        <li>No courses added.</li>
                                    )}
                                </ul>
                                <div className="semester-page-card-buttons">
                                    <button className="semester-page-action-btn semester-page-edit-btn"
                                            onClick={() => handleEdit(semester.id)}>
                                        <i className="fas fa-pen me-1"></i> Edit
                                    </button>
                                    <button className="semester-page-action-btn semester-page-delete-btn"
                                            onClick={() => handleDelete(semester.id)}>
                                        <i className="fas fa-trash-alt me-1"></i> Delete
                                    </button>
                                </div>

                            </div>
                        ))
                    ) : (
                        <div>
                            <p>You don't have any semesters.</p>
                        </div>
                    )}
                </div>

                <Modal
                    show={showModal}
                    onHide={closeModal}
                    centered
                    className="semester-page-modal"
                    dialogClassName="semester-page-modal-content"
                    backdrop="static"
                >
                    <Modal.Header className="semester-page-modal-header">
                        <Modal.Title className="semester-page-modal-title">
                            {editingSemesterId ? 'Edit Semester' : 'Create New Semester'}
                        </Modal.Title>
                        <button
                            className="semester-page-modal-close-btn"
                            onClick={closeModal}
                        >
                            ×
                        </button>
                    </Modal.Header>
                    <Modal.Body className="semester-page-modal-body">
                        <label className="semester-page-modal-label">Semester Name</label>
                        <input
                            type="text"
                            value={semesterName}
                            onChange={(e) => setSemesterName(e.target.value)}
                            className="semester-page-modal-input"
                            placeholder="Enter semester name"
                            required
                        />

                        {subjectLimitReached && (
                            <Notification
                                message="You can only select up to 5 subjects"
                                type="warning"
                                onClose={() => setSubjectLimitReached(false)}
                            />
                        )}

                        <div className="semester-page-dual-list-container">
                            <div className="semester-page-course-counter"
                                 className={chosenSubjects.length >= MAX_CHOSEN_COURSES ? 'limit-reached' : ''}>
                                Selected: {chosenSubjects.length}/{MAX_CHOSEN_COURSES}
                            </div>
                            <div className="d-flex justify-content-between">
                                <div className="w-50 text-center">
                                    <h5 className="semester-page-dual-list-header">Selected Courses</h5>
                                </div>
                                <div className="w-50 text-center">
                                    <h5 className="semester-page-dual-list-header">Available Courses</h5>
                                </div>
                            </div>

                            <div className="semester-page-dual-list-row">
                                <select
                                    multiple
                                    className="semester-page-dual-list-select"
                                    onChange={(e) => {
                                        const selected = Array.from(e.target.selectedOptions, option => option.value);
                                        setSelectedChosen(selected);
                                    }}
                                >
                                    {chosenSubjects.map((sub, index) => (
                                        <option key={index} value={sub.id}>{sub.title}</option>
                                    ))}
                                </select>

                                <div className="semester-page-dual-list-arrows">
                                    <button
                                        className="semester-page-arrow-btn"
                                        onClick={moveToChosen}
                                        disabled={chosenSubjects.length >= 5}
                                    >
                                        &larr;
                                    </button>
                                    <button
                                        className="semester-page-arrow-btn"
                                        onClick={moveToAvailable}
                                    >
                                        &rarr;
                                    </button>
                                </div>

                                <select
                                    multiple
                                    className="semester-page-dual-list-select"
                                    onChange={(e) => {
                                        const selected = Array.from(e.target.selectedOptions, option => option.value);
                                        setSelectedAvailable(selected);
                                    }}
                                >
                                    {availableSubjects.map((sub, index) => (
                                        <option key={index} value={sub.id}>{sub.title}</option>
                                    ))}
                                </select>
                            </div>

                            {chosenSubjects.length >= MAX_CHOSEN_COURSES && (
                                <div className="selection-limit-warning">
                                    <i className="fas fa-exclamation-circle"></i>
                                    Maximum number of subjects reached
                                </div>
                            )}
                        </div>
                    </Modal.Body>
                    <Modal.Footer className="semester-page-modal-footer">
                        <button
                            className="semester-page-modal-save-btn"
                            disabled={chosenSubjects.length > MAX_CHOSEN_COURSES || !semesterName.trim()}
                            onClick={async () => {
                                const email = localStorage.getItem("email");
                                const semesterData = {
                                    id: editingSemesterId,
                                    name: semesterName,
                                    courses: chosenSubjects.map(cs => ({
                                        id: cs.id
                                    }))
                                };

                                try {
                                    await createSemester(semesterData, email);
                                    await fetchSemesters();
                                    closeModal();
                                } catch (error) {
                                    console.error('Failed to save semester:', error);
                                }
                            }}
                        >
                            Save Semester
                        </button>
                    </Modal.Footer>
                </Modal>


                <footer>
                    <p>&copy; 2025 AI Educator</p>
                </footer>
            </div>
        </>
    );
};

export default SemesterPage;
