import React, { useState, useEffect } from 'react';

function AllTasks() {
  const [tasks, setTasks] = useState([]);
  const [timeFilter, setTimeFilter] = useState('24h');
  const [selectedTasks, setSelectedTasks] = useState(new Set());
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    loadTasks();
  }, [timeFilter, filterType, sortBy]);

  const loadTasks = () => {
    let allTasks = JSON.parse(localStorage.getItem('allTasks') || '[]');
    const now = new Date();
    
    // Time filter
    allTasks = allTasks.filter(task => {
      const taskDate = new Date(task.timestamp);
      const hoursDiff = (now - taskDate) / (1000 * 60 * 60);
      
      switch(timeFilter) {
        case '7d': return hoursDiff <= 168;
        case '30d': return hoursDiff <= 720;
        default: return hoursDiff <= 24;
      }
    });

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

  // ... rest of the functions remain the same ...

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">What you've done</h1>
      </div>

      <div className="mb-6 space-y-4">
        {/* Filters and Sort Row */}
        <div className="flex items-center space-x-4">
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="p-2 border rounded bg-white"
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
          </select>

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
            className="p-2 border rounded bg-white"
          >
            <optgroup label="DATE">
              <option value="newest">Newest to Oldest</option>
              <option value="oldest">Oldest to Newest</option>
            </optgroup>
            <optgroup label="DURATION">
              <option value="shortest">Shortest to Longest</option>
              <option value="longest">Longest to Shortest</option>
            </optgroup>
            <optgroup label="NAME">
              <option value="nameAZ">A to Z</option>
              <option value="nameZA">Z to A</option>
            </optgroup>
          </select>
        </div>

        {/* Rest of the component remains the same ... */}
