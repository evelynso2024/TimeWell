import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function Summary() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [summaryData, setSummaryData] = useState({
    totalTasks: 0,
    totalTime: 0,
    highImpactTasks: 0,
    mediumImpactTasks: 0,
    lowImpactTasks: 0
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
        lowImpactTasks: tasks.filter(task => task.leverage === 'Low').length
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

  // Chart data and options
  const barChartData = {
    labels: ['High Impact', 'Medium Impact', 'Low Impact', 'No Ranking'],
    datasets: [{
      data: [
        summaryData.highImpactTasks,
        summaryData.mediumImpactTasks,
        summaryData.lowImpactTasks,
        summaryData.totalTasks - (summaryData.highImpactTasks + summaryData.mediumImpactTasks + summaryData.lowImpactTasks)
      ],
      backgroundColor: [
        'rgba(34, 197, 94, 0.6)',  // green
        'rgba(234, 179, 8, 0.6)',   // yellow
        'rgba(239, 68, 68, 0.6)',   // red
        'rgba(156, 163, 175, 0.6)'  // gray
      ],
      borderColor: [
        'rgb(34, 197, 94)',
        'rgb(234, 179, 8)',
        'rgb(239, 68, 68)',
        'rgb(156, 163, 175)'
      ],
      borderWidth: 1
    }]
  };

  const donutChartData = {
    labels: ['High Impact', 'Medium Impact', 'Low Impact'],
    datasets: [{
      data: [
        summaryData.highImpactTasks,
        summaryData.mediumImpactTasks,
        summaryData.lowImpactTasks
      ],
      backgroundColor: [
        'rgba(34, 197, 94, 0.6)',
        'rgba(234, 179, 8, 0.6)',
        'rgba(239, 68, 68, 0.6)'
      ],
      borderColor: [
        'rgb(34, 197, 94)',
        'rgb(234, 179, 8)',
        'rgb(239, 68, 68)'
      ],
      borderWidth: 1
    }]
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Task Distribution by Impact Level'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  const donutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
      },
      title: {
        display: true,
        text: 'Impact Level Distribution'
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm mb-6">
        {/* ... existing navigation code ... */}
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

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Bar Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <Bar data={barChartData} options={barOptions} />
          </div>

          {/* Donut Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <Doughnut data={donutChartData} options={donutOptions} />
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
      </div>
    </div>
  );
}

export default Summary;
