import React, { useEffect, useState } from 'react';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { DashboardLayout } from '../components/DashboardLayout';
import { UploadIcon, CheckCircleIcon, ClockIcon, RefreshCw } from 'lucide-react';

const DOC_FIELDS = [
{ key: 'id_card_front_url', label: 'ID Card Front' },
{ key: 'id_card_back_url', label: 'ID Card Back' },
{ key: 'ssn_document_url', label: 'SSN Document' },
{ key: 'w2_document_url', label: 'W2 Document' },
{ key: 'proof_of_address_url', label: 'Proof of Address' }];


export function NextOfKinPage() {
  const { user } = useAuth();
  const [form, setForm] = useState({
    full_name: '',
    phone_number: '',
    email: '',
    date_of_birth: '',
    address: '',
    ssn_number: '',
    relationship: ''
  });
  const [docs, setDocs] = useState<Record<string, string>>({});
  const [isVerified, setIsVerified] = useState(false);
  const [nokId, setNokId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      fetchNok();
    }
  }, [user]);

  async function fetchNok() {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase.
    from('next_of_kin').
    select('*').
    eq('user_id', user.id).
    single();

    if (error && error.code !== 'PGRST116') {// PGRST116 = no rows
      console.error('Fetch error:', error);
    }

    if (data) {
      setNokId(data.id);
      setForm({
        full_name: data.full_name || '',
        phone_number: data.phone_number || '',
        email: data.email || '',
        date_of_birth: data.date_of_birth || '',
        address: data.address || '',
        ssn_number: data.ssn_number || '',
        relationship: data.relationship || ''
      });
      setDocs({
        id_card_front_url: data.id_card_front_url || '',
        id_card_back_url: data.id_card_back_url || '',
        ssn_document_url: data.ssn_document_url || '',
        w2_document_url: data.w2_document_url || '',
        proof_of_address_url: data.proof_of_address_url || ''
      });
      setIsVerified(!!data.is_verified); // Ensure boolean
    }
    setLoading(false);
  }

  async function handleRefresh() {
    setRefreshing(true);
    await fetchNok();
    setRefreshing(false);
  }

  function handleChange(
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>)
  {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const payload = {
      user_id: user!.id,
      ...form,
      ...docs
      // Note: Do NOT send is_verified here if it's controlled by admin only
    };

    let error;
    if (nokId) {
      const { error: updateError } = await supabase.
      from('next_of_kin').
      update(payload).
      eq('id', nokId);
      error = updateError;
    } else {
      const { data, error: insertError } = await supabase.
      from('next_of_kin').
      insert(payload).
      select().
      single();
      if (insertError) error = insertError;else
      if (data) setNokId(data.id);
    }

    if (!error) {
      await fetchNok(); // Refresh after save to show latest server state
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      console.error('Save error:', error);
    }

    setSaving(false);
  }

  async function handleUpload(fieldKey: string, file: File) {
    setUploading(fieldKey);

    // Fixed: proper template literal
    const path = `next-of-kin/${user!.id}/${fieldKey}-${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage.
    from('uploads').
    upload(path, file, { upsert: true });

    if (uploadError) {
      console.error('Upload failed:', uploadError);
      alert('Upload failed: ' + uploadError.message);
      setUploading(null);
      return;
    }

    const { data: urlData } = supabase.storage.
    from('uploads').
    getPublicUrl(path);

    const publicUrl = urlData.publicUrl;

    setDocs((prev) => ({
      ...prev,
      [fieldKey]: publicUrl
    }));

    if (nokId) {
      await supabase.
      from('next_of_kin').
      update({ [fieldKey]: publicUrl }).
      eq('id', nokId);
    }

    setUploading(null);
  }

  if (loading) {
    return (
      <DashboardLayout showBackToDashboard title="Next of Kin">
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-[#D71E28] border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>);

  }

  return (
    <DashboardLayout showBackToDashboard title="Next of Kin">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
            isVerified ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`
            }>
            
            {isVerified ?
            <CheckCircleIcon className="w-4 h-4" /> :

            <ClockIcon className="w-4 h-4" />
            }
            <span className="text-sm font-semibold capitalize">
              {isVerified ? 'Verified' : 'Pending Review'}
            </span>
          </div>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-[#D71E28] disabled:opacity-50">
            
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh status
          </button>
        </div>

        {success &&
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm">
            Saved successfully!
          </div>
        }

        <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 mb-6">
          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-[#2D2D2D] mb-1">
                  Full Name
                </label>
                <input
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#D71E28]" />
                
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2D2D2D] mb-1">
                  Phone Number
                </label>
                <input
                  name="phone_number"
                  value={form.phone_number}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#D71E28]" />
                
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2D2D2D] mb-1">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#D71E28]" />
                
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2D2D2D] mb-1">
                  Date of Birth
                </label>
                <input
                  name="date_of_birth"
                  type="date"
                  value={form.date_of_birth}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#D71E28]" />
                
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#2D2D2D] mb-1">
                  Address
                </label>
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#D71E28]" />
                
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2D2D2D] mb-1">
                  SSN Number
                </label>
                <input
                  name="ssn_number"
                  value={form.ssn_number}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#D71E28]" />
                
              </div>
              <div>
                <label className="block text-sm font-medium text-[#2D2D2D] mb-1">
                  Relationship
                </label>
                <select
                  name="relationship"
                  value={form.relationship}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#D71E28] bg-white">
                  
                  <option value="">Select relationship</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Parent">Parent</option>
                  <option value="Child">Child</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="bg-[#D71E28] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#B21B1C] transition-colors disabled:opacity-50 w-full md:w-auto">
              
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        <h3 className="text-lg font-bold text-[#2D2D2D] mb-4">Documents</h3>
        <div className="space-y-3">
          {DOC_FIELDS.map((field) => {
            const url = docs[field.key];
            return (
              <div
                key={field.key}
                className="bg-white rounded-xl border border-gray-200 p-4 flex items-center justify-between gap-4">
                
                <div>
                  <h4 className="font-medium text-[#2D2D2D] text-sm">
                    {field.label}
                  </h4>
                  {url ?
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-[#D71E28] hover:underline">
                    
                      View document
                    </a> :

                  <p className="text-xs text-[#666]">Not uploaded</p>
                  }
                </div>

                <label className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 cursor-pointer hover:border-[#D71E28] text-sm text-[#666] whitespace-nowrap">
                  {uploading === field.key ?
                  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> :

                  <UploadIcon className="w-4 h-4" />
                  }
                  <span>{url ? 'Replace' : 'Upload'}</span>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUpload(field.key, file);
                    }}
                    className="hidden" />
                  
                </label>
              </div>);

          })}
        </div>
      </div>
    </DashboardLayout>);

}