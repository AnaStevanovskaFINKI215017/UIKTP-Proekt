import React, {useState, useEffect, useRef} from 'react';
import './Admin.css';
import {FaEdit, FaPlus, FaHome, FaFileUpload, FaTrash, FaArrowDown, FaArrowUp} from 'react-icons/fa';
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useNavigate} from "react-router-dom";
import {logout, getCourses, createCourse, updateCourse, deleteCourse, importCourses} from '../../services/api.js';

const Admin = () => {
    const [subjects, setSubjects] = useState([]);
    const [newSubject, setNewSubject] = useState({title: '', description: ''});
    const [editSubject, setEditSubject] = useState({title: '', description: ''});
    const [editing, setEditing] = useState(null);
    const [file, setFile] = useState(null);
    const [sortOrder, setSortOrder] = useState('latest');
    const navigate = useNavigate();
    const formRef = useRef(null);

    const reloadSubjects = async () => {
        try {
            const coursesData = await getCourses();
            setSubjects(coursesData);
        } catch (error) {
            toast.error('⚠️ Failed to load subjects.');
        }
    };

    useEffect(() => {
        reloadSubjects();
    }, []);

    const handleAddSubject = async () => {
        if (newSubject.title && newSubject.description) {
            try {
                await createCourse({...newSubject});
                setNewSubject({title: '', description: ''});
                toast.success('✅ Subject added successfully!');
                await reloadSubjects();
            } catch (error) {
                toast.error('⚠️ Failed to add subject.');
            }
        }
    };

    const handleDeleteSubject = async (id) => {
        try {
            await deleteCourse(id);
            toast.error('🗑️ Subject deleted.');
            await reloadSubjects();
        } catch (error) {
            const msg =
                error?.response?.data?.message ||
                error?.response?.data ||
                error?.message ||
                '';
            if (
                msg.toLowerCase().includes('attachment') ||
                msg.toLowerCase().includes('dependent') ||
                msg.toLowerCase().includes('foreign key') ||
                msg.toLowerCase().includes('constraint')
            ) {
                toast.error('❌ Cannot delete subject: It has attachments or dependencies.');
            } else {
                toast.error('⚠️ Failed to delete subject.');
            }
        }
    };

    const handleEditSubject = (subject) => {
        setEditSubject({title: subject.title, description: subject.description});
        setEditing(subject.id ?? subject.courseId); // Ensure correct ID is set
        if (formRef.current) {
            formRef.current.scrollIntoView({behavior: 'smooth', block: 'center'});
        }
    };

    const handleSaveEdit = async () => {
        if (!editSubject.title || !editSubject.description) {
            toast.warning('⚠️ Please fill in all fields');
            return;
        }
        try {
            await updateCourse(editing, {...editSubject});
            setEditSubject({title: '', description: ''});
            setEditing(null);
            toast.success('✏️ Changes saved.');
            setSubjects((prev) =>
                prev.map((s) =>
                    (s.id ?? s.courseId) === editing
                        ? {...s, ...editSubject}
                        : s
                )
            );
        } catch (error) {
            let latestSubjects = [];
            try {
                const coursesData = await getCourses();
                setSubjects(coursesData);
                latestSubjects = coursesData;
            } catch (e) {
                toast.error('⚠️ Failed to reload subjects.');
            }
            const updated = latestSubjects.find(
                (s) => (s.id ?? s.courseId) === editing
            );
            if (
                updated &&
                updated.title === editSubject.title &&
                updated.description === editSubject.description
            ) {
                setEditSubject({title: '', description: ''});
                setEditing(null);
                toast.success('✏️ Changes saved.');
            } else {
                toast.error('⚠️ Failed to save changes.');
            }
        }
    };

    const handleImport = async () => {
        if (!file) {
            toast.warning('⚠️ Please upload a valid CSV or Excel file.');
            return;
        }
        try {
            const formData = new FormData();
            formData.append('file', file);
            const loadingToast = toast.loading('Importing courses...');
            await importCourses(formData);
            toast.dismiss(loadingToast);
            toast.success('✅ Courses imported successfully!');
            setFile(null);
            await reloadSubjects();
        } catch (error) {
            toast.error(`⚠️ Import failed: ${error.response?.data?.message || error.message}`);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            toast.error('⚠️ Logout failed');
        }
    };

    const handleGoHome = () => {
        navigate('/');
    };

    const getSortedSubjects = () => {
        if (!subjects) return [];
        const sorted = [...subjects].sort((a, b) => {
            const idA = a.id ?? a.courseId;
            const idB = b.id ?? b.courseId;
            return sortOrder === 'latest'
                ? idB - idA
                : idA - idB;
        });
        return sorted;
    };

    return (
        <>
            <ToastContainer
                position="top-center"
                style={{zIndex: 9999, position: "fixed"}}
                toastClassName="sticky-toast"
                bodyClassName="sticky-toast-body"
            />
            <div className="admin-container">
                <div className="admin-header">
                    <h1>Admin Panel</h1>
                    <div className="admin-header-buttons">
                        <button className="home-btn" onClick={handleGoHome}>
                            <FaHome style={{marginRight: 8}}/>
                            Homepage
                        </button>
                        <button className="logout-btn" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </div>

                <div className="upload-section">
                    <h2 className="upload-title">Import Subjects</h2>
                    <p className="upload-subtitle">
                        Upload a file (PDF, CSV, Excel) containing subject information.
                    </p>
                    <div className="upload-box">
                        <label htmlFor="admin-file-upload" className="custom-upload-label">
                            <FaFileUpload size={20}/>
                            {file ? file.name : "Choose File"}
                        </label>
                        <input
                            id="admin-file-upload"
                            type="file"
                            accept=".csv, .xls, .xlsx, .pdf"
                            onChange={(e) => setFile(e.target.files[0])}
                            style={{display: "none"}}
                        />
                    </div>
                    <div className="upload-actions">
                        <button className="import-btn" onClick={handleImport} disabled={!file}>
                            <FaFileUpload style={{marginRight: 8}}/>
                            Import Subjects
                        </button>
                    </div>
                </div>

                <div className="subject-form" ref={formRef}>
                    <label className="form-title">{editing ? 'Edit Subject' : 'Add Subject'}</label>
                    {editing && (
                        <p className="editing-indicator">✏️ Currently editing...</p>
                    )}
                    <div className="input-group">
                        <label>Title</label>
                        <input
                            type="text"
                            placeholder="Enter subject title"
                            value={editing ? editSubject.title : newSubject.title}
                            onChange={(e) =>
                                editing
                                    ? setEditSubject({...editSubject, title: e.target.value})
                                    : setNewSubject({...newSubject, title: e.target.value})
                            }
                        />
                    </div>
                    <div className="input-group">
                        <label>Description</label>
                        <input
                            type="text"
                            placeholder="Enter subject description"
                            value={editing ? editSubject.description : newSubject.description}
                            onChange={(e) =>
                                editing
                                    ? setEditSubject({...editSubject, description: e.target.value})
                                    : setNewSubject({...newSubject, description: e.target.value})
                            }
                        />
                    </div>
                    <div style={{display: 'flex', gap: '12px', width: '100%', justifyContent: 'center'}}>
                        <button className="form-btn" onClick={(e) => {
                            e.preventDefault();
                            editing ? handleSaveEdit() : handleAddSubject();
                        }}>
                            {editing ? <FaEdit/> : <FaPlus/>}
                            <span style={{marginLeft: '8px'}}>
                                {editing ? 'Save Changes' : 'Add Subject'}
                            </span>
                        </button>
                        {editing && (
                            <button
                                className="form-btn"
                                style={{background: '#eee', color: '#fff', border: '1.5px solid #800000'}}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setEditing(null);
                                    setEditSubject({title: '', description: ''});
                                }}
                                type="button"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                </div>

                <div className="subjects-list">
                    <div className="subjects-list-header-row">
                        <h2 className="subjects-list-title">Subjects List</h2>
                        <div className="subject-sort-toggle">
                            <button
                                className={`sort-btn ${sortOrder === 'latest' ? 'active' : ''}`}
                                onClick={() => setSortOrder('latest')}
                                aria-label="Sort by latest"
                            >
                                <FaArrowDown/> Latest
                            </button>
                            <button
                                className={`sort-btn ${sortOrder === 'oldest' ? 'active' : ''}`}
                                onClick={() => setSortOrder('oldest')}
                                aria-label="Sort by oldest"
                            >
                                <FaArrowUp/> Oldest
                            </button>
                        </div>
                    </div>

                    <div className="subject-table-header">
                        <div>Title</div>
                        <div>Description</div>
                        <div>Actions</div>
                    </div>

                    {subjects.length === 0 ? (
                        <div className="no-subjects">No subjects yet.</div>
                    ) : (
                        getSortedSubjects().map((subject) => (
                            <div key={subject.id ?? subject.courseId} className="subject-table-row">
                                <div className="subject-title">{subject.title}</div>
                                <div className="subject-description">{subject.description}</div>
                                <div className="subject-actions">
                                    <button className="action-btn edit-action"
                                            onClick={() => handleEditSubject(subject)} title="Edit">
                                        <FaEdit/>
                                    </button>
                                    <button className="action-btn delete-action"
                                            onClick={() => handleDeleteSubject(subject.id ?? subject.courseId)}
                                            title="Delete">
                                        <FaTrash/>
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </>
    );
};

export default Admin;
