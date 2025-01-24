import React, { useState, useEffect } from 'react';

function Timer() {
  const [task, setTask] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [recentTasks, setRecentTasks] = useState([]);

  // Create Audio objects
  const startSound = new Audio('/start.mp3');  // Make sure these files exist in public folder
  const endSound = new Audio('/end.mp3');

  // Load recent tasks on component mount
  useEffect(() => {
    const allTasks = JSON.parse(localStorage.getItem('allTasks') || '[]');
    setRecentTasks(allTasks.slice(0, 5));
  }, []);

  // Timer logic
  useEffect(() => {
    let intervalId;
    if (isRunning) {
      intervalId = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [isRunning]);

  // Format time to HH:MM:SS
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle starting timer
  const handleStart = () => {
    if (task.trim()) {
      setIsRunning(true);
      startSound.play().catch(error => console.log('Sound play failed:', error));
    }
  };

  // Handle ending timer
  const handleEnd = () => {
    if (isRunning) {
      setIsRunning(false);
      endSound.play().catch(error => console.log('Sound play failed:', error));
      
      // Create new task
      const newTask = {
        name: task,
        duration: formatTime(time),
        timestamp: new Date().toISOString(),
        leverage: ""
      };

      // Get existing tasks from localStorage
      const allTasks = JSON.parse(localStorage.getItem('allTasks') || '[]');
      
      // Add new task to the beginning
      const updatedTasks = [newTask, ...allTasks];
      
      // Update localStorage with all tasks
      localStorage.setItem('allTasks', JSON.stringify(updatedTasks));
      
      // Update recent tasks state with 5 most recent
      setRecentTasks(updatedTasks.slice(0, 5));

      // Reset
      setTask('');
      setTime(0);
    }
  };

  // ... rest of the component code stays the same ...
