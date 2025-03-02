import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Summary() {
  const [user, setUser] = useState(null);
  const [summaryData, setSummaryData] = useState({
    totalTime: 0,
    highImpact: 0,
    mediumImpact: 0,
    lowImpact: 0,
    taskCounts: {
      high: 0,
      medium: 0,
      low: 0,
      unranked: 0
    },
    timeDistribution: {}
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
        fetchSummaryData(user.id);
      }
    };
    getUser();
  }, [navigate]);

  const fetchSummaryData = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      // Calculate summary statistics
      const summary = data.reduce((acc, task) => {
        // Add to total time
        acc.totalTime += task.duration || 0;

        // Count tasks by impact level
        switch (task.leverage) {
          case 'High':
            acc.highImpact += task.duration || 0;
            acc.taskCounts.high += 1;
            break;
          case 'Medium':
            acc.mediumImpact += task.duration || 0;
            acc.taskCounts.medium += 1;
            break;
          case 'Low':
            acc.lowImpact += task.duration || 0;
            acc.taskCounts.low += 1;
            break;
          default:
            acc.taskCounts.unranked += 1;
        }

        // Add to time distribution
        if (task.start_time) {
          const hour = new Date(task.start_time).getHours();
          acc.timeDistribution[hour] = (acc.timeDistribution[hour] || 0) + 1;
        }

        return acc;
      }, {
        totalTime: 0,
        highImpact: 0,
        mediumImpact: 0,
        lowImpact: 0,
        taskCounts: { high: 0, medium: 0, low: 0, unranked: 0 },
        timeDistribution: {}
      });

      setSummaryData(summary);
    } catch (error) {
      console.error("Error fetching summary data:", error);
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
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

  // Chart Data
  const barChartData = {
    labels: ['High Impact', 'Medium Impact', 'Low Impact'],
    datasets: [{
      label: 'Number of Tasks',
      data: [
        summaryData.taskCounts.high,
        summaryData.taskCounts.medium,
        summaryData.taskCounts.low
      ],
      backgroundColor: ['#4CAF50', '#FFA726', '#EF5350']
    }]
  };

  const doughnutChartData = {
    labels: ['High Impact', 'Medium Impact', 'Low Impact'],
    datasets: [{
      data: [
        summaryData.taskCounts.high,
        summaryData.taskCounts.medium,
        summaryData.taskCounts.low
      ],
      backgroundColor: ['#4CAF50', '#FFA726', '#EF5350']
    }]
  };

  const timeChartData = {
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    datasets: [{
      label: 'Tasks by Hour',
      data: Array.from({ length: 24 }, (_, i) => summaryData.timeDistribution[i] || 0),
      borderColor: '#2196F3',
      tension: 0.1
    }]
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
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

      {/* Summary Content */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6">Summary</h2>

        {/* Total Time */}
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-2">Total Time Tracked</h3>
          <p className="text-3xl font-bold text-blue-600">{formatTime(summaryData.totalTime)}</p>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Bar Chart */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">Task Count by Impact</h3>
            <Bar data={barChartData} options={{ maintainAspectRatio: false }} height={300} />
          </div>

          {/* Doughnut Chart */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">Impact Distribution</h3>
            <Doughnut data={doughnutChartData} options={{ maintainAspectRatio: false }} height={300} />
          </div>
        </div>

        {/* Time Distribution Chart */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h3 className="text-lg font-medium mb-4">Task Timing Distribution</h3>
          <Line data={timeChartData} options={{ maintainAspectRatio: false }} height={200} />
        </div>

        {/* Impact Breakdown */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium mb-2">Time by Impact Level</h3>
          
          {/* High Impact */}
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
            <div>
              <div className="font-medium">High Impact</div>
              <div className="text-sm text-gray-500">{summaryData.taskCounts.high} tasks</div>
            </div>
            <div className="font-bold">{formatTime(summaryData.highImpact)}</div>
          </div>

          {/* Medium Impact */}
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
            <div>
              <div className="font-medium">Medium Impact</div>
              <div className="text-sm text-gray-500">{summaryData.taskCounts.medium} tasks</div>
            </div>
            <div className="font-bold">{formatTime(summaryData.mediumImpact)}</div>
          </div>

          {/* Low Impact */}
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
            <div>
              <div className="font-medium">Low Impact</div>
              <div className="text-sm text-gray-500">{summaryData.taskCounts.low} tasks</div>
            </div>
            <div className="font-bold">{formatTime(summaryData.lowImpact)}</div>
          </div>

          {/* Unranked */}
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
            <div>
              <div className="font-medium">Unranked</div>
              <div className="text-sm text-gray-500">{summaryData.taskCounts.unranked} tasks</div>
            </div>
            <div className="font-bold">-</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Summary;
