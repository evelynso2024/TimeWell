import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Insights() {
  const [hourlyData, setHourlyData] = useState({});
  const [mostProductiveHour, setMostProductiveHour] = useState(null);
  const [totalHighImpactTime, setTotalHighImpactTime] = useState(0);

  useEffect(() => {
    analyzeHourlyPatterns();
  }, []);

  const analyzeHourlyPatterns = () => {
    const allTasks = JSON.parse(localStorage.getItem('allTasks') || '[]');
    const hourlyStats = {};
    let totalHigh = 0;
    
    // Initialize hourly slots (0-23)
    for (let i = 0; i < 24; i++) {
      hourlyStats[i] = {
        high: 0,
        medium: 0,
        low: 0
      };
    }

    allTasks.forEach(task => {
      if (task.completed && task.startTime && task.duration) {
        const hour = new Date(task.startTime).getHours();
        const impact = task.leverage?.toLowerCase() || 'low';
        hourlyStats[hour][impact] += task.duration;

        if (impact === 'high') {
          totalHigh += task.duration;
        }
      }
    });

    // Find most productive hour (highest high-impact time)
    let maxHighImpactTime = 0;
    let mostProductiveHr = 0;
    
    Object.entries(hourlyStats).forEach(([hour, stats]) => {
      if (stats.high > maxHighImpactTime) {
        maxHighImpactTime = stats.high;
        mostProductiveHr = parseInt(hour);
      }
    });

    setHourlyData(hourlyStats);
    setMostProductiveHour(mostProductiveHr);
    setTotalHighImpactTime(totalHigh);
  };

  const formatHour = (hour) => {
    return `${hour % 12 || 12}${hour < 12 ? 'AM' : 'PM'}`;
  };

  const chartData = {
    labels: Array.from({length: 24}, (_, i) => formatHour(i)),
    datasets: [
      {
        label: 'High Impact',
        data: Object.values(hourlyData).map(h => h.high),
        backgroundColor: '#d45d5d',  // muted red
      },
      {
        label: 'Medium Impact',
        data: Object.values(hourlyData).map(h => h.medium),
        backgroundColor: '#e6c86e',  // muted yellow
      },
      {
        label: 'Low Impact',
        data: Object.values(hourlyData).map(h => h.low),
        backgroundColor: '#7fb069',  // muted green
      }
    ]
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        stacked: true,
        title: {
          display: true,
          text: 'Hour of Day'
        }
      },
      y: {
        stacked: true,
        title: {
          display: true,
          text: 'Time Spent (minutes)'
        }
      }
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: 'Task Distribution by Hour'
      }
    }
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Productivity Insights</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="h-[400px]">
          <Bar data={chartData} options={options} />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Key Insights</h2>
        <div className="space-y-4">
          <p className="text-gray-700">
            <span className="font-semibold">Most Productive Hour:</span> {mostProductiveHour !== null && 
              `${formatHour(mostProductiveHour)} - ${formatHour((mostProductiveHour + 1) % 24)}`}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Total High-Impact Time:</span> {formatTime(totalHighImpactTime)}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">Productivity Tip:</span> Consider scheduling your most important tasks during your peak productivity hour to maximize impact.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Insights;
