import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Timer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [task, setTask] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      const newTask = {
        id: Date.now(),
        name: task,
        duration: 25 * 60,
        timestamp: new Date().toISOString(),
        leverage: 'High'
      };
      const existingTasks = JSON.parse(localStorage.getItem('allTasks') || '[]');
      localStorage.setItem('allTasks', JSON.stringify([...existingTasks, newTask]));
      navigate('/all-tasks');
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, task, navigate]);

  const startTimer = () => {
    if (task.trim()) {
      setIsRunning(true);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      startTimer();
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-6xl text-center mb-8 font-mono">
          {formatTime(timeLeft)}
        </div>
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="What are you working on?"
          className="w-full p-2 mb-4 border rounded"
          disabled={isRunning}
        />
        {!isRunning ? (
          <button
            onClick={startTimer}
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Start
          </button>
        ) : (
          <div className="text-center text-gray-600">
            Focus on your task...
          </div>
        )}
      </div>
    </div>
  );
}

export default Timer;
