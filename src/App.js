import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Timer from './components/Timer';
import AllTasks from './components/AllTasks';
import Summary from './components/Summary';
import Insights from './components/Insights';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/timer" element={<Timer />} />
          <Route path="/alltasks" element={<AllTasks />} />
          <Route path="/summary" element={<Summary />} />
          <Route path="/insights" element={<Insights />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
