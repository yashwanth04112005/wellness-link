import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import * as sessionService from '../api/sessions';
import { useDebounce } from '../hooks/useDebounce'; 

const MySessionsPage = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState(''); 
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const debouncedKeyword = useDebounce(keyword, 500);

  const fetchMySessions = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const params = {
        keyword: debouncedKeyword,
        status: statusFilter,
        startDate: startDate,
        endDate: endDate,
      };
      const data = await sessionService.getMySessions(params); // Pass params to service
      setSessions(data);
    } catch (err) {
      console.error('Failed to fetch my sessions:', err);
      setError('Failed to load your sessions. Please try again.');
      if (err.response && err.response.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  }, [debouncedKeyword, statusFilter, startDate, endDate, isAuthenticated, logout]);

  useEffect(() => {
    fetchMySessions();
  }, [fetchMySessions]);


  return (
    <div className="py-8">
      <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-10">
        My Wellness Sessions
      </h1>
      <div className="text-right mb-6">
        <Link
          to="/my-sessions/new"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
        >
          Create New Session
        </Link>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Filter My Sessions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Keyword Search */}
          <div>
            <label htmlFor="my-keyword" className="block text-sm font-medium text-gray-700">
              Search by Title/Content
            </label>
            <input
              type="text"
              id="my-keyword"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="e.g., yoga, meditation"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label htmlFor="my-status" className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="my-status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">All</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          {/* Start Date Filter */}
          <div>
            <label htmlFor="my-startDate" className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              id="my-startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* End Date Filter */}
          <div>
            <label htmlFor="my-endDate" className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <input
              type="date"
              id="my-endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8 text-lg text-gray-700">Loading your sessions...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-600 text-lg">{error}</div>
      ) : sessions.length === 0 ? (
        <p className="text-center text-xl text-gray-600">No sessions available matching your criteria. <Link to="/my-sessions/new" className="text-indigo-600 hover:underline">Create one?</Link></p>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {sessions.map((session) => (
            <div
              key={session._id}
              className="bg-white p-6 rounded-lg shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex-grow mb-4 md:mb-0">
                <h2 className="text-2xl font-bold text-gray-800 mb-1">{session.title}</h2>
                <p className="text-sm text-gray-500 mb-2">
                  Last Updated: {new Date(session.updated_at).toLocaleDateString()}
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {session.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                  URL: <a href={session.json_file_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline break-all">{session.json_file_url}</a>
                </p>
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                    session.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                </span>
              </div>

              {/* Actions */}
              <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
                <Link
                  to={`/my-sessions/edit/${session._id}`}
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300"
                >
                  Edit
                </Link>
                {/* Placeholder for Delete button - functionality not yet implemented */}
                {/*
                <button
                  onClick={() => handleDelete(session._id)}
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Delete
                </button>
                */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MySessionsPage;