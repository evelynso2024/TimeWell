import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Timer() {
  // ... existing state and functions ...

  return (
    <div className="max-w-4xl mx-auto p-6">
      {!isTimerActive ? (
        <>
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
            What will you do next?
          </h1>

          <div className="bg-white rounded-lg shadow p-6">
            <form onSubmit={startTimer} className="mb-6">
              <input
                type="text"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                placeholder="Enter task name"
                className="w-full p-2 mb-4 border rounded focus:outline-none focus:border-blue-500"
              />
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="w-1/3 bg-blue-500 text-white px-8 py-3 rounded hover:bg-blue-600"
                >
                  Start Timer
                </button>
              </div>
            </form>

            {/* ... Recent tasks section ... */}
          </div>
        </>
      ) : (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-4xl font-bold mb-4 text-gray-800">
            {task}
          </div>
          <div className="text-3xl font-mono mb-6 text-gray-600">
            {formatTime(elapsedTime)}
          </div>
          <div className="flex justify-center">
            <button
              onClick={endTimer}
              className="w-1/3 bg-red-500 text-white px-8 py-3 rounded hover:bg-red-600"
            >
              End Timer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Timer;
