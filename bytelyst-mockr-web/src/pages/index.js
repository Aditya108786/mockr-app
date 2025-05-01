
// pages/index.js
import React from 'react';

const LandingPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-24 px-6 text-center">
        <h1 className="text-5xl font-extrabold mb-4">Welcome to Mockr</h1>
        <p className="text-2xl">Your AI-powered mock interview platform</p>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-lg transition">
            <h3 className="text-2xl font-semibold mb-4 text-blue-600">Mock Interviews</h3>
            <p className="text-gray-600">Practice real-world interviews with AI-driven scenarios customized to your skills.</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-lg transition">
            <h3 className="text-2xl font-semibold mb-4 text-blue-600">Performance Tracking</h3>
            <p className="text-gray-600">Track your growth with detailed feedback and performance reports after every session.</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-lg transition">
            <h3 className="text-2xl font-semibold mb-4 text-blue-600">AI Insights</h3>
            <p className="text-gray-600">Get smart suggestions to improve your answers, communication, and confidence.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-100 py-20 px-6">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">How It Works</h2>
        <div className="max-w-4xl mx-auto text-lg text-gray-700 leading-8">
          <ol className="list-decimal list-inside">
            <li className="mb-4">Sign up and set your job preferences.</li>
            <li className="mb-4">Take mock interviews tailored to your goals.</li>
            <li className="mb-4">Review AI feedback and improve continuously.</li>
            <li className="mb-4">Crush your real interviews with confidence!</li>
          </ol>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">What Our Users Say</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-lg transition">
            <p className="text-gray-600 mb-4">
              "Mockr helped me land my dream tech job! The mock interviews felt real and the feedback was super helpful."
            </p>
            <h4 className="font-semibold text-blue-600">— Priya Sharma</h4>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-lg transition">
            <p className="text-gray-600 mb-4">
              "Thanks to Mockr, I went from nervous to confident. Definitely a game-changer for job preparation!"
            </p>
            <h4 className="font-semibold text-blue-600">— Aman Verma</h4>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-center py-6">
        <p>&copy; 2025 Mockr. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
