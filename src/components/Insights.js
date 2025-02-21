import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Insights() {
  const [timeData, setTimeData] = useState({
    morning: { high: 0, medium: 0, low: 0 },
    afternoon: { high: 0, medium: 0, low: 0 },
    evening: { high: 0, medium: 0, low: 0 }
  });

  useEffect(() => {
    analyzeTimePatterns();
  }, []);

  const analyzeTimePatterns = () => {
    const allTasks = JSON.parse(localStorage.getItem('allTasks') || '[]');
    const patterns = {
      morning: { high: 0, medium: 0, low: 0 },
      afternoon: { high: 0, medium: 0, low: 0 },
      evening: { high: 0, medium: 0, low: 0 }
    };

    allTasks.forEach(task => {
      if (task.completed && task.startTime) {
        const hour = new Date(task.startTime).getHours();
        const timeOfDay = hour >= 5 && hour < 12 ? 'morning' 
                       : hour >= 12 && hour < 17 ? 'afternoon'
                       : 'evening';
        
        const impact = task.leverage?.toLowerCase() || 'low';
        patterns[timeOfDay][impact] += task.duration || 0;
      }
    });

    setTimeData(patterns);
  };

  const chartData = {
    labels: ['Morning (5AM-12PM)', 'Afternoon (12PM-5PM)', 'Evening (5PM-12AM)'],
    datasets: [
      {
        label: 'High Impact',
        data: [
          timeData.morning.high,
          timeData.afternoon.high,
          timeData.evening.high
        ],
        backgroundColor: '#d45d5d',  // muted red
      },
      {
        label: 'Medium Impact',
        data: [
          timeData.morning.medium,
          timeData.afternoon.medium,
          timeData.evening.medium
        ],
        backgroundColor: '#e6c86e',  // muted yellow
      },
      {
        label: 'Low Impact',
        data: [
          timeData.morning.low,
          timeData.afternoon.low,
          timeData.evening.low
        ],
        backgroundColor: '#7fb069',  // muted green
      }
    ]
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        stacked: true,
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
        text: 'Time Distribution Throughout the Day'
      }
    }
  };

  const getMostProductiveTime = () => {
    const totals = {
      morning: Object.values(timeData.morning).reduce((a, b) => a + b, 0),
      afternoon: Object.values(timeData.afternoon).reduce((a, b) => a + b, 0),
      evening: Object.values(timeData.evening).reduce((a, b) => a + b, 0)
    };

    const max = Math.max(...Object.values(totals));
    const timeOfDay = Object.keys(totals).find(key => totals[key] === max);
    
    return timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Time Pattern Insights</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="h-[400px]">
          <Bar data={chartData} options={options} />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Key Insights</h2>
        <p className="text-gray-700">
          Your most productive time of day appears to be during the {getMostProductiveTime()}.
        </p>
      </div>
    </div>
  );
}

export default Insights;
