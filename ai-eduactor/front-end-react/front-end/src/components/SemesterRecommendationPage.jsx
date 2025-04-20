import React, { useState } from 'react';
import CustomNavbar from './CustomNavbar';
import './SemesterRecommendationPage.css';

const INITIAL_USER_SUBJECTS = Array.from({ length: 8 }, (_, i) => ({
  name: `Rated Subject ${i + 1}`,
  checked: true,
}));

const INITIAL_AI_SUBJECTS = Array.from({ length: 5 }, (_, i) => ({
  name: `List item`,
  checked: true,
}));

const SemesterRecommendationPage = () => {
  const [userSubjects, setUserSubjects] = useState(INITIAL_USER_SUBJECTS);
  const [aiSubjects, setAiSubjects] = useState(INITIAL_AI_SUBJECTS);

  const handleUserCheckbox = (idx) => {
    setUserSubjects(subjects =>
      subjects.map((item, i) =>
        i === idx ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleAICheckbox = (idx) => {
    setAiSubjects(subjects =>
      subjects.map((item, i) =>
        i === idx ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleSubmit = () => {
    const newSubjects = Array.from({ length: 5 }, (_, i) => ({
      name: `Recommended Subject ${i + 1}`,
      checked: true,
    }));
    setAiSubjects(newSubjects);
  };

  return (
    <>
      <CustomNavbar />
      <div className="create-semester-container page-content">
        <h1 className="create-page-title">Subject Recommendation for Students</h1>
        <p className="create-page-subtitle">
          Get personalized subject recommendations based on your prior knowledge, interests and future goals for improvement.
        </p>

        <div className="create-lists-wrapper">
          <div className="create-list-box">
            <h2>Subjects you rated with a highest rating</h2>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {userSubjects.map((subject, index) => (
                <li key={index}>
                  <div className="create-list-item">
                    <div className="create-avatar">A</div>
                    <span>{subject.name}</span>
                    <input
                      type="checkbox"
                      checked={subject.checked}
                      onChange={() => handleUserCheckbox(index)}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="create-list-box">
            <h2>AI recommended subjects for you</h2>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
              {aiSubjects.map((subject, index) => (
                <li key={index}>
                  <div className="create-list-item">
                    <div className="create-avatar">{subject.name[0]}</div>
                    <span>{subject.name}</span>
                    <input
                      type="checkbox"
                      checked={subject.checked}
                      onChange={() => handleAICheckbox(index)}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <button className="create-submit-btn" onClick={handleSubmit}>
          Submit and get Recommended subjects
        </button>
      </div>
    </>
  );
};

export default SemesterRecommendationPage;
