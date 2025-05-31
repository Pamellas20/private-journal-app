'use client';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, googleProvider as provider } from '@/lib/firebase';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Check if user is already authenticated
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/dashboard');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await signInWithPopup(auth, provider);
      // Wait for the auth state to be fully updated
      if (result.user) {
        // Get ID token to ensure it's valid
        await result.user.getIdToken();
        router.push('/dashboard');
      }
    } catch (error: unknown) {
      console.error('Google sign-in failed:', error);
      setError(error instanceof Error ? error.message : 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async () => {
    setLoading(true);
    setError('');
    try {
      let result;
      if (mode === 'signup') {
        result = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        result = await signInWithEmailAndPassword(auth, email, password);
      }
      
      // Wait for the auth state to be fully updated and get token
      if (result.user) {
        await result.user.getIdToken();
        router.push('/dashboard');
      }
    } catch (error: unknown) {
      console.error('Email auth failed:', error);
      setError(error instanceof Error ? error.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-8">
          {mode === 'login' ? 'Login to Your Journal' : 'Create Your Account'}
        </h1>

        {/* Google Sign In */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors mb-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {loading ? 'Signing In...' : 'Sign In with Google'}
        </button>

        {/* Divider */}
        <div className="flex items-center mb-4">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-3 text-gray-500 text-sm">or</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* Email Input */}
        <input
          type="email"
          placeholder="Please enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent text-black disabled:opacity-50"
        />

        {/* Password Input */}
        <input
          type="password"
          placeholder="Please enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent text-black disabled:opacity-50"
        />

        {/* Submit Button */}
        <button
          onClick={handleEmailAuth}
          disabled={loading || !email || !password}
          className="w-full bg-gray-900 text-white py-3 px-4 rounded-md hover:bg-gray-800 transition-colors mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading 
            ? (mode === 'signup' ? 'Creating Account...' : 'Logging In...') 
            : (mode === 'signup' ? 'Sign Up' : 'Log In')
          }
        </button>

        {/* Mode Toggle */}
        <p className="text-center text-gray-600">
          {mode === 'login' ? (
            <>
              {"Don't have an account? "}
              <button 
                onClick={() => setMode('signup')}
                disabled={loading}
                className="text-gray-900 hover:underline font-medium disabled:opacity-50"
              >
                Sign Up
              </button>
            </>
          ) : (
            <>
              {"Already have an account? "}
              <button 
                onClick={() => setMode('login')}
                disabled={loading}
                className="text-gray-900 hover:underline font-medium disabled:opacity-50"
              >
                Log In
              </button>
            </>
          )}
        </p>

        {error && (
          <p className="text-red-600 text-sm mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
