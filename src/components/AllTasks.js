import React, { useState, useEffect } from 'react';

function AllTasks() {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({ name: '', leverage: '', duration: '' });

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('allTasks') || '[]');
    setTasks(storedTasks);
  }, []);

  // ... other functions stay the same ...

  return (
    <div className="max-w-4xl mx-auto p-6">  {/* Changed container class to match Summary page */}
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        What You've Done
      </h1>

      <div className="bg-white rounded-lg shadow p-6">
        {/* Rest of your table code stays the same */}
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto">
            {/* ... table content ... */}
          </table>
        </div>
      </div>

      {/* Edit Modal stays the same */}
    </div>
  );
}

export default AllTasks;
