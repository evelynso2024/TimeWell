import React, { useState, useEffect } from 'react';

function Summary() {
  const [tasks, setTasks] = useState([]);
  const [leverageStats, setLeverageStats] = useState({
    high: { count: 0, time: '00:00:00', tasks: [] },
    medium: { count: 0, time: '00:00:00', tasks: [] },
    low: { count: 0, time: '00:00:00', tasks: [] },
    unranked: { count: 0, time: '00:00:00', tasks: [] }
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [modalTitle, setModalTitle] = useState('');

  // Time conversion functions
  const timeToSeconds = (timeStr) => {
    const [hours, minutes, seconds] = timeStr.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };

  const secondsToTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate statistics
  useEffect(() => {
    const allTasks = JSON.parse(localStorage.getItem('allTasks') || '[]');
    setTasks(allTasks);

    // Calculate leverage statistics
    const stats = {
      high: { count: 0, seconds: 0, tasks: [] },
      medium: { count: 0, seconds: 0, tasks: [] },
      low: { count: 0, seconds: 0, tasks: [] },
      unranked: { count: 0, seconds: 0, tasks: [] }
    };

    allTasks.forEach(task => {
      const category = task.leverage || 'unranked';
      stats[category].count += 1;
      stats[category].seconds += timeToSeconds(task.duration);
      stats[category].tasks.push(task);
    });

    // Convert seconds back to HH:MM:SS for display
    setLeverageStats({
      high: { 
        count: stats.high.count, 
        time: secondsToTime(stats.high.seconds),
        tasks: stats.high.tasks
      },
      medium: { 
        count: stats.medium.count, 
        time: secondsToTime(stats.medium.seconds),
        tasks: stats.medium.tasks
      },
      low: { 
        count: stats.low.count, 
        time: secondsToTime(stats.low.seconds),
        tasks: stats.low.tasks
      },
      unranked: { 
        count: stats.unranked.count, 
        time: secondsToTime(stats.unranked.seconds),
        tasks: stats.unranked.tasks
      }
    });
  }, []);

  const handleTasksClick = (category, tasks) => {
    setSelectedTasks(tasks);
    setModalTitle(`${category.charAt(0).toUpperCase() + category.slice(1)} Leverage Tasks`);
    setShowModal(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Leverage Breakdown */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Leverage Breakdown</h2>
        <div className="space-y-6">
          {/* High Leverage */}
          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="text-lg font-semibold mb-2">High Leverage</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <button 
                  onClick={() => handleTasksClick('high', leverageStats.high.tasks)}
                  className="text-gray-600 hover:text-blue-500"
                >
                  Tasks
                </button>
                <p className="text-2xl font-bold">{leverageStats.high.count}</p>
              </div>
              <div>
                <p className="text-gray-600">Time</p>
                <p className="text-2xl font-bold font-mono">{leverageStats.high.time}</p>
              </div>
            </div>
          </div>

          {/* Medium Leverage */}
          <div className="border-l-4 border-yellow-500 pl-4">
            <h3 className="text-lg font-semibold mb-2">Medium Leverage</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <button 
                  onClick={() => handleTasksClick('medium', leverageStats.medium.tasks)}
                  className="text-gray-600 hover:text-blue-500"
                >
                  Tasks
                </button>
                <p className="text-2xl font-bold">{leverageStats.medium.count}</p>
              </div>
              <div>
                <p className="text-gray-600">Time</p>
                <p className="text-2xl font-bold font-mono">{leverageStats.medium.time}</p>
              </div>
            </div>
          </div>
