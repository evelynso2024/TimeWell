import React, { useState } from 'react';

function AllTasks() {
  const [dateRange, setDateRange] = useState('24h');
  const [tasks, setTasks] = useState([
    {
      name: "Sample Task 1",
      duration: "00:30:00",
      timestamp: new Date().toISOString(),
      leverage: "medium"
    },
    {
      name: "Sample Task 2",
      duration: "01:15:00",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      leverage: "high"
    }
  ]);

  const handleLeverageChange = (index, value) => {
    const updatedTasks = [...tasks];
    updatedTasks[index] = { ...updatedTasks[index], leverage: value };
    setTasks(updatedTasks);
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Task Name,Duration,Time,Leverage\n"
      + tasks.map(task => 
          `${task.name},${task.duration},${new Date(task.timestamp).toLocaleString()},${task.leverage}`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "tasks.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Controls */}
      <div className="flex justify-between items-center mb-6">
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
          onClick={handleExport}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Export CSV
        </button>
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
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
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
