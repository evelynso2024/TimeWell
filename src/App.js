import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';

// Placeholder components
const Timer = () => <div>Timer Page</div>;
const AllTasks = () => <div>All Tasks Page</div>;
const Summary = () => <div>Summary Page</div>;

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Navigation Tabs */}
        <nav className="bg-white shadow-lg">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-center space-x-1">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `px-6 py-3 text-sm font-medium rounded-t-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`
                }
              >
                Timer
              </NavLink>
              <NavLink
                to="/tasks"
                className={({ isActive }) =>
                  `px-6 py-3 text-sm font-medium rounded-t-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`
                }
              >
                All Tasks
              </NavLink>
              <NavLink
                to="/summary"
                className={({ isActive }) =>
                  `px-6 py-3 text-sm font-medium rounded-t-lg transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`
                }
              >
                Summary
              </NavLink>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Timer />} />
            <Route path="/tasks" element={<AllTasks />} />
            <Route path="/summary" element={<Summary />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
