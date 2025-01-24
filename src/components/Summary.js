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
import CalendarHeatmap from 'react-calendar-heatmap';
import ReactTooltip from 'react-tooltip';
import 'react-calendar-heatmap/dist/styles.css';

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
  // ... existing state and chart code ...

  // Add this new state
  const [heatmapData, setHeatmapData] = useState([]);

  useEffect(() => {
    try {
      const allTasks = JSON.parse(localStorage.getItem('allTasks') || '[]');
      // ... existing task counting code ...

      // Process data for heatmap
      const heatmapValues = allTasks.map(task => ({
        date: task.timestamp.split('T')[0],
        count: 1
      }));

      setHeatmapData(heatmapValues);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Existing charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Your existing Bar and Doughnut charts */}
      </div>

      {/* Heat Map */}
      <div className="bg-white p-6 rounded-lg shadow mt-6">
        <h2 className="text-lg font-semibold mb-4 text-center">Activity Heat Map</h2>
        <div className="overflow-x-auto">
          <CalendarHeatmap
            startDate={new Date('2024-01-01')}
            endDate={new Date()}
            values={heatmapData}
            classForValue={(value) => {
              if (!value) return 'color-empty';
              return 'color-filled';
            }}
          />
          <ReactTooltip />
        </div>
      </div>

      {/* Existing summary cards */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        {/* Your existing summary cards */}
      </div>
    </div>
  );
}

export default Summary;
