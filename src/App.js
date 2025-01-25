import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Timer from './components/Timer';
import AllTasks from './components/AllTasks';
import Summary from './components/Summary';
import React, { useState, useEffect } from 'react';

// Create a new NavLink component
function NavLink({ to, children }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  const [isTimerActive, setIsTimerActive] = useState(false);
  
  const baseClasses = "py-4 px-2 font-semibold transition duration-300";
  const activeClasses = "text-blue-500 border-b-2 border-blue-500";
  const inactiveClasses = "text-gray-500 hover:text-blue-500";
  const disabledClasses = "text-gray-300 cursor-not-allowed";

  useEffect(() => {
    const checkTimer = () => {
      const timerState = JSON.parse(localStorage.getItem('isTimerActive') || 'false');
      setIsTimerActive(timerState);
    };

    // Check initially
    checkTimer();

    // Set up interval to check periodically
    const interval = setInterval(checkTimer, 100);

    return () => clearInterval(interval);
  }, []);

  // If timer is active and this is not the Timer page
  if (isTimerActive && to !== '/') {
    return (
      <button
        onClick={() => alert('Focus on your task')}
        onMouseEnter={(e) => {
          e.currentTarget.title = 'Focus on your task';
        }}
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
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Navigation */}
        <nav className="bg-white shadow-lg">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-center space-x-8">
              <NavLink to="/">Timer</NavLink>
              <NavLink to="/all-tasks">All Tasks</NavLink>
              <NavLink to="/summary">Summary</NavLink>
            </div>
          </div>
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
