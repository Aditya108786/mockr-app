
// pages/dashboard.js
// pages/dashboard.js
import React from 'react';
import { useAuth } from '../context/authcontext';
import { useRouter } from 'next/router';
import ProtectedRoute from 'impt/components/Protectedroute';

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();

  // Redirect to the interview page when the "Start Interview" button is clicked
  const goToInterview = () => {
    router.push('/interview');
  };

  return (
    <ProtectedRoute>
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Welcome */}
      <h1 className="text-4xl font-bold mb-8 text-center">
        Welcome back, <span className="text-blue-600">{user?.username || user?.email}</span>!
      </h1>

      {/* Performance Overview Section */}
      <div className="bg-white rounded-2xl shadow-md p-8 hover:shadow-lg transition">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Performance Overview</h2>

        {/* Static Placeholder Report */}
        <div className="space-y-4 text-gray-700">
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Frontend Mock Interview</span>
            <span className="text-green-600 font-semibold">85%</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Backend Mock Interview</span>
            <span className="text-yellow-600 font-semibold">72%</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Full Stack Project Review</span>
            <span className="text-blue-600 font-semibold">90%</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">System Design Session</span>
            <span className="text-red-600 font-semibold">65%</span>
          </div>
        </div>

        {/* Report Summary */}
        <div className="mt-8">
          <h3 className="text-2xl font-semibold mb-6 text-gray-800">Summary:</h3>
          <p className="text-gray-600 leading-relaxed">
            You have shown strong skills in Full Stack and Frontend development.
            Focus on improving system design and backend architecture to boost your overall performance.
            Keep practicing and you'll ace your interviews!
          </p>
        </div>

        {/* Button to navigate to Interview */}
        <div className="mt-8 text-center">
          <button
            onClick={goToInterview}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Start Interview
          </button>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}
