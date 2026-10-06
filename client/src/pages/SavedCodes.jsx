import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import Navbar from '../components/Navbar';

export default function SavedCodes() {
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSnippets = async () => {
      try {
        const res = await API.get('/code');
        setSnippets(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSnippets();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this code?')) return;

    try {
      await API.delete(`/code/${id}`);
      setSnippets(snippets.filter((s) => s._id !== id));
    } catch (err) {
      alert('Failed to delete');
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">My Saved Codes</h1>

        {loading ? (
          <p>Loading...</p>
        ) : snippets.length === 0 ? (
          <p className="text-gray-400">No saved codes yet.</p>
        ) : (
          <div className="space-y-4">
            {snippets.map((snippet) => (
              <div
                key={snippet._id}
                className="bg-gray-900 p-4 rounded-lg border border-gray-700 flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold text-lg">{snippet.title}</h3>
                  <p className="text-sm text-gray-400">
                    Language: {snippet.language} •{' '}
                    {new Date(snippet.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex gap-3">
                  <Link
                    to="/"
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                  >
                    Open
                  </Link>
                  <button
                    onClick={() => handleDelete(snippet._id)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}