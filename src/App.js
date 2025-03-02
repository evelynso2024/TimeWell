import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Timer from './components/Timer';
import AllTasks from './components/AllTasks';
import Summary from './components/Summary';
import Insights from './components/Insights';
import Login from './components/Login';
import { supabase } from './supabaseClient';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/timer" element={<Timer />} />
        <Route path="/alltasks" element={<AllTasks />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/" element={<Timer />} />
      </Routes>
    </Router>
  );
}

export default App;
