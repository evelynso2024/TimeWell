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
            <div className="flex space-x-4">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `px-3 py-4 text-sm font-medium ${
                    isActive
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-blue-600'
                  }`
                }
              >
                Timer
              </NavLink>
              <NavLink
                to="/tasks"
                className={({ isActive }) =>
                  `px-3 py-4 text-sm font-medium ${
                    isActive
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-blue-600'
                  }`
                }
              >
                All Tasks
              </NavLink>
              <NavLink
                to="/summary"
                className={({ isActive }) =>
                  `px-3 py-4 text-sm font-medium ${
                    isActive
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-blue-600'
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
}

export default App;
