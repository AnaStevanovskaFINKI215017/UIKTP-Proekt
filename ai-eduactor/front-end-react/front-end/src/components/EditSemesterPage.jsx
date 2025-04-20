// components/EditSemesterPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Dummy data for demonstration. Replace with API call or context as needed.
const allSubjects = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  "English",
];

const semestersData = {
  1: { name: "First semester", subjects: ["Mathematics", "Physics"] },
  2: { name: "Second semester", subjects: ["Chemistry"] },
  3: { name: "Third semester", subjects: [] },
  4: { name: "Fourth semester", subjects: [] },
};

function EditSemesterPage() {
  const { semesterId } = useParams();
  const navigate = useNavigate();

  // In a real app, fetch this data!
  const semester = semestersData[semesterId];
  const [selectedSubjects, setSelectedSubjects] = useState(semester?.subjects || []);

  const availableSubjects = allSubjects.filter(
    (subj) => !selectedSubjects.includes(subj)
  );

  const handleAddSubject = (subject) => {
    setSelectedSubjects([...selectedSubjects, subject]);
  };

  const handleRemoveSubject = (subject) => {
    setSelectedSubjects(selectedSubjects.filter((s) => s !== subject));
  };

  const handleSave = () => {
    // Here you would send the updated subjects to your backend or context
    // For now, just go back to the semester list
    alert("Semester subjects saved!");
    navigate("/semester-planning");
  };

  if (!semester) return <div>Semester not found</div>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Edit {semester.name}</h2>
      <div style={{ display: "flex", gap: "2rem" }}>
        <div>
          <h3>Selected Subjects</h3>
          <ul>
            {selectedSubjects.map((subject) => (
              <li key={subject}>
                {subject}
                <button onClick={() => handleRemoveSubject(subject)} style={{ marginLeft: "10px" }}>
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Available Subjects</h3>
          <ul>
            {availableSubjects.map((subject) => (
              <li key={subject}>
                {subject}
                <button onClick={() => handleAddSubject(subject)} style={{ marginLeft: "10px" }}>
                  Add
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <button onClick={handleSave} style={{ marginTop: "2rem" }}>
        Save
      </button>
    </div>
  );
}

export default EditSemesterPage;
