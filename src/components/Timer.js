import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Timer() {
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [task, setTask] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [recentTasks, setRecentTasks] = useState([]);
  const navigate = useNavigate();

  // Load recent tasks
  useEffect(() => {
    const allTasks = JSON.parse(localStorage.getItem('allTasks') || '[]');
    setRecentTasks(allTasks.slice(-5).reverse()); // Get last 5 tasks, most recent first
  }, []);

  // Handle timer
  useEffect(() => {
    let intervalId;
    if (isTimerActive) {
      intervalId = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [isTimerActive, startTime]);

  const startTimer = (e) => {
    e.preventDefault(); // Prevent form submission
    if (!task.trim()) return;
    
    setIsTimerActive(true);
    setStartTime(Date.now());
  };

  const endTimer = () => {
    setIsTimerActive(false);
    
    const newTask = {
      id: Date.now(),
      name: task,
      duration: elapsedTime,
      timestamp: new Date().toISOString(),
      leverage: 'High'
    };

    const existingTasks = JSON.parse(localStorage.getItem('allTasks') || '[]');
    localStorage.setItem('allTasks', JSON.stringify([...existingTasks, newTask]));
    
    // Reset states
    setTask('');
    setElapsedTime(0);
    setStartTime(null);
    
    // Update recent tasks
    setRecentTasks([newTask, ...recentTasks.slice(0, 4)]);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        What will you do next?
      </h1>

      {!isTimerActive ? (
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={startTimer} className="mb-6">
            <div className="flex gap-4">
              <input
                type="text"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                placeholder="Enter task name"
                className="flex-1 p-2 border rounded focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
              >
                Start Timer
              </button>
            </div>
          </form>

          {/* Recent Tasks */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">Recent tasks</h2>
            <ul className="space-y-2">
              {recentTasks.map((task) => (
                <li 
                  key={task.id} 
                  className="text-gray-600 hover:text-gray-800"
                >
                  {task.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-4xl font-bold mb-4 text-gray-800">
            {task}
          </div>
          <div className="text-3xl font-mono mb-6 text-gray-600">
            {formatTime(elapsedTime)}
          </div>
          <button
            onClick={endTimer}
            className="bg-red-500 text-white px-8 py-3 rounded hover:bg-red-600"
          >
            End Timer
          </button>
        </div>
      )}
    </div>
  );
}

export default Timer;
