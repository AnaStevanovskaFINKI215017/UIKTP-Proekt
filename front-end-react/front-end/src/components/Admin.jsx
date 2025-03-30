import React, { useState, useEffect } from 'react';
import './Admin.css';
import { Document, Page, pdfjs } from 'react-pdf';
import { FaEdit, FaTrash, FaPlus, FaFileExport } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const Admin = () => {
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState({ name: '', code: '' });
  const [editing, setEditing] = useState(null);
  const [pdfPreview, setPdfPreview] = useState(null);
  const [showPdfPreview, setShowPdfPreview] = useState(true);

  useEffect(() => {
    const storedSubjects = localStorage.getItem('subjects');
    if (storedSubjects) {
      setSubjects(JSON.parse(storedSubjects));
    }
    
  }, []);

  const saveToLocalStorage = (data) => {
    localStorage.setItem('subjects', JSON.stringify(data));
  };

  const handleAddSubject = () => {
    if (newSubject.name && newSubject.code) {
      const newItem = {
        ...newSubject,
        id: `${newSubject.name}_${newSubject.code}_${Date.now()}`,
      };
      const updated = [...subjects, newItem];
      setSubjects(updated);
      saveToLocalStorage(updated);
      setNewSubject({ name: '', code: '' });
      toast.success('✅ Subject added successfully!');
    }
  };

  const handleDeleteSubject = (id) => {
    const updated = subjects.filter((subject) => subject.id !== id);
    setSubjects(updated);
    saveToLocalStorage(updated);
    toast.error('🗑️ Subject deleted.');
  };

  const handleEditSubject = (subject) => {
    setNewSubject({ name: subject.name, code: subject.code });
    setEditing(subject.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveEdit = () => {
    const updated = subjects.map((subject) =>
      subject.id === editing ? { ...subject, ...newSubject } : subject
    );
    setSubjects(updated);
    saveToLocalStorage(updated);
    setNewSubject({ name: '', code: '' });
    setEditing(null);
    toast.success('✏️ Changes saved.');
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== 'application/pdf') {
      toast.warning('⚠️ Please upload a valid PDF file.');
      return;
    }

    setPdfPreview(URL.createObjectURL(file));
    setShowPdfPreview(true);

    const reader = new FileReader();
    reader.onload = async function () {
      const typedArray = new Uint8Array(this.result);
      const pdf = await pdfjs.getDocument({ data: typedArray }).promise;
      let text = '';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items.map((item) => item.str).join(' ');
        text += strings + '\n';
      }

      const lines = text.split('\n');
      const extractedSubjects = [];

      lines.forEach((line) => {
        const match = line.match(/^(.+?)\s*[-–]\s*(\w+)$/);
        if (match) {
          const name = match[1].trim();
          const code = match[2].trim();
          const id = `${name}_${code}_${Date.now() + Math.random()}`;
          extractedSubjects.push({ id, name, code });
        }
      });

      if (extractedSubjects.length > 0) {
        const updated = [...subjects, ...extractedSubjects];
        setSubjects(updated);
        saveToLocalStorage(updated);
        toast.success(`📄 Imported ${extractedSubjects.length} subjects from PDF!`);
      } else {
        toast.warning('⚠️ No subjects found in the PDF.');
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleExportJSON = () => {
    const json = JSON.stringify(subjects, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'subjects.json';
    a.click();
    toast.info('⬇️ Exported as JSON');
  };

  const handleExportCSV = () => {
    const csv = ['Name,Code', ...subjects.map((s) => `${s.name},${s.code}`)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'subjects.csv';
    a.click();
    toast.info('⬇️ Exported as CSV');
  };

  const isPdfImported = (id) => id.includes('_') && id.split('_').length >= 3;

  return (
    <div className="admin-container">
      <ToastContainer position="top-center" />
      <h1>Admin Panel</h1>

      <div className="upload-section">
        <label>Import PDF with subjects:</label>
        <input type="file" accept="application/pdf" onChange={handleImport} />
      </div>

      {pdfPreview && showPdfPreview && (
        <div className="pdf-preview">
          <h3>PDF Preview:</h3>
          <Document file={pdfPreview} onLoadError={console.error}>
            <Page pageNumber={1} />
          </Document>
          <button onClick={() => setShowPdfPreview(false)} style={{ marginTop: '10px' }}>
            Hide PDF Preview
          </button>
        </div>
      )}

      <div className="subject-form">
        <label>{editing ? 'Edit Subject' : 'Add Subject'}</label>
        {editing && (
          <p style={{ color: 'green', fontWeight: 'bold' }}>✏️ Currently editing...</p>
        )}
        {editing && isPdfImported(editing) ? (
          <textarea
            placeholder="Name"
            value={newSubject.name}
            onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
            rows={3}
          />
        ) : (
          <input
            type="text"
            placeholder="Name"
            value={newSubject.name}
            onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
          />
        )}
        <input
          type="text"
          placeholder="Code"
          value={newSubject.code}
          onChange={(e) => setNewSubject({ ...newSubject, code: e.target.value })}
        />
        <button onClick={editing ? handleSaveEdit : handleAddSubject}>
          <FaPlus />
          {editing ? 'Save Changes' : 'Add Subject'}
        </button>
      </div>

      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <button onClick={handleExportJSON} style={{ marginRight: '10px' }}>
          <FaFileExport /> Export to JSON
        </button>
        <button onClick={handleExportCSV}>
          <FaFileExport /> Export to CSV
        </button>
      </div>

      <h2>Subjects List</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Code</th>
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
                <td>{subject.name}</td>
                <td>{subject.code}</td>
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