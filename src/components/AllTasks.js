import React, { useState } from 'react';

function AllTasks() {
  const [dateRange, setDateRange] = useState('24h');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tasks, setTasks] = useState([
    {
      name: "Sample Task 1",
      duration: "00:30:00",
      timestamp: new Date().toISOString(),
      leverage: ""
    },
    {
      name: "Sample Task 2",
      duration: "01:15:00",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      leverage: ""
    }
  ]);

  const handleLeverageChange = (index, value) => {
    const updatedTasks = [...tasks];
    updatedTasks[index] = { ...updatedTasks[index], leverage: value };
    setTasks(updatedTasks);
  };

  const handleDateRangeSelect = () => {
    if (startDate && endDate) {
      // Handle custom date range filtering
      setShowDatePicker(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Controls */}
      <div className="flex items-center gap-4 mb-6">
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="p-2 border rounded-lg"
        >
          <option value="24h">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
        </select>

        <button
          onClick={() => setShowDatePicker(!showDatePicker)}
          className="p-2 text-gray-600 hover:text-gray-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>

        {/* Custom Date Range Picker */}
        {showDatePicker && (
          <div className="absolute mt-2 p-4 bg-white rounded-lg shadow-lg border z-10">
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

      {/* Tasks List */}
      <div className="space-y-3">
        {tasks.map((task, index) => (
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
        ))}
      </div>
    </div>
  );
}

export default AllTasks;
