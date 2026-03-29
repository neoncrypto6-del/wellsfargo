import React, { useState } from 'react';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { DashboardLayout } from '../components/DashboardLayout';
import { CameraIcon, UserIcon } from 'lucide-react';
export function ProfilePage() {
  const {
    user,
    refreshUser
  } = useAuth();
  const [uploading, setUploading] = useState(false);
  if (!user) return null;
  async function handleUploadPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const path = `profile-pictures/${user!.id}/${Date.now()}-${file.name}`;
    const {
      error: uploadError
    } = await supabase.storage.from('uploads').upload(path, file);
    if (!uploadError) {
      const url = supabase.storage.from('uploads').getPublicUrl(path).data.publicUrl;
      await supabase.from('users').update({
        profile_picture_url: url
      }).eq('id', user!.id);
      await refreshUser();
    }
    setUploading(false);
  }
  const fields = [{
    label: 'Full Name',
    value: user.full_name
  }, {
    label: 'Email Address',
    value: user.email
  }, {
    label: 'Username',
    value: user.username
  }, {
    label: 'Phone Number',
    value: user.phone_number
  }, {
    label: 'Date of Birth',
    value: user.date_of_birth
  }, {
    label: 'SSN',
    value: user.ssn ? '•••-••-' + user.ssn.slice(-4) : 'Not provided'
  }, {
    label: 'Address',
    value: user.address
  }, {
    label: 'Account Type',
    value: user.account_type
  }, {
    label: 'Account Number',
    value: user.account_number
  }, {
    label: 'Routing Number',
    value: user.routing_number
  }];
  return <DashboardLayout showBackToDashboard title="Profile">
      <div className="max-w-2xl">
        {/* Profile Picture */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6 flex flex-col items-center">
          <div className="relative mb-4">
            {user.profile_picture_url ? <img src={`${user.profile_picture_url}?t=${Date.now()}`} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-gray-100" /> : <div className="w-24 h-24 rounded-full bg-[#F5F5F5] flex items-center justify-center border-4 border-gray-100">
                <UserIcon className="w-10 h-10 text-gray-400" />
              </div>}
            <label className="absolute bottom-0 right-0 w-8 h-8 bg-[#D71E28] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#B21B1C] transition-colors">
              {uploading ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <CameraIcon className="w-4 h-4 text-white" />}
              <input type="file" accept="image/*" onChange={handleUploadPhoto} className="hidden" />
            </label>
          </div>
          <h2 className="text-xl font-bold text-[#2D2D2D]">{user.full_name}</h2>
          <span className="text-sm text-[#666]">{user.account_type}</span>
        </div>

        {/* Details */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {fields.map((field, i) => <div key={field.label} className={`flex justify-between p-4 ${i < fields.length - 1 ? 'border-b border-gray-50' : ''}`}>
              <span className="text-sm text-[#666]">{field.label}</span>
              <span className="text-sm font-medium text-[#2D2D2D] text-right max-w-[60%]">
                {field.value || 'Not provided'}
              </span>
            </div>)}
        </div>
      </div>
    </DashboardLayout>;
}