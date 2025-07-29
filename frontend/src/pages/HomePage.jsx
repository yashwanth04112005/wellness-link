import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] text-center bg-gray-50 p-8 rounded-lg shadow-lg">
      <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
        Welcome to WellnessLink!
      </h1>
      <p className="text-xl text-gray-700 mb-8 max-w-2xl">
        Your personal platform for drafting, publishing, and managing wellness sessions.
        Connect with a healthier you.
      </p>
      <div className="space-x-4">
        <Link
          to="/dashboard"
          className="inline-flex items-center px-8 py-3 border border-transparent text-lg font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
        >
          Explore Public Sessions
        </Link>
        <Link
          to="/register"
          className="inline-flex items-center px-8 py-3 border border-transparent text-lg font-medium rounded-full shadow-sm text-blue-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
        >
          Join Us
        </Link>
      </div>
    </div>
  );
};

export default HomePage;