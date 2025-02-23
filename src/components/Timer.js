import React, { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc, query, where, getDocs, doc, updateDoc, deleteDoc, orderBy, limit, Timestamp } from 'firebase/firestore';
import { auth } from '../firebase';

function Timer({ setIsTimerActive }) {
  const [isTimerActive, setIsTimerLocalActive] = useState(false);
  const [task, setTask] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [recentTasks, setRecentTasks] = useState([]);

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

  useEffect(() => {
    if (auth.currentUser) {
      loadRecentTasks();
    }
  }, [auth.currentUser]);

  const loadRecentTasks = async () => {
    if (!auth.currentUser) return;
    
    try {
      const db = getFirestore();
      const tasksRef = collection(db, 'tasks');
      const q = query(
        tasksRef,
        where('userId', '==', auth.currentUser.uid),
        orderBy('startTime', 'desc'),
        limit(5)
      );
      
      const querySnapshot = await getDocs(q);
      const recentFiveTasks = [];
      querySnapshot.forEach((doc) => {
        recentFiveTasks.push({ id: doc.id, ...doc.data() });
      });
      setRecentTasks(recentFiveTasks);
    } catch (error) {
      console.error("Error loading recent tasks:", error);
    }
  };

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

  const endTimer = async () => {
    if (!auth.currentUser) {
      alert('Please log in to save tasks');
      return;
    }

    playClickSound();
    setIsTimerLocalActive(false);
    setIsTimerActive(false);
    localStorage.setItem('isTimerActive', 'false');

    try {
      const db = getFirestore();
      const newTask = {
        name: task,
        duration: elapsedTime,
        startTime: Timestamp.fromDate(new Date(startTime)),
        endTime: Timestamp.fromDate(new Date()),
        leverage: '',
        userId: auth.currentUser.uid,
        timestamp: Timestamp.now()
      };

      await addDoc(collection(db, 'tasks'), newTask);
      await loadRecentTasks();
      
      setTask('');
      setElapsedTime(0);
      setStartTime(null);
    } catch (error) {
      console.error("Error saving task:", error);
      alert('Error saving task. Please try again.');
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDateTime = (timestamp) => {
    if (!timestamp || !timestamp.seconds) return '';
    return new Date(timestamp.seconds * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const updateTaskLeverage = async (taskId, leverage) => {
    if (!auth.currentUser) return;
    
    try {
      const db = getFirestore();
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, { leverage });
      await loadRecentTasks();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteTask = async (taskId) => {
    if (!auth.currentUser) return;
    
    try {
      const db = getFirestore();
      const taskRef = doc(db, 'tasks', taskId);
      await deleteDoc(taskRef);
      await loadRecentTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {!isTimerActive ? (
        <>
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <input
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="What are you working on?"
              className="w-full p-4 text-xl border rounded mb-4"
              autoFocus
            />
            <button
              onClick={startTimer}
              disabled={!task.trim()}
              className={`w-full p-4 rounded text-white text-xl
                ${task.trim() ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-300'}`}
            >
              Start Timer
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Tasks</h2>
            <div className="space-y-4">
              <ul className="space-y-3">
                {recentTasks.map((task) => (
                  <li 
                    key={task.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded"
                  >
                    <div>
                      <div className="font-medium">{task.name}</div>
                      <div className="text-sm text-gray-500">
                        {formatTime(task.duration)} • {formatDateTime(task.startTime)} - {formatDateTime(task.endTime)}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <select
                        value={task.leverage || ''}
                        onChange={(e) => updateTaskLeverage(task.id, e.target.value)}
                        className="p-2 border rounded text-sm bg-white"
                      >
                        <option value="">Rank</option>
                        <option value="High">High impact</option>
                        <option value="Medium">Medium impact</option>
                        <option value="Low">Low impact</option>
                      </select>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="text-red-500 hover:text-red-700 font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-4xl font-bold mb-4 text-gray-800">
            {task}
          </div>
          <div className="text-3xl font-mono mb-6 text-gray-600">
            {formatTime(elapsedTime)}
          </div>
          <div className="flex justify-center">
            <button
              onClick={endTimer}
              className="w-1/3 bg-red-500 text-white px-8 py-3 rounded hover:bg-red-600"
            >
              End Timer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Timer;
