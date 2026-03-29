import React, { useState } from 'react';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { DashboardLayout } from '../components/DashboardLayout';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
export function ChangePasswordPage() {
  const {
    user,
    refreshUser
  } = useAuth();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }
    if (oldPassword !== user?.password) {
      setError('Old password is incorrect.');
      return;
    }
    setLoading(true);
    const {
      error: updateError
    } = await supabase.from('users').update({
      password: newPassword
    }).eq('id', user!.id);
    setLoading(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    await refreshUser();
    setSuccess(true);
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  }
  return <DashboardLayout showBackToDashboard title="Change Password">
      <div className="max-w-md">
        {success && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm">
            Password changed successfully!
          </div>}

        <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
          {error && <div className="bg-red-50 border border-red-200 text-[#D71E28] px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <label className="block text-sm font-medium text-[#2D2D2D] mb-1">
                Old Password
              </label>
              <input type={showOld ? 'text' : 'password'} value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:border-[#D71E28]" required />
              <button type="button" onClick={() => setShowOld(!showOld)} className="absolute right-3 top-9 text-gray-400 hover:text-gray-600">
                {showOld ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
              </button>
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-[#2D2D2D] mb-1">
                New Password
              </label>
              <input type={showNew ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:border-[#D71E28]" required />
              <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-9 text-gray-400 hover:text-gray-600">
                {showNew ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2D2D2D] mb-1">
                Confirm New Password
              </label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#D71E28]" required />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-[#D71E28] text-white py-3 rounded-full font-semibold hover:bg-[#B21B1C] transition-colors disabled:opacity-50">
              {loading ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>;
}