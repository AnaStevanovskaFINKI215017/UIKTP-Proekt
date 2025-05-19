import React, {useEffect} from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
// Authentication
import LoginPage from "./components/Authentication/LoginPage";
import RegisterPage from "./components/Authentication/RegisterPage";
import PrivateRoute from "./PrivateRoute";
// Pages
import HomePage from './components/home/HomePage';
import Admin from './components/Admin/Admin';
import SemesterPage from "./components/Semester/SemesterPage";
import CoursePage from './components/CoursePage/CoursePage';
import CourseHub from "./components/Predmetnik/CourseHub";
import CourseReviewPage from './components/Predmetnik/CourseReviewPage';
// Flashcards
import FlashCardGamePage from "./components/FlashCardQuiz/FlashCardGamePage";
import FlashcardCourseSelector from "./components/FlashCardGeneratorForm/FlashcardCourseSelector";
// Other components
import SubjectRecommendation from "./components/Recommendations/SubjectRecommendation";
import ChatBot from "./components/ChatBot/ChatBot";
// Styles
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    const checkAuthCookie = () => {
        try {
            const isLoggedIn = document.cookie
                .split('; ')
                .find((row) => row.startsWith('jwt='));

            if (!isLoggedIn) {
                console.log('Auth cookie expired or missing. Clearing localStorage.');
                localStorage.clear();
                window.location.href = '/login';
            }
        } catch (error) {
            console.error('Error checking authentication:', error);
            window.location.href = '/login';
        }
    };

    useEffect(() => {
        const interval = setInterval(checkAuthCookie, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<HomePage/>}/>
                    <Route path="/login" element={<LoginPage/>}/>
                    <Route path="/register" element={<RegisterPage/>}/>
                    <Route path="/admin" element={<PrivateRoute element={<Admin/>}/>}/>
                    <Route path="/semester-planning" element={<PrivateRoute element={<SemesterPage/>}/>}/>
                    <Route path="/subject-recommendation" element={<PrivateRoute element={<SubjectRecommendation/>}/>}/>
                    <Route path="/course-reviews" element={<PrivateRoute element={<CourseHub/>}/>}/>
                    <Route path="/course/:courseId/reviews" element={<PrivateRoute element={<CourseReviewPage/>}/>}/>
                    <Route path="/flashcards" element={<PrivateRoute element={<FlashcardCourseSelector/>}/>}/>
                    <Route path="/course/:courseName" element={<PrivateRoute element={<CoursePage/>}/>}/>
                    <Route path="/flashcard-game/:courseId" element={<PrivateRoute element={<FlashCardGamePage/>}/>}/>
                    <Route path="/chatbot" element={<PrivateRoute element={<ChatBot/>}/>}/>
                </Routes>
            </div>
        </Router>
    );
}

export default App;