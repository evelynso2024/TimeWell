import React, { useState, useEffect } from 'react';

function Timer({ setIsTimerActive }) {
  const [isTimerActive, setIsTimerLocalActive] = useState(false);
  const [task, setTask] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [recentTasks, setRecentTasks] = useState([]);

  // Create audio context on first interaction
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
    gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 0.1);
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
    if (isTimerActive) {
      intervalId = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [isTimerActive, startTime]);

  const startTimer = () => {
    if (task.trim()) {
      playClickSound();
      setIsTimerLocalActive(true);
      setIsTimerActive(true);
      setStartTime(Date.now());
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
    
    const newTask = {
      id: Date.now(),
      name: task,
      duration: elapsedTime,
      timestamp: new Date().toISOString(),
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
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const updateTaskLeverage = (taskId, leverage) => {
    const allTasks = JSON.parse(localStorage.getItem('allTasks') || '[]');
    const updatedTasks = allTasks.map(task => 
      task.id === taskId ? { ...task, leverage } : task
    );
    localStorage.setItem('allTasks', JSON.stringify(updatedTasks));
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
                        {formatTime(task.duration)}
                      </div>
                    </div>
                    <select
                      value={task.leverage || ''}
                      onChange={(e) => updateTaskLeverage(task.id, e.target.value)}
                      className="ml-4 p-2 border rounded text-sm bg-white"
                    >
                      <option value="">Rank</option>
                      <option value="High">High leverage</option>
                      <option value="Medium">Medium leverage</option>
                      <option value="Low">Low leverage</option>
                    </select>
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
