import React, { useState, useEffect } from 'react';

function Timer({ setIsTimerActive }) {
  const [task, setTask] = useState('');
  const [popupWindow, setPopupWindow] = useState(null);
  const [tasks, setTasks] = useState([]);

  const startTimer = () => {
    if (!task.trim()) {
      alert('Please enter a task first');
      return;
    }

    const startTime = new Date();
    const popup = window.open(
      '',
      'TimeWell Timer',
      'width=300,height=250,resizable=yes'
    );

    popup.document.write(`
      <html>
        <head>
          <title>TimeWell Timer</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              padding: 20px;
              text-align: center;
              background-color: white;
            }
            .timer {
              font-size: 48px;
              font-weight: bold;
              margin: 20px 0;
            }
            .task {
              color: #666;
              margin: 15px 0;
              font-size: 16px;
              padding: 0 10px;
              word-wrap: break-word;
            }
            .end-btn {
              background-color: #DC2626;
              color: white;
              border: none;
              padding: 8px 16px;
              border-radius: 4px;
              cursor: pointer;
              font-size: 14px;
            }
            .end-btn:hover {
              background-color: #B91C1C;
            }
          </style>
        </head>
        <body>
          <div class="timer" id="timer">25:00</div>
          <div class="task">${task}</div>
          <button class="end-btn" onclick="endTimer()">End Timer</button>
          <script>
            let startTime = new Date();
            let timerInterval;
            
            function updateTimer() {
              const now = new Date();
              const elapsed = Math.floor((now - startTime) / 1000);
              const minutes = Math.floor(elapsed / 60);
              const seconds = elapsed % 60;
              document.getElementById('timer').textContent = 
                minutes.toString().padStart(2, '0') + ':' + 
                seconds.toString().padStart(2, '0');
            }

            function endTimer() {
              clearInterval(timerInterval);
              const endTime = new Date();
              const duration = Math.floor((endTime - startTime) / 1000);
              window.opener.handleTimerEnd(duration);
              window.close();
            }

            timerInterval = setInterval(updateTimer, 1000);
            
            window.onbeforeunload = function() {
              clearInterval(timerInterval);
            }
          </script>
        </body>
      </html>
    `);

    setPopupWindow(popup);
    setIsTimerActive(true);
  };

  const handleTimerEnd = (duration) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    const timeSpent = `${minutes}m ${seconds}s`;

    // Add completed task to log
    const newTask = {
      name: task,
      timeSpent,
      completedAt: new Date().toLocaleString()
    };

    setTasks(prevTasks => [...prevTasks, newTask]);
    
    // Reset states
    setIsTimerActive(false);
    setPopupWindow(null);
    setTask('');
  };

  // Attach handleTimerEnd to window object so popup can call it
  window.handleTimerEnd = handleTimerEnd;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">TimeWell</h2>
      
      <div className="mb-4">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="What are you working on?"
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        onClick={startTimer}
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Start Timer
      </button>

      {/* Task Log */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">Completed Tasks</h3>
        {tasks.map((completedTask, index) => (
          <div key={index} className="bg-gray-50 p-3 rounded-md mb-2">
            <div className="font-medium">{completedTask.name}</div>
            <div className="text-sm text-gray-600">
              Time: {completedTask.timeSpent} • {completedTask.completedAt}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Timer;
