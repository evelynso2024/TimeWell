import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Timer from './components/Timer';
import AllTasks from './components/AllTasks';
import Summary from './components/Summary';
import Insights from './components/Insights';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex space-x-8">
                <Link to="/" className="flex items-center px-1 pt-1 text-gray-900">Timer</Link>
                <Link to="/all-tasks" className="flex items-center px-1 pt-1 text-gray-900">All Tasks</Link>
                <Link to="/summary" className="flex items-center px-1 pt-1 text-gray-900">Summary</Link>
                <Link to="/insights" className="flex items-center px-1 pt-1 text-gray-900">Insights</Link>
              </div>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Timer />} />
          <Route path="/all-tasks" element={<AllTasks />} />
          <Route path="/summary" element={<Summary />} />
          <Route path="/insights" element={<Insights />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
