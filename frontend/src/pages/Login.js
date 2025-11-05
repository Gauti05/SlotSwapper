import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch {
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-500 px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg transform transition-transform hover:scale-105">
        <h2 className="text-3xl font-extrabold text-center mb-8 text-indigo-700">
          Login to SlotSwapper
        </h2>
        {error && <p className="mb-4 text-red-600 animate-fadeIn">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 font-semibold text-gray-700">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 text-gray-900 rounded-md border border-gray-300 focus:ring-4 focus:ring-indigo-400 focus:outline-none transition"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold text-gray-700">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 text-gray-900 rounded-md border border-gray-300 focus:ring-4 focus:ring-indigo-400 focus:outline-none transition"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center items-center gap-2 px-4 py-3 font-bold text-white rounded-md transition ${
              loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            ) : (
              'Login'
            )}
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600">
          New here?{' '}
          <Link to="/signup" className="text-indigo-700 hover:underline font-medium transition">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
