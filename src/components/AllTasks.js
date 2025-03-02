import React from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebase'; // Updated path with ../
import { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';




function AllTask() {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate('/login');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return;
      
      try {
        const q = query(
          collection(db, "tasks"),
          where("userId", "==", user.uid)
        );
        
        const querySnapshot = await getDocs(q);
        const taskList = [];
        querySnapshot.forEach((doc) => {
          taskList.push({ id: doc.id, ...doc.data() });
        });
        
        setTasks(taskList);
      } catch (error) {
        console.error("Error fetching tasks: ", error);
      }
    };

    fetchTasks();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">All Tasks</h1>
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="bg-white p-4 rounded-lg shadow">
              <h2 className="font-semibold">{task.taskName}</h2>
              <p>Duration: {task.duration} minutes</p>
              <p>Date: {task.timestamp?.toDate().toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AllTask;
