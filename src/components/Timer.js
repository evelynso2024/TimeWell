import React, { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc, query, where, getDocs, orderBy, limit, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { auth } from '../firebase';

function Timer({ setIsTimerActive }) {
  // Keep all existing state variables
  const [isTimerActive, setIsTimerLocalActive] = useState(false);
  const [task, setTask] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [recentTasks, setRecentTasks] = useState([]);

  // Keep playClickSound function exactly the same
  const playClickSound = () => {
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    
    oscillator.connect(gain);
    gain.connect(context.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.value = 400;
    gain.gain.value = 0.4;
    
    oscillator.start(context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 0.06);
    oscillator.stop(context.currentTime + 0.06);
  };

  // Keep all useEffect hooks the same
  useEffect(() => {
    const allTasks = JSON.parse(localStorage.getItem('allTasks') || '[]');
    const recentFiveTasks = allTasks
      .sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
      .slice(0, 5);
    setRecentTasks(recentFiveTasks);
  }, []);

  useEffect(() => {
    const storedTimerState = localStorage.getItem('isTimerActive') === 'true';
    setIsTimerLocalActive(storedTimerState);
    setIsTimerActive(storedTimerState);
  }, [setIsTimerActive]);

  useEffect(() => {
    let intervalId;
    if (isTimerActive && startTime) {
      intervalId = setInterval(() => {
        const currentElapsed = Math.floor((Date.now() - startTime) / 1000);
        setElapsedTime(currentElapsed);
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [isTimerActive, startTime]);

  // Keep startTimer and handleKeyPress the same
  const startTimer = () => {
    if (task.trim()) {
      playClickSound();
      const now = Date.now();
      setStartTime(now);
      setIsTimerLocalActive(true);
      setIsTimerActive(true);
      localStorage.setItem('isTimerActive', 'true');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && task.trim()) {
      startTimer();
    }
  };

  // Update endTimer to save to both localStorage and Firebase
  const endTimer = async () => {
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

    try {
      // Save to Firebase
      const db = getFirestore();
      await addDoc(collection(db, 'tasks'), newTask);

      // Save to localStorage (keep existing functionality)
      const existingTasks = JSON.parse(localStorage.getItem('allTasks') || '[]');
      localStorage.setItem('allTasks', JSON.stringify([...existingTasks, newTask]));
      
      setTask('');
      setElapsedTime(0);
      setStartTime(null);
      setRecentTasks([newTask, ...recentTasks.slice(0, 4)]);
    } catch (error) {
      console.error("Error saving task:", error);
      alert('Error saving task. Please try again.');
    }
  };

  // Keep formatting functions the same
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDateTime = (isoString) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Update task management functions to work with both localStorage and Firebase
  const updateTaskLeverage = async (taskId, leverage) => {
    try {
      const db = getFirestore();
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, { leverage });

      // Update localStorage
      const allTasks = JSON.parse(localStorage.getItem('allTasks') || '[]');
      const updatedTasks = allTasks.map(task => 
        task.id === taskId ? { ...task, leverage } : task
      );
      localStorage.setItem('allTasks', JSON.stringify(updatedTasks));
      setRecentTasks(updatedTasks.slice(-5).reverse());
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const db = getFirestore();
      const taskRef = doc(db, 'tasks', taskId);
      await deleteDoc(taskRef);

      // Update localStorage
      const allTasks = JSON.parse(localStorage.getItem('allTasks') || '[]');
      const updatedTasks = allTasks.filter(task => task.id !== taskId);
      localStorage.setItem('allTasks', JSON.stringify(updatedTasks));
      setRecentTasks(updatedTasks.slice(-5).reverse());
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Keep the entire return/JSX section exactly the same
  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* ... rest of your JSX remains exactly the same ... */}
    </div>
  );
}

export default Timer;
