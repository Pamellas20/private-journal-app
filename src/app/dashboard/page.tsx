'use client';

import { useState, useEffect } from 'react';
import { auth, signOutUser } from '@/lib/firebase';
import { Trash2 } from 'lucide-react';

// Define Entry interface
interface Entry {
  id: string;
  title?: string;
  content: string;
  createdAt: string;
}

export default function Dashboard() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchEntries = async () => {
      const user = auth.currentUser;
      const token = user ? await user.getIdToken() : null;
      if (!token) {
        alert('User not authenticated.');
        return;
      }

      const res = await fetch('/api/entries', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        console.log('Fetched entries:', data);
        setEntries(data);
      } else {
        console.error('Fetch failed:', await res.text());
      }
    };

    fetchEntries();
  }, []); // No dependency needed since fetchEntries is defined inside

  const handleAddEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;
    const token = user ? await user.getIdToken() : null;
    if (!token) {
      alert('User not authenticated.');
      return;
    }

    const res = await fetch('/api/entries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content }),
    });

    if (res.ok) {
      console.log('POST response:', await res.json());
      setTitle('');
      setContent('');
      setShowForm(false);
      const fetchEntries = async () => {
        const user = auth.currentUser;
        const token = user ? await user.getIdToken() : null;
        if (token) {
          const res = await fetch('/api/entries', {
            headers: { 'Authorization': `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            setEntries(data);
          }
        }
      };
      fetchEntries();
    } else {
      alert('Failed to add entry: ' + await res.text());
    }
  };

  const handleDelete = async (id: string) => {
    const user = auth.currentUser;
    const token = user ? await user.getIdToken() : null;
    if (!token) {
      alert('User not authenticated.');
      return;
    }

    const confirmDelete = window.confirm('Are you sure you want to delete this entry?');
    if (!confirmDelete) return;

    const res = await fetch(`/api/entries?id=${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (res.ok) {
      console.log('Delete successful:', await res.json());
      const fetchEntries = async () => {
        const user = auth.currentUser;
        const token = user ? await user.getIdToken() : null;
        if (token) {
          const res = await fetch('/api/entries', {
            headers: { 'Authorization': `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            setEntries(data);
          }
        }
      };
      fetchEntries();
    } else {
      alert('Failed to delete entry: ' + await res.text());
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      window.location.href = '/login';
    } catch (error: unknown) {
      alert('Sign-out failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto bg-gray-50 min-h-screen flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Personal Journal</h1>
        <button onClick={handleSignOut} className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">
          Sign Out
        </button>
      </div>
      <div className="mb-6">
        <button
          onClick={() => setShowForm(true)}
          className="bg-gray-800 text-white px-4 py-2 rounded flex items-center hover:bg-gray-700"
        >
          <span className="mr-2">+</span> New Entry
        </button>
      </div>
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-bold mb-4">New Journal Entry</h2>
          <form onSubmit={handleAddEntry} className="space-y-4">
            <div>
              <label className="block text-gray-700">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
                placeholder="Give your entry a title"
              />
            </div>
            <div>
              <label className="block text-gray-700">Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-gray-500"
                placeholder="Write your thoughts here..."
                rows={4}
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:underline"
              >
                Cancel
              </button>
              <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700">
                Save Entry
              </button>
            </div>
          </form>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-grow">
        {entries.length === 0 ? (
          <p className="text-gray-500 text-center col-span-2">No entries found. Add a new entry to get started!</p>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-lg text-gray-800">{entry.title || 'Untitled'}</h3>
              <p className="text-gray-600 text-sm mb-2">
                {new Date(entry.createdAt).toLocaleString()}
              </p>
              <p className="text-gray-700 mb-4">{entry.content}</p>
              <button
                onClick={() => handleDelete(entry.id)}
                className=" hover:text-red-600 text-gray-900 px-4 py-2 rounded transition-colors"
              >
                <Trash2 className="w-5 h-5 inline-block mr-1" />
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      <footer className="py-4 text-center text-gray-500 text-sm">
        © 2025 Personal Journal App
      </footer>
    </div>
  );
}