import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

function Insights() {
  const [highTotal, setHighTotal] = useState(0);
  const [mediumTotal, setMediumTotal] = useState(0);
  const [lowTotal, setLowTotal] = useState(0);
  const [highTimeTotal, setHighTimeTotal] = useState(0);
  const [mediumTimeTotal, setMediumTimeTotal] = useState(0);
  const [lowTimeTotal, setLowTimeTotal] = useState(0);

  useEffect(() => {
    calculateTotals();
  }, []);

  const calculateTotals = () => {
    const allTasks = JSON.parse(localStorage.getItem('allTasks') || '[]');
    let high = 0;
    let medium = 0;
    let low = 0;
    let highTime = 0;
    let mediumTime = 0;
    let lowTime = 0;

    allTasks.forEach(task => {
      if (task.completed) {
        switch (task.leverage) {
          case 'High':
            high++;
            highTime += task.duration || 0;
            break;
          case 'Medium':
            medium++;
            mediumTime += task.duration || 0;
            break;
          case 'Low':
            low++;
            lowTime += task.duration || 0;
            break;
          default:
            break;
        }
      }
    });

    setHighTotal(high);
    setMediumTotal(medium);
    setLowTotal(low);
    setHighTimeTotal(highTime);
    setMediumTimeTotal(mediumTime);
    setLowTimeTotal(lowTime);
  };

  const chartData = {
    labels: ['High Impact', 'Medium Impact', 'Low Impact'],
    datasets: [{
      data: [highTotal, mediumTotal, lowTotal],
      backgroundColor: ['#d45d5d', '#e6c86e', '#7fb069'],  // muted red, yellow, green
      borderWidth: 0
    }]
  };

  const timeChartData = {
    labels: ['High Impact', 'Medium Impact', 'Low Impact'],
    datasets: [{
      data: [highTimeTotal, mediumTimeTotal, lowTimeTotal],
      backgroundColor: ['#d45d5d', '#e6c86e', '#7fb069'],  // muted red, yellow, green
      borderWidth: 0
    }]
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Task Insights</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tasks by Impact Level */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Completed Tasks by Impact Level</h2>
          <div className="h-64">
            <Pie 
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
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
                  }
                }
              }}
            />
          </div>
          <div className="mt-4 text-center text-sm text-gray-600">
            Total Tasks: {highTotal + mediumTotal + lowTotal}
          </div>
        </div>

        {/* Time Spent by Impact Level */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Time Spent by Impact Level</h2>
          <div className="h-64">
            <Pie 
              data={timeChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
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
                  }
                }
              }}
            />
          </div>
          <div className="mt-4 text-center text-sm text-gray-600">
            Total Time: {formatTime(highTimeTotal + mediumTimeTotal + lowTimeTotal)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Insights;
