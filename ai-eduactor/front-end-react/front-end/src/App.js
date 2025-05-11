import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import Admin from './components/Admin';
import HomePage from './components/HomePage';  // Don't forget to import the HomePage component
import SemesterPage from "./components/SemesterPage";
import CourseReviews from "./components/CourseReviews";
import CourseReviewPage from './components/CourseReviewPage';
import FlashcardsPage from "./components/FlashcardsPage";
import 'bootstrap/dist/css/bootstrap.min.css';
import SubjectRecommendation from "./components/SubjectRecommendation";
import FlashcardActions from "./components/FlashcardActions"; // Import the FlashcardActions component
import CoursePage from './components/CoursePage';
// import FlashcardGame from "./components/FlashcardGame";
import FlashCardGamePage from "./components/FlashCardGamePage";

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<HomePage />} />  {/* HomePage as the default route */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/semester-planning" element={<SemesterPage/>}/>
                    <Route path="/subject-recommendation" element={<SubjectRecommendation />} />
                    <Route path="/course-reviews" element={<CourseReviews />} />
                    <Route path="/course/:courseId/reviews" element={<CourseReviewPage />} />
                    <Route path="/flashcards" element={<FlashcardsPage />} />
                    <Route path="flashcardactions" element={<FlashcardActions />} />
                    <Route path="/course/:courseName" element={<CoursePage />} />
                    {/* <Route path="/flashcard-game/:courseId" element={<FlashcardGame />} />
                    <Route path="/flashcard-game/demo" element={<FlashcardGame demo={true} />} /> */}
                    <Route path="/flashcards/game/:courseId" element={<FlashCardGamePage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
