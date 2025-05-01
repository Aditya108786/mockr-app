
// pages/auth.js
// pages/auth.js
import { useState } from 'react';
import { useAuth } from '../context/authcontext'; // Adjust path if needed
import { useRouter } from 'next/router';

export default function Auth() {
  const { login, register } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password || (!isLogin && !username)) {
      setError('All fields are required');
      return;
    }

    const isValidEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!isValidEmail.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      if (isLogin) {
        // ==== Backend Integration for Login ====
        /*
        const response = await fetch('http://localhost:5000/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Login failed');
        login(data); // Store user data in context
        */

        // ==== Without backend (dummy login) ====
        await login({ email, password });

        router.push('/dashboard');
      } else {
        // ==== Backend Integration for Register ====
        /*
        const response = await fetch('http://localhost:5000/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Registration failed');
        register(data); // Store user data in context
        */

        // ==== Without backend (dummy register) ====
        await register({ email, password });
          alert("registered")
        //router.push('/');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto p-8 bg-white rounded-lg shadow-md mt-8">
        <h1 className="text-3xl font-semibold mb-4 text-center text-black">{isLogin ? 'Login' : 'Register'}</h1>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-lg font-medium text-black">Username</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg text-black"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
              />
            </div>
          )}

          <div>
            <label className="block text-lg font-medium text-black">Email</label>
            <input
              type="email"
              className="w-full p-2 border border-gray-300 rounded-lg text-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-black">Password</label>
            <input
              type="password"
              className="w-full p-2 border border-gray-300 rounded-lg text-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <p className="mt-4 text-center text-black">
          {isLogin ? (
            <>
              Don't have an account?{' '}
              <a
                onClick={() => setIsLogin(false)}
                className="text-blue-500 hover:underline cursor-pointer "
              >
                Register here
              </a>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <a
                onClick={() => setIsLogin(true)}
                className="text-blue-500 hover:underline cursor-pointer"
              >
                Login here
              </a>
            </>
          )}
        </p>
      </div>

      <footer className="text-center mt-8 py-4 bg-gray-800 text-white">
        <p>&copy; 2025 Your Company. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
