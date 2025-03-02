import React, { useState, useEffect } from 'react';
import Timer from './Timer';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const navigate = useNavigate();
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (!error) {
        navigate('/login');
      }
    } catch (error) {
      console.error("Error signing out:", error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-lg fixed w-full z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-blue-600">TimeWell</span>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <button
                    onClick={() => navigate('/alltasks')}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    View All Tasks
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-16">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-20">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6">
              Turn your Time into Impact
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              A smarter way to stay focused and be mindful of how you spend your time.
            </p>
            {!user && (
              <button
                onClick={() => navigate('/login')}
                className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-50 transition duration-200"
              >
                Get Started - It's Free
              </button>
            )}
          </div>
        </div>

        {/* Timer Section */}
        <div className="max-w-6xl mx-auto px-4 py-12">
          <Timer />
        </div>

        {/* Rest of your landing page content remains the same */}
        {/* Features Section */}
        {/* How It Works Section */}
        {/* Footer */}
        {/* ... */}
      </div>
    </div>
  );
}

export default LandingPage;
