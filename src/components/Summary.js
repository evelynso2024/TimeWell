import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Bar, Doughnut } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
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

  // ... rest of your existing functions (handleLogout, formatTime) ...

  // ... your existing chart configurations ...

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Navigation Bar - keeping your existing navigation */}
      <nav className="bg-white shadow-sm mb-6">
        {/* ... your existing navigation code ... */}
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
                  d="M8 7V3m
