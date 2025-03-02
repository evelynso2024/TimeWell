import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Timer from './components/Timer';
import AllTasks from './components/AllTasks';
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
