import React, { useState, useEffect } from 'react';
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
  // ... (keep existing state variables)

  // Chart configuration
  const chartData = {
    labels: ['High Leverage', 'Medium Leverage', 'Low Leverage'],
    datasets: [
      {
        label: 'Number of Tasks',
        data: [
          leverageStats.high.count,
          leverageStats.medium.count,
          leverageStats.low.count
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.6)',  // green
          'rgba(234, 179, 8, 0.6)',   // yellow
          'rgba(239, 68, 68, 0.6)',   // red
        ],
        borderColor: [
          'rgb(34, 197, 94)',
          'rgb(234, 179, 8)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Task Distribution by Leverage',
        font: {
          size: 16,
          weight: 'bold',
        },
        padding: {
          bottom: 20
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
      {/* Chart Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="h-[300px]">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Leverage Breakdown */}
      <div className="bg-white rounded-lg shadow p-6">
        {/* ... (keep existing leverage breakdown sections) ... */}
      </div>

      {/* ... (keep existing modal code) ... */}
    </div>
  );
}

export default Summary;
