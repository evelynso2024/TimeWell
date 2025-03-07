import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
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
import { Bar, Doughnut } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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
  const [timeFilter, setTimeFilter] = useState('24h');
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
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
      let query = supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId);

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

      const { data: tasks, error } = await query;

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

  // Handle filter changes
  const handleTimeFilterChange = (value) => {
    setTimeFilter(value);
    setDateRange([null, null]); // Reset date range when changing time filter
    setTimeout(() => fetchSummaryData(user.id), 0);
  };

  const handleDateRangeChange = (update) => {
    setDateRange(update);
    if (update[0] && update[1]) {
      setTimeFilter('custom'); // Reset time filter when using date range
      setTimeout(() => fetchSummaryData(user.id), 0);
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

  // Chart Configuration
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
        'rgba(30, 58, 138, 0.9)',   // Darkest blue - High Impact
        'rgba(59, 130, 246, 0.9)',  // Medium blue - Medium Impact
        'rgba(191, 219, 254, 0.9)', // Light blue - Low Impact
        'rgba(226, 232, 240, 0.9)'  // Very light blue - No Ranking
      ],
      borderRadius: 8,
      borderSkipped: false,
      maxBarThickness: 50
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
        'rgba(30, 58, 138, 0.9)',   // Darkest blue - High Impact
        'rgba(59, 130, 246, 0.9)',  // Medium blue - Medium Impact
        'rgba(191, 219, 254, 0.9)'  // Light blue - Low Impact
      ],
      borderWidth: 0
    }]
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Task Distribution by Impact Level',
        font: {
          size: 16,
          family: "'Inter', sans-serif",
          weight: '500'
        },
        padding: {
          top: 20,
          bottom: 20
        },
        color: '#1e3a8a'  // Dark blue
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          font: {
            family: "'Inter', sans-serif"
          },
          color: '#64748b'  // Slate gray
        },
        grid: {
          display: false
        }
      },
      x: {
        ticks: {
          font: {
            family: "'Inter', sans-serif"
          },
          color: '#64748b'  // Slate gray
        },
        grid: {
          display: false
        }
      }
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart'
    }
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            family: "'Inter', sans-serif",
            size: 12
          },
          padding: 20,
          usePointStyle: true
        }
      },
      title: {
        display: true,
        text: 'Impact Level Distribution',
        font: {
          size: 16,
          family: "'Inter', sans-serif",
          weight: '500'
        },
        padding: {
          top: 20,
          bottom: 20
        },
        color: '#1e3a8a'  // Dark blue
      }
    },
    cutout: '65%',
    animation: {
      animateScale: true,
      animateRotate: true,
      duration: 2000,
      easing: 'easeInOutQuart'
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm mb-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div 
                onClick={() => navigate('/')}
                className="text-xl font-bold text-blue-600 cursor-pointer"
              >
                TimeWell
              </div>
            </div>

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
        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center space-x-4">
            <select
              value={timeFilter}
              onChange={(e) => handleTimeFilterChange(e.target.value)}
              className="p-2 border rounded text-sm bg-white min-w-[140px]"
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
                className="w-60 p-2 border rounded text-sm bg-white"
                placeholderText="Select date range"
                isClearable={true}
                dateFormat="MMM d, yyyy"
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
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-700">Total Time Tracked</h3>
            <p className="text-3xl font-bold text-blue-900">{formatTime(summaryData.totalTime)}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-2 text-gray-700">Total Tasks</h3>
            <p className="text-3xl font-bold text-blue-900">{summaryData.totalTasks}</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <Bar data={barChartData} options={barOptions} />
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <Doughnut data={donutChartData} options={donutOptions} />
          </div>
        </div>

        {/* Impact Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Task Impact Distribution</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">High Impact</span>
                <span className="text-sm font-medium text-gray-600">{summaryData.highImpactTasks} tasks</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div 
                  className="bg-blue-900 h-2.5 rounded-full transition-all duration-500" 
                  style={{ width: `${(summaryData.highImpactTasks / summaryData.totalTasks * 100) || 0}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Medium Impact</span>
                <span className="text-sm font-medium text-gray-600">{summaryData.mediumImpactTasks} tasks</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div 
                  className="bg-blue-500 h-2.5 rounded-full transition-all duration-500" 
                  style={{ width: `${(summaryData.mediumImpactTasks / summaryData.totalTasks * 100) || 0}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Low Impact</span>
                <span className="text-sm font-medium text-gray-600">{summaryData.lowImpactTasks} tasks</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div 
                  className="bg-blue-200 h-2.5 rounded-full transition-all duration-500" 
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
