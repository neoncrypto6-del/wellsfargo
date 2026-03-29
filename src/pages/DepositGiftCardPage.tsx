import React, { useState } from 'react';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';
import { DashboardLayout } from '../components/DashboardLayout';
import { UploadIcon } from 'lucide-react';
const GIFT_CARD_TYPES = [
'Amazon',
'Apple/iTunes',
'Google Play',
'Visa',
'Mastercard',
'eBay',
'Walmart',
'Target',
'Steam',
'Nike',
'Sephora',
'Other'];

export function DepositGiftCardPage() {
  const { user } = useAuth();
  const [cardType, setCardType] = useState('');
  const [amount, setAmount] = useState('');
  const [details, setDetails] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!cardType || !amount) {
      setError('Please fill in required fields.');
      return;
    }
    setLoading(true);
    setError('');
    let proofUrl = '';
    if (file) {
      const path = `gift-cards/${user!.id}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage.
      from('uploads').
      upload(path, file);
      if (!uploadError) {
        proofUrl = supabase.storage.from('uploads').getPublicUrl(path).
        data.publicUrl;
      }
    }
    const { error: insertError } = await supabase.
    from('deposit_requests').
    insert({
      user_id: user!.id,
      deposit_type: 'gift_card',
      gift_card_type: cardType,
      amount: parseFloat(amount),
      proof_image_url: proofUrl,
      additional_details: details,
      status: 'pending_review'
    });
    if (!insertError) {
      await supabase.from('transactions').insert({
        user_id: user!.id,
        type: 'deposit',
        description: `Deposit of $${amount} via Gift Card submitted`,
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
    setCardType('');
    setAmount('');
    setDetails('');
    setFile(null);
  }
  return (
    <DashboardLayout showBackToDashboard title="Deposit via Gift Card">
      <div className="max-w-lg">
        {success &&
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 text-sm">
            Gift card deposit submitted for review!
          </div>
        }

        <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
          {error &&
          <div className="bg-red-50 border border-red-200 text-[#D71E28] px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          }

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#2D2D2D] mb-1">
                Gift Card Type *
              </label>
              <select
                value={cardType}
                onChange={(e) => setCardType(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#D71E28] bg-white"
                required>
                
                <option value="">Select gift card type</option>
                {GIFT_CARD_TYPES.map((t) =>
                <option key={t} value={t}>
                    {t}
                  </option>
                )}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2D2D2D] mb-1">
                Amount (USD) *
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
                Card Code / Additional Details
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#D71E28] resize-none" />
              
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2D2D2D] mb-1">
                Upload Gift Card Image
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