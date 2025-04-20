import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import Admin from './components/Admin';
import HomePage from './components/HomePage';  
import SemesterPage from "./components/SemesterPage";
import CreateSemesterPage from "./components/SemesterRecommendationPage"; 
import CourseReviews from "./components/CourseReviews";
import CourseReviewPage from './components/CourseReviewPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import EditSemesterPage from "./components/EditSemesterPage";



function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<HomePage />} />  {/* HomePage as the default route */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/semester-planning" element={<SemesterPage />} />
                    <Route path="/subject-recommendation" element={<CreateSemesterPage />} />
                    <Route path="/semester-planning/edit/:id" element={<EditSemesterPage />} />
                    <Route path="/course-reviews" element={<CourseReviews />} />
                    <Route path="/course/:courseId/reviews" element={<CourseReviewPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
