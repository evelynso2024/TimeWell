import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Timer from './components/Timer';

// Placeholder components
const AllTasks = () => <div className="text-xl">All Tasks Page</div>;
const Summary = () => <div className="text-xl">Summary Page</div>;

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation Tabs */}
        <nav className="bg-white border-b">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-center gap-1 pt-2">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `px-8 py-3 font-medium rounded-t-lg ${
                    isActive
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`
                }
              >
                Timer
              </NavLink>
              <NavLink
                to="/tasks"
                className={({ isActive }) =>
                  `px-8 py-3 font-medium rounded-t-lg ${
                    isActive
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`
                }
              >
                All Tasks
              </NavLink>
              <NavLink
                to="/summary"
                className={({ isActive }) =>
                  `px-8 py-3 font-medium rounded-t-lg ${
                    isActive
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
