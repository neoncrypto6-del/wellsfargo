import React, { useEffect, useState } from 'react';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { DashboardLayout } from '../components/DashboardLayout';
import { UploadIcon, CheckCircleIcon, ClockIcon } from 'lucide-react';
interface VerificationDoc {
  id?: string;
  id_card_front_url?: string;
  id_card_back_url?: string;
  ssn_document_url?: string;
  w2_document_url?: string;
  proof_of_address_url?: string;
  status?: string;
  is_verified?: boolean;
}
const DOC_FIELDS = [
{
  key: 'id_card_front_url',
  label: 'ID Card Front'
},
{
  key: 'id_card_back_url',
  label: 'ID Card Back'
},
{
  key: 'ssn_document_url',
  label: 'SSN Document'
},
{
  key: 'w2_document_url',
  label: 'W2 Document'
},
{
  key: 'proof_of_address_url',
  label: 'Proof of Address'
}];

export function VerificationPage() {
  const { user } = useAuth();
  const [doc, setDoc] = useState<VerificationDoc>({
    status: 'pending'
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  useEffect(() => {
    fetchDoc();
  }, [user]);
  async function fetchDoc() {
    if (!user) return;
    const { data } = await supabase.
    from('verification_documents').
    select('*').
    eq('user_id', user.id).
    single();
    if (data) setDoc(data);
    setLoading(false);
  }
  async function handleUpload(fieldKey: string, file: File) {
    if (!user) return;
    setUploading(fieldKey);
    const path = `verification/${user.id}/${fieldKey}-${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage.
    from('uploads').
    upload(path, file);
    if (uploadError) {
      setUploading(null);
      return;
    }
    const url = supabase.storage.from('uploads').getPublicUrl(path).
    data.publicUrl;
    if (doc.id) {
      await supabase.
      from('verification_documents').
      update({
        [fieldKey]: url
      }).
      eq('id', doc.id);
    } else {
      const { data } = await supabase.
      from('verification_documents').
      insert({
        user_id: user.id,
        [fieldKey]: url,
        status: 'pending_review'
      }).
      select().
      single();
      if (data) setDoc(data);
    }
    setDoc((prev) => ({
      ...prev,
      [fieldKey]: url
    }));
    setUploading(null);
  }
  if (loading)
  return (
    <DashboardLayout showBackToDashboard title="Verification">
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-[#D71E28] border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>);

  return (
    <DashboardLayout showBackToDashboard title="Verification">
      <div className="max-w-2xl">
        {/* Status Badge */}
        <div
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 ${doc.is_verified ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>
          
          {doc.is_verified ?
          <CheckCircleIcon className="w-4 h-4" /> :

          <ClockIcon className="w-4 h-4" />
          }
          <span className="text-sm font-semibold capitalize">
            {doc.is_verified ? 'Verified' : 'Pending Review'}
          </span>
        </div>

        <div className="space-y-4">
          {DOC_FIELDS.map((field) => {
            const url = (doc as any)[field.key];
            return (
              <div
                key={field.key}
                className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between">
                
                <div>
                  <h3 className="font-medium text-[#2D2D2D]">{field.label}</h3>
                  {url ?
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#D71E28] hover:underline">
                    
                      View uploaded document
                    </a> :

                  <p className="text-sm text-[#666]">Not uploaded</p>
                  }
                </div>
                <label
                  className={`flex items-center gap-2 px-4 py-2 rounded-full border cursor-pointer transition-colors ${url ? 'border-green-200 bg-green-50 text-green-700' : 'border-gray-300 hover:border-[#D71E28] text-[#666]'}`}>
                  
                  {uploading === field.key ?
                  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> :

                  <UploadIcon className="w-4 h-4" />
                  }
                  <span className="text-sm font-medium">
                    {url ? 'Replace' : 'Upload'}
                  </span>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => {
                      if (e.target.files?.[0])
                      handleUpload(field.key, e.target.files[0]);
                    }}
                    className="hidden" />
                  
                </label>
              </div>);

          })}
        </div>
      </div>
    </DashboardLayout>);

}