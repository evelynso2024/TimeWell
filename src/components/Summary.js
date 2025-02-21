import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

function Summary() {
  const [taskStats, setTaskStats] = useState({
    counts: {
      labels: ['High', 'Medium', 'Low', 'Unranked'],
      datasets: [{
        data: [0, 0, 0, 0],
        backgroundColor: ['#d45d5d', '#e6c86e', '#7fb069', '#6B7280']  // muted red, yellow, green, gray
      }]
    },
    percentages: {
      labels: ['High', 'Medium', 'Low', 'Unranked'],
      datasets: [{
        data: [0, 0, 0, 0],
        backgroundColor: ['#d45d5d', '#e6c86e', '#7fb069', '#6B7280']  // muted red, yellow, green, gray
      }]
    }
  });

  useEffect(() => {
    calculateStats();
  }, []);

  const calculateStats = () => {
    const allTasks = JSON.parse(localStorage.getItem('allTasks') || '[]');
    
    const leverageCounts = {
      'High': 0,
      'Medium': 0,
      'Low': 0,
      'Unranked': 0
    };

    allTasks.forEach(task => {
      if (!task.leverage) {
        leverageCounts['Unranked']++;
      } else {
        leverageCounts[task.leverage]++;
      }
    });

    const total = allTasks.length;
    const percentages = Object.values(leverageCounts).map(count => 
      total > 0 ? Math.round((count / total) * 100) : 0
    );

    setTaskStats({
      counts: {
        labels: ['High', 'Medium', 'Low', 'Unranked'],
        datasets: [{
          data: Object.values(leverageCounts),
          backgroundColor: ['#d45d5d', '#e6c86e', '#7fb069', '#6B7280'],  // muted red, yellow, green, gray
          borderWidth: 0
        }]
      },
      percentages: {
        labels: ['High', 'Medium', 'Low', 'Unranked'],
        datasets: [{
          data: percentages,
          backgroundColor: ['#d45d5d', '#e6c86e', '#7fb069', '#6B7280'],  // muted red, yellow, green, gray
          borderWidth: 0
        }]
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Task Summary</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Task Counts by Category</h2>
          <div className="h-64">
            <Bar 
              data={taskStats.counts}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
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
              }}
            />
          </div>
        </div>

        {/* Donut Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Task Distribution (%)</h2>
          <div className="h-64">
            <Doughnut 
              data={taskStats.percentages}
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
        </div>
      </div>
    </div>
  );
}

export default Summary;
