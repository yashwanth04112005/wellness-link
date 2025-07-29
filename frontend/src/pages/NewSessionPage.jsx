import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as sessionService from '../api/sessions';
import { useAuth } from '../contexts/AuthContext';
import { useDebounce } from '../hooks/useDebounce';

const NewSessionPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [jsonFileUrl, setJsonFileUrl] = useState('');
  const [status, setStatus] = useState('draft');

  const [loading, setLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [error, setError] = useState('');

  const debouncedTitle = useDebounce(title, 1000);
  const debouncedTags = useDebounce(tags, 1000);
  const debouncedJsonFileUrl = useDebounce(jsonFileUrl, 1000);

  useEffect(() => {
   
    if (isAuthenticated && (debouncedTitle || debouncedTags || debouncedJsonFileUrl)) {
      const autoSaveDraft = async () => {
        setSaveMessage('Auto-saving draft...');
        setError('');
        try {
          const sessionData = {
            title: debouncedTitle,
            tags: debouncedTags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
            json_file_url: debouncedJsonFileUrl,
            status: 'draft', 
          };
          await sessionService.saveDraftSession(sessionData);
          setSaveMessage('Draft auto-saved!');
          setTimeout(() => setSaveMessage(''), 3000);
        } catch (err) {
          console.error('Auto-save failed:', err);
          setError('Auto-save failed!');
          setSaveMessage('');
        }
      };
      autoSaveDraft();
    }
  }, [debouncedTitle, debouncedTags, debouncedJsonFileUrl, isAuthenticated]); 

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!title || !jsonFileUrl) { 
      setError('Title and JSON File URL are required.');
      setLoading(false);
      return;
    }

    try {
      const sessionData = {
        title,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
        json_file_url: jsonFileUrl,
        status: 'draft',
      };

      const newSession = await sessionService.saveDraftSession(sessionData);
      setSaveMessage('Session saved as draft!');
      navigate(`/my-sessions/edit/${newSession._id}`); 
    } catch (err) {
      console.error('Failed to save session:', err);
      setError(err.response?.data?.message || 'Failed to save session.');
    } finally {
      setLoading(false);
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!title || !jsonFileUrl) {
      setError('Title and JSON File URL are required to publish.');
      setLoading(false);
      return;
    }

    try {
      
      const draftSessionData = {
        title,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
        json_file_url: jsonFileUrl,
        status: 'draft',
      };

      const savedSession = await sessionService.saveDraftSession(draftSessionData);

      await sessionService.publishSession(savedSession._id);
      setSaveMessage('Session published successfully!');
      navigate('/my-sessions'); 
    } catch (err) {
      console.error('Failed to publish session:', err);
      setError(err.response?.data?.message || 'Failed to publish session.');
    } finally {
      setLoading(false);
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  return (
    <div className="py-8">
      <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-10">
        Create New Wellness Session
      </h1>
      <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-xl">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        {saveMessage && (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative mb-4" role="status">
            <span className="block sm:inline">{saveMessage}</span>
          </div>
        )}

        <form className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g., yoga, meditation, mindfulness"
            />
          </div>

          <div>
            <label htmlFor="jsonFileUrl" className="block text-sm font-medium text-gray-700 mb-1">
              JSON File URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url" 
              id="jsonFileUrl"
              value={jsonFileUrl}
              onChange={(e) => setJsonFileUrl(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="e.g., https://example.com/session_content.json"
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
            <button
              type="button"
              onClick={handleSave}
              disabled={loading}
              className={`flex-1 py-3 px-6 border border-transparent rounded-md shadow-sm text-lg font-medium text-white ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300`}
            >
              {loading ? 'Saving Draft...' : 'Save as Draft'}
            </button>
            <button
              type="button"
              onClick={handlePublish}
              disabled={loading}
              className={`flex-1 py-3 px-6 border border-transparent rounded-md shadow-sm text-lg font-medium text-white ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300`}
            >
              {loading ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewSessionPage;