import React, { useState, useEffect } from 'react';

function Timer({ setIsTimerActive }) {
  const [isTimerActive, setIsTimerLocalActive] = useState(false);
  const [task, setTask] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [recentTasks, setRecentTasks] = useState([]);

  const playClickSound = () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
  };

  useEffect(() => {
    const allTasks = JSON.parse(localStorage.getItem('allTasks') || '[]');
    setRecentTasks(allTasks.slice(-5).reverse());
  }, []);

  useEffect(() => {
    const storedTimerState = localStorage.getItem('isTimerActive') === 'true';
    setIsTimerLocalActive(storedTimerState);
    setIsTimerActive(storedTimerState);
  }, [setIsTimerActive]);

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
      setIsTimerLocalActive(true);
      setIsTimerActive(true);
      localStorage.setItem('isTimerActive', 'true');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && task.trim()) {
      startTimer();
    }
  };

  const endTimer = () => {
    playClickSound();
    setIsTimerLocalActive(false);
    setIsTimerActive(false);
    localStorage.setItem('isTimerActive', 'false');
    
    const endTime = new Date().toISOString();
    const newTask = {
      id: Date.now(),
      name: task,
      duration: elapsedTime,
      startTime: startTime ? new Date(startTime).toISOString() : null,
      endTime: endTime,
      leverage: ''
    };

    const existingTasks = JSON.parse(localStorage.getItem('allTasks') || '[]');
    localStorage.setItem('allTasks', JSON.stringify([...existingTasks, newTask]));
    
    setTask('');
    setElapsedTime(0);
    setStartTime(null);
    setRecentTasks([newTask, ...recentTasks.slice(0, 4)]);
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDateTime = (isoString) => {
    if (!isoString) return ''; // Handle missing timestamps for old records
    return new Date(isoString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const updateTaskLeverage = (taskId, leverage) => {
    const allTasks = JSON.parse(localStorage.getItem('allTasks') || '[]');
    const updatedTasks = allTasks.map(task => 
      task.id === taskId ? { ...task, leverage } : task
    );
    localStorage.setItem('allTasks', JSON.stringify(updatedTasks));
    setRecentTasks(updatedTasks.slice(-5).reverse());
  };

  const deleteTask = (taskId) => {
    // Remove from localStorage
    const allTasks = JSON.parse(localStorage.getItem('allTasks') || '[]');
    const updatedTasks = allTasks.filter(task => task.id !== taskId);
    localStorage.setItem('allTasks', JSON.stringify(updatedTasks));
    
    // Update recent tasks
    setRecentTasks(updatedTasks.slice(-5).reverse());
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
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
                      <div className="font-medium">{task.name}</div>
                      <div className="text-sm text-gray-500">
                        {formatTime(task.duration)} • {formatDateTime(task.startTime)} - {formatDateTime(task.endTime)}
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
