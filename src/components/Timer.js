import React, { useState, useEffect } from 'react';

function Timer() {
  const [task, setTask] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [recentTasks, setRecentTasks] = useState([]);

  // Load recent tasks on component mount
  useEffect(() => {
    const allTasks = JSON.parse(localStorage.getItem('allTasks') || '[]');
    setRecentTasks(allTasks.slice(0, 5));
  }, []);

  // Timer logic
  useEffect(() => {
    let intervalId;
    if (isRunning) {
      intervalId = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [isRunning]);

  // Format time to HH:MM:SS
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle starting timer
  const handleStart = () => {
    if (task.trim()) {
      setIsRunning(true);
      playSound();
    }
  };

  // Handle ending timer
  const handleEnd = () => {
    if (isRunning) {
      setIsRunning(false);
      playSound();
      
      // Create new task
      const newTask = {
        name: task,
        duration: formatTime(time),
        timestamp: new Date().toISOString(),
        leverage: ""
      };

      // Get existing tasks from localStorage
      const allTasks = JSON.parse(localStorage.getItem('allTasks') || '[]');
      
      // Add new task to the beginning
      const updatedTasks = [newTask, ...allTasks];
      
      // Update localStorage with all tasks
      localStorage.setItem('allTasks', JSON.stringify(updatedTasks));
      
      // Update recent tasks state with 5 most recent
      setRecentTasks(updatedTasks.slice(0, 5));

      // Reset
      setTask('');
      setTime(0);
    }
  };

  // Play sound effect
  const playSound = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568.wav');
    audio.volume = 0.3;
    audio.play().catch(e => console.log('Audio play failed:', e));
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {isRunning ? (
        // Timer Running Mode - Minimal Interface
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-12">
          {/* Current Task Display - Larger and Above Timer */}
          <div className="text-6xl font-medium text-center">
            {task}
          </div>

          {/* Timer Display - Smaller than Task */}
          <div className="text-5xl font-mono">
            {formatTime(time)}
          </div>

          {/* End Timer Button */}
          <button
            onClick={handleEnd}
            className="py-4 px-8 bg-red-500 text-white text-xl rounded-lg hover:bg-red-600"
          >
            End Timer
          </button>
        </div>
      ) : (
        // Timer Stopped Mode - Full Interface
        <div>
          {/* Timer Display */}
          <div className="text-center mb-8">
            <div className="text-6xl font-mono mb-4">
              {formatTime(time)}
            </div>
          </div>

          {/* Task Input and Start Button */}
          <div className="space-y-4 mb-8">
            <input
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="Enter your task..."
              className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={handleStart}
              disabled={!task.trim()}
              className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Start Timer
            </button>
          </div>

          {/* Recent Tasks Section */}
          <div className="mt-8">
            <h2 className="text-lg font-medium mb-4">Recent Tasks</h2>
            <div className="space-y-2">
              {recentTasks.map((recentTask, index) => (
                <div key={index} className="p-3 bg-white rounded-lg shadow">
                  <div className="flex justify-between items-center">
                    <span>{recentTask.name}</span>
                    <span className="text-gray-500">{recentTask.duration}</span>
                  </div>
                </div>
              ))}
              {recentTasks.length === 0 && (
                <div className="text-gray-500 text-center py-4">
                  No recent tasks
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Timer;
