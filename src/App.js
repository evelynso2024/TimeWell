import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Timer from './components/Timer';
import AllTasks from './components/AllTasks';
import Summary from './components/Summary';
import React, { useState } from 'react';

// Create a new NavLink component
function NavLink({ to, children, disabled, onClick }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  const baseClasses = "py-4 px-2 font-semibold transition duration-300";
  const activeClasses = "text-blue-500 border-b-2 border-blue-500";
  const inactiveClasses = "text-gray-500 hover:text-blue-500";
  const disabledClasses = "text-gray-300 cursor-not-allowed";

  if (disabled) {
    return (
      <button
        onClick={onClick}
        className={`${baseClasses} ${disabledClasses}`}
      >
        {children}
      </button>
    );
  }

  return (
    <Link
      to={to}
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
    >
      {children}
    </Link>
  );
}

function App() {
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const handleTimerStateChange = (isActive) => {
    setIsTimerActive(isActive);
  };

  const handleDisabledClick = (e) => {
    e.preventDefault();
    setShowWarning(true);
    setTimeout(() => setShowWarning(false), 2000);
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Navigation */}
        <nav className="bg-white shadow-lg relative">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-center space-x-8">
              <NavLink to="/">
                Timer
              </NavLink>
              
              {isTimerActive ? (
                <>
                  <NavLink
                    disabled
                    onClick={handleDisabledClick}
                    to="/all-tasks"
                  >
                    All Tasks
                  </NavLink>
                  <NavLink
                    disabled
                    onClick={handleDisabledClick}
                    to="/summary"
                  >
                    Summary
                  </NavLink>
                </>
              ) : (
                <>
                  <NavLink to="/all-tasks">
                    All Tasks
                  </NavLink>
                  <NavLink to="/summary">
                    Summary
                  </NavLink>
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
