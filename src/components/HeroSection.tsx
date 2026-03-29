import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';

export function HeroSection() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter username and password');
      return;
    }
    setLoading(true);
    setError('');
    const { error: loginError } = await login(username, password);
    setLoading(false);
    if (loginError) {
      setError(loginError);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <section className="relative bg-[#F5F5F5] w-full min-h-[600px] overflow-hidden">
      {/* Background Image – full section coverage */}
      <div className="absolute inset-0 hidden md:block pointer-events-none">
        <img
          src="/image_11.png"
          alt="Hero background"
          className="w-full h-full object-cover object-center"
          style={{
            maskImage: 'linear-gradient(to right, transparent 30%, black 55%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 30%, black 55%)'
          }} />
        
      </div>

      {/* Main content container */}
      <div className="relative max-w-[1400px] mx-auto px-4 md:px-8 py-12 flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-10 lg:gap-12 z-10">
        {/* Left Sign-on Card – fixed width */}
        <div className="w-full md:w-[380px] bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] overflow-hidden flex-shrink-0">
          <div className="p-8">
            <h2 className="text-[28px] font-normal text-[#2D2D2D] mb-1">
              {greeting}
            </h2>
            <p className="text-sm text-[#666666] mb-6">
              Sign on to manage your accounts.
            </p>

            {error &&
            <div className="bg-red-50 text-[#D71E28] p-3 rounded-md text-sm mb-4">
                {error}
              </div>
            }

            <form className="space-y-5" onSubmit={handleLogin}>
              <div>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full border-b border-gray-400 py-2 focus:outline-none focus:border-[#D71E28] placeholder-gray-500 text-[15px]" />
                
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-b border-gray-400 py-2 focus:outline-none focus:border-[#D71E28] placeholder-gray-500 text-[15px]" />
                
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-2 text-sm text-blue-700 hover:underline">
                  
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>

              <div className="flex items-center pt-2">
                <input
                  type="checkbox"
                  id="save-username"
                  className="w-4 h-4 border-gray-400 rounded-sm mr-2 accent-[#D71E28]" />
                
                <label
                  htmlFor="save-username"
                  className="text-[15px] text-[#2D2D2D]">
                  
                  Save username
                </label>
              </div>

              <div className="flex items-center space-x-4 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#D71E28] text-white px-8 py-2.5 rounded-full font-semibold hover:bg-[#B21B1C] transition-colors disabled:opacity-50">
                  
                  {loading ? 'Signing On...' : 'Sign On'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/enroll')}
                  className="text-blue-700 hover:underline text-[15px]">
                  
                  Enroll
                </button>
              </div>
            </form>
          </div>

          <div className="bg-[#F4F4F4] p-6 border-t border-gray-200 space-y-2">
            <a href="#" className="block text-sm text-[#2D2D2D] hover:underline">
              Sign on with a passkey
            </a>
            <a href="#" className="block text-sm text-[#2D2D2D] hover:underline">
              Forgot username or password?
            </a>
            <a href="#" className="block text-sm text-[#2D2D2D] hover:underline">
              Privacy, Cookies, and Legal
            </a>
          </div>
        </div>

        {/* Right Content – now much closer to the card */}
        <div className="flex-1 text-left max-w-xl">
          <h1 className="text-[40px] md:text-[44px] leading-[1.1] font-normal text-[#2D2D2D] mb-4">
            Checking that fits perfectly
          </h1>
          <p className="text-lg md:text-xl text-[#2D2D2D] mb-6 md:mb-8">
            Explore all the benefits then find a checking account that suits your lifestyle
          </p>
          <button
            onClick={() => navigate('/enroll')}
            className="border border-[#2D2D2D] text-[#2D2D2D] px-6 py-2.5 rounded-full font-medium hover:bg-gray-100 transition-colors">
            
            Get started &gt;&gt;
          </button>
        </div>
      </div>
    </section>);

}