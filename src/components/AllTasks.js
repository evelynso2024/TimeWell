import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

function AllTasks() {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [showAddTask, setShowAddTask] = useState(false);
  const [timeFilter, setTimeFilter] = useState('24h');
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [newTask, setNewTask] = useState({
    task_name: '',
    date: '',
    start_time: '',
    hours: '',
    minutes: ''
  });
  const navigate = useNavigate();

  // Authentication check
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
      } else {
        setUser(user);
        fetchTasks(user.id);
      }
    };
    getUser();
  }, [navigate]);

  // Fetch tasks with filters
  const fetchTasks = async (userId) => {
    try {
      let query = supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      // Apply time filter
      const now = new Date();
      if (dateRange[0] && dateRange[1]) {
        // Date range filter
        query = query
          .gte('start_time', dateRange[0].toISOString())
          .lte('start_time', dateRange[1].toISOString());
      } else {
        // Time period filter
        switch (timeFilter) {
          case '24h':
            const last24h = new Date(now - 24 * 60 * 60 * 1000);
            query = query.gte('start_time', last24h.toISOString());
            break;
          case '7d':
            const last7d = new Date(now - 7 * 24 * 60 * 60 * 1000);
            query = query.gte('start_time', last7d.toISOString());
            break;
          case '1m':
            const lastMonth = new Date(now);
            lastMonth.setMonth(lastMonth.getMonth() - 1);
            query = query.gte('start_time', lastMonth.toISOString());
            break;
          default:
            break;
        }
      }

      const { data, error } = await query;
      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/login');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const updateTaskLeverage = async (taskId, leverage) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ leverage })
        .eq('id', taskId);

      if (error) throw error;
      fetchTasks(user.id);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;
      fetchTasks(user.id);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const durationInSeconds = (parseInt(newTask.hours) * 3600) + (parseInt(newTask.minutes) * 60);
      const startDateTime = new Date(newTask.date + 'T' + newTask.start_time);
      
      const { error } = await supabase
        .from('tasks')
        .insert([{
          task_name: newTask.task_name,
          start_time: startDateTime.toISOString(),
          duration: durationInSeconds,
          user_id: user.id,
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;

      setNewTask({
        task_name: '',
        date: '',
        start_time: '',
        hours: '',
        minutes: ''
      });
      setShowAddTask(false);
      fetchTasks(user.id);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDateTime = (isoString) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Handle filter changes
  const handleTimeFilterChange = (value) => {
    setTimeFilter(value);
    setDateRange([null, null]); // Reset date range when changing time filter
    setTimeout(() => fetchTasks(user.id), 0);
  };

  const handleDateRangeChange = (update) => {
    setDateRange(update);
    if (update[0] && update[1]) {
      setTimeFilter('custom'); // Reset time filter when using date range
      setTimeout(() => fetchTasks(user.id), 0);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm mb-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            {/* Left side - Logo */}
            <div className="flex items-center">
              <div 
                onClick={() => navigate('/')}
                className="text-xl font-bold text-blue-600 cursor-pointer"
              >
                TimeWell
              </div>
            </div>

            {/* Middle - Navigation Links */}
            <div className="flex items-center justify-center flex-1 px-2 space-x-8">
              <button
                onClick={() => navigate('/timer')}
                className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium"
              >
                Timer
              </button>
              <button
                onClick={() => navigate('/alltasks')}
                className="text-blue-600 hover:text-blue-700 px-3 py-2 text-sm font-medium"
              >
                All Tasks
              </button>
              <button
                onClick={() => navigate('/summary')}
                className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium"
              >
                Summary
              </button>
              <button
                onClick={() => navigate('/insights')}
                className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium"
              >
                Insights
              </button>
            </div>

            {/* Right side - Logout */}
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* All Tasks Content */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">All Tasks</h2>
          <button
            onClick={() => setShowAddTask(!showAddTask)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {showAddTask ? 'Cancel' : 'Add Task'}
          </button>
        </div>

        {/* Filters Section */}
        <div className="flex items-center space-x-4 mb-6">
          <select
            value={timeFilter}
            onChange={(e) => handleTimeFilterChange(e.target.value)}
            className="p-2 border rounded text-sm bg-white"
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="1m">Last month</option>
            {timeFilter === 'custom' && <option value="custom">Custom Range</option>}
          </select>

          <div className="relative flex items-center">
            <DatePicker
              selectsRange={true}
              startDate={startDate}
              endDate={endDate}
              onChange={handleDateRangeChange}
              className="p-2 border rounded text-sm bg-white pr-8"
              placeholderText="Select date range"
              isClearable={true}
            />
            <svg 
              className="w-5 h-5 absolute right-2 pointer-events-none text-gray-400"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
              />
            </svg>
          </div>
        </div>

        {/* Manual Task Entry Form */}
        {showAddTask && (
          <form onSubmit={handleAddTask} className="mb-6 p-4 bg-gray-50 rounded">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Task Name
                </label>
                <input
                  type="text"
                  required
                  value={newTask.task_name}
                  onChange={(e) => setNewTask({...newTask, task_name: e.target.value})}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  required
                  value={newTask.date}
                  onChange={(e) => setNewTask({...newTask, date: e.target.value})}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  required
                  value={newTask.start_time}
                  onChange={(e) => setNewTask({...newTask, start_time: e.target.value})}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hours
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    max="23"
                    value={newTask.hours}
                    onChange={(e) => setNewTask({...newTask, hours: e.target.value})}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minutes
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    max="59"
                    value={newTask.minutes}
                    onChange={(e) => setNewTask({...newTask, minutes: e.target.value})}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Save Task
              </button>
            </div>
          </form>
        )}

        {/* Tasks List */}
        <div className="space-y-4">
          <ul className="space-y-3">
            {tasks.map((task) => (
              <li 
                key={task.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded"
              >
                <div>
                  <div className="font-medium">{task.task_name}</div>
                  <div className="text-sm text-gray-500">
                    {formatDate(task.start_time)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatTime(task.duration)} • {formatDateTime(task.start_time)}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <select
                    value={task.leverage || ''}
                    onChange={(e) => updateTaskLeverage(task.id, e.target.value)}
                    className="p-2 border rounded text-sm bg-white"
                  >
                    <option value="">Rank</option>
                    <option value="High">High impact</option>
                    <option value="Medium">Medium impact</option>
                    <option value="Low">Low impact</option>
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
        </div>
      </div>
    </div>
  );
}

export default AllTasks;
