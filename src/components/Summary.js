import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';

function Summary() {
  const [taskStats, setTaskStats] = useState({
    counts: [],
    percentages: []
  });

  useEffect(() => {
    calculateStats();
  }, []);

  const calculateStats = () => {
    const allTasks = JSON.parse(localStorage.getItem('allTasks') || '[]');
    
    // Count tasks by leverage level
    const leverageCounts = {
      'High': 0,
      'Medium': 0,
      'Low': 0,
      'Unranked': 0
    };

    allTasks.forEach(task => {
      if (!task.leverage) {
        leverageCounts['Unranked']++;
      } else {
        leverageCounts[task.leverage]++;
      }
    });

    // Calculate percentages
    const total = allTasks.length;
    const percentages = Object.keys(leverageCounts).map(key => ({
      name: key,
      value: total > 0 ? Math.round((leverageCounts[key] / total) * 100) : 0
    }));

    // Format data for bar chart
    const counts = Object.keys(leverageCounts).map(key => ({
      name: key,
      tasks: leverageCounts[key]
    }));

    setTaskStats({ counts, percentages });
  };

  // Colors for the donut chart
  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#6B7280'];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Task Summary</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Task Counts by Category</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={taskStats.counts}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="tasks" fill="#4F46E5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Task Distribution (%)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taskStats.percentages}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {taskStats.percentages.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div className="flex flex-wrap justify-center mt-4 gap-4">
            {taskStats.percentages.map((entry, index) => (
              <div key={`legend-${index}`} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm text-gray-600">
                  {entry.name} ({entry.value}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Summary;
