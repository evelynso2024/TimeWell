import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Timer from './components/Timer';
import AllTasks from './components/AllTasks';
import Summary from './components/Summary';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Navigation */}
        <nav className="bg-white shadow-lg">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-center space-x-8">
              <Link
                to="/"
                className="py-4 px-2 text-gray-500 font-semibold hover:text-blue-500 transition duration-300"
              >
                Timer
              </Link>
              <Link
                to="/all-tasks"
                className="py-4 px-2 text-gray-500 font-semibold hover:text-blue-500 transition duration-300"
              >
                All Tasks
              </Link>
              <Link
                to="/summary"
                className="py-4 px-2 text-gray-500 font-semibold hover:text-blue-500 transition duration-300"
              >
                Summary
              </Link>
            </div>
          </div>
        </nav>

        {/* Content */}
        <div className="container mx-auto py-8">
          <Routes>
            <Route path="/" element={<Timer />} />
            <Route path="/all-tasks" element={<AllTasks />} />
            <Route path="/summary" element={<Summary />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
