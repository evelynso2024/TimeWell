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
      console.error("Error signing out:", error);
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
          <Timer setIsTimerActive={setIsTimerActive} />
        </div>

        {/* Features Section */}
        <div className="bg-white py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose TimeWell?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="text-blue-500 text-4xl mb-4">⏱️</div>
                <h3 className="text-xl font-semibold mb-3">Simple Time Tracking</h3>
                <p className="text-gray-600">Start tracking your time with just one click. No complicated setup required.</p>
              </div>
              <div className="text-center p-6">
                <div className="text-blue-500 text-4xl mb-4">📊</div>
                <h3 className="text-xl font-semibold mb-3">Task Analytics</h3>
                <p className="text-gray-600">Get insights into how you spend your time with detailed task analytics.</p>
              </div>
              <div className="text-center p-6">
                <div className="text-blue-500 text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold mb-3">Impact Tracking</h3>
                <p className="text-gray-600">Identify and focus on your highest-leverage activities.</p>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <h3 className="font-semibold mb-2">Sign Up</h3>
                <p className="text-gray-600">Create your free account</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <h3 className="font-semibold mb-2">Add Task</h3>
                <p className="text-gray-600">Enter your task name</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold">3</span>
                </div>
                <h3 className="font-semibold mb-2">Start Timer</h3>
                <p className="text-gray-600">Click to start tracking</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold">4</span>
                </div>
                <h3 className="font-semibold mb-2">Rate Impact</h3>
                <p className="text-gray-600">Evaluate task leverage</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-8">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">TimeWell</h3>
              <p className="text-gray-400">© 2024 TimeWell. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default LandingPage;
