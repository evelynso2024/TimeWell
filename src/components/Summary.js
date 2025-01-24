// ... existing imports stay the same ...

function Summary() {
  // ... existing state and functions stay the same ...

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Added heading */}
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        How You Spent Your Time
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 text-center">Task Count by Leverage</h2>
          <Bar data={barData} options={chartOptions} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 text-center">Task Distribution (%)</h2>
          <Doughnut data={doughnutData} options={doughnutOptions} />
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        {/* ... existing summary cards stay the same ... */}
      </div>
    </div>
  );
}

export default Summary;
