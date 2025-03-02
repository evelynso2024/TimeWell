import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function Timer() {
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [task, setTask] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [recentTasks, setRecentTasks] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Authentication check
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
      } else {
        setUser(user);
        fetchRecentTasks(user.id);
      }
    };
    getUser();
  }, [navigate]);

  // Fetch recent tasks from Supabase
  const fetchRecentTasks = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setRecentTasks(data || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const playClickSound = () => {
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    
    oscillator.connect(gain);
    gain.connect(context.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.value = 400;
    gain.gain.value = 0.4;
    
    oscillator.start(context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 0.06);
    oscillator.stop(context.currentTime + 0.06);
  };

  useEffect(() => {
    let intervalId;
    if (isTimerActive && startTime) {
      intervalId = setInterval(() => {
        const currentElapsed = Math.floor((Date.now() - startTime) / 1000);
        setElapsedTime(currentElapsed);
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [isTimerActive, startTime]);

  const startTimer = () => {
    if (task.trim()) {
      playClickSound();
      const now = Date.now();
      setStartTime(now);
      setIsTimerActive(true);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && task.trim()) {
      startTimer();
    }
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

  const endTimer = async () => {
    playClickSound();
    setIsTimerActive(false);
    
    const endTime = new Date().toISOString();
    const newTask = {
      task_name: task,
      duration: elapsedTime,
      start_time: startTime ? new Date(startTime).toISOString() : null,
      end_time: endTime,
      leverage: '',
      user_id: user.id,
      created_at: new Date().toISOString()
    };

    try {
      const { error } = await supabase
        .from('tasks')
        .insert([newTask]);

      if (error) throw error;
      
      setTask('');
      setElapsedTime(0);
      setStartTime(null);
      fetchRecentTasks(user.id);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const updateTaskLeverage = async (taskId, leverage) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ leverage })
        .eq('id', taskId);

      if (error) throw error;
      fetchRecentTasks(user.id);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;
      fetchRecentTasks(user.id);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDateTime = (isoString) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

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
        <button
          onClick={handleLogout}
          className="bg-white text-black px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
        >
          Logout
        </button>
      </div>

      {/* Timer Content */}
      {!isTimerActive ? (
        <>
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <input
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="What are you working on?"
              className="w-full p-4 text-xl border rounded mb-4"
              autoFocus
            />
            <button
              onClick={startTimer}
              disabled={!task.trim()}
              className={`w-full p-4 rounded text-white text-xl
                ${task.trim() ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300'}`}
            >
              Start Timer
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Tasks</h2>
            <div className="space-y-4">
              <ul className="space-y-3">
                {recentTasks.map((task) => (
                  <li 
                    key={task.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded"
                  >
                    <div>
                      <div className="font-medium">{task.task_name}</div>
                      <div className="text-sm text-gray-500">
                        {formatTime(task.duration)} • {formatDateTime(task.start_time)} - {formatDateTime(task.end_time)}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <select
                        value={task.leverage || ''}
                        onChange={(e) => updateTaskLeverage(task.id, e.target.value)}
                        className="p-2 border rounded text-sm bg-white"
                      >
                        <option value="">Rank</option>
                        <option value="High">High impact</option>
                        <option value="Medium">Medium impact</option>
                        <option value="Low">Low impact</option>
                      </select>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-red-500 hover:text-red-700 font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
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
