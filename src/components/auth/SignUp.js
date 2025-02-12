function SignUp() {
  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Create your TimeWell account</h2>
      
      {/* Email Sign Up */}
      <form className="space-y-4">
        <input 
          type="email" 
          placeholder="Email"
          className="w-full p-2 border rounded"
        />
        <input 
          type="password" 
          placeholder="Password"
          className="w-full p-2 border rounded"
        />
        <button 
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          Sign Up
        </button>
      </form>

      {/* Google Sign Up */}
      <button 
        className="w-full mt-4 border p-2 rounded flex items-center justify-center"
      >
        <img src="google-icon.png" className="w-6 h-6 mr-2" />
        Sign up with Google
      </button>
    </div>
  );
}
