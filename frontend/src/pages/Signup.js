import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signup(name, email, password);
      navigate('/dashboard');
    } catch {
      setError('Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-tr from-purple-600 via-indigo-700 to-blue-800 px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-xl transform transition-transform hover:scale-105">
        <h2 className="text-3xl font-extrabold text-center mb-8 text-indigo-800">
          Create Your Account
        </h2>
        {error && <p className="mb-4 text-red-600 animate-fadeIn">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 font-semibold text-gray-700">Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-3 text-gray-900 rounded-md border border-gray-300 focus:ring-4 focus:ring-indigo-500 focus:outline-none transition"
              placeholder="Your full name"
            />
          </div>
          <div>
            <label className="block mb-2 font-semibold text-gray-700">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 text-gray-900 rounded-md border border-gray-300 focus:ring-4 focus:ring-indigo-500 focus:outline-none transition"
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
              className="w-full px-4 py-3 text-gray-900 rounded-md border border-gray-300 focus:ring-4 focus:ring-indigo-500 focus:outline-none transition"
              placeholder="Choose a password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center items-center gap-2 px-4 py-3 font-bold text-white rounded-md bg-indigo-700 hover:bg-indigo-800 transition ${
              loading ? 'cursor-not-allowed opacity-75' : ''
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
              'Sign Up'
            )}
          </button>
        </form>
        <p className="mt-6 text-center text-gray-700">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-800 hover:underline font-medium transition">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
