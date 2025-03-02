import React from 'react';
import { useNavigate } from 'react-router-dom';

function Summary() {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Navigation Bar */}
      <div className="mb-6 flex justify-between items-center">
        <div className="flex space-x-4">
          <button
            onClick={() => navigate('/timer')}
            className="bg-white text-black px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
          >
            Timer
          </button>
          <button
            onClick={() => navigate('/alltasks')}
            className="bg-white text-black px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
          >
            All Tasks
          </button>
          <button
            onClick={() => navigate('/summary')}
            className="bg-white text-black px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
          >
            Summary
          </button>
          <button
            onClick={() => navigate('/insights')}
            className="bg-white text-black px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
          >
            Insights
          </button>
        </div>
      </div>

      {/* Test Content */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Summary Page</h2>
        <p>This is a test to make sure the Summary page is working.</p>
      </div>
    </div>
  );
}

export default Summary;
