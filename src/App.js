import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Timer from './components/Timer';
import AllTasks from './components/AllTasks';
import Summary from './components/Summary';
import Insights from './components/Insights';

function App() {
  const [isTimerActive, setIsTimerActive] = useState(false);

  useEffect(() => {
    const timerState = localStorage.getItem('isTimerActive');
    setIsTimerActive(timerState === 'true');
  }, []);

  const handleNavigation = (e, path) => {
    if (isTimerActive && path !== '/') {
      e.preventDefault();
      alert('Please end the current timer before navigating away');
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex space-x-8">
                <Link to="/" className="flex items-center px-1 pt-1 text-gray-900">
                  Timer
                </Link>
                <Link 
                  to="/all-tasks" 
                  onClick={(e) => handleNavigation(e, '/all-tasks')}
                  className={`flex items-center px-1 pt-1 ${isTimerActive ? 'text-gray-400 cursor-not-allowed' : 'text-gray-900'}`}
                >
                  All Tasks
                </Link>
                <Link 
                  to="/summary" 
                  onClick={(e) => handleNavigation(e, '/summary')}
                  className={`flex items-center px-1 pt-1 ${isTimerActive ? 'text-gray-400 cursor-not-allowed' : 'text-gray-900'}`}
                >
                  Summary
                </Link>
                <Link 
                  to="/insights" 
                  onClick={(e) => handleNavigation(e, '/insights')}
                  className={`flex items-center px-1 pt-1 ${isTimerActive ? 'text-gray-400 cursor-not-allowed' : 'text-gray-900'}`}
                >
                  Insights
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Timer setIsTimerActive={setIsTimerActive} />} />
          <Route path="/all-tasks" element={<AllTasks />} />
          <Route path="/summary" element={<Summary />} />
          <Route path="/insights" element={<Insights />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
