import React, { useState, useRef, useEffect } from 'react';

function AllTasks() {
  const [dateRange, setDateRange] = useState('24h');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const datePickerRef = useRef(null);
  const [allTasks, setAllTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [leverageFilter, setLeverageFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date-newest');

  // Convert duration string (HH:MM:SS) to seconds for sorting
  const durationToSeconds = (duration) => {
    const [hours, minutes, seconds] = duration.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };

  // Load all tasks on component mount
  useEffect(() => {
    const tasks = JSON.parse(localStorage.getItem('allTasks') || '[]');
    setAllTasks(tasks);
    setFilteredTasks(tasks);
  }, []);

  // Handle clicking outside of date picker
  useEffect(() => {
    function handleClickOutside(event) {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setShowDatePicker(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [datePickerRef]);

  // Filter and sort tasks based on all criteria
  useEffect(() => {
    let filtered = [...allTasks];

    // Date filter
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59);
      filtered = filtered.filter(task => {
        const taskDate = new Date(task.timestamp);
        return taskDate >= start && taskDate <= end;
      });
    } else {
      const now = new Date();
      const hours = {
        '24h': 24,
        '7d': 24 * 7,
        '30d': 24 * 30
      }[dateRange] || 24;

      const cutoff = new Date(now - hours * 60 * 60 * 1000);
      filtered = filtered.filter(task => new Date(task.timestamp) >= cutoff);
    }

    // Search term filter
    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Leverage filter
    if (leverageFilter !== 'all') {
      filtered = filtered.filter(task => task.leverage === leverageFilter);
    }

    // Sort tasks
    switch (sortBy) {
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'date-newest':
        filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        break;
      case 'date-oldest':
        filtered.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        break;
      case 'duration-longest':
        filtered.sort((a, b) => durationToSeconds(b.duration) - durationToSeconds(a.duration));
        break;
      case 'duration-shortest':
        filtered.sort((a, b) => durationToSeconds(a.duration) - durationToSeconds(b.duration));
        break;
      default:
        break;
    }

    setFilteredTasks(filtered);
  }, [allTasks, dateRange, startDate, endDate, searchTerm, leverageFilter, sortBy]);

  const handleLeverageChange = (index, value) => {
    const taskToUpdate = filteredTasks[index];
    const allTasksIndex = allTasks.findIndex(t => t.timestamp === taskToUpdate.timestamp);
    
    const updatedAllTasks = [...allTasks];
    updatedAllTasks[allTasksIndex] = { ...taskToUpdate, leverage: value };
    setAllTasks(updatedAllTasks);
    
    localStorage.setItem('allTasks', JSON.stringify(updatedAllTasks));
  };

  const handleDateRangeSelect = () => {
    if (startDate && endDate) {
      setDateRange('custom');
      setShowDatePicker(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Controls */}
      <div className="space-y-4 mb-6">
        {/* First Row: Date Controls */}
        <div className="flex items-center gap-4">
          <select
            value={dateRange}
            onChange={(e) => {
              setDateRange(e.target.value);
              setStartDate('');
              setEndDate('');
            }}
            className="p-2 border rounded-lg"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            {startDate && endDate && <option value="custom">Custom Range</option>}
          </select>

          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="p-2 text-gray-600 hover:text-gray-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>

          {showDatePicker && (
            <div ref={datePickerRef} className="absolute mt-2 p-4 bg-white rounded-lg shadow-lg border z-10">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">From</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="p-2 border rounded-lg w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">To</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="p-2 border rounded-lg w-full"
                  />
                </div>
                <button
                  onClick={handleDateRangeSelect}
                  className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Second Row: Search, Leverage Filter, and Sort */}
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 p-2 border rounded-lg"
          />
          <select
            value={leverageFilter}
            onChange={(e) => setLeverageFilter(e.target.value)}
            className="p-2 border rounded-lg"
          >
            <option value="all">All Rankings</option>
            <option value="high">High Leverage</option>
            <option value="medium">Medium Leverage</option>
            <option value="low">Low Leverage</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="p-2 border rounded-lg min-w-[160px]"
          >
            <optgroup label="Task Name">
              <option value="name-asc">Name (A to Z)</option>
              <option value="name-desc">Name (Z to A)</option>
            </optgroup>
            <optgroup label="Date">
              <option value="date-newest">Newest First</option>
              <option value="date-oldest">Oldest First</option>
            </optgroup>
            <optgroup label="Duration">
              <option value="duration-longest">Longest First</option>
              <option value="duration-shortest">Shortest First</option>
            </optgroup>
          </select>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            No tasks found
          </div>
        ) : (
          filteredTasks.map((task, index) => (
            <div key={index} className="p-4 bg-white rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-medium">{task.name}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(task.timestamp).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="font-mono">{task.duration}</span>
                  <select
                    value={task.leverage}
                    onChange={(e) => handleLeverageChange(index, e.target.value)}
                    className="p-2 border rounded-lg bg-gray-50"
                  >
                    <option value="">Rank</option>
                    <option value="high">High Leverage</option>
                    <option value="medium">Medium Leverage</option>
                    <option value="low">Low Leverage</option>
                  </select>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AllTasks;
