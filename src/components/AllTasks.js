import React, { useState, useEffect } from 'react';

function AllTasks() {
  const [tasks, setTasks] = useState([]);
  const [timeFilter, setTimeFilter] = useState('24h');
  const [selectedTasks, setSelectedTasks] = useState(new Set());
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  useEffect(() => {
    loadTasks();
  }, [timeFilter, filterType, sortBy, dateRange]);

  const loadTasks = () => {
    let allTasks = JSON.parse(localStorage.getItem('allTasks') || '[]');
    const now = new Date();
    
    // Time filter
    if (timeFilter === 'custom' && dateRange.start) {
      const startDate = new Date(dateRange.start);
      const endDate = dateRange.end ? new Date(dateRange.end) : new Date();
      allTasks = allTasks.filter(task => {
        const taskDate = new Date(task.timestamp);
        return taskDate >= startDate && taskDate <= endDate;
      });
    } else {
      allTasks = allTasks.filter(task => {
        const taskDate = new Date(task.timestamp);
        const hoursDiff = (now - taskDate) / (1000 * 60 * 60);
        
        switch(timeFilter) {
          case '7d': return hoursDiff <= 168;
          case '30d': return hoursDiff <= 720;
          default: return hoursDiff <= 24;
        }
      });
    }

    // Leverage filter
    if (filterType !== 'all') {
      allTasks = allTasks.filter(task => 
        task.leverage.toLowerCase() === filterType
      );
    }

    // Sort
    allTasks.sort((a, b) => {
      switch(sortBy) {
        case 'oldest':
          return new Date(a.timestamp) - new Date(b.timestamp);
        case 'newest':
          return new Date(b.timestamp) - new Date(a.timestamp);
        case 'shortest':
          return a.duration - b.duration;
        case 'longest':
          return b.duration - a.duration;
        case 'nameAZ':
          return a.name.localeCompare(b.name);
        case 'nameZA':
          return b.name.localeCompare(a.name);
        default:
          return new Date(b.timestamp) - new Date(a.timestamp);
      }
    });

    setTasks(allTasks);
    setSelectedTasks(new Set());
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} min${mins !== 1 ? 's' : ''}`;
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const toggleSelectAll = () => {
    if (selectedTasks.size === tasks.length) {
      setSelectedTasks(new Set());
    } else {
      setSelectedTasks(new Set(tasks.map(task => task.id)));
    }
  };

  const toggleTaskSelection = (taskId) => {
    const newSelected = new Set(selectedTasks);
    if (newSelected.has(taskId)) {
      newSelected.delete(taskId);
    } else {
      newSelected.add(taskId);
    }
    setSelectedTasks(newSelected);
  };

  const deleteSelectedTasks = () => {
    if (window.confirm('Are you sure you want to delete the selected tasks?')) {
      const allTasks = JSON.parse(localStorage.getItem('allTasks') || '[]');
      const updatedTasks = allTasks.filter(task => !selectedTasks.has(task.id));
      localStorage.setItem('allTasks', JSON.stringify(updatedTasks));
      loadTasks();
    }
  };

  const updateTaskLeverage = (taskId, leverage) => {
    const allTasks = JSON.parse(localStorage.getItem('allTasks') || '[]');
    const updatedTasks = allTasks.map(task => 
      task.id === taskId ? { ...task, leverage } : task
    );
    localStorage.setItem('allTasks', JSON.stringify(updatedTasks));
    loadTasks();
  };

  const deleteTask = (taskId) => {
    const allTasks = JSON.parse(localStorage.getItem('allTasks') || '[]');
    const updatedTasks = allTasks.filter(task => task.id !== taskId);
    localStorage.setItem('allTasks', JSON.stringify(updatedTasks));
    loadTasks();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">What you've done</h1>
      </div>

      <div className="mb-6 space-y-4">
        {/* Filters and Sort Row */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <select
              value={timeFilter}
              onChange={(e) => {
                setTimeFilter(e.target.value);
                if (e.target.value !== 'custom') {
                  setDateRange({ start: '', end: '' });
                }
              }}
              className="p-2 border rounded bg-white"
            >
              <option value="24h">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              {dateRange.start && <option value="custom">Custom Range</option>}
            </select>

            <button
              onClick={() => document.getElementById('date-range').showPicker()}
              className="p-2 hover:bg-gray-100 rounded"
            >
              📅
            </button>
            <input
              id="date-range"
              type="date"
              className="hidden"
              value={dateRange.start}
              onChange={(e) => {
                setDateRange({ ...dateRange, start: e.target.value });
                setTimeFilter('custom');
              }}
            />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="p-2 border rounded bg-white"
          >
            <option value="all">All Tasks</option>
            <option value="high">High Leverage</option>
            <option value="medium">Medium Leverage</option>
            <option value="low">Low Leverage</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="p-2 border rounded bg-white min-w-[200px]"
          >
            <option disabled>DATE</option>
            <option value="newest">Newest to Oldest</option>
            <option value="oldest">Oldest to Newest</option>
            <option disabled>DURATION</option>
            <option value="shortest">Shortest to Longest</option>
            <option value="longest">Longest to Shortest</option>
            <option disabled>NAME</option>
            <option value="nameAZ">A to Z</option>
            <option value="nameZA">Z to A</option>
          </select>
        </div>

        {/* Only show Bulk Actions Row if there are tasks */}
        {tasks.length > 0 && (
          <div className="flex items-center space-x-4">
            <input
              type="checkbox"
              checked={selectedTasks.size === tasks.length && tasks.length > 0}
              onChange={toggleSelectAll}
              className="h-4 w-4 text-blue-600"
            />
            <span className="text-gray-600">Select All</span>
            {selectedTasks.size > 0 && (
              <button
                onClick={deleteSelectedTasks}
                className="text-red-500 hover:text-red-700 font-medium"
              >
                Delete Selected ({selectedTasks.size})
              </button>
            )}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow">
        {tasks.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {tasks.map((task) => (
              <li 
                key={task.id} 
                className="p-4 hover:bg-gray-50 flex items-center justify-between"
              >
                <div className="flex items-center flex-1">
                  <input
                    type="checkbox"
                    checked={selectedTasks.has(task.id)}
                    onChange={() => toggleTaskSelection(task.id)}
                    className="h-4 w-4 text-blue-600 mr-4"
                  />
                  <div>
                    <div className="font-medium text-gray-800">{task.name}</div>
                    <div className="text-sm text-gray-500">
                      <span className="mr-4">{formatDuration(task.duration)}</span>
                      <span>{formatTimestamp(task.timestamp)}</span>
                    </div>
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
                    className="text-red-500 hover:text-red-700 font-bold"
                  >
                    ✕
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
