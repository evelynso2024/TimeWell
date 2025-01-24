import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Timer from './components/Timer';
import AllTasks from './components/AllTasks';
import Summary from './components/Summary';
import React, { useState } from 'react';

function App() {
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  // Function to handle timer state changes
  const handleTimerStateChange = (isActive) => {
    setIsTimerActive(isActive);
  };

  // Function to handle disabled navigation clicks
  const handleDisabledClick = (e) => {
    e.preventDefault();
    setShowWarning(true);
    // Auto-hide warning after 2 seconds
    setTimeout(() => setShowWarning(false), 2000);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Navigation */}
        <nav className="bg-white shadow-lg relative">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-center space-x-8">
              <Link
                to="/"
                className="py-4 px-2 text-gray-500 font-semibold hover:text-blue-500 transition duration-300"
              >
                Timer
              </Link>
              {/* Disabled links when timer is active */}
              {isTimerActive ? (
                <>
                  <button
                    onClick={handleDisabledClick}
                    className="py-4 px-2 text-gray-300 font-semibold cursor-not-allowed"
                  >
                    All Tasks
                  </button>
                  <button
                    onClick={handleDisabledClick}
                    className="py-4 px-2 text-gray-300 font-semibold cursor-not-allowed"
                  >
                    Summary
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/all-tasks"
                    className="py-4 px-2 text-gray-500 font-semibold hover:text-blue-500 transition duration-300"
                  >
                    All Tasks
                  </Link>
                  <Link
                    to="/summary"
                    className="py-4 px-2 text-gray-500 font-semibold hover:text-blue-500 transition duration-300"
                  >
                    Summary
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Warning Popup */}
          {showWarning && (
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-2 rounded shadow-lg z-50 transition-opacity duration-300">
              Let's focus on your task
            </div>
          )}
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
