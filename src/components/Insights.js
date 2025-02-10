import React, { useState, useEffect } from 'react';

function Summary() {
  const [insights, setInsights] = useState({
    mostProductiveHour: '',
    highLeverageTime: ''
  });

  useEffect(() => {
    analyzeProductivity();
  }, []);

  const analyzeProductivity = () => {
    const allTasks = JSON.parse(localStorage.getItem('allTasks') || '[]');
    if (allTasks.length === 0) return;

    // Analyze hours
    const hourCounts = {};
    allTasks.forEach(task => {
      const hour = new Date(task.timestamp).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });

    // Analyze high leverage tasks
    const highLeverageTasks = allTasks.filter(task => task.leverage === 'High');
    const highLeverageHours = {};
    highLeverageTasks.forEach(task => {
      const hour = new Date(task.timestamp).getHours();
      highLeverageHours[hour] = (highLeverageHours[hour] || 0) + 1;
    });

    setInsights({
      mostProductiveHour: formatHour(parseInt(Object.keys(hourCounts).reduce((a, b) => 
        hourCounts[a] > hourCounts[b] ? a : b
      ))),
      highLeverageTime: highLeverageTasks.length > 0 ? formatHour(parseInt(Object.keys(highLeverageHours).reduce((a, b) => 
        highLeverageHours[a] > highLeverageHours[b] ? a : b
      ))) : 'Not enough data'
    });
  };

  const formatHour = (hour) => {
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}${ampm}`;
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Your Productivity Insights</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">Time Patterns</h2>
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-blue-800">
              <span className="font-medium">Peak Productivity Hour:</span> You're most productive at {insights.mostProductiveHour}. 
              Consider scheduling important tasks during this time.
            </p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-purple-800">
              <span className="font-medium">High-Impact Tasks:</span> You handle important tasks best at {insights.highLeverageTime}. 
              Consider protecting this time slot for focused work.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Summary;
