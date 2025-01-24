import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function Timer() {
  const [time, setTime] = useState(1500); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [leverage, setLeverage] = useState('High');
  const [showWarning, setShowWarning] = useState(false);
  const intervalRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const startTimer = () => {
    if (!taskName.trim()) {
      setShowWarning(true);
      return;
    }
    setShowWarning(false);
    setIsActive(true);
    intervalRef.current = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(intervalRef.current);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  const pauseTimer = () => {
    clearInterval(intervalRef.current);
    setIsActive(false);
  };

  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setTime(1500);
    setIsActive(false);
    setTaskName('');
    setLeverage('High');
    setShowWarning(false);
  };

  const completeTask = () => {
    const task = {
      id: Date.now(),
      name: taskName,
      leverage: leverage,
      duration: 1500 - time,
      timestamp: new Date().toISOString()
    };

    const existingTasks = JSON.parse(localStorage.getItem('allTasks') || '[]');
    localStorage.setItem('allTasks', JSON.stringify([...existingTasks, task]));

    resetTimer();
    navigate('/all-tasks');
  };

  const formatTime = () => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        What will you do next?
      </h1>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <input
            type="text"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            placeholder="Enter task name"
            className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
            disabled={isActive}
          />
          {showWarning && (
            <p className="text-red-500 text-sm mt-1">Please enter a task name</p>
          )}
        </div>

        <div className="mb-6">
          <select
            value={leverage}
            onChange={(e) => setLeverage(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
            disabled={isActive}
          >
            <option value="High">High Leverage</option>
            <option value="Medium">Medium Leverage</option>
            <option value="Low">Low Leverage</option>
          </select>
        </div>

        <div className="text-6xl text-center mb-6 font-mono">
          {formatTime()}
        </div>

        <div className="flex justify-center space-x-4">
          {!isActive ? (
            <button
              onClick={startTimer}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              Start
            </button>
          ) : (
            <button
              onClick={pauseTimer}
              className="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600"
            >
              Pause
            </button>
          )}
          <button
            onClick={resetTimer}
            className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
          >
            Reset
          </button>
          {time === 0 && (
            <button
              onClick={completeTask}
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
            >
              Complete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Timer;
