import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { FiUpload } from 'react-icons/fi';
import CustomNavbar from './CustomNavbar';
import './FlashcardsPage.css';
import axios from 'axios';

const FlashcardsPage = () => {
  const [file, setFile] = useState(null);
  const [numFlashcards, setNumFlashcards] = useState(0);
  const [isGenerated, setIsGenerated] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) navigate("/login");
  }, [userId, navigate]);

  useEffect(() => {
    axios.get("http://localhost:8080/api/courses")
        .then(res => setSubjects(res.data))
        .catch(err => console.error("Error fetching subjects:", err));
  }, []);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.size > 5 * 1024 * 1024) {
      alert("File too large! Max allowed size is 5MB.");
      return;
    }
    setFile(selectedFile);
    setIsGenerated(false);
  };

  const handleNumChange = (event) => {
    setNumFlashcards(event.target.value);
  };

  const handleSubjectChange = (event) => {
    setSelectedSubject(event.target.value);
  };

  const handleGenerate = async () => {
    if (!file) {
      alert("Please upload a PDF file first.");
      return;
    }
    if (!selectedSubject) {
      alert("Please select a subject or course.");
      return;
    }
    if (!userId) {
      alert("You must be logged in.");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("userId", userId);
      uploadData.append("courseId", selectedSubject);
      uploadData.append("numFlashcards", numFlashcards);

      await axios.post(
          'http://localhost:8080/api/attachments/upload',
          uploadData
          // No need to set Content-Type manually!
      );

      setIsGenerated(true);
      alert("Flashcards generated successfully!");

    } catch (error) {
      console.error("Upload error:", error);
      alert(error.response?.data?.message || "Failed to upload file.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!selectedSubject) {
      alert("Please select a subject before downloading.");
      return;
    }
    window.open(`http://localhost:8080/api/flashcards/export/${selectedSubject}`, '_blank');
  };

  const handlePlayGame = () => {
    navigate(`/flashcards/game/${selectedSubject}`);
  };

  return (
      <>
        <CustomNavbar pageTitle="Flashcards" />

        <div className="flashcards-container">
          <h1 className="flashcards-title">Generate your flash cards here!</h1>
          <p className="flashcards-subtitle">
            Please upload your notes as a PDF and choose how many flashcards to generate (max 20).
          </p>

          <div className="flashcards-upload-range">

            {/* 🔽 Subject Dropdown */}
            <div className="dropdown-section">
              <label>Select Subject:</label>
              <select
                  value={selectedSubject}
                  onChange={handleSubjectChange}
                  disabled={loading}
              >
                <option value="">-- Choose a subject --</option>
                {subjects.map(subject => (
                    <option key={subject.id} value={subject.id}>
                      {subject.title}
                    </option>
                ))}
              </select>
            </div>

            {/* 📤 File Upload */}
            <div className="upload-section">
              <label>Upload PDF</label>
              <div className="upload-icon">
                <label htmlFor="file-upload">
                  <FiUpload size={24} />
                </label>
                <input
                    id="file-upload"
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    disabled={loading}
                    style={{ display: 'none' }}
                />
              </div>
              {file && <div style={{ marginTop: 8 }}>{file.name}</div>}
            </div>

            {/* 🔢 Range Selector */}
            <div className="range-section">
              <label>Select number of flashcards</label>
              <div className="range-control">
                <span>0</span>
                <input
                    type="range"
                    min="0"
                    max="20"
                    value={numFlashcards}
                    onChange={handleNumChange}
                    disabled={loading}
                />
                <span>20</span>
              </div>
              <div style={{ textAlign: "center", marginTop: 4 }}>
                Number: <b>{numFlashcards}</b>
              </div>
            </div>
          </div>

          {/* 🧠 Buttons */}
          <div className="flashcards-buttons">
            <button
                className="flashcards-button"
                onClick={handleGenerate}
                disabled={loading || !userId}
            >
              {loading ? "Uploading..." : "Generate"}
            </button>

            {isGenerated && (
                <>
                  <button className="flashcards-button" onClick={handleDownload}>
                    Download
                  </button>
                  <button className="flashcards-button" onClick={handlePlayGame}>
                    Play game
                  </button>
                </>
            )}
          </div>
        </div>
      </>
  );
};

export default FlashcardsPage;
