 import React, { useState, useEffect } from 'react';
import './Admin.css';
import { FaEdit, FaTrash, FaPlus, FaFileExport } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse, importCourses
} from '../repository/api.js';

const Admin = () => {
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState({ title: '', description: '' });
  const [editing, setEditing] = useState(null);
  const [file, setFile] = useState(null);

  // Fetch courses from the backend when component mounts
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesData = await getCourses(); // Get courses from the backend
        setSubjects(coursesData);
      } catch (error) {
        console.error('Error fetching courses:', error);
        toast.error('⚠️ Failed to load subjects.');
      }
    };

    fetchCourses();
  }, []);

  const handleAddSubject = async () => {
    if (newSubject.title && newSubject.description) {
      const newItem = { ...newSubject };

      try {
        const createdCourse = await createCourse(newItem);
        setSubjects((prevSubjects) => [...prevSubjects, createdCourse]);
        setNewSubject({ title: '', description: '' });
        toast.success('✅ Subject added successfully!');
      } catch (error) {
        console.error('Error creating course:', error);
        toast.error('⚠️ Failed to add subject.');
      }
    }
  };

  const handleDeleteSubject = async (id) => {
    try {
      await deleteCourse(id);
      setSubjects((prevSubjects) => prevSubjects.filter((subject) => subject.id !== id));
      toast.error('🗑️ Subject deleted.');
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('⚠️ Failed to delete subject.');
    }
  };

  const handleEditSubject = (subject) => {
    setNewSubject({ title: subject.title, description: subject.description });
    setEditing(subject.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveEdit = async () => {
    const updatedSubject = { ...newSubject };

    try {
      const updated = await updateCourse(editing, updatedSubject);
      setSubjects((prevSubjects) =>
          prevSubjects.map((subject) => (subject.id === editing ? updated : subject))
      );
      setNewSubject({ title: '', description: '' });
      setEditing(null);
      toast.success('✏️ Changes saved.');
    } catch (error) {
      console.error('Error saving edit:', error);
      toast.error('⚠️ Failed to save changes.');
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast.warning('⚠️ Please upload a valid CSV or Excel file.');
    }else{
      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await importCourses(formData);
        toast.success('✅ Courses imported successfully!');

        setFile(null);
      } catch (error) {
        console.error('Error uploading file:', error);
        toast.error('⚠️ Failed to import courses.');
      }
    }
  };

  return (
      <div className="admin-container">
        <ToastContainer position="top-center" />
        <h1>Admin Panel</h1>

        <div className="upload-section">
          <label>Import PDF with subjects:</label>
          <input type="file" accept=".csv, .xls, .xlsx" onChange={(e) => setFile(e.target.files[0])}/>
          <button onClick={handleImport}>Import Courses</button>
        </div>

        <div className="subject-form">
          <label>{editing ? 'Edit Subject' : 'Add Subject'}</label>
          {editing && (
              <p style={{ color: 'green', fontWeight: 'bold' }}>✏️ Currently editing...</p>
          )}
          <input
              type="text"
              placeholder="Title"
              value={newSubject.title}
              onChange={(e) => setNewSubject({ ...newSubject, title: e.target.value })}
          />
          <input
              type="text"
              placeholder="Description"
              value={newSubject.description}
              onChange={(e) => setNewSubject({ ...newSubject, description: e.target.value })}
          />
          <button onClick={editing ? handleSaveEdit : handleAddSubject}>
            <FaPlus />
            {editing ? 'Save Changes' : 'Add Subject'}
          </button>
        </div>

        <h2>Subjects List</h2>
        <table>
          <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          {subjects.length === 0 ? (
              <tr>
                <td colSpan="3">No subjects yet.</td>
              </tr>
          ) : (
              subjects.map((subject) => (
                  <tr key={subject.id}>
                    <td>{subject.title}</td>
                    <td>{subject.description}</td>
                    <td>
                      <button onClick={() => handleEditSubject(subject)} title="Edit">
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDeleteSubject(subject.id)} title="Delete">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
              ))
          )}
          </tbody>
        </table>
      </div>
  );
};

export default Admin;