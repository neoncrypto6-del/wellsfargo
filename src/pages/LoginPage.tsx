import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { AuthLayout } from '../components/AuthLayout';
import { EyeIcon, EyeOffIcon, LogInIcon } from 'lucide-react';
export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    login
  } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const enrolled = (location.state as any)?.enrolled;
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }
    setLoading(true);
    setError('');
    const success = await login(username, password);
    setLoading(false);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Invalid username or password. Please try again.');
    }
  }
  return <AuthLayout title="Sign On">
      <div className="max-w-md mx-auto mt-8">
        {enrolled && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm">
            Account created successfully! Please sign on with your credentials.
          </div>}

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <LogInIcon className="w-6 h-6 text-[#D71E28]" />
              <h1 className="text-2xl font-bold text-[#2D2D2D]">Sign On</h1>
            </div>

            {error && <div className="bg-red-50 border border-red-200 text-[#D71E28] px-4 py-3 rounded-lg mb-6 text-sm">
                {error}
              </div>}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <input type="text" value={username} onChange={(e) => {
                setUsername(e.target.value);
                setError('');
              }} placeholder="Username" className="w-full border-b-2 border-gray-300 py-3 focus:outline-none focus:border-[#D71E28] transition-colors text-[15px]" />
              </div>

              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }} placeholder="Password" className="w-full border-b-2 border-gray-300 py-3 pr-16 focus:outline-none focus:border-[#D71E28] transition-colors text-[15px]" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-0 top-3 text-gray-400 hover:text-gray-600 flex items-center gap-1">
                  {showPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                  <span className="text-sm">
                    {showPassword ? 'Hide' : 'Show'}
                  </span>
                </button>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <button type="submit" disabled={loading} className="bg-[#D71E28] text-white px-10 py-2.5 rounded-full font-semibold hover:bg-[#B21B1C] transition-colors disabled:opacity-50">
                  {loading ? <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Signing On...
                    </span> : 'Sign On'}
                </button>
                <button type="button" onClick={() => navigate('/enroll')} className="text-blue-700 hover:underline text-[15px]">
                  Enroll
                </button>
              </div>
            </form>
          </div>

          <div className="bg-[#F4F4F4] p-6 border-t border-gray-200 space-y-2">
            <p className="text-sm text-[#2D2D2D]">
              Forgot username or password?
            </p>
            <p className="text-sm text-[#2D2D2D]">
              Privacy, Cookies, and Legal
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>;
}