"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Your Personal Journal
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          A simple space to capture your thoughts, memories, and reflections.
        </p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => router.push("/login")}
            className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer"
          >
            Get Started
          </button>

          <button
            onClick={() => router.push("/about")}
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors  cursor-pointer"
          >
            Learn More
          </button>
        </div>
      </div>
      <footer className="my-10 text-gray-500 text-sm">
        © 2025 Personal Journal App
      </footer>
      
    
    </div>
  );
}