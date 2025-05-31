'use client';

import { useRouter } from 'next/navigation';
import { PenLine, BookOpen, Lock } from 'lucide-react';

export default function About() {
  const router = useRouter();

  const handleStartJournaling = () => {
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-6">
      <header className="w-full max-w-4xl flex justify-between items-center py-4">
        <h2 className="text-xl font-bold text-gray-900">Personal Journal</h2>
        <button
          onClick={handleStartJournaling}
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
        >
          Sign In
        </button>
      </header>

      <main className="flex flex-col items-center justify-center flex-grow">
        <div className="max-w-2xl text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About Personal Journal
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            A private space for your thoughts, memories, and reflections.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <PenLine className="w-8 h-8 mx-auto mb-2 text-gray-700" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Write</h3>
              <p className="text-gray-600">
                Capture your thoughts, ideas, and memories in a clean interface.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <BookOpen className="w-8 h-8 mx-auto mb-2 text-gray-700" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Reflect</h3>
              <p className="text-gray-600">
                Review past entries to see how you’ve grown and changed over time.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <Lock className="w-8 h-8 mx-auto mb-2 text-gray-700" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Private</h3>
              <p className="text-gray-600">
                Your entries are private and secure, accessible only to you.
              </p>
            </div>
          </div>

          <button
            onClick={handleStartJournaling}
            className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer"
          >
            Start Journaling
          </button>
        </div>
      </main>

      <footer className="py-4 text-center text-gray-500 text-sm">
        © 2025 Personal Journal App
      </footer>
    </div>
  );
}