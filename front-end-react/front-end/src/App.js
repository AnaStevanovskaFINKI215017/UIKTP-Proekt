import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import routing components
import LoginPage from './components/LoginPage';
import SemesterEnrollment from './components/SemesterEnrollment';

function App() {
  return (
      <Router>
          <div className="App">
              {/* Define routes for your app */}
              <Routes>
                  <Route path="/" element={<LoginPage />} />
                  <Route path="/semester-enrollment" element={<SemesterEnrollment />} />
              </Routes>
          </div>
      </Router>
  );
}

export default App;
