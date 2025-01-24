// ... previous imports stay the same ...

function Timer() {
  // ... previous state declarations ...

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} min${mins !== 1 ? 's' : ''}`;
  };

  const updateTaskLeverage = (taskId, newLeverage) => {
    const existingTasks = JSON.parse(localStorage.getItem('allTasks') || '[]');
    const updatedTasks = existingTasks.map(task => 
      task.id === taskId ? { ...task, leverage: newLeverage } : task
    );
    localStorage.setItem('allTasks', JSON.stringify(updatedTasks));
    
    // Update recent tasks display
    setRecentTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, leverage: newLeverage } : task
      )
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {!isTimerActive ? (
        <>
          {/* ... existing header and input form ... */}

          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4">Recent tasks</h2>
            <ul className="space-y-3">
              {recentTasks.map((task) => (
                <li 
                  key={task.id} 
                  className="flex items-center justify-between p-3 bg-gray-50 rounded"
                >
                  <div>
                    <span className="text-gray-800">{task.name}</span>
                    <span className="text-gray-500 text-sm ml-2">
                      {formatDuration(task.duration)}
                    </span>
                  </div>
                  <select
                    value={task.leverage || 'High'}
                    onChange={(e) => updateTaskLeverage(task.id, e.target.value)}
                    className="ml-4 p-1 border rounded text-sm"
                  >
                    <option value="High">High leverage</option>
                    <option value="Medium">Medium leverage</option>
                    <option value="Low">Low leverage</option>
                  </select>
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        // ... existing timer active view ...
      )}
    </div>
  );
}
