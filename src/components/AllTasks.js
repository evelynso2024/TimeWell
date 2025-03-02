import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function AllTasks() {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
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

  // Fetch all tasks
  const fetchTasks = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

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

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Navigation Bar */}
      <div className="mb-6 flex justify-between items-center">
        <div className="flex space-x-4">
          <button
            onClick={() => navigate('/timer')}
            className="bg-white text-black px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
          >
            Timer
          </button>
          <button
            onClick={() => navigate('/alltasks')}
            className="bg-white text-black px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
          >
            All Tasks
          </button>
          <button
            onClick={() => navigate('/summary')}
            className="bg-white text-black px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
          >
            Summary
          </button>
          <button
            onClick={() => navigate('/insights')}
            className="bg-white text-black px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
          >
            Insights
          </button>
        </div>
        <button
          onClick={handleLogout}
          className="bg-white text-black px-4 py-2 rounded border border-gray-300 hover:bg-gray-100"
        >
          Logout
        </button>
      </div>

      {/* All Tasks Content */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">All Tasks</h2>
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
                    {formatTime(task.duration)} • {formatDateTime(task.start_time)} - {formatDateTime(task.end_time)}
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
