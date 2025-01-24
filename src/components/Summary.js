import React, { useEffect, useState } from 'react';
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function Summary() {
  const [taskCounts, setTaskCounts] = useState({
    high: 0,
    medium: 0,
    low: 0
  });
  const [tasksByLeverage, setTasksByLeverage] = useState({
    high: [],
    medium: [],
    low: []
  });

  useEffect(() => {
    try {
      const allTasks = JSON.parse(localStorage.getItem('allTasks') || '[]');
      const counts = {
        high: 0,
        medium: 0,
        low: 0
      };
      const tasks = {
        high: [],
        medium: [],
        low: []
      };
      
      allTasks.forEach(task => {
        if (task.leverage) {
          const leverage = task.leverage.toLowerCase();
          if (counts.hasOwnProperty(leverage)) {
            counts[leverage]++;
            tasks[leverage].push(task.name);
          }
        }
      });

      setTaskCounts(counts);
      setTasksByLeverage(tasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  }, []);

  const barData = {
    labels: ['High', 'Medium', 'Low'],
    datasets: [
      {
        label: 'Tasks by Leverage',
        data: [taskCounts.high, taskCounts.medium, taskCounts.low],
        backgroundColor: [
          'rgba(75, 192, 192, 0.5)',  // Green
          'rgba(255, 206, 86, 0.5)',  // Yellow
          'rgba(255, 99, 132, 0.5)',  // Red
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const doughnutData = {
    labels: ['High', 'Medium', 'Low'],
    datasets: [
      {
        data: [taskCounts.high, taskCounts.medium, taskCounts.low],
        backgroundColor: [
          'rgba(75, 192, 192, 0.8)',  // Green
          'rgba(255, 206, 86, 0.8)',  // Yellow
          'rgba(255, 99, 132, 0.8)',  // Red
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          afterBody: function(context) {
            const leverageLevel = context[0].label.toLowerCase();
            const tasks = tasksByLeverage[leverageLevel];
            if (tasks.length === 0) return 'No tasks';
            
            return [
              '',  // Empty line for spacing
              'Tasks:',
              ...tasks.map((task, index) => `${index + 1}. ${task}`)
            ];
          }
        }
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

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const total = Object.values(taskCounts).reduce((a, b) => a + b, 0);
            const percentage = total ? ((context.raw / total) * 100).toFixed(1) : 0;
            return `${context.label}: ${context.raw} (${percentage}%)`;
          },
          afterBody: function(context) {
            const leverageLevel = context[0].label.toLowerCase();
            const tasks = tasksByLeverage[leverageLevel];
            if (tasks.length === 0) return 'No tasks';
            
            return [
              '',  // Empty line for spacing
              'Tasks:',
              ...tasks.map((task, index) => `${index + 1}. ${task}`)
            ];
          }
        }
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        How You Spent Your Time
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 text-center">Task Count by Leverage</h2>
          <Bar data={barData} options={chartOptions} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 text-center">Task Distribution (%)</h2>
          <Doughnut data={doughnutData} options={doughnutOptions} />
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <h3 className="font-semibold text-green-600">High Leverage</h3>
          <p className="text-2xl mt-2">{taskCounts.high}</p>
          <div className="mt-2 text-sm text-gray-600">
            {tasksByLeverage.high.length > 0 ? (
              <ul className="text-left">
                {tasksByLeverage.high.map((task, index) => (
                  <li key={index} className="truncate">{task}</li>
                ))}
              </ul>
            ) : (
              <p>No tasks</p>
            )}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <h3 className="font-semibold text-yellow-500">Medium Leverage</h3>
          <p className="text-2xl mt-2">{taskCounts.medium}</p>
          <div className="mt-2 text-sm text-gray-600">
            {tasksByLeverage.medium.length > 0 ? (
              <ul className="text-left">
                {tasksByLeverage.medium.map((task, index) => (
                  <li key={index} className="truncate">{task}</li>
                ))}
              </ul>
            ) : (
              <p>No tasks</p>
            )}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <h3 className="font-semibold text-red-600">Low Leverage</h3>
          <p className="text-2xl mt-2">{taskCounts.low}</p>
          <div className="mt-2 text-sm text-gray-600">
            {tasksByLeverage.low.length > 0 ? (
              <ul className="text-left">
                {tasksByLeverage.low.map((task, index) => (
                  <li key={index} className="truncate">{task}</li>
                ))}
              </ul>
            ) : (
              <p>No tasks</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Summary;
