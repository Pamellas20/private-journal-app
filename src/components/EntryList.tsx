'use client';

import { JournalEntry } from '@/lib/types';

export default function EntryList({ entries }: { entries: JournalEntry[] }) {
  const handleDelete = async (id: string) => {
    await fetch(`/api/entries/${id}`, { method: 'DELETE' });
    window.location.reload(); // Refresh page (or use router.refresh() with revalidation)
  };

  return (
    <div className="space-y-4">
      {entries.map((entry) => (
        <div key={entry.id} className="p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold">{entry.title}</h2>
          <p className="text-gray-600">{entry.content}</p>
          <p className="text-sm text-gray-400">{new Date(entry.createdAt).toLocaleString()}</p>
          <button
            onClick={() => handleDelete(entry.id)}
            className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}