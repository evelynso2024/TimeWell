import React, { useState, useEffect } from 'react';

function Timer() {
  const [isTimerActive, setIsTimerActive] = useState(false);
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
    let intervalId;
    if (isTimerActive) {
      intervalId = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [isTimerActive, startTime]);

  const startTimer = (e) => {
    e.preventDefault();
    if (!task.trim()) return;
    
    playClickSound();
    setIsTimerActive(true);
    setStartTime(Date.now());
  };

  const endTimer = () => {
    playClickSound();
    setIsTimerActive(false);
    
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

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} min${mins !== 1 ? 's' : ''}`;
  };

  const updateTaskLeverage = (taskId, leverage) => {
    const allTasks = JSON.parse(localStorage.getItem('allTasks') || '[]');
    const updatedAllTasks = allTasks.map(task => 
      task.id === taskId ? { ...task, leverage } : task
    );
    localStorage.setItem('allTasks', JSON.stringify(updatedAllTasks));

    setRecentTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, leverage } : task
      )
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {!isTimerActive ? (
        <>
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
            What will you do next?
          </h1>

          <div className="bg-white rounded-lg shadow p-6">
            <form onSubmit={startTimer} className="mb-6">
              <div className="flex justify-center mb-4">
                <input
                  type="text"
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  placeholder="Enter task name"
                  className="w-4/5 p-2 border rounded focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  disabled={!task.trim()}
                  className={`w-1/3 px-8 py-3 rounded ${
                    task.trim() 
                      ? 'bg-blue-500 text-white hover:bg-blue-600' 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Start Timer
                </button>
              </div>
            </form>

            <div className="mt-8">
              <h2 className="text-lg font-semibold mb-4">Recent tasks</h2>
              <ul className="space-y-3">
                {recentTasks.map((task) => (
                  <li 
                    key={task.id} 
                    className="flex items-center justify-between p-3 bg-gray-50 rounded"
                  >
                    <div className="flex-1">
                      <span className="text-gray-800">{task.name}</span>
                      <span className="text-gray-500 text-sm ml-2">
                        {formatDuration(task.duration)}
                      </span>
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
