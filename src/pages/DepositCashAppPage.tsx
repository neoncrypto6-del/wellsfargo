import React, { useState } from 'react';
import { useAuth } from '../lib/auth';
import { supabase, CASHAPP_TAG } from '../lib/supabase';
import { DashboardLayout } from '../components/DashboardLayout';
import { UploadIcon, CopyIcon, CheckIcon } from 'lucide-react';
export function DepositCashAppPage() {
  const { user } = useAuth();
  const [amount, setAmount] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  function copyTag() {
    navigator.clipboard.writeText(CASHAPP_TAG);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!amount || !file) {
      setError('Please enter amount and upload proof.');
      return;
    }
    setLoading(true);
    setError('');
    let proofUrl = '';
    const path = `cashapp-proofs/${user!.id}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage.
    from('uploads').
    upload(path, file);
    if (!uploadError) {
      proofUrl = supabase.storage.from('uploads').getPublicUrl(path).
      data.publicUrl;
    }
    const { error: insertError } = await supabase.
    from('deposit_requests').
    insert({
      user_id: user!.id,
      deposit_type: 'cashapp',
      amount: parseFloat(amount),
      proof_image_url: proofUrl,
      status: 'pending_review'
    });
    if (!insertError) {
      await supabase.from('transactions').insert({
        user_id: user!.id,
        type: 'deposit',
        description: `Deposit of $${amount} via Cash App submitted`,
        amount: parseFloat(amount),
        status: 'pending',
        reference: 'DEP' + Date.now().toString(36).toUpperCase()
      });
    }
    setLoading(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }
    setSuccess(true);
    setAmount('');
    setFile(null);
  }
  return (
    <DashboardLayout showBackToDashboard title="Deposit via Cash App">
      <div className="max-w-lg">
        {success &&
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm">
            Cash App deposit submitted for review!
          </div>
        }

        <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
          <div className="bg-[#D71E28] text-white rounded-lg p-6 mb-6 text-center">
            <p className="text-sm mb-2">Send payment to this Cash App tag:</p>
            <div className="flex items-center justify-center gap-2">
              <p className="text-2xl font-bold">{CASHAPP_TAG}</p>
              <button onClick={copyTag} className="hover:opacity-80">
                {copied ?
                <CheckIcon className="w-5 h-5" /> :

                <CopyIcon className="w-5 h-5" />
                }
              </button>
            </div>
          </div>

          {error &&
          <div className="bg-red-50 border border-red-200 text-[#D71E28] px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          }

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#2D2D2D] mb-1">
                Amount Sent (USD) *
              </label>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#D71E28]"
                required />
              
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2D2D2D] mb-1">
                Upload Proof of Deposit *
              </label>
              <label className="flex items-center gap-2 border border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-[#D71E28] transition-colors">
                <UploadIcon className="w-5 h-5 text-gray-400" />
                <span className="text-sm text-[#666]">
                  {file ? file.name : 'Choose file...'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden" />
                
              </label>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#D71E28] text-white py-3 rounded-full font-semibold hover:bg-[#B21B1C] transition-colors disabled:opacity-50">
              
              {loading ? 'Submitting...' : 'Submit for Review'}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>);

}