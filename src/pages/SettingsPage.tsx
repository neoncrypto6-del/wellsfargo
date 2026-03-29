import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { DashboardLayout } from '../components/DashboardLayout';
import { UserIcon, ShieldCheckIcon, UsersIcon, KeyIcon, LockIcon, LogOutIcon } from 'lucide-react';
export function SettingsPage() {
  const navigate = useNavigate();
  const {
    logout
  } = useAuth();
  const items = [{
    label: 'Profile',
    description: 'View and edit your personal information',
    icon: UserIcon,
    path: '/settings/profile',
    color: 'bg-blue-50 text-blue-600'
  }, {
    label: 'Verification',
    description: 'Upload identity documents for verification',
    icon: ShieldCheckIcon,
    path: '/settings/verification',
    color: 'bg-green-50 text-green-600'
  }, {
    label: 'Next of Kin',
    description: 'Add or update your next of kin details',
    icon: UsersIcon,
    path: '/settings/next-of-kin',
    color: 'bg-purple-50 text-purple-600'
  }, {
    label: 'Change Password',
    description: 'Update your account password',
    icon: KeyIcon,
    path: '/settings/change-password',
    color: 'bg-orange-50 text-orange-600'
  }, {
    label: 'Create PIN',
    description: 'Set up a transaction PIN for security',
    icon: LockIcon,
    path: '/settings/create-pin',
    color: 'bg-red-50 text-red-600'
  }];
  return <DashboardLayout showBackToDashboard title="Settings">
      <div className="max-w-2xl space-y-3">
        {items.map((item) => <button key={item.label} onClick={() => navigate(item.path)} className="w-full bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4 hover:shadow-md hover:border-gray-300 transition-all text-left">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${item.color}`}>
              <item.icon className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-[#2D2D2D]">{item.label}</h3>
              <p className="text-sm text-[#666]">{item.description}</p>
            </div>
            <span className="text-gray-400">→</span>
          </button>)}

        <button onClick={() => {
        logout();
        navigate('/');
      }} className="w-full bg-white rounded-xl border border-red-200 p-5 flex items-center gap-4 hover:shadow-md hover:bg-red-50 transition-all text-left">
          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
            <LogOutIcon className="w-6 h-6 text-[#D71E28]" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-[#D71E28]">Logout</h3>
            <p className="text-sm text-[#666]">Sign out of your account</p>
          </div>
        </button>
      </div>
    </DashboardLayout>;
}