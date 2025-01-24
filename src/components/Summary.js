import React, { useState, useEffect } from 'react';

function Summary() {
  const [tasks, setTasks] = useState([]);
  const [totalTime, setTotalTime] = useState('00:00:00');
  const [leverageStats, setLeverageStats] = useState({
    high: { count: 0, time: '00:00:00' },
    medium: { count: 0, time: '00:00:00' },
    low: { count: 0, time: '00:00:00' },
    unranked: { count: 0, time: '00:00:00' }
  });

  // Convert HH:MM:SS to seconds
  const timeToSeconds = (timeStr) => {
    const [hours, minutes, seconds] = timeStr.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };

  // Convert seconds to HH:MM:SS
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

    // Calculate total time
    const totalSeconds = allTasks.reduce((acc, task) => {
      return acc + timeToSeconds(task.duration);
    }, 0);
    setTotalTime(secondsToTime(totalSeconds));

    // Calculate leverage statistics
    const stats = {
      high: { count: 0, seconds: 0 },
      medium: { count: 0, seconds: 0 },
      low: { count: 0, seconds: 0 },
      unranked: { count: 0, seconds: 0 }
    };

    allTasks.forEach(task => {
      const category = task.leverage || 'unranked';
      stats[category].count += 1;
      stats[category].seconds += timeToSeconds(task.duration);
    });

    // Convert seconds back to HH:MM:SS for display
    setLeverageStats({
      high: { 
        count: stats.high.count, 
        time: secondsToTime(stats.high.seconds)
      },
      medium: { 
        count: stats.medium.count, 
        time: secondsToTime(stats.medium.seconds)
      },
      low: { 
        count: stats.low.count, 
        time: secondsToTime(stats.low.seconds)
      },
      unranked: { 
        count: stats.unranked.count, 
        time: secondsToTime(stats.unranked.seconds)
      }
    });
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Overall Summary */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Overall Summary</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600">Total Tasks</p>
            <p className="text-3xl font-bold">{tasks.length}</p>
          </div>
          <div>
            <p className="text-gray-600">Total Time</p>
            <p className="text-3xl font-bold font-mono">{totalTime}</p>
          </div>
        </div>
      </div>

      {/* Leverage Breakdown */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Leverage Breakdown</h2>
        <div className="space-y-6">
          {/* High Leverage */}
          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="text-lg font-semibold mb-2">High Leverage</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Tasks</p>
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
                <p className="text-gray-600">Tasks</p>
                <p className="text-2xl font-bold">{leverageStats.medium.count}</p>
              </div>
              <div>
                <p className="text-gray-600">Time</p>
                <p className="text-2xl font-bold font-mono">{leverageStats.medium.time}</p>
              </div>
            </div>
          </div>

          {/* Low Leverage */}
          <div className="border-l-4 border-red-500 pl-4">
            <h3 className="text-lg font-semibold mb-2">Low Leverage</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Tasks</p>
                <p className="text-2xl font-bold">{leverageStats.low.count}</p>
              </div>
              <div>
                <p className="text-gray-600">Time</p>
                <p className="text-2xl font-bold font-mono">{leverageStats.low.time}</p>
              </div>
            </div>
          </div>

          {/* Unranked */}
          <div className="border-l-4 border-gray-300 pl-4">
            <h3 className="text-lg font-semibold mb-2">Unranked</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Tasks</p>
                <p className="text-2xl font-bold">{leverageStats.unranked.count}</p>
              </div>
              <div>
                <p className="text-gray-600">Time</p>
                <p className="text-2xl font-bold font-mono">{leverageStats.unranked.time}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Summary;
