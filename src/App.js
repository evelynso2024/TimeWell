import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Timer from './components/Timer';
import AllTasks from './components/AllTasks';
import Summary from './components/Summary';
import React, { useState } from 'react';

function App() {
  const [isTimerActive, setIsTimerActive] = useState(false);

  // Function to handle timer state changes
  const handleTimerStateChange = (isActive) => {
    setIsTimerActive(isActive);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Navigation */}
        <nav className="bg-white shadow-lg">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-center space-x-8">
              <Link
                to="/"
                className={`py-4 px-2 font-semibold transition duration-300
                  ${isTimerActive ? 'text-blue-500' : 'text-gray-500 hover:text-blue-500'}`}
              >
                Timer
              </Link>
              <Link
                to="/all-tasks"
                onClick={(e) => {
                  if (isTimerActive) {
                    e.preventDefault();
                    alert('Please end the current timer before navigating away.');
                  }
                }}
                className={`py-4 px-2 font-semibold transition duration-300
                  ${isTimerActive 
                    ? 'text-gray-300 cursor-not-allowed' 
                    : 'text-gray-500 hover:text-blue-500'}`}
              >
                All Tasks
              </Link>
              <Link
                to="/summary"
                onClick={(e) => {
                  if (isTimerActive) {
                    e.preventDefault();
                    alert('Please end the current timer before navigating away.');
                  }
                }}
                className={`py-4 px-2 font-semibold transition duration-300
                  ${isTimerActive 
                    ? 'text-gray-300 cursor-not-allowed' 
                    : 'text-gray-500 hover:text-blue-500'}`}
              >
                Summary
              </Link>
            </div>
          </div>
        </nav>

        {/* Content */}
        <div className="container mx-auto py-8">
          <Routes>
            <Route 
              path="/" 
              element={<Timer onTimerStateChange={handleTimerStateChange} />} 
            />
            <Route path="/all-tasks" element={<AllTasks />} />
            <Route path="/summary" element={<Summary />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
