import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function AllTask() {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/login');
      } else {
        setUser(user);
        fetchTasks(user.id);
      }
    };
    getUser();
  }, [navigate]);

  const fetchTasks = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks: ", error);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/login');
    } catch (error) {
      console.error("Error logging out:", error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">All Tasks</h1>
          <div className="space-x-4">
            <Link
              to="/timer"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Timer
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <p className="text-center text-gray-500">No tasks found</p>
          ) : (
            tasks.map((task) => (
              <div key={task.id} className="bg-white p-4 rounded-lg shadow">
                <h2 className="font-semibold">{task.task_name}</h2>
                <p>Duration: {task.duration} minutes</p>
                <p>Date: {new Date(task.created_at).toLocaleDateString()}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default AllTask;
