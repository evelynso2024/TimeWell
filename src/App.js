import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import { signOut } from 'firebase/auth';
import Timer from './components/Timer';
import AllTasks from './components/AllTasks';
import Summary from './components/Summary';
import Insights from './components/Insights';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import LandingPage from './components/LandingPage';  // Added this import

function AppContent() {
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const timerState = localStorage.getItem('isTimerActive');
    setIsTimerActive(timerState === 'true');

    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user);
      // Redirect to landing page if not logged in
      if (!user && window.location.pathname !== '/login' && window.location.pathname !== '/signup') {
        navigate('/');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleNavigation = (e, path) => {
    if (isTimerActive && path !== '/timer') {
      e.preventDefault();
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');  // Changed to redirect to landing page
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Don't show nav bar on landing page
  if (window.location.pathname === '/' && !user) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage setIsTimerActive={setIsTimerActive} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex space-x-8">
              <Link 
                to="/timer" 
                className="flex items-center px-3 pt-1 text-gray-900 font-medium"
              >
                Timer
              </Link>
              <Link 
                to="/all-tasks" 
                onClick={(e) => handleNavigation(e, '/all-tasks')}
                className={`flex items-center px-3 pt-1 font-medium ${
                  isTimerActive ? 'text-gray-400 cursor-not-allowed' : 'text-gray-900'
                }`}
                title={isTimerActive ? "Focus on your current task" : ""}
              >
                All Tasks
              </Link>
              <Link 
                to="/summary" 
                onClick={(e) => handleNavigation(e, '/summary')}
                className={`flex items-center px-3 pt-1 font-medium ${
                  isTimerActive ? 'text-gray-400 cursor-not-allowed' : 'text-gray-900'
                }`}
                title={isTimerActive ? "Focus on your current task" : ""}
              >
                Summary
              </Link>
              <Link 
                to="/insights" 
                onClick={(e) => handleNavigation(e, '/insights')}
                className={`flex items-center px-3 pt-1 font-medium ${
                  isTimerActive ? 'text-gray-400 cursor-not-allowed' : 'text-gray-900'
                }`}
                title={isTimerActive ? "Focus on your current task" : ""}
              >
                Insights
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-gray-700">{user.email}</span>
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-gray-900 font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 hover:text-gray-900 font-medium">
                    Login
                  </Link>
                  <Link to="/signup" className="text-gray-700 hover:text-gray-900 font-medium">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/timer" element={<Timer setIsTimerActive={setIsTimerActive} />} />
        <Route path="/all-tasks" element={<AllTasks />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/" element={<LandingPage setIsTimerActive={setIsTimerActive} />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
