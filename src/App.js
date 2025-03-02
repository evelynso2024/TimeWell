import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Timer from './components/Timer';
import AllTask from './components/AllTasks';
import Navigation from './components/Navigation';
import { supabase } from './supabaseClient';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/timer"
            element={
              <div>
                <Navigation />
                <Timer />
              </div>
            }
          />
          <Route
            path="/alltask"
            element={
              <div>
                <Navigation />
                <AllTask />
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
