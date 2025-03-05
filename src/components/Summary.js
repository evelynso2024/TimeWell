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
    lowImpactTasks: 0,
    hourlyData: Array(24).fill({ high: 0, medium: 0, low: 0, noRank: 0 })
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

  const processTimePatternData = (tasks) => {
    const hourlyData = Array(24).fill(0).map(() => ({
      high: 0,
      medium: 0,
      low: 0,
      noRank: 0
    }));

    tasks.forEach(task => {
      if (task.start_time) {
        const hour = new Date(task.start_time).getHours();
        const duration = task.duration / 3600; // Convert seconds to hours

        if (task.leverage === 'High') {
          hourlyData[hour].high += duration;
        } else if (task.leverage === 'Medium') {
          hourlyData[hour].medium += duration;
        } else if (task.leverage === 'Low') {
          hourlyData[hour].low += duration;
        } else {
          hourlyData[hour].noRank += duration;
        }
      }
    });

    return hourlyData;
  };

  const fetchSummaryData = async (userId) => {
    try {
      const { data: tasks, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      const hourlyData = processTimePatternData(tasks);

      const summary = {
        totalTasks: tasks.length,
        totalTime: tasks.reduce((acc, task) => acc + (task.duration || 0), 0),
        highImpactTasks: tasks.filter(task => task.leverage === 'High').length,
        mediumImpactTasks: tasks.filter(task => task.leverage === 'Medium').length,
        lowImpactTasks: tasks.filter(task => task.leverage === 'Low').length,
        hourlyData: hourlyData
      };

      setSummaryData(summary);
    } catch (error) {
      console.error("Error fetching summary data:", error);
    }
  };

  // ... existing handleLogout and formatTime functions ...
  // ... continuing from Part 1 ...

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

  // Existing chart data and options
  const barChartData = {
    // ... your existing barChartData ...
  };

  const donutChartData = {
    // ... your existing donutChartData ...
  };

  const barOptions = {
    // ... your existing barOptions ...
  };

  const donutOptions = {
    // ... your existing donutOptions ...
  };

  // New time pattern chart data and options
  const timePatternData = {
    labels: Array.from({ length: 24 }, (_, i) => 
      i === 0 ? '12 AM' : 
      i < 12 ? `${i} AM` : 
      i === 12 ? '12 PM' : 
      `${i - 12} PM`
    ),
    datasets: [
      {
        label: 'High Impact',
        data: summaryData.hourlyData.map(h => h.high),
        backgroundColor: 'rgba(34, 197, 94, 0.6)',
        borderColor: 'rgb(34, 197, 94)',
        borderWidth: 1,
      },
      {
        label: 'Medium Impact',
        data: summaryData.hourlyData.map(h => h.medium),
        backgroundColor: 'rgba(234, 179, 8, 0.6)',
        borderColor: 'rgb(234, 179, 8)',
        borderWidth: 1,
      },
      {
        label: 'Low Impact',
        data: summaryData.hourlyData.map(h => h.low),
        backgroundColor: 'rgba(239, 68, 68, 0.6)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1,
      },
      {
        label: 'No Ranking',
        data: summaryData.hourlyData.map(h => h.noRank),
        backgroundColor: 'rgba(156, 163, 175, 0.6)',
        borderColor: 'rgb(156, 163, 175)',
        borderWidth: 1,
      }
    ]
  };

  const timePatternOptions = {
    responsive: true,
    scales: {
      x: {
        stacked: true,
        title: {
          display: true,
          text: 'Time of Day'
        }
      },
      y: {
        stacked: true,
        title: {
          display: true,
          text: 'Duration (hours)'
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      title: {
        display: true,
        text: 'Task Duration Pattern by Time of Day'
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm mb-6">
        {/* ... your existing navigation code ... */}
      </nav>

      {/* Summary Content */}
      <div className="space-y-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-2 gap-4">
          {/* ... your existing overview cards ... */}
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

        {/* Time Pattern Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <Bar data={timePatternData} options={timePatternOptions} />
        </div>

        {/* Impact Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          {/* ... your existing impact distribution code ... */}
        </div>
      </div>
    </div>
  );
}

export default Summary;
