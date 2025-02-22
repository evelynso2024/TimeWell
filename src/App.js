import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';

import Login from './components/auth/Login'
import TaskList from './components/AllTasks';
import Summary from './components/Summary';
import Insights from './components/Insights';

function AppContent() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');  // Add redirect to login page
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {user && (
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex items-center px-2 lg:px-0">
                  <span className="font-bold text-xl text-gray-800">TimeWell</span>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  <a href="/" className="text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium">
                    Tasks
                  </a>
                  <a href="/summary" className="text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium">
                    Summary
                  </a>
                  <a href="/insights" className="text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium">
                    Insights
                  </a>
                </div>
              </div>
              <div className="flex items-center">
                <button
                  onClick={handleLogout}
                  className="text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>
      )}

      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/"
          element={user ? <TaskList /> : <Navigate to="/login" />}
        />
        <Route
          path="/summary"
          element={user ? <Summary /> : <Navigate to="/login" />}
        />
        <Route
          path="/insights"
          element={user ? <Insights /> : <Navigate to="/login" />}
        />
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
