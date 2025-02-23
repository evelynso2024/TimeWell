import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';

function Timer({ setIsTimerActive }) {
  const [isTimerActive, setIsTimerLocalActive] = useState(false);
  const [task, setTask] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [recentTasks, setRecentTasks] = useState([]);

  // ... keep playClickSound function the same ...

  useEffect(() => {
    if (auth.currentUser) {
      const userTasks = JSON.parse(localStorage.getItem(`tasks_${auth.currentUser.uid}`) || '[]');
      const recentFiveTasks = userTasks
        .sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
        .slice(0, 5);
      setRecentTasks(recentFiveTasks);
    }
  }, [auth.currentUser]);

  // ... keep other useEffects the same ...

  const endTimer = () => {
    if (!auth.currentUser) {
      alert('Please log in to save tasks');
      return;
    }

    playClickSound();
    setIsTimerLocalActive(false);
    setIsTimerActive(false);
    localStorage.setItem('isTimerActive', 'false');
    
    const endTime = new Date().toISOString();
    const newTask = {
      id: Date.now(),
      name: task,
      duration: elapsedTime,
      startTime: startTime ? new Date(startTime).toISOString() : null,
      endTime: endTime,
      leverage: '',
      userId: auth.currentUser.uid
    };

    const userTasks = JSON.parse(localStorage.getItem(`tasks_${auth.currentUser.uid}`) || '[]');
    localStorage.setItem(`tasks_${auth.currentUser.uid}`, JSON.stringify([...userTasks, newTask]));
    
    setTask('');
    setElapsedTime(0);
    setStartTime(null);
    setRecentTasks([newTask, ...recentTasks.slice(0, 4)]);
  };

  const updateTaskLeverage = (taskId, leverage) => {
    if (!auth.currentUser) return;

    const userTasks = JSON.parse(localStorage.getItem(`tasks_${auth.currentUser.uid}`) || '[]');
    const updatedTasks = userTasks.map(task => 
      task.id === taskId ? { ...task, leverage } : task
    );
    localStorage.setItem(`tasks_${auth.currentUser.uid}`, JSON.stringify(updatedTasks));
    setRecentTasks(updatedTasks.slice(-5).reverse());
  };

  const deleteTask = (taskId) => {
    if (!auth.currentUser) return;

    const userTasks = JSON.parse(localStorage.getItem(`tasks_${auth.currentUser.uid}`) || '[]');
    const updatedTasks = userTasks.filter(task => task.id !== taskId);
    localStorage.setItem(`tasks_${auth.currentUser.uid}`, JSON.stringify(updatedTasks));
    setRecentTasks(updatedTasks.slice(-5).reverse());
  };

  // ... keep all other functions and JSX return the same ...
