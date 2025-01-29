import React, { useState, useEffect } from 'react';

function Summary() {
  const [insights, setInsights] = useState({
    mostProductiveHour: '',
    mostProductiveDay: '',
    averageDuration: 0,
    highLeverageTime: '',
    longestStreak: 0,
    commonTaskLength: 0
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

    // Analyze days
    const dayCounts = {};
    allTasks.forEach(task => {
      const day = new Date(task.timestamp).toLocaleDateString('en-US', { weekday: 'long' });
      dayCounts[day] = (dayCounts[day] || 0) + 1;
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
      mostProductiveDay: Object.keys(dayCounts).reduce((a, b) => 
        dayCounts[a] > dayCounts[b] ? a : b
      ),
      averageDuration: Math.round(allTasks.reduce((acc, task) => 
        acc + task.duration, 0) / allTasks.length / 60),
      highLeverageTime: highLeverageTasks.length > 0 ? formatHour(parseInt(Object.keys(highLeverageHours).reduce((a, b) => 
        highLeverageHours[a] > highLeverageHours[b] ? a : b
      ))) : 'Not enough data',
      longestStreak: calculateLongestStreak(allTasks),
      commonTaskLength: findMostCommonDuration(allTasks)
    });
  };

  const formatHour = (hour) => {
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}${ampm}`;
  };

  const calculateLongestStreak = (tasks) => {
    // Calculate days in a row with completed tasks
    const dates = [...new Set(tasks.map(task => 
      new Date(task.timestamp).toLocaleDateString()
    ))].sort();
    
    let currentStreak = 1;
    let maxStreak = 1;
    
    for (let i = 1; i < dates.length; i++) {
      const diff = (new Date(dates[i]) - new Date(dates[i-1])) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }
    return maxStreak;
  };

  const findMostCommonDuration = (tasks) => {
    const durations = tasks.map(task => Math.round(task.duration / 60));
    const counts = {};
    durations.forEach(duration => {
      counts[duration] = (counts[duration] || 0) + 1;
    });
    return parseInt(Object.keys(counts).reduce((a, b) => 
      counts[a] > counts[b] ? a : b
    ));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
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

          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-green-800">
              <span className="font-medium">Most Productive Day:</span> {insights.mostProductiveDay}s are your power days. 
              Try planning challenging tasks for this day.
            </p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-purple-800">
              <span className="font-medium">High-Leverage Tasks:</span> You handle important tasks best at {insights.highLeverageTime}. 
              Consider protecting this time slot for focused work.
            </p>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg">
            <p className="text-orange-800">
              <span className="font-medium">Task Duration:</span> Your tasks typically take {insights.commonTaskLength} minutes. 
              Average task duration is {insights.averageDuration} minutes.
            </p>
          </div>

          <div className="bg-teal-50 p-4 rounded-lg">
            <p className="text-teal-800">
              <span className="font-medium">Consistency:</span> Your longest streak is {insights.longestStreak} days in a row. 
              Keep building those productive habits!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Summary;
