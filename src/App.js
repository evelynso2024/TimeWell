import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Timer from './components/Timer';
import AllTasks from './components/AllTasks';
import Summary from './components/Summary';
import Insights from './components/Insights';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp'; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} /> 
        <Route path="/timer" element={<Timer />} />
        <Route path="/alltasks" element={<AllTasks />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="/insights" element={<Insights />} />
      </Routes>
    </Router>
  );
}

export default App;
