import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function Summary() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [summaryData, setSummaryData] = useState({
    totalTasks: 0,
    totalTime: 0,
    highImpactTasks: 0,
    mediumImpactTasks: 0,
    lowImpactTasks: 0,
    recentTasks: []
  });

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
      } else {
        setUser(user);
        fetchSummaryData(user.id);
      }
    };
    getUser();
  }, [navigate]);

  const fetchSummaryData = async (userId) => {
    try {
      const { data: tasks, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      const summary = {
        totalTasks: tasks.length,
        totalTime: tasks.reduce((acc, task) => acc + (task.duration || 0), 0),
        highImpactTasks: tasks.filter(task => task.leverage === 'High').length,
        mediumImpactTasks: tasks.filter(task => task.leverage === 'Medium').length,
        lowImpactTasks: tasks.filter(task => task.leverage === 'Low').length,
        recentTasks: tasks.slice(0, 5) // Get 5 most recent tasks
      };

      setSummaryData(summary);
    } catch (error) {
      console.error("Error fetching summary data:", error);
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

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
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
                className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium"
              >
                All Tasks
              </button>
              <button
                onClick={() => navigate('/summary')}
                className="text-blue-600 hover:text-blue-700 px-3 py-2 text-sm font-medium"
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

      {/* Summary Content */}
      <div className="space-y-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Total Time Tracked</h3>
            <p className="text-3xl font-bold text-blue-600">{formatTime(summaryData.totalTime)}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2">Total Tasks</h3>
            <p className="text-3xl font-bold text-blue-600">{summaryData.totalTasks}</p>
          </div>
        </div>

        {/* Impact Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Task Impact Distribution</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span>High Impact</span>
                <span>{summaryData.highImpactTasks} tasks</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${(summaryData.highImpactTasks / summaryData.totalTasks * 100) || 0}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span>Medium Impact</span>
                <span>{summaryData.mediumImpactTasks} tasks</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-yellow-500 h-2 rounded-full" 
                  style={{ width: `${(summaryData.mediumImpactTasks / summaryData.totalTasks * 100) || 0}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span>Low Impact</span>
                <span>{summaryData.lowImpactTasks} tasks</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full" 
                  style={{ width: `${(summaryData.lowImpactTasks / summaryData.totalTasks * 100) || 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Tasks</h3>
          <div className="space-y-3">
            {summaryData.recentTasks.map((task, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <div className="font-medium">{task.task_name}</div>
                  <div className="text-sm text-gray-500">{formatTime(task.duration)}</div>
                </div>
                <div className={`px-3 py-1 rounded text-sm ${
                  task.leverage === 'High' ? 'bg-green-100 text-green-800' :
                  task.leverage === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {task.leverage || 'Unrated'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Summary;
