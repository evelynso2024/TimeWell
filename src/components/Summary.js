import React, { useEffect, useState } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import ReactTooltip from 'react-tooltip';
import 'react-calendar-heatmap/dist/styles.css';
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

// ... existing ChartJS registration ...

function Summary() {
  // ... existing state declarations ...
  const [heatmapData, setHeatmapData] = useState([]);

  useEffect(() => {
    try {
      const allTasks = JSON.parse(localStorage.getItem('allTasks') || '[]');
      // ... existing task counting logic ...

      // Process data for heatmap
      const tasksByDate = allTasks.reduce((acc, task) => {
        const date = task.timestamp.split('T')[0];
        if (!acc[date]) {
          acc[date] = { high: 0, medium: 0, low: 0 };
        }
        const leverage = task.leverage.toLowerCase();
        if (leverage in acc[date]) {
          acc[date][leverage]++;
        }
        return acc;
      }, {});

      const heatmapValues = Object.entries(tasksByDate).map(([date, counts]) => ({
        date,
        count: counts.high * 3 + counts.medium * 2 + counts.low, // Weighted score
        details: counts,
      }));

      setHeatmapData(heatmapValues);

    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  }, []);

  // Get date range for heatmap
  const today = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 5); // Show last 6 months

  // Custom tooltip content
  const getTooltipContent = (value) => {
    if (!value || !value.details) {
      return 'No tasks';
    }
    return `
      High: ${value.details.high} tasks
      Medium: ${value.details.medium} tasks
      Low: ${value.details.low} tasks
    `;
  };

  // Add this section before the return statement
  const getHeatmapColor = (value) => {
    if (!value) return '#ebedf0';
    const intensity = Math.min(value.count / 9, 1); // Max weighted score is 9 (3 high tasks)
    return `rgba(75, 192, 192, ${intensity})`; // Using the green color with varying opacity
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Existing charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* ... existing Bar and Doughnut charts ... */}
      </div>

      {/* Heat Map Section */}
      <div className="bg-white p-6 rounded-lg shadow mt-6">
        <h2 className="text-lg font-semibold mb-4 text-center">Activity Heat Map</h2>
        <div className="overflow-x-auto">
          <CalendarHeatmap
            startDate={startDate}
            endDate={today}
            values={heatmapData}
            classForValue={(value) => {
              if (!value) {
                return 'color-empty';
              }
              return 'color-filled';
            }}
            tooltipDataAttrs={(value) => {
              return {
                'data-tip': getTooltipContent(value),
              };
            }}
            showWeekdayLabels={true}
            titleForValue={(value) => getTooltipContent(value)}
            transformDayElement={(element, value, index) => {
              return React.cloneElement(element, {
                style: {
                  ...element.props.style,
                  fill: getHeatmapColor(value),
                },
              });
            }}
          />
          <ReactTooltip />
        </div>
        <div className="flex justify-center items-center mt-4 space-x-4 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-200 mr-2"></div>
            <span>No tasks</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-[rgba(75,192,192,0.2)] mr-2"></div>
            <span>Low activity</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-[rgba(75,192,192,0.6)] mr-2"></div>
            <span>Medium activity</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-[rgba(75,192,192,1)] mr-2"></div>
            <span>High activity</span>
          </div>
        </div>
      </div>

      {/* Existing summary cards */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        {/* ... existing summary cards ... */}
      </div>
    </div>
  );
}

export default Summary;
