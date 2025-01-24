import React, { useState, useEffect, useCallback } from 'react';

function Timer() {
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [task, setTask] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [recentTasks, setRecentTasks] = useState([]);

  const playButtonSound = useCallback(() => {
    const audio = new Audio('https://www.soundjay.com/button/button-09.mp3');
    audio.play().catch(e => console.log('Audio play failed:', e));
  }, []);

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
    
    playButtonSound();
    setIsTimerActive(true);
    setStartTime(Date.now());
  };

  const endTimer = () => {
    playButtonSound();
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
