import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiUpload } from "react-icons/fi";
import CustomNavbar from "./CustomNavbar";
import { getCourses } from "../repository/api";
import axios from "axios";
import "./FlashcardsPage.css";
import "./CoursePage.css";
import Notification from "./Notification";

const CoursePage = () => {
  const { courseName } = useParams();
  const navigate = useNavigate();
  const [courseDetails, setCourseDetails] = useState(null);
  const [file, setFile] = useState(null);
  const [numFlashcards, setNumFlashcards] = useState(0);
  const [isGenerated, setIsGenerated] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [notification, setNotification] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const courses = await getCourses();
        const course = courses.find((c) => c.title === courseName);
        setCourseDetails(course);

        // Fetch attachments after getting course details
        if (course) {
          const userId = localStorage.getItem("userId");
          if (userId) {
            const response = await axios.get(
              "http://localhost:8080/api/attachments",
              {
                params: {
                  courseId: course.id,
                  userId: userId,
                },
              }
            );
            setAttachments(
              response.data.map((attachment) => ({
                file: { name: attachment.originalFileName },
                numFlashcards: 0,
                isGenerated: false,
                id: attachment.id,
              }))
            );
          }
        }
      } catch (error) {
        console.error("Error fetching course details:", error);
      }
    };

    fetchCourseDetails();
  }, [courseName]);
  const handleFileChange = (event) => {
    const newFile = event.target.files[0];
    if (newFile) {
      setSelectedFile(newFile);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const userId = localStorage.getItem("userId");
    if (!userId) {
      showNotification("User not authenticated", "error");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("userId", userId);
    formData.append("courseId", courseDetails.id);

    setIsUploading(true); // start loader

    try {
      const response = await axios.post(
        "http://localhost:8080/api/attachments/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      showNotification("File uploaded successfully!", "success");
      const newAttachment = {
        file: selectedFile,
        numFlashcards: 0,
        isGenerated: false,
        id: response.data.id,
      };

      setAttachments((prev) => [...prev, newAttachment]);
      setSelectedFile(null);
    } catch (error) {
      let message = "Failed to upload file.";

      if (error.response) {
        if (error.response.data.message) {
          message = error.response.data.message;
        } else if (typeof error.response.data === "string") {
          message = error.response.data;
        }
      }

      showNotification(message, "error");
    } finally {
      setIsUploading(false); // stop loader
    }
  };

  const handleNumChange = (index, value) => {
    const updated = [...attachments];
    updated[index].numFlashcards = value;
    setAttachments(updated);
  };

  const handleGenerate = async (index) => {
    const attachment = attachments[index];
    const formData = new FormData();
    formData.append("file", attachment.file);
    formData.append("num_flashcards", attachment.numFlashcards);
    formData.append("course_id", courseDetails.id);

    try {
      await axios.post(
        "http://localhost:8080/api/flashcards/generate",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const updated = [...attachments];
      updated[index].isGenerated = true;
      setAttachments(updated);
      showNotification("Flashcards generated!", "success");
    } catch (error) {
      showNotification("Failed to generate flashcards.", "error");
    }
  };

  const handleDownload = () => {
    window.open(
      `http://localhost:8080/api/flashcards/export/${courseDetails.id}`,
      "_blank"
    );
  };

  const handleDelete = async (id, index) => {
    try {
      await axios.delete(`http://localhost:8080/api/attachments/${id}`);
      const updated = [...attachments];
      updated.splice(index, 1);
      setAttachments(updated);
      alert("Attachment deleted!");
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete attachment.");
    }
  };

  const handlePlayGame = () => {
    navigate(`/flashcard-game/${courseDetails.id}`);
  };

  const handlePlayDemo = () => {
    navigate(`/flashcards/game/${courseDetails.id}`);
  };

  const showNotification = (message, type = "error") => {
    setNotification({ message, type });
  };

  if (!courseDetails) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <CustomNavbar />
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="flashcards-container">
        <h1 className="flashcards-title">{courseDetails.title}</h1>
        <p className="flashcards-subtitle">{courseDetails.description}</p>

        <div className="flashcards-buttons">
          <button className="flashcards-button" onClick={handlePlayDemo}>
            Try Flashcards Game
          </button>
          <br />
        </div>

        <div className="flashcards-upload-range">
          <div className="upload-section">
            <label>
              Attach your PDF to generate flashcards for your course.
            </label>
            <div className="upload-icon">
              <label htmlFor="file-upload">
                <FiUpload size={24} />
              </label>
              <input
                id="file-upload"
                type="file"
                accept="application/pdf"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </div>

            {selectedFile && (
              <div className="upload-preview">
                <p>{selectedFile.name}</p>
                <button onClick={handleUpload} disabled={isUploading}>
                  Upload
                  {isUploading && <span className="spinner"></span>}
                </button>
              </div>
            )}
          </div>
        </div>

        <table className="flashcards-table">
          <thead>
            <tr>
              <th>File</th>
              <th>Flashcards</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {attachments.map((att, index) => (
              <tr key={att.id}>
                <td>
                  <span className="file-collumn">{att.file.name}</span>
                </td>
                <td>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={att.numFlashcards}
                    onChange={(e) => handleNumChange(index, e.target.value)}
                  />
                  <span className="range-number">{att.numFlashcards}</span>
                </td>
                <td>
                  {!att.isGenerated ? (
                    <button onClick={() => handleGenerate(index)}>
                      Generate
                    </button>
                  ) : (
                    <>
                      <button onClick={handleDownload}>Download</button>
                      <button onClick={handlePlayGame}>Play</button>
                      <button onClick={() => handleDelete(att.id, index)}>
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default CoursePage;
