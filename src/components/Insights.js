import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

function Insights() {
  const [insights, setInsights] = useState({
    mostProductiveTime: '',
    totalHighImpactHours: 0,
    peakHour: '',
    totalTasks: 0
  });

  useEffect(() => {
    if (auth.currentUser) {
      analyzeTimePatterns();
    }
  }, []);

  const analyzeTimePatterns = async () => {
    const firestore = getFirestore();
    try {
      const tasksRef = collection(firestore, 'tasks');
      const q = query(tasksRef, where('userId', '==', auth.currentUser.uid));
      const querySnapshot = await getDocs(q);

      // Initialize time slots for 24 hours
      const hourlyData = {};
      for (let i = 0; i < 24; i++) {
        hourlyData[i] = { high: 0 };
      }

      let totalHighImpactMinutes = 0;
      let maxHighImpactMinutes = 0;
      let peakHour = 0;
      let completedTasks = 0;

      querySnapshot.forEach((doc) => {
        const task = doc.data();
        if (task.completed && task.startTime && task.leverage === 'High') {
          const hour = task.startTime.toDate().getHours();
          const duration = task.duration || 0;
          
          hourlyData[hour].high += duration;
          totalHighImpactMinutes += duration;
          completedTasks++;

          if (hourlyData[hour].high > maxHighImpactMinutes) {
            maxHighImpactMinutes = hourlyData[hour].high;
            peakHour = hour;
          }
        }
      });

      setInsights({
        mostProductiveTime: getPeriodOfDay(peakHour),
        totalHighImpactHours: Math.round(totalHighImpactMinutes / 60 * 10) / 10,
        peakHour: formatHour(peakHour),
        totalTasks: completedTasks
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getPeriodOfDay = (hour) => {
    if (hour >= 5 && hour < 12) return "morning";
    if (hour >= 12 && hour < 17) return "afternoon";
    if (hour >= 17 && hour < 22) return "evening";
    return "night";
  };

  const formatHour = (hour) => {
    return `${hour % 12 || 12}${hour < 12 ? 'AM' : 'PM'}`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Your Productivity Insights</h1>
        <p className="text-gray-600 mt-2">Understanding your high-impact work patterns</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-6">Key Insights</h2>
        
        <div className="space-y-6">
          <div className="p-5 bg-gray-50 rounded-lg border border-gray-100">
            <h3 className="font-semibold text-lg text-gray-800 mb-2">Peak Productivity Time</h3>
            <p className="text-gray-700">
              You're most productive at <span className="font-semibold text-blue-600">{insights.peakHour}</span>, 
              typically during the <span className="font-semibold text-blue-600">{insights.mostProductiveTime}</span>
            </p>
          </div>

          <div className="p-5 bg-gray-50 rounded-lg border border-gray-100">
            <h3 className="font-semibold text-lg text-gray-800 mb-2">High-Impact Work</h3>
            <p className="text-gray-700">
              You've dedicated <span className="font-semibold text-blue-600">{insights.totalHighImpactHours} hours</span> to 
              high-impact activities across <span className="font-semibold text-blue-600">{insights.totalTasks} tasks</span>
            </p>
          </div>

          <div className="p-5 bg-blue-50 rounded-lg border border-blue-100">
            <h3 className="font-semibold text-lg text-blue-800 mb-2">💡 Recommendations</h3>
            <ul className="space-y-3 text-blue-700">
              <li>• Schedule your most important tasks around {insights.peakHour} to maximize productivity</li>
              <li>• Use your {insights.mostProductiveTime} hours for complex, high-impact work</li>
              <li>• Consider blocking out your peak hours for focused work sessions</li>
            </ul>
          </div>

          <div className="p-5 bg-purple-50 rounded-lg border border-purple-100">
            <h3 className="font-semibold text-lg text-purple-800 mb-2">🎯 Action Steps</h3>
            <ul className="space-y-3 text-purple-700">
              <li>• Block your calendar for high-impact work during {insights.peakHour}</li>
              <li>• Minimize distractions during your peak {insights.mostProductiveTime} hours</li>
              <li>• Review and adjust your schedule to align with your natural productivity rhythm</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Insights;
