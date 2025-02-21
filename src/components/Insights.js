import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { auth } from '../firebase';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Insights() {
  const [timeData, setTimeData] = useState({});
  const [insights, setInsights] = useState({
    mostProductiveTime: '',
    totalHighImpactHours: 0,
    peakHour: ''
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

      querySnapshot.forEach((doc) => {
        const task = doc.data();
        if (task.completed && task.startTime && task.leverage === 'High') {
          const hour = task.startTime.toDate().getHours();
          const duration = task.duration || 0;
          
          hourlyData[hour].high += duration;
          totalHighImpactMinutes += duration;

          if (hourlyData[hour].high > maxHighImpactMinutes) {
            maxHighImpactMinutes = hourlyData[hour].high;
            peakHour = hour;
          }
        }
      });

      setTimeData(hourlyData);
      setInsights({
        mostProductiveTime: getPeriodOfDay(peakHour),
        totalHighImpactHours: Math.round(totalHighImpactMinutes / 60 * 10) / 10,
        peakHour: formatHour(peakHour)
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

  const chartData = {
    labels: Array.from({length: 24}, (_, i) => formatHour(i)),
    datasets: [{
      label: 'High Impact Activities',
      data: Object.values(timeData).map(h => h.high || 0),
      backgroundColor: '#d45d5d',  // muted red
      borderRadius: 6,
    }]
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Minutes Spent'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Hour of Day'
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'High Impact Activity Distribution'
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Your Productivity Insights</h1>
        <p className="text-gray-600 mt-2">Understanding when you're most effective</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="h-[400px]">
          <Bar data={chartData} options={options} />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Key Insights</h2>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-800">
              <span className="font-semibold">Peak Productivity:</span> Your most productive time for high-impact work is at {insights.peakHour}
            </p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-800">
              <span className="font-semibold">Time of Day Pattern:</span> You tend to be most effective during the {insights.mostProductiveTime}
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-800">
              <span className="font-semibold">High Impact Focus:</span> You've spent {insights.totalHighImpactHours} hours on high-impact activities
            </p>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg mt-6">
            <p className="text-blue-800">
              <span className="font-semibold">💡 Recommendation:</span> Consider scheduling your most important tasks around {insights.peakHour} to maximize your natural productivity rhythm.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Insights;
