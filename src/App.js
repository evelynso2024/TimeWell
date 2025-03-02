import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './component/auth/Login';
import Timer from './component/Timer';
import AllTasks from './component/AllTasks';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/timer" element={<Timer />} />
          <Route path="/alltasks" element={<AllTasks />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
