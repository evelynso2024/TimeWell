import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function Timer() {
  const [taskName, setTaskName] = useState('');
  const [duration, setDuration] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
      } else {
        setUser(user);
      }
    };
    getUser();
  }, [navigate]);

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const startTimer = () => {
    if (duration && duration > 0) {
      setTimeLeft(duration * 60);
      setIsRunning(true);
    }
  };

  const stopTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(0);
  };

  const addTask = async () => {
    try {
      const { error } = await supabase
        .from('tasks')
        .insert([
          {
            task_name: taskName,
            duration: duration,
            user_id: user.id,
            created_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;
      
      setTaskName('');
      setDuration('');
      startTimer();
    } catch (error) {
      console.error("Error adding task: ", error);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/login');
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Timer</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Task Name</label>
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter task name"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Duration (minutes)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter duration in minutes"
            />
          </div>
          <button
            onClick={addTask}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Start Task
          </button>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-6xl font-bold text-center mb-4">
            {formatTime(timeLeft)}
          </div>
          <div className="flex justify-center space-x-4">
            {!isRunning ? (
              <button
                onClick={startTimer}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                disabled={!timeLeft}
              >
                Start
              </button>
            ) : (
              <button
                onClick={stopTimer}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              >
                Pause
              </button>
            )}
            <button
              onClick={resetTimer}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Timer;
