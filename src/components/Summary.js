import React, { useEffect, useState } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import ReactTooltip from 'react-tooltip';
import 'react-calendar-heatmap/dist/styles.css';
// ... other existing imports ...

function Summary() {
  // ... existing state and useEffect code ...

  // Add this new state
  const [heatmapData, setHeatmapData] = useState([]);

  useEffect(() => {
    try {
      const allTasks = JSON.parse(localStorage.getItem('allTasks') || '[]');
      
      // Process data for heatmap
      const heatmapValues = allTasks.map(task => ({
        date: task.timestamp.split('T')[0],
        count: task.leverage.toLowerCase() === 'high' ? 3 : 
               task.leverage.toLowerCase() === 'medium' ? 2 : 1
      }));

      setHeatmapData(heatmapValues);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  }, []);

  // Get date range
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 5);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Existing charts */}
      
      {/* Heat Map */}
      <div className="bg-white p-6 rounded-lg shadow mt-6">
        <h2 className="text-lg font-semibold mb-4 text-center">Activity Heat Map</h2>
        <div className="overflow-x-auto">
          <CalendarHeatmap
            startDate={startDate}
            endDate={endDate}
            values={heatmapData}
            classForValue={(value) => {
              if (!value) return 'color-empty';
              return `color-scale-${value.count}`;
            }}
            tooltipDataAttrs={(value) => {
              if (!value || !value.count) return { 'data-tip': 'No tasks' };
              return {
                'data-tip': `${value.count} activities`,
              };
            }}
          />
          <ReactTooltip />
        </div>
      </div>

      {/* Existing summary cards */}
    </div>
  );
}

export default Summary;
