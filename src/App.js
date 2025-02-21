import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { auth } from './firebase';
import { signOut } from 'firebase/auth';
import Timer from './components/Timer';
import AllTasks from './components/AllTasks';
import Summary from './components/Summary';
import Insights from './components/Insights';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';

function App() {
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const timerState = localStorage.getItem('isTimerActive');
    setIsTimerActive(timerState === 'true');

    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged(user => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleNavigation = (e, path) => {
    if (isTimerActive && path !== '/') {
      e.preventDefault();
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // User is automatically redirected to home page
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex space-x-8">
                <Link 
                  to="/" 
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
