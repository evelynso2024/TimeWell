import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Timer from './components/Timer';
import AllTasks from './components/AllTasks';
import Summary from './components/Summary';
import React, { useState, useEffect } from 'react';

// Create a new NavLink component
function NavLink({ to, children, disabled, onClick }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  const [showTooltip, setShowTooltip] = useState(false);
  
  const baseClasses = "py-4 px-2 font-semibold transition duration-300 relative";
  const activeClasses = "text-blue-500 border-b-2 border-blue-500";
  const inactiveClasses = "text-gray-500 hover:text-blue-500";
  const disabledClasses = "text-gray-300 cursor-not-allowed";

  if (disabled) {
    return (
      <div className="relative">
        <button
          onClick={onClick}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className={`${baseClasses} ${disabledClasses}`}
        >
          {children}
        </button>
        {showTooltip && (
          <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-12 
            bg-gray-800 text-white text-sm px-3 py-2 rounded shadow-lg whitespace-nowrap z-50">
            Focus on your task
            <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 
              border-4 border-transparent border-b-gray-800"></div>
          </div>
        )}
      </div>
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

  useEffect(() => {
    const checkTimer = () => {
      const timerState = JSON.parse(localStorage.getItem('isTimerActive') || 'false');
      setIsTimerActive(timerState);
    };

    // Check initially
    checkTimer();

    // Set up interval to check periodically
    const interval = setInterval(checkTimer, 1000);

    return () => clearInterval(interval);
  }, []);

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
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 
              bg-gray-800 text-white px-4 py-2 rounded shadow-lg z-50 
              transition-opacity duration-300">
              Focus on your task
            </div>
          )}
        </nav>

        {/* Content */}
        <div className="container mx-auto py-8">
          <Routes>
            <Route path="/" element={<Timer />} />
            <Route path="/all-tasks" element={<AllTasks />} />
            <Route path="/summary" element={<Summary />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
