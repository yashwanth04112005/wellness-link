import React, { useEffect, useState, useCallback } from 'react';
import * as sessionService from '../api/sessions';
import { useDebounce } from '../hooks/useDebounce'; 

const DashboardPage = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [keyword, setKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState(''); 
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const debouncedKeyword = useDebounce(keyword, 500);

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {
        keyword: debouncedKeyword,
        startDate: startDate,
        endDate: endDate,
      };
      const data = await sessionService.getPublicSessions(params); 
      setSessions(data);
    } catch (err) {
      console.error('Failed to fetch public sessions:', err);
      setError('Failed to load public sessions. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [debouncedKeyword, startDate, endDate]);
  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]); 


  return (
    <div className="py-8">
      <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-10">
        Public Wellness Sessions
      </h1>

      {/* Search and Filter Bar */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Filter Sessions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Keyword Search */}
          <div>
            <label htmlFor="keyword" className="block text-sm font-medium text-gray-700">
              Search by Title/Content
            </label>
            <input
              type="text"
              id="keyword"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="e.g., yoga, meditation"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

        
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Status (Always Public)
            </label>
            <select
              id="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              disabled 
            >
              <option value="">All</option>
              <option value="published">Published</option>
            </select>
          </div>

          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8 text-lg text-gray-700">Loading sessions...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-600 text-lg">{error}</div>
      ) : sessions.length === 0 ? (
        <p className="text-center text-xl text-gray-600">No public sessions available matching your criteria.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sessions.map((session) => (
            <div
              key={session._id}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{session.title}</h2>
              <p className="text-sm text-gray-500 mb-3">
                Published: {new Date(session.updated_at).toLocaleDateString()}
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {session.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-gray-700 mb-4 line-clamp-3">
                Content URL: <a href={session.json_file_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline break-all">{session.json_file_url}</a>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;