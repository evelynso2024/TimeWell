import React, { useState, useEffect } from 'react';

function AllTasks() {
  const [tasks, setTasks] = useState([]);
  const [timeFilter, setTimeFilter] = useState('24h'); // Default to 24 hours

  useEffect(() => {
    loadTasks();
  }, [timeFilter]);

  const loadTasks = () => {
    const allTasks = JSON.parse(localStorage.getItem('allTasks') || '[]');
    const now = new Date();
    
    const filteredTasks = allTasks.filter(task => {
      const taskDate = new Date(task.timestamp);
      const hoursDiff = (now - taskDate) / (1000 * 60 * 60);
      
      switch(timeFilter) {
        case '7d':
          return hoursDiff <= 168; // 7 days
        case '30d':
          return hoursDiff <= 720; // 30 days
        default: // 24h
          return hoursDiff <= 24;
      }
    });

    setTasks(filteredTasks.reverse()); // Most recent first
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} min${mins !== 1 ? 's' : ''}`;
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const updateTaskLeverage = (taskId, leverage) => {
    const allTasks = JSON.parse(localStorage.getItem('allTasks') || '[]');
    const updatedTasks = allTasks.map(task => 
      task.id === taskId ? { ...task, leverage } : task
    );
    localStorage.setItem('allTasks', JSON.stringify(updatedTasks));
    loadTasks(); // Reload tasks to show update
  };

  const deleteTask = (taskId) => {
    const allTasks = JSON.parse(localStorage.getItem('allTasks') || '[]');
    const updatedTasks = allTasks.filter(task => task.id !== taskId);
    localStorage.setItem('allTasks', JSON.stringify(updatedTasks));
    loadTasks(); // Reload tasks to show update
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">All Tasks</h1>
        <select
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value)}
          className="p-2 border rounded bg-white"
        >
          <option value="24h">Last 24 hours</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow">
        {tasks.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {tasks.map((task) => (
              <li 
                key={task.id} 
                className="p-4 hover:bg-gray-50 flex items-center justify-between"
              >
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{task.name}</div>
                  <div className="text-sm text-gray-500">
                    <span className="mr-4">{formatDuration(task.duration)}</span>
                    <span>{formatTimestamp(task.timestamp)}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <select
                    value={task.leverage || ''}
                    onChange={(e) => updateTaskLeverage(task.id, e.target.value)}
                    className="p-2 border rounded text-sm bg-white"
                  >
                    <option value="">Rank</option>
                    <option value="High">High leverage</option>
                    <option value="Medium">Medium leverage</option>
                    <option value="Low">Low leverage</option>
                  </select>
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-4 text-center text-gray-500">
            No tasks found for the selected time period
          </div>
        )}
      </div>
    </div>
  );
}

export default AllTasks;
