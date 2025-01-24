import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Summary() {
  const [leverageData, setLeverageData] = useState({
    high: 0,
    medium: 0,
    low: 0
  });

  useEffect(() => {
    // Get tasks from localStorage
    const allTasks = JSON.parse(localStorage.getItem('allTasks') || '[]');
    
    // Count tasks by leverage
    const counts = allTasks.reduce((acc, task) => {
      const leverage = task.leverage.toLowerCase();
      if (leverage === 'high') acc.high++;
      else if (leverage === 'medium') acc.medium++;
      else if (leverage === 'low') acc.low++;
      return acc;
    }, { high: 0, medium: 0, low: 0 });

    setLeverageData(counts);
  }, []);

  // Chart configuration
  const chartData = {
    labels: ['High Leverage', 'Medium Leverage', 'Low Leverage'],
    datasets: [
      {
        label: 'Number of Tasks',
        data: [leverageData.high, leverageData.medium, leverageData.low],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)', // Green for high
          'rgba(54, 162, 235, 0.6)', // Blue for medium
          'rgba(255, 99, 132, 0.6)',  // Red for low
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Task Distribution by Leverage',
        font: {
          size: 16
        }
      },
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

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Task Summary</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <Bar data={chartData} options={options} />
      </div>
      
      {/* Summary Statistics */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <h3 className="font-semibold text-green-600">High Leverage</h3>
          <p className="text-2xl mt-2">{leverageData.high}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <h3 className="font-semibold text-blue-600">Medium Leverage</h3>
          <p className="text-2xl mt-2">{leverageData.medium}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow text-center">
          <h3 className="font-semibold text-red-600">Low Leverage</h3>
          <p className="text-2xl mt-2">{leverageData.low}</p>
        </div>
      </div>
    </div>
  );
}

export default Summary;
