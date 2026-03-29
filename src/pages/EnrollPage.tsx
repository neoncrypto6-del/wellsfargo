import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { AuthLayout } from '../components/AuthLayout';
import { UserPlusIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
const ACCOUNT_TYPES = ['Checking Account', 'Savings Account', 'Inheritance Account', 'Loan Account', 'Credit Card', 'Investment Account', 'Corporate Account'];
export function EnrollPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    username: '',
    phone_number: '',
    date_of_birth: '',
    password: '',
    ssn: '',
    address: '',
    account_type: ''
  });
  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
    setError('');
  }
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.full_name || !form.email || !form.username || !form.password || !form.account_type) {
      setError('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    setError('');
    const account_number = Math.floor(1000000000 + Math.random() * 9000000000).toString();
    const routing_number = Math.floor(100000000 + Math.random() * 900000000).toString();
    const {
      error: insertError
    } = await supabase.from('users').insert({
      ...form,
      account_number,
      routing_number,
      balance: 0
    });
    setLoading(false);
    if (insertError) {
      if (insertError.message.includes('duplicate') || insertError.message.includes('unique')) {
        setError('Username or email already exists. Please try a different one.');
      } else {
        setError(insertError.message);
      }
      return;
    }
    navigate('/login', {
      state: {
        enrolled: true
      }
    });
  }
  return <AuthLayout title="Enrollment">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 md:p-10">
            <div className="text-center mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-[#D71E28] mb-2">
                Let's set up your online access
              </h1>
              <p className="text-[#666] text-sm">
                First, we need some information from you.
              </p>
            </div>

            {error && <div className="bg-red-50 border border-red-200 text-[#D71E28] px-4 py-3 rounded-md mb-6 text-sm">
                {error}
              </div>}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                {/* Left Column - Personal Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-[#2D2D2D] border-b border-gray-100 pb-2 text-sm">
                    Personal Information
                  </h3>

                  <div>
                    <label className="block text-xs font-medium text-[#2D2D2D] mb-1">
                      Full Name *
                    </label>
                    <input name="full_name" value={form.full_name} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#D71E28] focus:ring-1 focus:ring-[#D71E28]" required />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#2D2D2D] mb-1">
                      Date of Birth
                    </label>
                    <input name="date_of_birth" type="date" value={form.date_of_birth} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#D71E28] focus:ring-1 focus:ring-[#D71E28]" />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#2D2D2D] mb-1">
                      SSN
                    </label>
                    <input name="ssn" value={form.ssn} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#D71E28] focus:ring-1 focus:ring-[#D71E28]" placeholder="XXX-XX-XXXX" />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#2D2D2D] mb-1">
                      Address
                    </label>
                    <textarea name="address" value={form.address} onChange={handleChange as any} rows={2} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#D71E28] focus:ring-1 focus:ring-[#D71E28] resize-none" />
                  </div>
                </div>

                {/* Right Column - Account Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-[#2D2D2D] border-b border-gray-100 pb-2 text-sm">
                    Account Details
                  </h3>

                  <div>
                    <label className="block text-xs font-medium text-[#2D2D2D] mb-1">
                      Account Type *
                    </label>
                    <select name="account_type" value={form.account_type} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#D71E28] focus:ring-1 focus:ring-[#D71E28] bg-white" required>
                      <option value="">Select account type</option>
                      {ACCOUNT_TYPES.map((type) => <option key={type} value={type}>
                          {type}
                        </option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#2D2D2D] mb-1">
                      Email Address *
                    </label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#D71E28] focus:ring-1 focus:ring-[#D71E28]" required />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#2D2D2D] mb-1">
                      Phone Number
                    </label>
                    <input name="phone_number" type="tel" value={form.phone_number} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#D71E28] focus:ring-1 focus:ring-[#D71E28]" />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#2D2D2D] mb-1">
                      Username *
                    </label>
                    <input name="username" value={form.username} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#D71E28] focus:ring-1 focus:ring-[#D71E28]" required />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#2D2D2D] mb-1">
                      Password *
                    </label>
                    <div className="relative">
                      <input name="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2 pr-10 text-sm focus:outline-none focus:border-[#D71E28] focus:ring-1 focus:ring-[#D71E28]" required />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-col items-center border-t border-gray-100 pt-6">
                <button type="submit" disabled={loading} className="w-full md:w-auto min-w-[200px] bg-[#D71E28] text-white px-8 py-2.5 rounded-full text-sm font-semibold hover:bg-[#B21B1C] transition-colors disabled:opacity-50">
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>

                <p className="mt-4 text-xs text-[#666]">
                  Already have an account?{' '}
                  <button type="button" onClick={() => navigate('/login')} className="text-[#D71E28] font-medium hover:underline">
                    Sign On
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthLayout>;
}